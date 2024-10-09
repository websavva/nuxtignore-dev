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
            component: '~/extended-pages/ActivePage.vue',
            path: '/extended/active',
            children: [
              {
                component: '~/extended-pages/IgnoredChildPage.vue',
                path: '/extended/active/child',
              },
            ],
          },
          {
            component: '~/extended-pages/IgnoredPage.vue',
            path: '/extended/ignored',
          },
        );
      },
    },
  },
} satisfies NuxtConfig;
