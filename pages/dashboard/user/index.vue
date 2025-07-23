<template>
  <User/>
</template>

<script setup>
import User from '~/components/opd/dashboard/user/User.vue';
definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'role-protection']
});
</script>
