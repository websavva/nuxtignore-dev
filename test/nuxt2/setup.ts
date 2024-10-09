import { vi } from 'vitest';

// Mock global jest with vitest (used in @nuxt/test-utils)
global.jest = vi;
