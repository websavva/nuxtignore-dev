import { join, isAbsolute, relative } from 'node:path';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';

import { defineNuxtModule, isNuxt2 } from '@nuxt/kit';

import { type Nuxt2Builder, type Nuxt2Page, removeIgnoredPages } from './utils';

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
      if (isNuxt2()) {
        // @ts-expect-error non-existing hooks for nuxt3
        nuxt.hook('builder:prepared', (builder: Nuxt2Builder) => {
          const isIgnored = (pathname: string) => {
            const relativePathname = relative(nuxt.options.rootDir, pathname);
            if (
              !relativePathname ||
              (relativePathname[0] === '.' && relativePathname[1] === '.')
            ) {
              return false;
            }

            return builder.ignore.ignore.ignores(relativePathname);
          };

          // wrapping extendRoutes function in order to apply ignored patterns
          // @ts-expect-error non-existing hooks for nuxt3
          nuxt.hook('build:extendRoutes', () => {
            const optionsWithRouter = nuxt.options as unknown as {
              router?: {
                extendRoutes: (
                  pages: Nuxt2Page[],
                  router: unknown,
                ) => Nuxt2Page[] | undefined;
              };
            };

            const { extendRoutes: originalExtendRoutes } =
              optionsWithRouter.router || {};

            optionsWithRouter.router!.extendRoutes = (
              pages: Nuxt2Page[],
              router: unknown,
            ) => {
              const extendedPages =
                originalExtendRoutes?.(pages, router) || pages;

              removeIgnoredPages(extendedPages, isIgnored);

              return extendedPages;
            };
          });
        });
      } else {
        nuxt.hooks.afterEach(({ name, args }) => {
          if (name === 'pages:extend') {
            const [rootPages] = args;

            removeIgnoredPages(rootPages);
          }
        });
      }
    }
  },
});
