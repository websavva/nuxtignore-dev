import { fileURLToPath } from 'node:url';
import { readdirSync } from 'node:fs';
import { join, basename } from 'node:path';

import { getContext, setupTest as _setupTest } from '@nuxt/test-utils';
import { $fetch as _$fetch } from 'ofetch';

export const $fetch = (path: string) => {
  const { url } = getContext();

  return _$fetch(new URL(path, url!).toString());
};

export const fixturesRootDir = fileURLToPath(
  new URL('./fixtures', import.meta.url),
);

export const FIXTURE_PATHS = Object.fromEntries(
  readdirSync(fixturesRootDir).map((fixtureRelativePath) => {
    return [
      basename(fixtureRelativePath),
      join(fixturesRootDir, fixtureRelativePath),
    ];
  }),
);

export const loadConfig = (rootDir: string) => {
  return import(join(rootDir, 'nuxt.config')).then((m) => m.default);
};

export const setupTest = async (
  fixtureName: string,
  options: Record<string, unknown> = {},
) => {
  const rootDir = FIXTURE_PATHS[fixtureName];

  const config = await loadConfig(rootDir);

  return _setupTest({
    server: true,
    browser: false,
    rootDir,
    configFile: '',
    config: {
      ...config,
      nuxtignoreDev: {
        isPagesExtendHookIncluded: true,
        ...options,
      },
    },
  });
};
