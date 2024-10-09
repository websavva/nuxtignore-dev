<template>
  <h1>Was Ignored Middlewared Passed - {{ activated }}</h1>
</template>

<script setup lang="ts">
import { useState, definePageMeta } from '#imports';

const {
  value: { activated },
} = useState('ignored-middleware', () => ({
  activated: false,
}));

definePageMeta({
  middleware: 'ignored',
});
</script>
