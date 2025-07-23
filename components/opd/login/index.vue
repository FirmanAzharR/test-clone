<template>
  <div class="flex w-full h-screen transition-colors duration-500 bg-gray-100 dark:bg-gray-900">
    <!-- Main Container -->
  <div class="flex flex-col md:flex-row w-full overflow-hidden bg-white shadow-2xl md:m-8 md:mx-auto max-w-7xl dark:bg-gray-800 md:rounded-3xl">
      
      <!-- Left Column - Informational Content -->
      <div class="flex flex-col justify-between w-full p-8 transition-colors duration-500 bg-white md:w-1/2 md:p-12 lg:p-16 dark:bg-gray-800">
        
        <!-- Header with Logo -->
        <div class="mb-10">
          <div class="flex items-center mb-4">
            <div class="flex items-center justify-center w-12 h-12 mr-4 rounded-full shadow-lg bg-gradient-to-br from-blue-500 to-blue-700">
              <span class="text-2xl font-bold text-white">{{ akronimInitial }}</span>
            </div>
            <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              {{ akronim }}
            </h1>
          </div>
        </div>

        <!-- Informational Section -->
        <div class="mb-10 space-y-6">
          <h2 class="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Selamat Datang
          </h2>
          <p class="text-base leading-relaxed text-gray-600 dark:text-gray-300">
            Login untuk mengakses konten eksklusif, analitik canggih, dan layanan digital yang aman.
          </p>
        </div>

        <!-- Login Button -->
        <UButton
          block
          size="xl"
          color="blue"
          variant="solid"
          label="Login"
          class="py-4 text-lg font-semibold text-white transition-all duration-300 bg-blue-600 hover:shadow-xl hover:shadow-blue-500/30 animate-bounce-in hover:bg-blue-700"
          @click="handleLogin"
        />
        <div class="flex items-center space-x-2">
          <Icon name="ri:error-warning-line" class="w-5 h-5 text-red-500" />
          <p class="text-xs font-medium text-red-600 dark:text-red-400">
            Hanya ASN dari masing-masing OPD yang dapat login ke platform ini.
          </p>
        </div>
        <!-- Footer -->
        <div class="flex items-center justify-between mt-8">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            © 2025 {{ akronim }}. All rights reserved.
          </div>
          
          <div class="flex items-center space-x-3">
            <UTooltip :text="layoutStore.theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'">
              <UButton
                size="sm"
                color="gray"
                variant="ghost"
                :icon="layoutStore.theme === 'dark' ? 'i-heroicons-sun-20-solid' : 'i-heroicons-moon-20-solid'"
                @click="toggleDarkMode"
                class="text-gray-500 transition-transform duration-300 hover:scale-110 dark:text-gray-300"
              />
            </UTooltip>
          </div>
        </div>
      </div>
      
      <!-- Right Column - Enhanced Content with Animation -->
      <div class="relative w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900">
        <!-- Subtle Overlay -->
        <div class="absolute inset-0 bg-blue-600/10 animate-pulse-slow"></div>
        
        <!-- Decorative Elements -->
        <div class="absolute rounded-full w-72 h-72 top-10 left-10 bg-white/10 blur-3xl animate-float"></div>
        <div class="absolute rounded-full w-96 h-96 bottom-10 right-10 bg-white/10 blur-3xl animate-float-reverse"></div>
        
        <!-- Content -->
        <div class="relative z-10 flex flex-col items-center justify-center h-full p-8 md:p-12">
          <!-- Animation -->
          <ClientOnly>
            <Vue3Lottie 
              :animationLink="`/animation/login.json`" 
              :height="250" 
              :loop="true"
              :autoplay="true"
              class="hidden md:block mb-8 transition-transform duration-500 transform hover:scale-105 animate-float-subtle"
            />
          </ClientOnly>
          
          <!-- Enhanced Informational Content -->
          <div class="space-y-6 text-center">
            <h3 class="text-3xl font-bold text-white drop-shadow-lg animate-fade-in">
              Aptika Platform
            </h3>
            <p class="max-w-sm text-base text-white/90 drop-shadow-md animate-fade-in-delay">
              Kelola konten, analisis data, dan akses layanan digital dengan mudah melalui platform kami.
            </p>
            
            <!-- Feature Cards -->
            <div class="grid grid-cols-2 gap-4 mt-6">
              <div class="p-4 transition-transform duration-300 rounded-xl bg-white/10 backdrop-blur-md hover:scale-105">
                <UIcon name="i-heroicons-shield-check-20-solid" class="w-6 h-6 mb-2 text-blue-200" />
                <p class="text-sm font-medium text-white">Keamanan Tingkat Tinggi</p>
              </div>
              <div class="p-4 transition-transform duration-300 rounded-xl bg-white/10 backdrop-blur-md hover:scale-105">
                <UIcon name="i-heroicons-chart-bar-20-solid" class="w-6 h-6 mb-2 text-blue-200" />
                <p class="text-sm font-medium text-white">Analitik Mendalam</p>
              </div>
              <div class="p-4 transition-transform duration-300 rounded-xl bg-white/10 backdrop-blur-md hover:scale-105">
                <UIcon name="i-heroicons-document-text-20-solid" class="w-6 h-6 mb-2 text-blue-200" />
                <p class="text-sm font-medium text-white">Manajemen Efisien</p>
              </div>
              <div class="p-4 transition-transform duration-300 rounded-xl bg-white/10 backdrop-blur-md hover:scale-105">
                <UIcon name="i-heroicons-device-phone-mobile-20-solid" class="w-6 h-6 mb-2 text-blue-200" />
                <p class="text-sm font-medium text-white">Akses Multi-Platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ComposableAuth } from '~/composable/useAuth'
