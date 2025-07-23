<template>
  <div class="flex items-center justify-center h-screen transition-colors duration-500 bg-gradient-to-br from-blue-100 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
    <div class="w-full max-w-md p-8 text-center bg-white shadow-2xl dark:bg-gray-800 rounded-3xl">
      <!-- Animated Icon -->
      <div class="relative mb-6">
        <div class="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-blue-700 animate-pulse-slow">
          <UIcon name="i-heroicons-lock-closed-20-solid" class="w-8 h-8 text-white" />
        </div>
        <!-- Subtle glow effect -->
        <div class="absolute inset-0 w-16 h-16 mx-auto rounded-full bg-blue-500/30 blur-xl animate-pulse-slow"></div>
      </div>

      <!-- Title -->
      <h2 class="mb-4 text-2xl font-bold text-gray-900 dark:text-white animate-fade-in">
        Memvalidasi Login
      </h2>

      <!-- Description -->
      <p class="mb-6 text-base text-gray-600 dark:text-gray-300 animate-fade-in-delay">
        Silakan tunggu sementara kami memverifikasi kredensial Anda dengan aman...
      </p>

      <!-- Loading Spinner -->
      <div v-if="isLoading" class="relative w-12 h-12 mx-auto">
        <div class="absolute inset-0 border-4 border-transparent rounded-full border-t-blue-500 border-b-blue-500 animate-spin"></div>
        <div class="absolute inset-0 border-4 border-transparent rounded-full border-l-blue-400 border-r-blue-400 animate-spin-reverse"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  middleware: ['auth'],
  layout: false
})

const router = useRouter()
const isLoading = ref(true)

onMounted(async () => {
  // Check Keycloak authentication using localStorage
  if (process.client) {
    const keycloakToken = localStorage.getItem("auth._token.keycloak")
    const tokenExpiry = parseInt(localStorage.getItem('auth._token_expiration.keycloak') || '0')
    const tokenInAuth = localStorage.getItem("TokenInAuth")
    const userId = localStorage.getItem("userId")
    
    if (!keycloakToken || keycloakToken.trim() === "") {
      router.push('/login')
      return
    }

    // Check if token is expired
    if (tokenExpiry <= Date.now()) {
      router.push('/login')
      return
    }

    // Check if user already has TokenInAuth (completed OTP)
    if (tokenInAuth && userId) {
      // User already completed OTP, redirect to dashboard
      router.push('/dashboard')
      return
    }
  }
  
  // Simulate login validation process
  try {
    // Shorter delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // After successful Keycloak authentication, redirect to OTP validation
    // Use replace instead of push to avoid back button issues
    router.replace('/auth/validasi_otp')
    isLoading.value = false
  } catch (error) {
    console.error('Login validation error:', error)
    router.push('/login')
  }
})
</script>

<style scoped>
/* Pulse animation */
@keyframes pulse-slow {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}

.animate-pulse-slow {
  animation: pulse-slow 2s ease-in-out infinite;
}

/* Fade animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

.animate-fade-in-delay {
  animation: fadeIn 0.8s ease-out 0.3s both;
}

/* Reverse spin for secondary spinner */
@keyframes spin-reverse {
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}

.animate-spin-reverse {
  animation: spin-reverse 1.5s linear infinite;
}

/* Ensure no scroll and fit viewport */
html, body {
  overflow: hidden;
}

/* Smooth transitions for dark mode */
.dark {
  transition: all 0.5s ease;
}
</style>