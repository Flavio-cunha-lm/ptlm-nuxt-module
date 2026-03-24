import { useRuntimeConfig } from "#imports"
import { defineEventHandler, setCookie, getRequestURL, sendRedirect } from "h3"
import { randomBytes, createHash } from "node:crypto"

export default defineEventHandler((event) => {
  const config : any = useRuntimeConfig().public.pingAuth
  const isSecure =  useRuntimeConfig().public.ddEnv === "local" ? false : true
  const codeVerifier = randomBytes(32).toString("hex")
  const codeChallenge = createHash("sha256")
    .update(codeVerifier)
    .digest("base64url")

  setCookie(event, "pkce_code_verifier", codeVerifier, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: isSecure,
  })

  const requestUrl = getRequestURL(event)

  const url = new URL(`${config.issuer}/as/authorization.oauth2`)
  url.searchParams.set("client_id", config.clientId)
  url.searchParams.set("redirect_uri",`${requestUrl.protocol}//${requestUrl.host}/api/auth/callback`)
  url.searchParams.set("scope", "openid profile email advprofile picture groups")
  url.searchParams.set("response_type", "code")
  url.searchParams.set("code_challenge", codeChallenge)
  url.searchParams.set("code_challenge_method", "S256")

  return sendRedirect(event, url.toString())
})