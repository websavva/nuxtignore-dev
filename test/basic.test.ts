import { fileURLToPath } from 'node:url';

import { expect, describe, it } from 'vitest';
import { setup, $fetch } from '@nuxt/test-utils';

await setup({
  server: true,
  browser: false,
  rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
});

describe('Basic project', () => {
  it('should ignore pages', async () => {
    expect(await $fetch('/')).toContain('<h1>Home Page</h1>');

    expect($fetch('/ignored')).rejects.toHaveProperty('data.statusCode', 404);
  });

  it('should ignore layouts', async () => {
    const activePageContent = await $fetch('/with-active-layout');

    expect(activePageContent).toContain('id="active-layout"');
    expect(activePageContent).toContain('<h1>With Active Layout</h1>');

    const ignoredPageContent = await $fetch('/with-ignored-layout');

    expect(ignoredPageContent).not.toContain('id="ignored-layout"');
    expect(ignoredPageContent).toContain('<h1>With Ignored Layout</h1>');
  });
});
