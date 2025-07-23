<template>
  <Article />
</template>

<script setup>
import Article from '@/components/opd/dashboard/Article.vue';
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
});
</script>