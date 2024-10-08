import { fileURLToPath } from 'node:url';

import { expect, describe, it } from 'vitest';
import { setup, $fetch } from '@nuxt/test-utils';

await setup({
  server: true,
  browser: false,
  rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  dev: true,
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

  it('should ignore components', async () => {
    const componentsPageContent = await $fetch('/components');

    expect(componentsPageContent).toContain('id="active-component');
    expect(componentsPageContent).not.toContain('id="ignored-component"');
  });

  it('should ignore auto imports', async () => {
    const autoImportsPageContent = await $fetch('/auto-imports');

    expect(autoImportsPageContent).toContain('useActive=function');
    expect(autoImportsPageContent).toContain('useIgnored=undefined');

    expect(autoImportsPageContent).toContain('activeUtil=function');
    expect(autoImportsPageContent).toContain('ignoredUtil=undefined');
  });

  it('should ignore extended pages', async () => {
    expect(await $fetch('/extended/active')).toContain(
      '<h1>Active Extended Page</h1>',
    );

    expect($fetch('/extended/ignored')).rejects.toHaveProperty(
      'data.statusCode',
      404,
    );
    expect($fetch('/extended/active/child')).rejects.toHaveProperty(
      'data.statusCode',
      404,
    );
  });
});
