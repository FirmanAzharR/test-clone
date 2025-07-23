<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications />
    <Loading v-if="isLoading" />
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { useLayout } from '@/store/layouts/layouts.js';
import Loading from '@/components/global/loading/index.vue';

const layoutStore = useLayout();
const isLoading = computed(() => layoutStore.isLoading);
const isDarkMode = computed(() => layoutStore.theme === 'dark');

// Hanya jalankan di client side untuk menghindari hydration mismatch
onMounted(() => {
  // Plugin theme.client.js sudah menangani tema sebelum ini
  // Hanya perlu sync dengan store
  layoutStore.setInitialTheme();
  layoutStore.initThemeListener();
});

// Watch perubahan tema dan langsung apply
watch(isDarkMode, (newVal) => {
  if (process.client && typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', newVal);
    document.documentElement.setAttribute('data-theme', newVal ? 'dark' : 'light');
  }
}, { immediate: false });
</script>