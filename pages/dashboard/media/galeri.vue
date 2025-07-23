<template>
  <Galeri />
</template>

<script setup>
import Galeri from '@/components/opd/dashboard/mediaa/GaleriSection.vue';
definePageMeta({
  layout: 'admin',
    middleware: 'auth'
});
</script>