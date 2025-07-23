<template>
  <UModal v-model="modalValue" prevent-close>
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold leading-6 text-gray-900 dark:text-white">
            Konfirmasi Keluar
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
            @click="modalValue = false" />
        </div>
      </template>

      <div class="flex justify-center p-4">
        <Vue3Lottie :animationLink="`/animation/warning.json`" :height="200" />
      </div>
      
      <div class="flex flex-col items-center justify-center space-y-4">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Apakah anda yakin akan keluar?
        </p>
        <div class="flex items-center justify-center gap-2 space-x-4">
          <UButton size="lg" class="flex items-center justify-center w-full" color="red" variant="soft" label="Yes"
            :trailing="false" @click="handleLogout" />
          <UButton size="lg" class="flex items-center justify-center w-full" color="gray" variant="solid" label="No"
            :trailing="false" @click="modalValue = false" />
        </div>
      </div>
    </UCard>
  </UModal>
</template>


<script setup>
import { computed } from 'vue';
import { useLoginStore } from '~/store/auth/login';
import { useAuthKeycloakStore } from '~/store/auth/auth';
import { useRouter } from 'vue-router';
import { useLayout } from '~/store/layouts/layouts';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
});
const emit = defineEmits(['update:modelValue']);
const modalValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const toast = useToast();
const loginStore = useLoginStore();
const authStore = useAuthKeycloakStore()
const router = useRouter();
const layoutStore = useLayout()

const handleLogout = () => {
  layoutStore.setLoading(true);
  try {
    // authStore.logout() will handle redirect to Keycloak logout
    // which will clear all tokens and redirect back to home
    authStore.logout();
    
    // Don't do additional redirects here - let Keycloak handle it
    // router.push('/login'); // REMOVED
    
    toast.add({ title: "Log Out Berhasil!" });
  } catch (error) {
    console.error('Logout error:', error);
    // Fallback if logout fails
    window.location.href = '/login';
  } finally {
    layoutStore.setLoading(false);
  }
};
</script>