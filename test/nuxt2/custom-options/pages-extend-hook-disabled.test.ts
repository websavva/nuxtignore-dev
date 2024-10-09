import { expect, test } from 'vitest';

import { setupTest, $fetch } from '../utils';

await setupTest({
  enabled: true,
  strict: true,
  isPagesExtendHookIncluded: false,
});

test('"pages:extend" hook is excluded', async () => {
  expect(await $fetch('/extended/active')).toContain(
    '<h1>Active Extended Page</h1>',
  );

  expect(await $fetch('/extended/ignored')).toContain(
    '<h1>Ignored Extended Page</h1>',
  );

  const childPageContent = await $fetch('/extended/active/child');

  expect(childPageContent).toContain('<h1>Active Extended Page</h1>');
  expect(childPageContent).toContain('<h1>Ignored Child Page</h1>');
});
