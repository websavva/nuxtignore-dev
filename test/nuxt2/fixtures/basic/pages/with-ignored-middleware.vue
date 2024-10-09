<template>
  <h1>Was Ignored Middleware Activated - {{ activated }}</h1>
</template>

<script>
export default {
  middleware: 'ignored',

  computed: {
    activated() {
      return this.$nuxt.$store.state['ignored-middleware'].activated;
    },
  },
};
</script>
