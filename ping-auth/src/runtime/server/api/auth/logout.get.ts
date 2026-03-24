import { useRuntimeConfig } from "#imports"
import { defineEventHandler, deleteCookie, sendRedirect } from "h3"

export default defineEventHandler((event) => {
    const isSecure =  useRuntimeConfig().public.ddEnv === "local" ? false : true
    const pubPingCfg : any = useRuntimeConfig().public.pingAuth

    deleteCookie(event, "pkce_code_verifier", {
        path: "/",
        sameSite: "lax",
        secure: isSecure,
    })

    deleteCookie(event, "access_token", {
        path: "/",
        sameSite: "lax",
        secure: isSecure,
    })

    deleteCookie(event, "app_user", {
        path: "/",
        sameSite: "lax",
        secure: isSecure,
    })

    if(!pubPingCfg.fullLogout ) {
       return sendRedirect(event, pubPingCfg.logoutUri)
    }

    const logoutUrl = `${pubPingCfg.issuer}/idp/startSLO.ping?TargetResource=${encodeURIComponent(
        pubPingCfg.logoutUri
    )}`
    return sendRedirect(event, logoutUrl)
})