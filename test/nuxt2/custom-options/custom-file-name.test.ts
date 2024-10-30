import { fileURLToPath } from 'node:url';

import { expect, test } from 'vitest';
import { setupTest, $fetch } from '../utils';

await setupTest('basic', {
  enabled: true,
  filePath: fileURLToPath(new URL('./.custom-nuxtignore-dev', import.meta.url)),
  strict: true,
});

test('Custom file name', async () => {
  expect($fetch('/')).rejects.toHaveProperty('statusCode', 404);
  expect(await $fetch('/ignored')).toContain('<h1>Ignored Page</h1>');
});
