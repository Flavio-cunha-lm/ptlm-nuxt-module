import { defineEventHandler, getCookie, createError } from "h3"
import { useRuntimeConfig } from "#imports"
import { createHmac } from "node:crypto"

function base64urlDecode(input: string): string {
  input = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = input.length % 4;
  if (pad) {
    if (pad === 1) throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
    input += new Array(5 - pad).join('=');
  }
  return Buffer.from(input, 'base64').toString('utf8');
}

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const pingCfg: any = config.pingAuth
  const appUserCookie = getCookie(event, "app_user")

  if (!appUserCookie) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" })
  }

  const parts = appUserCookie.split('.')
  if (parts.length !== 3) {
    throw createError({ statusCode: 401, statusMessage: "Invalid token format" })
  }

  const [header, payload, signature] = parts

  if (!payload || !signature) {
    throw createError({ statusCode: 401, statusMessage: "Invalid token format" })
  }

  // Verify signature
  const expectedSignature = createHmac("sha256", pingCfg.jwtSecret)
    .update(`${header}.${payload}`)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')

  if (signature !== expectedSignature) {
    throw createError({ statusCode: 401, statusMessage: "Invalid token signature" })
  }

  try {
    const decodedPayload = JSON.parse(base64urlDecode(payload))
    // Check expiration
    if (decodedPayload.exp && Math.floor(Date.now() / 1000) > decodedPayload.exp) {
      throw createError({ statusCode: 401, statusMessage: "Token expired" })
    }
    return decodedPayload
  } catch (e) {
    throw createError({ statusCode: 401, statusMessage: "Invalid token payload" })
  }
})
