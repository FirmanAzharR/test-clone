<template>
  <Konten />
</template>

<script setup>
import { ref, onMounted } from 'vue';

import Konten from '@/components/opd/dashboard/konten/Konten.vue';
import { useLoginStore } from '~/store/auth/login';
const loginStore = useLoginStore()


definePageMeta({
  layout: 'admin',
    middleware: 'auth'
});

onMounted(async () => {
  loginStore.getUsers()
});
</script>