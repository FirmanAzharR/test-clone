<template>
  <Video />
</template>

<script setup>
import Video from '@/components/opd/dashboard/mediaa/VideoSection.vue';
definePageMeta({
  layout: 'admin',
    middleware: 'auth'
});
</script>