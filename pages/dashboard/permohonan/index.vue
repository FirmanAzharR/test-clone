<template>
  <Permohonan />
</template>

<script setup>
import Permohonan from '@/components/opd/dashboard/permohonan/index.vue';
definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'role-protection']
});
</script>