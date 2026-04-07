export default defineNuxtConfig({
  modules: ['ping-auth'],
  devtools: { enabled: true },
  compatibilityDate: 'latest',
  runtimeConfig: {
    pingAuth: {
      clientSecret: '',
      jwtSecret: '',
      app: '',
    },
    public: {
      pingAuth: {
        clientId: '',
        issuer: '',
        redirectUri: '',
        logoutUri: '',
        fullLogout: false,
      },
      ddEnv: 'local',
    },
  },
})
