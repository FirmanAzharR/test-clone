<template>
  <UCard class="w-full">
    <div v-if="iframeSrc" class="relative w-full" style="padding-top: 56.25%;">
      <iframe
        :src="iframeSrc"
        class="absolute top-0 left-0 w-full h-full"
        frameborder="0"
        allowtransparency
        loading="lazy"
      />
    </div>

    <div v-else class="flex items-center justify-center h-96">
      <UIcon name="i-heroicons-exclamation-triangle" class="mr-4 text-6xl text-yellow-500" />
      <p class="text-lg">Unable to load dashboard. Please check your app ID.</p>
    </div>

    <template #footer>
      <p class="text-sm text-gray-500">
        Data provided by Metabase. Last updated: {{ currentDate }}
      </p>
    </template>
  </UCard>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useLoginStore } from '~/store/auth/login';

const loginStore = useLoginStore();
const appId = ref(1);
const iframeSrc = ref(null);

const currentDate = computed(() => {
  return new Date().toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Fungsi untuk memperbarui iframeSrc
const updateIframeSrc = () => {
  appId.value = loginStore?.appIdUser || localStorage.getItem("appId");
  
  if (appId.value) {
    iframeSrc.value = `https://metabase.jogjaprov.go.id/public/dashboard/afae313f-ea56-4fe8-832a-17eca1b0a38c?id=${appId.value}`;
    console.log('Iframe source updated successfully');
  } else {
    console.log('No appId available - iframe will show error');
  }
};

onMounted(() => {
  if (process.client) {
    updateIframeSrc();
  }
});

// Watch perubahan appId di loginStore
watch(
  () => loginStore.appIdUser,
  () => {
    updateIframeSrc();
  }
);
</script>