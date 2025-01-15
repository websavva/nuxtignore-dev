import { relative } from 'node:path';

import ignore from 'ignore';

import { resolveAlias, isNuxt2 as _isNuxt2, useNuxt } from '@nuxt/kit';
import type { NuxtPage as Nuxt3Page } from '@nuxt/schema';

export interface Nuxt2Page {
  component: string;
  children?: Nuxt2Page[];
}

export type NuxtPage = Nuxt2Page | Nuxt3Page;

export type IsIgnored = (pathname: string) => boolean;

export type Nuxt2Builder = {
  ignore: {
    ignore: {
      ignores: IsIgnored;
    };
  };
};

export function resolveGroupSyntax(group: string): string[] {
  let groups = [group];
  while (groups.some((group) => group.includes('{'))) {
    groups = groups.flatMap((group) => {
      const [head, ...tail] = group.split('{');
      if (tail.length) {
        const [body = '', ...rest] = tail.join('{').split('}');
        return body.split(',').map((part) => `${head}${part}${rest.join('')}`);
      }

      return group;
    });
  }
  return groups;
}

export const createDevIgnoreFilter = (devIgnorePatterns: string[]) => {
  const ignoreFilter = ignore();

  ignoreFilter.add(
    devIgnorePatterns.flatMap((pattern) => resolveGroupSyntax(pattern)),
  );

  const nuxt = useNuxt();

  const isNuxt2 = _isNuxt2();

  return (pathname: string) => {
    let baseDir: string;

    if (isNuxt2) {
      baseDir = nuxt.options.rootDir;
    } else {
      const cwds = nuxt.options._layers
        ?.map((layer) => layer.cwd)
        .sort((a, b) => b.length - a.length);

      const layer = cwds?.find((cwd) => pathname.startsWith(cwd));

      baseDir = layer || nuxt.options.rootDir;
    }

    const relativePathname = relative(baseDir, pathname);

    if (
      !relativePathname ||
      (relativePathname[0] === '.' && relativePathname[1] === '.')
    ) {
      return false;
    }

    return Boolean(relativePathname && ignoreFilter.ignores(relativePathname));
  };
};

export const findIgnoredPageIndex = <P extends NuxtPage>(
  pages: P[],
  isIgnored: (pathname: string) => boolean,
) => {
  return pages.findIndex((page) => {
    const filePath = 'component' in page ? page.component : page.file;

    if (!filePath) return false;

    return isIgnored(resolveAlias(filePath));
  });
};

export const removeIgnoredPages = <P extends NuxtPage>(
  pages: P[],
  isIgnored: (pathname: string) => boolean,
) => {
  let ignoredPageIndex: number;

  while (~(ignoredPageIndex = findIgnoredPageIndex(pages, isIgnored))) {
    pages.splice(ignoredPageIndex, 1);
  }

  pages.forEach((page) => {
    if (page.children) {
      removeIgnoredPages(page.children as P[], isIgnored);
    }
  });
};
