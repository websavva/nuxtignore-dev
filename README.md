[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

# Nuxtignore Dev

Nuxt module which replaces the behavior of `.nuxtignore`, but for development purpose only, using `.nuxtignore.dev`, analogous to `.env.dev`. If a project is too large and containes big number of pages, such functionality
can help to pick out only specific pages in the development mode, thereby making builds faster.

> The current module supports both 2 and 3 versions of Nuxt.

## Setup

```sh
npm i -D nuxtignore-dev # npm
yarn add -D nuxtignore-dev # yarn
pnpm add -D nuxtignore-dev # pnpm
```

## Usage

1. Creating file `.nuxtignore.dev`, similar to the existing file `.nuxtignore.dev`

```.gitignore
pages/index.vue

middleware/*
```

It can also be useful to add `.nuxtignore.dev` to `.gitignore`.

2. Register the module in the `modules` array in `nuxt.config.ts`:

```javascript
// nuxt.config.js
{
  modules: [
    "nuxtignore-dev",
  ],

  nuxtignoreDev: { // optional
    enabled: process.env.NODE_ENV === 'development',

    // custom path to a file or filename
    filePath: '/etc/.custom-nuxtignore'

    // if set to true and the file is not found, error is thrown
    strict: false,

    // if set to true, ignored patterns are applied to pages added by hook "pages:extend"
    isPagesExtendHookIncluded: true,
  }
}
```

[npm-version-src]: https://img.shields.io/npm/v/nuxtignore-dev/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/nuxtignore-dev
[npm-downloads-src]: https://img.shields.io/npm/dt/nuxtignore-dev.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/nuxtignore-dev
[license-src]: https://img.shields.io/npm/l/@nuxt/image.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/nuxtignore-dev
[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
