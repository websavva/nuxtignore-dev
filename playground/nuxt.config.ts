import { defineNuxtConfig } from 'nuxt/config';

import NuxtignoreDevModule from 'nuxtignore-dev';

export default defineNuxtConfig({
  modules: [NuxtignoreDevModule],

  compatibilityDate: '2024-10-06',
});
