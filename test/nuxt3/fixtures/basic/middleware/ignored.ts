import { defineNuxtRouteMiddleware } from 'nuxt/app';

export default defineNuxtRouteMiddleware(() => {
  const $state = useState('ignored-middleware', () => ({
    activated: false,
  }));

  $state.value.activated = true;
});
