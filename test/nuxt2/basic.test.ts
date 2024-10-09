import { fileURLToPath } from 'node:url';

import { expect, describe, it } from 'vitest';

import { $fetch, setupTest } from './utils';

await setupTest();

describe('Basic project', () => {
  it('should ignore pages', async () => {
    expect(await $fetch('/')).toContain('<h1>Home Page</h1>');

    expect($fetch('/ignored')).rejects.toHaveProperty('statusCode', 404);
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

  it('should ignore extended pages', async () => {
    expect(await $fetch('/extended/active')).toContain(
      '<h1>Active Extended Page</h1>',
    );

    expect($fetch('/extended/ignored')).rejects.toHaveProperty(
      'statusCode',
      404,
    );
    expect($fetch('/extended/active/child')).rejects.toHaveProperty(
      'statusCode',
      404,
    );
  });

  it('should ignore middlewares', async () => {
    expect(await $fetch('/with-active-middleware')).toContain(
      '<h1>Was Active Middleware Activated - true</h1>',
    );
    expect($fetch('with-ignored-middleware')).rejects.toHaveProperty(
      'statusCode',
      500,
    );
  });
});
