import { defineNuxtConfig } from 'nuxt/config'
import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [
    MyModule
  ],
  runtimeConfig: {
    public: {
      pingAuth: {
        issuer: 'http://example.com',
        clientId: 'test-client-id',
        logoutUri: '/logged-out'
      },
      ddEnv: 'local'
    }
  }
})
