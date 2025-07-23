<template>
  <UserRole/>
</template>

<script setup>
import UserRole from '~/components/opd/dashboard/manajemen-role/user-role/UserRole.vue';
definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'role-protection']
});
</script>