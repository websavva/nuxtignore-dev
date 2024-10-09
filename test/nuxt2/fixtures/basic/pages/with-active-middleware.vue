<template>
  <h1>Was Active Middleware Activated - {{ activated }}</h1>
</template>

<script>
export default {
  middleware: 'active',

  computed: {
    activated() {
      return this.$store.state['active-middleware'].activated;
    },
  },
};
</script>
