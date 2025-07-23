<template>
  <Apps/>
</template>

<script setup>
import Apps from '~/components/opd/dashboard/manajemen-role/apps/Apps.vue';
definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'role-protection']
});
</script>