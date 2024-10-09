import { resolve } from 'node:path';

import type { NuxtConfig } from '@nuxt/types';

export default {
  buildModules: ['nuxtignore-dev'],

  components: true,

  dev: true,

  hooks: {
    build: {
      extendRoutes(routes) {
        routes.push(
          {
            component: resolve(__dirname, './extended-pages/ActivePage.vue'),
            path: '/extended/active',
            children: [
              {
                component: resolve(
                  __dirname,
                  './extended-pages/IgnoredChildPage.vue',
                ),
                path: '/extended/active/child',
              },
            ],
          },
          {
            component: resolve(__dirname, './extended-pages/IgnoredPage.vue'),
            path: '/extended/ignored',
          },
        );
      },
    },
  },
} satisfies NuxtConfig;
