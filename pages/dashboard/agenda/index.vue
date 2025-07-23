<template>
  <Agenda />
</template>

<script setup>
import Agenda from '@/components/opd/dashboard/agenda/Agenda.vue';

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'role-protection']
});
</script>