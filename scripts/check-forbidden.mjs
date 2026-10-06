import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const ignored = new Set(['.git', 'node_modules', 'coverage', 'playwright-report', 'test-results'])
const textExtensions = new Set(['.css', '.html', '.js', '.json', '.map', '.md', '.mjs', '.svg', '.ts', '.tsx', '.txt', '.yml', '.yaml'])
const forbidden = [
  ['supa', 'base'].join(''),
  ['ver', 'cel'].join(''),
  ['cloud', 'flare'].join(''),
  ['service', '_', 'role'].join(''),
  ['CRON', '_', 'SECRET'].join(''),
  ['ADMIN', '_', 'SECRET'].join(''),
  ['NEXT_PUBLIC_', 'SUPABASE_'].join(''),
]
const forbiddenLocalPath = 'C:' + String.fromCharCode(92) + 'Users' + String.fromCharCode(92)
const findings = []

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignored.has(entry.name)) continue
    const fullPath = path.join(directory, entry.name)
    const relativePath = path.relative(root, fullPath)
    if (entry.isDirectory()) {
      await walk(fullPath)
      continue
    }
    if (entry.name === '.gitmodules' || entry.name === '.lfsconfig' || entry.name === '.env' || entry.name.startsWith('.env.')) {
      findings.push(relativePath + ': forbidden configuration file')
      continue
    }
    if (relativePath === path.join('scripts', 'check-forbidden.mjs')) continue
    if (!textExtensions.has(path.extname(entry.name).toLowerCase())) continue
    const content = await readFile(fullPath, 'utf8')
    for (const pattern of forbidden) {
      if (content.toLowerCase().includes(pattern.toLowerCase())) findings.push(relativePath + ': forbidden infrastructure or secret identifier')
    }
    if (content.toLowerCase().includes(forbiddenLocalPath.toLowerCase())) findings.push(relativePath + ': local Windows path')
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
