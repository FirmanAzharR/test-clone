<template>
  <Jawaban />
</template>

<script setup>
import Jawaban from '@/components/opd/dashboard/survey-masyarakat/jawaban.vue';
definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'role-protection']
});
</script>