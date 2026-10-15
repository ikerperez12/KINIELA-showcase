import { spawnSync } from 'node:child_process'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import assert from 'node:assert/strict'

const policy = JSON.parse(
  Buffer.from((await readFile(path.resolve(process.cwd(), 'scripts/forbidden-policy.b64'), 'utf8')).trim(), 'base64').toString('utf8'),
)

test('rejects private agent folders, infrastructure references and local paths', async () => {
  const fixture = await mkdtemp(path.join(os.tmpdir(), 'kiniela-forbidden-'))
  try {
    const agentDirectory = policy.directories[0]
    await mkdir(path.join(fixture, agentDirectory))
    await writeFile(path.join(fixture, agentDirectory, 'notes.md'), 'private notes')
    const windowsPath = ['C:', 'Users', 'synthetic', 'repo'].join(String.fromCharCode(92))
    await writeFile(path.join(fixture, 'README.md'), ['host: ', policy.terms[0], '\npath: ', windowsPath].join(''))
    const result = spawnSync(process.execPath, [path.resolve(process.cwd(), 'scripts/check-forbidden.mjs'), fixture], { encoding: 'utf8' })

    assert.equal(result.status, 1)
    assert.ok(result.stderr.includes(agentDirectory))
    assert.match(result.stderr, /forbidden infrastructure or secret identifier/)
    assert.match(result.stderr, /local filesystem path/)
  } finally {
    await rm(fixture, { recursive: true, force: true })
  }
})
