import AxeBuilder from '@axe-core/playwright'
import { expect, test, type BrowserContext } from '@playwright/test'

const isolatedOrigin = 'http://127.0.0.1:4173'
const unexpectedRequestsByContext = new WeakMap<BrowserContext, string[]>()

test.beforeEach(async ({ context }) => {
  const unexpectedRequests: string[] = []
  unexpectedRequestsByContext.set(context, unexpectedRequests)

  await context.route('**/*', async (route) => {
    const url = new URL(route.request().url())
    if ((url.protocol === 'http:' || url.protocol === 'https:') && url.origin !== isolatedOrigin) {
      unexpectedRequests.push(url.href)
      await route.abort()
      return
    }
    await route.continue()
  })
  await context.routeWebSocket('**/*', async (socket) => {
    unexpectedRequests.push(socket.url())
    await socket.close({ code: 1008, reason: 'The showcase demo is offline' })
  })
})

test.afterEach(async ({ page, context }) => {
  await expect(page.locator('iframe')).toHaveCount(0)
  expect(unexpectedRequestsByContext.get(context) ?? []).toEqual([])
})

test('demo flow works offline and has no serious accessibility violations', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /Acierta\./ })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Play now ↗' })).toBeDisabled()
  await expect(page.getByText('Puerto Brisa')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Guardar pronósticos' })).toBeDisabled()

  for (const match of ['Puerto Brisa contra Monteverde', 'Río Azul contra Villa Nube', 'Costa Norte contra Valle Claro']) {
    await page.getByRole('group', { name: match }).getByRole('button', { name: '1' }).click()
  }
  await page.getByRole('button', { name: 'Guardar pronósticos' }).click()
  await expect(page.getByRole('status')).toContainText('RESULTADO DEMO')
  await expect(page.getByText('Ejemplo precalculado. No es el sistema de puntuación de producción.')).toBeVisible()
  await expect(page.getByText('12', { exact: true })).toBeVisible()

  const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
  if (accessibility.violations.length) {
    const contrastPairs = accessibility.violations
      .flatMap((violation) => violation.nodes.map((node) => ({ target: node.target[0], data: node.any[0]?.data })))
      .filter((finding) => finding.data?.fgColor && finding.data?.bgColor)
    console.log('Axe contrast findings:', JSON.stringify([...new Map(contrastPairs.map((finding) => [`${finding.data?.fgColor}:${finding.data?.bgColor}`, finding])).values()]))
  }
  expect(accessibility.violations).toEqual([])
})

test('mobile layout fits the viewport and language toggle works', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 })
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /Acierta\./ })).toBeVisible()
  await page.getByRole('button', { name: 'Switch to English' }).click()
  await expect(page.getByRole('heading', { name: /Call it\./ })).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  const width = await page.evaluate(() => document.documentElement.scrollWidth)
  expect(width).toBeLessThanOrEqual(320)
  const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
  expect(accessibility.violations).toEqual([])
})

test('keyboard users can skip the navigation and reach the main content', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Saltar al contenido' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#main$/)
  await expect(page.getByRole('main')).toBeFocused()
})
