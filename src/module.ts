import { join, isAbsolute } from 'node:path';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';

import { defineNuxtModule } from '@nuxt/kit';

export interface ModuleOptions {
  filePath: string;
  isEnabled: boolean;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxtignore-dev',
    configKey: 'nuxtignoreDev',
  },
  defaults(nuxt) {
    return {
      filePath: './.nuxtignore.dev',
      isEnabled: nuxt.options.dev,
    };
  },

  async setup({ filePath }, nuxt) {
    const fullFilePath = isAbsolute(filePath)
      ? filePath
      : join(nuxt.options.rootDir, filePath);

    if (!existsSync(fullFilePath))
      throw new Error(
        `[nuxtignore-dev]: File path "${fullFilePath}" does not exist !`,
      );

    const fileContent = await readFile(fullFilePath, 'utf-8');

    const devIgnoredPatterns = fileContent
      .trim()
      .split(/\r?\n/)
      .filter(Boolean)
      .filter((pattern) => !pattern.startsWith('#'));

    nuxt.options.ignore = [
      ...(nuxt.options.ignore || []),
      ...devIgnoredPatterns,
    ];
  },
});
