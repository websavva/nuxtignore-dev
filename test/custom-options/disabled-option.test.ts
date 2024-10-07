import { fileURLToPath } from 'node:url';

import { expect, describe, it } from 'vitest';
import { setup, $fetch } from '@nuxt/test-utils';

await setup({
  server: true,
  browser: false,
  rootDir: fileURLToPath(new URL('../fixtures/basic', import.meta.url)),
  nuxtConfig: {
    // @ts-expect-error
    nuxtignoreDev: {
      enabled: false,
    },
  },
});

describe('Disable option', () => {
  it('should not ignore pages', async () => {
    expect(await $fetch('/')).toContain('<h1>Home Page</h1>');
    expect(await $fetch('/ignored')).toContain('<h1>Ignored Page</h1>');
  });

  it('should not ignore layouts', async () => {
    const activePageContent = await $fetch('/with-active-layout');

    expect(activePageContent).toContain('id="active-layout"');
    expect(activePageContent).toContain('<h1>With Active Layout</h1>');

    const ignoredPageContent = await $fetch('/with-ignored-layout');

    expect(ignoredPageContent).toContain('id="ignored-layout"');
    expect(ignoredPageContent).toContain('<h1>With Ignored Layout</h1>');
  });

  it('should not ignore components', async () => {
    const componentsPageContent = await $fetch('/components');

    expect(componentsPageContent).toContain('id="active-component');
    expect(componentsPageContent).toContain('id="ignored-component"');
  });

  it('should not ignore auto imports', async () => {
    const autoImportsPageContent = await $fetch('/auto-imports');

    expect(autoImportsPageContent).toContain('useActive=function');
    expect(autoImportsPageContent).toContain('useIgnored=function');

    expect(autoImportsPageContent).toContain('activeUtil=function');
    expect(autoImportsPageContent).toContain('ignoredUtil=function');
  });
});