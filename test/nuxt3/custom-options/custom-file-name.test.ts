import { fileURLToPath } from 'node:url';

import { expect, test } from 'vitest';
import { $fetch } from '@nuxt/test-utils';

import { setupWithCustomOptions } from './utils';

await setupWithCustomOptions({
  enabled: true,
  filePath: fileURLToPath(new URL('./.custom-nuxtignore-dev', import.meta.url)),
  strict: true,
});

test('Custom file name', async () => {
  expect($fetch('/')).rejects.toHaveProperty('data.statusCode', 404);
  expect(await $fetch('/ignored')).toContain('<h1>Ignored Page</h1>');
});
