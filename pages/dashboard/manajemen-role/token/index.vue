<template>
  <Token/>
</template>

<script setup>
import Token from '~/components/opd/dashboard/manajemen-role/token/Token.vue';
definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'role-protection']
});
</script>