<template>
  <Widget />
</template>

<script setup>
import Widget from '@/components/opd/dashboard/widgett/index.vue';
definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'role-protection']
});
</script>