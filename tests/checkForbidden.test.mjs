import { spawnSync } from 'node:child_process'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { expect, it } from 'vitest'

it('rejects private agent folders and production infrastructure references', async () => {
  const fixture = await mkdtemp(path.join(os.tmpdir(), 'kiniela-forbidden-'))
  try {
    await mkdir(path.join(fixture, '.claude'))
    await writeFile(path.join(fixture, '.claude', 'notes.md'), 'private prompt history')
    const windowsPath = ['C:', 'Users', 'synthetic', 'repo'].join(String.fromCharCode(92))
    const unixPath = ['', 'home', 'synthetic', 'repo'].join('/')
    await writeFile(path.join(fixture, 'README.md'), ['backend host: ', ['supa', 'base'].join(''), '.co\npath: ', windowsPath, '\npath: ', unixPath].join(''))
    const scanner = path.resolve(process.cwd(), 'scripts/check-forbidden.mjs')
    const result = spawnSync(process.execPath, [scanner, fixture], { encoding: 'utf8' })

    expect(result.status).toBe(1)
    expect(result.stderr).toContain('.claude')
    expect(result.stderr).toContain('forbidden infrastructure or secret identifier')
    expect(result.stderr).toContain('local filesystem path')
  } finally {
    await rm(fixture, { recursive: true, force: true })
  }
})
