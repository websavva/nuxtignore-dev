import { join, isAbsolute } from 'node:path';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';

import type { NuxtPage } from '@nuxt/schema';
import { defineNuxtModule, isIgnored } from '@nuxt/kit';

export interface ModuleOptions {
  filePath: string;
  enabled: boolean;
  strict: boolean;
  isPagesExtendHookIncluded: boolean;
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
      isPagesExtendHookIncluded: true,
    };
  },

  async setup({ filePath, strict, enabled, isPagesExtendHookIncluded }, nuxt) {
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

    if (isPagesExtendHookIncluded) {
      nuxt.hooks.afterEach(({ name, args }) => {
        if (name === 'pages:extend') {
          const [rootPages] = args;

          const findIgnoredPageIndex = (pages: NuxtPage[]) => {
            return pages.findIndex(({ file }) => {
              return file && isIgnored(file);
            });
          };

          const removeIgnoredPages = (pages: NuxtPage[]) => {
            let ignoredPageIndex: number;

            while (~(ignoredPageIndex = findIgnoredPageIndex(pages))) {
              pages.splice(ignoredPageIndex, 1);
            }

            pages.forEach((page) => {
              if (page.children) {
                removeIgnoredPages(page.children);
              }
            });
          };

          removeIgnoredPages(rootPages);
        }
      });
    }
  },
});
