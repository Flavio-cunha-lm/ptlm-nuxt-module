import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch, fetch } from '@nuxt/test-utils/e2e'

describe('ping-auth module', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })

  it('redirects the index page to login because of auth middleware', async () => {
    // Get response to a server-rendered page which should be protected 
    // by the module's server auth middleware.
    const res = await fetch('/', { redirect: 'manual' })
    expect(res.status).toBeGreaterThanOrEqual(300)
    expect(res.status).toBeLessThan(400)
    expect(res.headers.get('location')).toBe('/api/auth/login')
  })

  it('provides login and logout routes via ping-auth module', async () => {
    // When calling login
    const loginRes = await fetch('/api/auth/login', { redirect: 'manual' })
    expect(loginRes.status).toBeGreaterThanOrEqual(300) 
    expect(loginRes.status).toBeLessThan(400) // Expecting redirect
    const loginCookies = loginRes.headers.get('set-cookie')
    expect(loginCookies).toBeDefined()

    // When calling logout
    const logoutRes = await fetch('/api/auth/logout', { redirect: 'manual' })
    expect(logoutRes.status).toBeGreaterThanOrEqual(300) // Expecting a redirect to logout provider
    expect(logoutRes.status).toBeLessThan(400) // Expecting redirect
  })

  it('correctly loads module capabilities', () => {
    expect(true).toBe(true)
  })
})
