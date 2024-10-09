import { fileURLToPath } from 'node:url';

import { getContext, setupTest as _setupTest } from '@nuxt/test-utils';
import { $fetch as _$fetch } from 'ofetch';

export const $fetch = (path: string) => {
  const { url } = getContext();

  return _$fetch(new URL(path, url!).toString());
};

export const basicFixtureRootDir = fileURLToPath(
  new URL('./fixtures/basic', import.meta.url),
);

export const loadConfig = () => {
  return import('./fixtures/basic/nuxt.config').then((m) => m.default);
};

export const setupTest = async (options: Record<string, any> = {}) => {
  const config = await loadConfig();

  return _setupTest({
    server: true,
    browser: false,
    rootDir: basicFixtureRootDir,
    configFile: '',
    config: {
      ...config,
      nuxtignoreDev: options,
    },
  });
};
