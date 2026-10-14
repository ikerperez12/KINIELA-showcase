import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(process.argv[2] ?? process.cwd())
const ignored = new Set(['.git', 'node_modules', 'coverage', 'playwright-report', 'test-results'])
// The denylist is stored base64-encoded so this public source does not name
// private infrastructure. To change it, decode, edit and re-encode
// scripts/forbidden-policy.b64 (base64 of a JSON object with the same keys).
const policyPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'forbidden-policy.b64')
const policy = JSON.parse(Buffer.from((await readFile(policyPath, 'utf8')).trim(), 'base64').toString('utf8'))
const forbiddenDirectories = new Set(policy.directories)
const forbiddenFiles = new Set(policy.files)
const forbiddenExtensions = new Set(policy.extensions)
const textNames = new Set(['.dockerignore', '.editorconfig', '.gitattributes', '.gitignore', '.npmignore'])
const textExtensions = new Set([
  '.cjs', '.conf', '.config', '.css', '.csv',
  '.html', '.ini', '.js', '.json', '.jsonc', '.lock', '.map', '.md', '.mdx', '.mjs',
  '.properties', '.ps1', '.sh', '.sql', '.svg', '.toml', '.ts', '.tsx', '.txt', '.xml', '.yml', '.yaml',
])
const forbidden = policy.terms
const findings = []

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignored.has(entry.name)) continue
    const fullPath = path.join(directory, entry.name)
    const relativePath = path.relative(root, fullPath)
    const normalizedName = entry.name.toLowerCase()
    if (forbidden.some((pattern) => relativePath.toLowerCase().includes(pattern.toLowerCase()))) {
      findings.push(relativePath + ': forbidden infrastructure or secret identifier in path')
    }
    if (entry.isSymbolicLink()) {
      findings.push(relativePath + ': symbolic link')
      continue
    }
    if (entry.isDirectory()) {
      if (forbiddenDirectories.has(normalizedName)) findings.push(relativePath + ': forbidden private or operational directory')
      else await walk(fullPath)
      continue
    }
    if (forbiddenFiles.has(normalizedName) || normalizedName === '.env' || normalizedName.startsWith('.env.')) {
      findings.push(relativePath + ': forbidden configuration or local file')
      continue
    }
    if (forbiddenExtensions.has(path.extname(normalizedName))) {
      findings.push(relativePath + ': forbidden log or credential file')
      continue
    }
    if (relativePath === path.join('scripts', 'check-forbidden.mjs')) continue
    if (!textNames.has(normalizedName) && !textExtensions.has(path.extname(entry.name).toLowerCase())) continue
    const content = await readFile(fullPath, 'utf8')
    for (const pattern of forbidden) {
      if (content.toLowerCase().includes(pattern.toLowerCase())) findings.push(relativePath + ': forbidden infrastructure or secret identifier')
    }
    if (/[A-Z]:\\Users\\[^\r\n]+|\/Users\/[^/\s]+|\/home\/[^/\s]+|\/private\/var\/folders\/[\s\S]*/i.test(content)) findings.push(relativePath + ': local filesystem path')
    if (content.includes(String.fromCharCode(0xfffd))) findings.push(relativePath + ': replacement character in text')
    if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i.test(content)) findings.push(relativePath + ': private key material')
    if (/\bgh[pousr]_[A-Za-z0-9]{30,}\b/.test(content)) findings.push(relativePath + ': GitHub token-shaped value')
  }
}

await walk(root)
if (findings.length) {
  console.error(findings.join('\n'))
  process.exitCode = 1
} else {
  console.log('Forbidden pattern scan passed.')
}
