<template>
  <Profil />
</template>

<script setup>
import Profil from '@/components/opd/dashboard/profile/index.vue';
definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'role-protection']
});
</script>