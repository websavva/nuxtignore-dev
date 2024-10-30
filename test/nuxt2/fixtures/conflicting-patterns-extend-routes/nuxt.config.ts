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
            component: '~/pages/-active-pages/index.vue',
            path: '/active-pages',
          },
          {
            component: '~/pages/-active-pages/child.vue',
            path: '/active-pages/child',
          },
        );
      },
    },
  },
} satisfies NuxtConfig;
