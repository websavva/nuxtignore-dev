import { expect, test, beforeEach, afterAll, afterEach } from 'vitest';
import {
  loadFixture,
  loadNuxt,
  listen,
  createContext,
  setContext,
  build,
} from '@nuxt/test-utils';

import { loadConfig, FIXTURE_PATHS } from '../utils';

test('Missing file in strict mode', async () => {
  const rootDir = FIXTURE_PATHS.basic;

  const baseConfig = await loadConfig(rootDir);

  const ctx = createContext({
    browser: false,
    server: true,
    rootDir,
    configFile: '',
    config: {
      ...baseConfig,
      nuxtignoreDev: {
        enabled: true,
        filePath: 'non-existing-file',
        strict: true,
      },
    },
  });

  beforeEach(() => {
    setContext(ctx);
  });

  afterEach(() => {
    // @ts-expect-error wrong types
    setContext(undefined);
  });

  afterAll(async () => {
    if (ctx.nuxt) {
      await ctx.nuxt.close();
    }

    if (ctx.browser) {
      await ctx.browser.close();
    }
  });

  const setup = async () => {
    await loadFixture();

    if (!ctx.nuxt) {
      await loadNuxt();

      await ctx.nuxt!.ready();
    }
    await build();
    await listen();
  };

  expect(setup()).rejects.toThrow(
    /\[nuxtignore-dev\]: File path ".+?non-existing-file" does not exist !/g,
  );
});
