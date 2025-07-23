<template>
  <Pages />
</template>

<script setup>
import Pages from '@/components/opd/dashboard/pagess/index.vue';
definePageMeta({
  layout: 'admin',
    middleware: 'auth'
});
</script>