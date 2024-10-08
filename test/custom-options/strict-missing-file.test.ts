import { expect, test } from 'vitest';
import { createTest } from '@nuxt/test-utils';

import { basicFixtureRootDir } from './utils';

test('Missing file in strict mode', async () => {
  const testHooks = createTest({
    browser: false,
    server: true,
    rootDir: basicFixtureRootDir,
    nuxtConfig: {
      // @ts-expect-error
      nuxtignoreDev: {
        enabled: true,
        filePath: 'non-existing-file',
        strict: true,
      },
    },
  });

  testHooks.beforeEach();

  expect(testHooks.setup()).rejects.toThrow(
    /\[nuxtignore-dev\]: File path ".+?non-existing-file" does not exist !/g,
  );

  testHooks.afterEach();

  await testHooks.afterAll();
});
