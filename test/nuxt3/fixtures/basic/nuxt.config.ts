import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  modules: ['nuxtignore-dev'],

  telemetry: false,

  hooks: {
    'pages:extend'(pages) {
      pages.push(
        {
          name: 'ActiveExtendedPage',
          file: '~/extended-pages/ActivePage.vue',
          path: '/extended/active',
          children: [
            {
              name: 'IgnoreChildExtendedPage',
              path: '/extended/active/child',
              file: '~/extended-pages/IgnoredChildPage.vue',
            },
          ],
        },
        {
          name: 'IgnoredExtendedPage',
          file: '~/extended-pages/IgnoredPage.vue',
          path: '/extended/ignored',
        },
      );
    },
  },
});
