<template>
  <Soal />
</template>

<script setup>
import Soal from '@/components/opd/dashboard/survey-masyarakat/soal.vue';
definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'role-protection']
});
</script>