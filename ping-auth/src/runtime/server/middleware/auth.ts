import { defineEventHandler, isMethod, getRequestURL, getCookie, createError, sendRedirect } from "h3"
import { useRuntimeConfig } from "#imports"

export default defineEventHandler(async (event) => {
  if (isMethod(event, ["OPTIONS", "HEAD"])) return

  const rc = useRuntimeConfig()
  const publicCfg :any = rc.public?.pingAuth || {}

  const { pathname , href} = getRequestURL(event)
  if(href.startsWith( publicCfg.logoutUri)) return

  const skipPaths = ["/api/auth", "/auth", "/_nuxt", "/_ipx", "/assets"]
  if (skipPaths.some((p) => pathname.startsWith(p))) return

  const token = getCookie(event, "access_token")
  if (!token) {
    if (pathname.startsWith("/api")) throw createError({ statusCode: 401 })
    return sendRedirect(event, "/api/auth/login")
  }

  const clientId = publicCfg.clientId
  const clientSecret = (rc.pingAuth as any)?.clientSecret

  if (!publicCfg.issuer || !clientId || !clientSecret)
    throw createError({ statusCode: 500, statusMessage: "Ping introspection not configured" })

  const params = new URLSearchParams({ token })

  type IntrospectResponse = { active?: boolean; [key: string]: unknown }

  try {
    const data = await $fetch<IntrospectResponse>(publicCfg.issuer + "/as/introspect.oauth2", {
      method: "POST",
      body: params.toString(),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
      },
    })

    if (!data?.active) throw createError({ statusCode: 401 })
    event.context.auth = data
  } catch {
    if (pathname.startsWith("/api")) throw createError({ statusCode: 401 })
    return sendRedirect(event, "/api/auth/login")
  }
})