import { defineNuxtConfig } from 'nuxt/config';

import NuxtignoreDevModule from '../src/module';

export default defineNuxtConfig({
  modules: [NuxtignoreDevModule],

  compatibilityDate: '2024-10-06',
});
