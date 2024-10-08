import { createResolver } from '@nuxt/kit';

import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  modules: ['nuxtignore-dev'],

  telemetry: false,

  hooks: {
    'pages:extend'(pages) {
      const { resolve } = createResolver(import.meta.url);
      pages.push(
        {
          name: 'ActiveExtendedPage',
          file: resolve('./extended-pages/ActivePage.vue'),
          path: '/extended/active',
          children: [
            {
              name: 'IgnoreChildExtendedPage',
              path: '/extended/active/child',
              file: resolve('./extended-pages/IgnoredChildPage.vue'),
            },
          ],
        },
        {
          name: 'IgnoredExtendedPage',
          file: resolve('./extended-pages/IgnoredPage.vue'),
          path: '/extended/ignored',
        },
      );
    },
  },
});
