<template>
  <Page />
</template>

<script setup>
import Page from '@/components/opd/dashboard/pagess/index.vue';
definePageMeta({
  layout: 'admin',
    middleware: 'auth'
});
</script>