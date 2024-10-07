import { fileURLToPath } from 'node:url';

import { expect, describe, it, beforeEach } from 'vitest';
import { nuxtCtx } from '@nuxt/kit';
import { createTest, $fetch } from '@nuxt/test-utils';

const createTestHooks = (options: Record<string, any>) => {
  return createTest({
    server: true,
    browser: false,
    rootDir: fileURLToPath(new URL('../fixtures/basic', import.meta.url)),
    nuxtConfig: {
      // @ts-expect-error
      nuxtignoreDev: options,
    },
  });
};
describe.sequential('Missing file', () => {
  beforeEach(() => {
    // workaround for multiple setups in one test suite
    nuxtCtx.unset();
  });

  it('should throw error when no file is found and strict mode is enabled', async () => {
    const testHooks = createTestHooks({
      enabled: true,
      filePath: 'non-existing-file',
      strict: true,
    });

    testHooks.beforeEach();

    expect(testHooks.setup()).rejects.toThrow(
      /\[nuxtignore-dev\]: File path ".+?non-existing-file" does not exist !/g,
    );

    testHooks.afterEach();

    await testHooks.afterAll();
  });

  it('should not throw error when no file is found and strict mode is disabled', async () => {
    const testHooks = createTestHooks({
      enabled: true,
      filePath: 'non-existing-file',
      strict: false,
    });

    testHooks.beforeEach();

    await testHooks.setup();

    expect(await $fetch('/')).toContain('<h1>Home Page</h1>');
    expect(await $fetch('/ignored')).toContain('<h1>Ignored Page</h1>');

    testHooks.afterEach();

    await testHooks.afterAll();
  });

  it('should apply custom file name', async () => {
    const testHooks = createTestHooks({
      enabled: true,
      filePath: fileURLToPath(
        new URL('./.custom-nuxtignore-dev', import.meta.url),
      ),
      strict: true,
    });

    testHooks.beforeEach();

    await testHooks.setup();

    expect($fetch('/')).rejects.toHaveProperty('data.statusCode', 404);
    expect(await $fetch('/ignored')).toContain('<h1>Ignored Page</h1>');

    testHooks.afterEach();

    await testHooks.afterAll();
  });
});
