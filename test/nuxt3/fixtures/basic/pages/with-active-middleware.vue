<template>
  <h1>Was Active Middlewared Passed - {{ activated }}</h1>
</template>

<script setup lang="ts">
import { useState, definePageMeta } from '#imports';

const {
  value: { activated },
} = useState('active-middleware', () => ({
  activated: false,
}));

definePageMeta({
  middleware: 'active',
});
</script>
