<template>
  <Role/>
</template>

<script setup>
import Role from '~/components/opd/dashboard/manajemen-role/role/Role.vue';
definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'role-protection']
});
</script>