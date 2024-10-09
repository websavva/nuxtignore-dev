import { defineNuxtRouteMiddleware } from 'nuxt/app';

export default defineNuxtRouteMiddleware(() => {
  const $state = useState('active-middleware', () => ({
    activated: false,
  }));

  $state.value.activated = true;
});
