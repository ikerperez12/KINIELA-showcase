import { spawnSync } from 'node:child_process'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { expect, it } from 'vitest'

const policy = JSON.parse(
  Buffer.from((await readFile(path.resolve(process.cwd(), 'scripts/forbidden-policy.b64'), 'utf8')).trim(), 'base64').toString('utf8'),
)

it('rejects private agent folders and production infrastructure references', async () => {
  const fixture = await mkdtemp(path.join(os.tmpdir(), 'kiniela-forbidden-'))
  try {
    const agentDirectory = policy.directories[0]
    await mkdir(path.join(fixture, agentDirectory))
    await writeFile(path.join(fixture, agentDirectory, 'notes.md'), 'private prompt history')
    const windowsPath = ['C:', 'Users', 'synthetic', 'repo'].join(String.fromCharCode(92))
    const unixPath = ['', 'home', 'synthetic', 'repo'].join('/')
    await writeFile(path.join(fixture, 'README.md'), ['backend host: ', policy.terms[0], '.co\npath: ', windowsPath, '\npath: ', unixPath].join(''))
    const scanner = path.resolve(process.cwd(), 'scripts/check-forbidden.mjs')
    const result = spawnSync(process.execPath, [scanner, fixture], { encoding: 'utf8' })

    expect(result.status).toBe(1)
    expect(result.stderr).toContain(agentDirectory)
    expect(result.stderr).toContain('forbidden infrastructure or secret identifier')
    expect(result.stderr).toContain('local filesystem path')
  } finally {
    await rm(fixture, { recursive: true, force: true })
  }
})
