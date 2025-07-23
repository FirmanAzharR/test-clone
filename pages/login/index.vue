<template>
  <Login />
</template>

<script setup>
import Login from '@/components/opd/login/index.vue';

definePageMeta({
  layout: false,
  middleware: ['login-redirect']
});
</script>