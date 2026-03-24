<!--
Get your module up and running quickly.

Find and replace all on all files (CMD+SHIFT+F):
- Name: My Module
- Package name: my-module
- Description: My new Nuxt module
-->

# ping-auth

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

ping-auth module for doing amazing things.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/ping-auth?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

- 🔐 &nbsp;Seamless integration with Ping Identity OIDC/OAuth2
- 🧩 &nbsp;Out-of-the-box composables for user session management (`usePingAuth`)
- 🛡️ &nbsp;Route protection middleware
- 🔄 &nbsp;Auto-refresh tokens and state handling
- ⚡ &nbsp;Full Server-Side Rendering (SSR) support

## Quick Setup

Install the module to your Nuxt application with one command:

```bash
npx nuxt module add ping-auth
```

That's it! You can now use ping-auth in your Nuxt app ✨


## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  npm install
  
  # Generate type stubs
  npm run dev:prepare
  
  # Develop with the playground
  npm run dev
  
  # Build the playground
  npm run dev:build
  
  # Run ESLint
  npm run lint
  
  # Run Vitest
  npm run test
  npm run test:watch
  
  # Release new version
  npm run release
  ```

</details>


<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/ping-auth/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/ping-auth

[npm-downloads-src]: https://img.shields.io/npm/dm/ping-auth.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/ping-auth

[license-src]: https://img.shields.io/npm/l/ping-auth.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/ping-auth

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt
[nuxt-href]: https://nuxt.com
