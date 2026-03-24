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
        redirectUri: 'http://localhost:3000/dashboard',
        logoutUri: 'http://localhost:3000/',
        fullLogout: false,
      },
      ddEnv: 'local',
    },
  },
})
