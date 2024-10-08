import { isIgnored } from '@nuxt/kit';
import type { NuxtPage as Nuxt3Page } from '@nuxt/schema';

export interface Nuxt2Page {
  component: string;
  children?: Nuxt2Page[];
}

export type NuxtPage = Nuxt2Page | Nuxt3Page;

export const findIgnoredPageIndex = <P extends NuxtPage>(pages: P[]) => {
  return pages.findIndex((page) => {
    const filePath = 'component' in page ? page.component : page.file;

    return filePath && isIgnored(filePath);
  });
};

export const removeIgnoredPages = <P extends NuxtPage>(pages: P[]) => {
  let ignoredPageIndex: number;

  while (~(ignoredPageIndex = findIgnoredPageIndex(pages))) {
    pages.splice(ignoredPageIndex, 1);
  }

  pages.forEach((page) => {
    if (page.children) {
      removeIgnoredPages(page.children as P[]);
    }
  });
};
