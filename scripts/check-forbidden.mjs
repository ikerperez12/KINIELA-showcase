import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const root = path.resolve(process.argv[2] ?? process.cwd())
const ignored = new Set(['.git', 'node_modules', 'coverage', 'playwright-report', 'test-results'])
const forbiddenDirectories = new Set([
  '.claude', '.cloudflare', '.codex', '.cursor', '.vercel', '.wrangler',
  'claude_history_export', 'logs', 'mcp_traces',
])
const forbiddenFiles = new Set([
  '.dev.vars', '.mcp.json', '.netrc', '.npmrc', '.vercelignore', '.cursorrules',
  'agents.md', 'claude.md', 'codex.md', 'gemini.md', 'copilot-instructions.md',
  'credentials.json', 'vercel.json', 'wrangler.json', 'wrangler.jsonc', 'wrangler.toml',
  '.gitmodules', '.lfsconfig', '.ds_store', 'thumbs.db',
])
const forbiddenExtensions = new Set(['.key', '.log', '.p12', '.pem', '.pfx'])
const textNames = new Set(['.dockerignore', '.editorconfig', '.gitattributes', '.gitignore', '.npmignore'])
const textExtensions = new Set([
  '.cjs', '.conf', '.config', '.css', '.csv',
  '.html', '.ini', '.js', '.json', '.jsonc', '.lock', '.map', '.md', '.mdx', '.mjs',
  '.properties', '.ps1', '.sh', '.sql', '.svg', '.toml', '.ts', '.tsx', '.txt', '.xml', '.yml', '.yaml',
])
const forbidden = [
  ['supa', 'base'].join(''),
  ['ver', 'cel'].join(''),
  ['cloud', 'flare'].join(''),
  ['service', '_', 'role'].join(''),
  ['CRON', '_', 'SECRET'].join(''),
  ['ADMIN', '_', 'SECRET'].join(''),
  ['NEXT_PUBLIC_', 'SUPABASE_'].join(''),
]
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
