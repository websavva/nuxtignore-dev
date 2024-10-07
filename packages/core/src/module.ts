import { join, isAbsolute } from 'node:path';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';

import { defineNuxtModule } from '@nuxt/kit';
import { strict } from 'node:assert';

export interface ModuleOptions {
  filePath: string;
  enabled: boolean;
  strict: boolean;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxtignore-dev',
    configKey: 'nuxtignoreDev',
  },
  defaults(nuxt) {
    return {
      filePath: './.nuxtignore.dev',
      enabled: nuxt.options.dev,
      strict: false,
    };
  },

  async setup({ filePath, strict, enabled }, nuxt) {
    if (!enabled) return;

    const absoluteNuxtignoreDevFilePath = isAbsolute(filePath)
      ? filePath
      : join(nuxt.options.rootDir, filePath);

    if (!existsSync(absoluteNuxtignoreDevFilePath)) {
      if (strict)
        throw new Error(
          `[nuxtignore-dev]: File path "${absoluteNuxtignoreDevFilePath}" does not exist !`,
        );

      return;
    }

    nuxt.options.watch.push(absoluteNuxtignoreDevFilePath);

    const fileContent = await readFile(absoluteNuxtignoreDevFilePath, 'utf-8');

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
