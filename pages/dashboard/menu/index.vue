<template>
  <Menu />
</template>

<script setup>
import Menu from '@/components/opd/dashboard/menu/index.vue';
definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'role-protection']
});
</script>