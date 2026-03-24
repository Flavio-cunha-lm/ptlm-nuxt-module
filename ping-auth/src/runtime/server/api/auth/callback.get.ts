import { defineEventHandler, getQuery, getRequestURL, getCookie, setCookie, sendRedirect, createError } from "h3"
import { useRuntimeConfig } from "#imports"
import { createHmac } from "node:crypto"

export default defineEventHandler(async (event: any) => {
  const config = useRuntimeConfig()
  const pingCfg: any = config.pingAuth
  const pubPingCfg: any = config.public.pingAuth
  const isSecure =  config.public.ddEnv === "local" ? false : true

  const query = getQuery(event)
  const code = typeof query.code === "string" ? query.code : undefined
  if (!code) throw createError({ statusCode: 400, statusMessage: "Missing code" })

  const state = typeof query.state === "string" ? query.state : undefined
  const cookieState = getCookie(event, "oauth_state")
  if (cookieState && state !== cookieState) {
    throw createError({ statusCode: 400, statusMessage: "Invalid state parameter" })
  }

  const requestUrl = getRequestURL(event)

  const codeVerifier = getCookie(event, "pkce_code_verifier")
  if (!codeVerifier) throw createError({ statusCode: 400, statusMessage: "Missing code verifier" })

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: `${requestUrl.protocol}//${requestUrl.host}/api/auth/callback`,
    code_verifier: codeVerifier,
  })

  let tokenResp: any
  try {
    tokenResp = await $fetch(pubPingCfg.issuer+"/as/token.oauth2", {
      method: "POST",
      body: body.toString(),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " + Buffer.from(`${pubPingCfg.clientId}:${pingCfg.clientSecret}`).toString("base64"),
      },
    })
  } catch (e: any) {
    console.error("Token exchange failed", e?.data || e)
    throw createError({ statusCode: 502, statusMessage: "Token exchange failed" })
  }

  const accessToken = tokenResp.access_token
  const expiresIn = tokenResp.expires_in

  if (!accessToken) throw createError({ statusCode: 502, statusMessage: "No access token" })

  let userInfo: any = {}
  try {
    userInfo = await $fetch(pubPingCfg.issuer+"/idp/userinfo.openid", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  } catch {
    console.warn("UserInfo fetch failed")
  }

  userInfo.roles = getRoles(Array.isArray(userInfo.memberof) ? userInfo.memberof : [], pingCfg.app) 
  delete userInfo.memberof 

  setCookie(event, "access_token", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: isSecure,
    maxAge: expiresIn,
  })

  if (!pingCfg.jwtSecret) {
    console.error("Missing jwtSecret in pingAuth configuration.");
    throw createError({ statusCode: 500, statusMessage: "Server configuration error" })
  }

  let appUserValue = ""
  try {
    appUserValue = signJWT(userInfo, pingCfg.jwtSecret, 3600)
  } catch (e) {
    throw createError({ statusCode: 500, statusMessage: "Failed to create user token" })
  }

  setCookie(event, "app_user", appUserValue, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: isSecure,
    maxAge: expiresIn,
  })

  return sendRedirect(event, pubPingCfg.redirectUri)
})

function base64urlEncode(input: string | Buffer): string {
  const buf = typeof input === 'string' ? Buffer.from(input) : input;
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function signJWT(payload: any, secret: string, expiresInSecs: number): string {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const jwtPayload = { ...payload, iat: now, exp: now + expiresInSecs };

  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedPayload = base64urlEncode(JSON.stringify(jwtPayload));
  const tokenData = `${encodedHeader}.${encodedPayload}`;

  const signature = createHmac("sha256", secret).update(tokenData).digest();
  const encodedSignature = base64urlEncode(signature);

  return `${tokenData}.${encodedSignature}`;
}

function parseDN(dn: string): Record<string, string[]> {
  const parts = dn.split(/(?<!\\),/).map(p => p.trim());

  const result: Record<string, string[]> = {};

  for (const part of parts) {
    const [key, ...valueParts] = part.split('=');
    const value = valueParts.join('=');
    if (!key || !value) continue;

    const k = key.toLowerCase();
    const v = value.trim().replace(/\\,/g, ',');

    if (!result[k]) result[k] = [];
    result[k].push(v);
  }

  return result;
}

function getRoles(roles: string[], apps: string): string[] {
  const appsArray = apps.split(',').map(a => a.trim().toLowerCase());
  let rolesAppArray : any = {};
  for (const app of appsArray) {
    let rolesArray: string [] = []
    for (const role of roles) {
      const dn = parseDN(role);

      const ous = (dn['ou'] || []).map(v => v.toLowerCase());

      const appIdx = ous.findIndex(o => o === app.toLowerCase());
      const appRoleIdx = ous.findIndex(o => o === 'applicationrole');
      const roleIdx = ous.findIndex(o => o === 'role');
      const hasTargetOU = appIdx !== -1 && appRoleIdx !== -1 && roleIdx !== -1;

      if (hasTargetOU) {  
        const cn = dn['cn']?.[0];
        if (cn) {
          rolesArray.push( cn.substring(cn.lastIndexOf('-') + 1).toUpperCase() );
        }
      }
    }
    rolesAppArray[app] = rolesArray
  }

  return rolesAppArray;
}