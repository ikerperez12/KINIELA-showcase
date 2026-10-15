// Checks the media library: allowed formats, size limit, file naming, and
// that every file is referenced from a document (no orphaned assets).
import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const mediaRoot = path.join(root, 'media')
const allowedExtensions = new Set(['.png', '.jpg', '.webp', '.svg', '.mp4', '.webm'])
const maxBytes = 25 * 1024 * 1024
const namePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*\.[a-z0-9]+$/

async function listFiles(directory) {
  const files = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...(await listFiles(fullPath)))
    else files.push(fullPath)
  }
  return files
}

async function documentText() {
  const documents = []
  for (const name of ['README.md', 'ATTRIBUTION.md', 'NOTICE.md', 'docs']) {
    const target = path.join(root, name)
    const info = await stat(target).catch(() => null)
    if (!info) continue
    if (info.isDirectory()) {
      for (const file of await listFiles(target)) if (file.endsWith('.md')) documents.push(await readFile(file, 'utf8'))
    } else {
      documents.push(await readFile(target, 'utf8'))
    }
  }
  return documents.join('\n')
}

const problems = []
const files = await listFiles(mediaRoot)
const text = await documentText()

for (const file of files) {
  const relative = path.relative(root, file).split(path.sep).join('/')
  const extension = path.extname(file).toLowerCase()
  const name = path.basename(file)
  if (!allowedExtensions.has(extension)) problems.push(relative + ': format not allowed')
  if (!namePattern.test(name)) problems.push(relative + ': use lowercase kebab-case names')
  const { size } = await stat(file)
  if (size > maxBytes) problems.push(relative + ': larger than 25 MB')
  if (!text.includes(relative)) problems.push(relative + ': not referenced by any document')
}

if (problems.length) {
  console.error(problems.join('\n'))
  process.exitCode = 1
} else {
  console.log('Media library OK (' + files.length + ' files checked).')
}
