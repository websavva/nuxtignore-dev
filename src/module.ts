import {
  defineNuxtModule,
  createResolver,
  addPluginTemplate,
  addTypeTemplate,
} from '@nuxt/kit';

export interface ModuleOptions {
  globalName?: string;
  order?: number;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'exposedNuxt',
    configKey: 'exposedNuxt',
  },
  defaults: {
    globalName: '$nuxt',
  },
  setup({ order, globalName }) {
    const templateOptions = {
      globalName,
    };

    const resolver = createResolver(import.meta.url);

    addPluginTemplate({
      src: resolver.resolve('./runtime/plugin.mjs'),
      mode: 'client',
      options: templateOptions,
      order,
    });

    addTypeTemplate({
      src: resolver.resolve('./runtime/types.d.ts'),
      filename: 'exposed-nuxt.d.ts',
      options: templateOptions,
    });
  },
});
