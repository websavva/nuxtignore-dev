import { expect, describe, it } from 'vitest';

import { $fetch, setupTest } from '../utils';

await setupTest('conflicting-patterns-extend-routes', {
  filePath: '.nuxtignore-without-active-pages.dev',
});

describe('Project with conflicting patterns', () => {
  it('should ignore pages', async () => {
    expect($fetch('/ignored')).rejects.toHaveProperty('statusCode', 404);
    expect($fetch('/')).rejects.toHaveProperty('statusCode', 404);
    expect($fetch('/active-pages')).rejects.toHaveProperty('statusCode', 404);
    expect($fetch('/active-pages/child')).rejects.toHaveProperty(
      'statusCode',
      404,
    );
  });
});
