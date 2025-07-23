<template>
  <Analytics />
</template>

<script setup>
import Analytics from '@/components/opd/dashboard/Analytics.vue';
definePageMeta({
  layout: 'admin',
    middleware: 'auth'
});
</script>
