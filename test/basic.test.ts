import { fileURLToPath } from 'node:url';

import { expect, describe, it } from 'vitest';
import { setup, $fetch } from '@nuxt/test-utils';

await setup({
  server: true,
  browser: false,
  rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
});

describe('Basic project', () => {
  it('Should ignore pages', async () => {
    expect(await $fetch('/')).toContain('<h1>Home Page</h1>');

    expect($fetch('/ignored')).rejects.toHaveProperty('data.statusCode', 404)
  });
});
