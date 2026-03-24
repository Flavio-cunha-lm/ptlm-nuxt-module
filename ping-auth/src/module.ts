import { 
  defineNuxtModule,
  addServerHandler,
  addRouteMiddleware,
  addImportsDir,
  createResolver
} from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "ping-auth",
    configKey: "pingAuth",
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(_options, _nuxt) {
    const { resolve } = createResolver(import.meta.url)

    addImportsDir(resolve("./runtime/composables"))

    // API 
    addServerHandler({ 
      handler: resolve("./runtime/server/middleware/auth") 
    })

    addServerHandler({
      route: "/api/auth/login",
      handler: resolve("./runtime/server/api/auth/login.get"),
    })
 
    addServerHandler({
      route: "/api/auth/logout",
      handler: resolve("./runtime/server/api/auth/logout.get"),
    })
    
    addServerHandler({
      route: "/api/auth/callback",
      handler: resolve("./runtime/server/api/auth/callback.get"),
    })
    
    addServerHandler({
      route: "/api/auth/me",
      handler: resolve("./runtime/server/api/auth/me.get"),
    })

    addRouteMiddleware({
      name: "auth",
      path: resolve("./runtime/middleware/auth.global"),
      global: true,
    })
  },
})
