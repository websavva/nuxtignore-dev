// @ts-check
import { createCommonJS } from 'mlly';

import withNuxt from './.nuxt/eslint.config.mjs';

const { require: _require } = createCommonJS(import.meta.url);

export default withNuxt([_require('eslint-plugin-prettier/recommended')]);
