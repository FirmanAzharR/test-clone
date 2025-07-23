<template>
  <div class="flex items-center justify-center h-screen">
    <div v-if="auth.loading.value" class="text-center">
      <p class="mb-4 text-lg">Processing authentication...</p>
      <div class="w-12 h-12 mx-auto border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
    </div>
    <div v-else-if="error" class="px-4 py-3 text-red-700 bg-red-100 border border-red-400 rounded">
      <p>{{ error }}</p>
      <UButton color="blue" label="Try Again" @click="auth.login()" class="mt-4" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ComposableAuth } from '~/composable/useAuth';

definePageMeta({
  layout: false,
});

const router = useRouter()
const auth = ComposableAuth()
const error = ref('')
const checkAuthInterval = ref(null)

// Process callback
onMounted(() => {
  checkAuthInterval.value = setInterval(() => {
    if (!auth.loading.value) {
      clearInterval(checkAuthInterval.value)
      
      if (auth.loggedIn.value) {
        router.push('/auth/validasi_login')
      } else if (auth.error.value) {
        error.value = auth.error.value
      } else {
        router.push('/login')
      }
    }
  }, 100)
})
</script>