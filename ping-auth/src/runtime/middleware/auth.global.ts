import { defineNuxtRouteMiddleware, useCookie, navigateTo } from "#app"

export default defineNuxtRouteMiddleware((to) => {
  // Only run on server-side to access httpOnly cookies
  if (import.meta.client) {
    return
  }

  const token = useCookie("access_token", {
    readonly: true,
  })

  if (
    to.path === "/" ||
    to.path.startsWith("/api/auth") ||
    to.path.startsWith("/_nuxt")
  ) {
    return
  }

  if (!token.value) {
    return navigateTo("/")
  }
})