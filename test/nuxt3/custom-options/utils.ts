import { fileURLToPath } from 'node:url';

import { setup } from '@nuxt/test-utils';

export const basicFixtureRootDir = fileURLToPath(
  new URL('../fixtures/basic', import.meta.url),
);

export const setupWithCustomOptions = (options: Record<string, unknown>) => {
  return setup({
    server: true,
    browser: false,
    rootDir: fileURLToPath(new URL('../fixtures/basic', import.meta.url)),
    nuxtConfig: {
      // @ts-expect-error missing type
      nuxtignoreDev: options,
    },
    dev: true,
  });
};
