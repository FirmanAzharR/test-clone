<template>
  <Layanan />
</template>

<script setup>
import Layanan from '@/components/opd/dashboard/layanan/index.vue';
definePageMeta({
  layout: 'admin',
    middleware: 'auth'
});
</script>