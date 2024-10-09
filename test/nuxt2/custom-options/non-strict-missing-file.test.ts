import { expect, test } from 'vitest';

import { setupTest, $fetch } from '../utils';

await setupTest({
  enabled: true,
  filePath: 'non-existing-file',
  strict: false,
});

test('Missing file in non-strict mode', async () => {
  expect(await $fetch('/')).toContain('<h1>Home Page</h1>');
  expect(await $fetch('/ignored')).toContain('<h1>Ignored Page</h1>');
});