import { useLayout } from '~/store/layouts/layouts'

const layoutStore = useLayout()
const router = useRouter()
const auth = ComposableAuth()

const config = useRuntimeConfig();
const akronim = config.public.akronim || 'Aptika';
const akronimInitial = akronim.charAt(0);

definePageMeta({
  layout: false,
})

const handleLogin = () => {
  auth.login()
}

const toggleDarkMode = () => {
  layoutStore.themeSwitch()
}

onMounted(() => {
  if (auth.loggedIn.value && !auth.loading.value) {
    router.push('/auth/validasi_login')
  }
  document.documentElement.classList.toggle('dark', layoutStore.theme === 'dark')
})
</script>

<style scoped>
@keyframes float {
  0% { transform: translate(0, 0); }
  50% { transform: translate(10px, -10px); }
  100% { transform: translate(0, 0); }
}

.animate-float {
  animation: float 8s ease-in-out infinite;
}

@keyframes float-reverse {
  0% { transform: translate(0, 0); }
  50% { transform: translate(-10px, 10px); }
  100% { transform: translate(0, 0); }
}

.animate-float-reverse {
  animation: float-reverse 10s ease-in-out infinite;
}

@keyframes float-subtle {
  0% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0); }
}

.animate-float-subtle {
  animation: float-subtle 3s ease-in-out infinite;
}

/* Pulse animation */
@keyframes pulse-slow {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.6; }
}

.animate-pulse-slow {
  animation: pulse-slow 6s ease-in-out infinite;
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

/* Bounce animation for button */
@keyframes bounceIn {
  0% { opacity: 0; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { transform: scale(1); }
}

.animate-bounce-in {
  animation: bounceIn 0.7s ease-out;
}

/* Ensure no scroll and fit viewport */
html, body {
  overflow: hidden;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .md\:flex-row {
    flex-direction: column;
  }
  
  .md\:w-1\/2 {
    width: 100%;
  }
}

/* Smooth transitions for dark mode */
.dark {
  transition: all 0.5s ease;
}
</style>