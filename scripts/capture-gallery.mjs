import { chromium } from '@playwright/test'
import { mkdtemp, mkdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const run = promisify(execFile)
const origin = process.env.SHOWCASE_URL ?? 'http://127.0.0.1:4173'
const output = path.resolve('public/gallery')
const frames = await mkdtemp(path.join(tmpdir(), 'kiniela-gallery-'))
const browser = await chromium.launch()

try {
  await mkdir(output, { recursive: true })
  const page = await browser.newPage({ viewport: { width: 1440, height: 920 }, deviceScaleFactor: 1 })
  await page.goto(origin, { waitUntil: 'networkidle' })
  await page.screenshot({ path: path.join(output, 'showcase-desktop.png') })
  await page.locator('#demo').screenshot({ path: path.join(output, 'matchday-desktop.png') })
  await page.locator('.leaderboard-panel').screenshot({ path: path.join(output, 'leaderboard-desktop.png') })
  await page.locator('.modes-section').screenshot({ path: path.join(output, 'competition-modes.png') })
  await page.locator('.progress-section').screenshot({ path: path.join(output, 'profile-stats.png') })

  const fixtureGroups = [
    'Puerto Brisa contra Monteverde',
    'Río Azul contra Villa Nube',
    'Costa Norte contra Valle Claro',
  ]
  await page.locator('.matchday-panel').screenshot({ path: path.join(frames, 'frame-01.png') })
  for (const group of fixtureGroups) await page.getByRole('group', { name: group }).getByRole('button', { name: '1' }).click()
  await page.locator('.matchday-panel').screenshot({ path: path.join(frames, 'frame-02.png') })
  await page.getByRole('button', { name: 'Guardar pronósticos' }).click()
  await page.locator('.matchday-panel').screenshot({ path: path.join(frames, 'frame-03.png') })
  await run('ffmpeg', [
    '-y', '-framerate', '1', '-i', path.join(frames, 'frame-%02d.png'),
    '-vf', 'fps=1,scale=960:-1:flags=lanczos',
    '-loop', '0', '-f', 'gif', path.join(output, 'predict-save-review.gif'),
  ])

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(origin, { waitUntil: 'networkidle' })
  await page.screenshot({ path: path.join(output, 'showcase-mobile.png') })

  await page.setViewportSize({ width: 1280, height: 640 })
  await page.goto(origin, { waitUntil: 'networkidle' })
  await page.addStyleTag({ content: '.site-header{display:none}.hero{width:1280px;height:640px;min-height:640px;margin:0;border-radius:0}.hero-art{min-height:640px}' })
  await page.screenshot({ path: path.join(output, 'showcase-social.png') })

  console.log('Gallery screenshots and flow GIF saved to public/gallery.')
} finally {
  await browser.close()
  await rm(frames, { recursive: true, force: true })
}
