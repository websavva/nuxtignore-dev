import { expect, describe, it } from 'vitest';

import { $fetch, setupTest } from '../utils';

await setupTest('conflicting-patterns-extend-routes', {
  filePath: '.nuxtignore-with-active-pages.dev',
});

describe('Project with conflicting patterns', () => {
  it('should ignore pages', async () => {
    expect($fetch('/ignored')).rejects.toHaveProperty('statusCode', 404);
    expect($fetch('/')).rejects.toHaveProperty('statusCode', 404);

    expect(await $fetch('/active-pages')).toContain('<h1>Active Page</h1>');
    expect(await $fetch('/active-pages/child')).toContain(
      '<h1>Child Active Page</h1>',
    );
  });
});
