<template>
  <Slider />
</template>

<script setup>
import Slider from '@/components/opd/dashboard/mediaa/SliderSection.vue';
definePageMeta({
  layout: 'admin',
    middleware: 'auth'
});
</script>