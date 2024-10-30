import { isIgnored as _isIgnored, resolveAlias } from '@nuxt/kit';
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

export const findIgnoredPageIndex = <P extends NuxtPage>(
  pages: P[],
  isIgnored: IsIgnored = _isIgnored,
) => {
  return pages.findIndex((page) => {
    const filePath = 'component' in page ? page.component : page.file;

    if (!filePath) return false;

    return isIgnored(resolveAlias(filePath));
  });
};

export const removeIgnoredPages = <P extends NuxtPage>(
  pages: P[],
  isIgnored?: IsIgnored,
) => {
  let ignoredPageIndex: number;

  while (~(ignoredPageIndex = findIgnoredPageIndex(pages, isIgnored))) {
    pages.splice(ignoredPageIndex, 1);
  }

  pages.forEach((page) => {
    if (page.children) {
      removeIgnoredPages(page.children as P[]);
    }
  });
};
