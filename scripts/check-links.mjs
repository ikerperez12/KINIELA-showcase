import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const ignored = new Set(['.git', 'node_modules', 'coverage', 'dist', 'playwright-report', 'test-results'])
const markdownFiles = []

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignored.has(entry.name)) continue
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) await walk(fullPath)
    else if (entry.name.toLowerCase().endsWith('.md')) markdownFiles.push(fullPath)
  }
}

await walk(root)
const broken = []
const destinations = [
  /!?\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g,
  /\b(?:src|href)="([^"]+)"/g,
]

for (const file of markdownFiles) {
  const content = await readFile(file, 'utf8')
  for (const pattern of destinations) {
    for (const match of content.matchAll(pattern)) {
      const destination = match[1]
      if (!destination || destination.startsWith('#') || /^[a-z][a-z\d+.-]*:/i.test(destination) || destination.startsWith('//')) continue
      const pathname = decodeURIComponent(destination.split(/[?#]/, 1)[0])
      if (!pathname) continue
      const target = path.resolve(path.dirname(file), pathname)
      try {
        await stat(target)
      } catch {
        broken.push(path.relative(root, file) + ' -> ' + destination)
      }
    }
  }
}

if (broken.length) {
  console.error(broken.join('\n'))
  process.exitCode = 1
} else {
  console.log('Markdown links OK (' + markdownFiles.length + ' files checked).')
}
