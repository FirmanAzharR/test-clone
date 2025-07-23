<template>
  <div class="min-h-screen transition-colors duration-500 bg-gray-50 rounded-xl content-wrapper dark:bg-gray-900">
    <div class="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <!-- Welcome Header -->
      <div class="mb-12 text-center">
        <h1 class="text-4xl font-extrabold text-gray-900 capitalize dark:text-white animate-fade-in">
          Selamat Datang, {{ userName || loginStore.getUsersData?.role || 'Pengguna' }}!
        </h1>
        <p class="mt-4 text-lg text-gray-600 dark:text-gray-300 animate-fade-in-delay">
          Jelajahi dashboard Aptika untuk mengelola konten, analisis data, dan akses berbagai fitur.
        </p>
      </div>

      <!-- Error Alert -->
      <div v-if="error" class="mb-6">
        <UAlert
          :title="'Error loading analytics data'"
          color="red"
          variant="soft"
          icon="i-heroicons-exclamation-triangle"
        >
          {{ error }}
          <template #footer>
            <UButton color="red" variant="ghost" label="Retry" @click="fetchAnalyticsData" />
          </template>
        </UAlert>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <!-- Feature Card: Dashboard -->
        <div class="p-6 transition-all duration-300 bg-white shadow-lg dark:bg-gray-800 rounded-2xl hover:scale-105 hover:shadow-xl hover:bg-blue-50 dark:hover:bg-gray-700 animate-slide-in">
          <UIcon name="mdi:view-dashboard" class="w-10 h-10 mb-4 text-blue-500" />
          <h3 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Dashboard
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Akses ringkasan aktivitas, artikel, dan analitik secara cepat.
          </p>
          <UButton
            to="/dashboard"
            color="blue"
            variant="link"
            class="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
          >
            Buka Dashboard
          </UButton>
        </div>

        <!-- Feature Card: Konten -->
        <div class="p-6 transition-all duration-300 bg-white shadow-lg dark:bg-gray-800 rounded-2xl hover:scale-105 hover:shadow-xl hover:bg-blue-50 dark:hover:bg-gray-700 animate-slide-in">
          <UIcon name="mdi:file-document" class="w-10 h-10 mb-4 text-blue-500" />
          <h3 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Konten
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Buat, edit, dan kelola konten digital dengan antarmuka intuitif.
          </p>
          <UButton
            to="/dashboard/konten"
            color="blue"
            variant="link"
            class="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
          >
            Kelola Konten
          </UButton>
        </div>

        <!-- Feature Card: Media -->
        <div class="p-6 transition-all duration-300 bg-white shadow-lg dark:bg-gray-800 rounded-2xl hover:scale-105 hover:shadow-xl hover:bg-blue-50 dark:hover:bg-gray-700 animate-slide-in">
          <UIcon name="mdi:folder-multiple" class="w-10 h-10 mb-4 text-blue-500" />
          <h3 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Media
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Atur galeri, video, dan slider untuk konten visual Anda.
          </p>
          <UButton
            to="/dashboard/media/galeri"
            color="blue"
            variant="link"
            class="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
          >
            Kelola Media
          </UButton>
        </div>

        <!-- Feature Card: Layanan -->
        <div class="p-6 transition-all duration-300 bg-white shadow-lg dark:bg-gray-800 rounded-2xl hover:scale-105 hover:shadow-xl hover:bg-blue-50 dark:hover:bg-gray-700 animate-slide-in">
          <UIcon name="mdi:handshake" class="w-10 h-10 mb-4 text-blue-500" />
          <h3 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Layanan
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Kelola layanan yang disediakan untuk masyarakat.
          </p>
          <UButton
            to="/dashboard/layanan"
            color="blue"
            variant="link"
            class="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
          >
            Kelola Layanan
          </UButton>
        </div>

        <!-- Feature Card: Page -->
        <div class="p-6 transition-all duration-300 bg-white shadow-lg dark:bg-gray-800 rounded-2xl hover:scale-105 hover:shadow-xl hover:bg-blue-50 dark:hover:bg-gray-700 animate-slide-in">
          <UIcon name="mdi:file" class="w-10 h-10 mb-4 text-blue-500" />
          <h3 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Page
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Buat dan kelola halaman statis untuk website.
          </p>
          <UButton
            to="/dashboard/page"
            color="blue"
            variant="link"
            class="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
          >
            Kelola Page
          </UButton>
        </div>

        <!-- Feature Card: Agenda (Admin/Superadmin Only) -->
        <div v-if="!isKontributor" class="p-6 transition-all duration-300 bg-white shadow-lg dark:bg-gray-800 rounded-2xl hover:scale-105 hover:shadow-xl hover:bg-blue-50 dark:hover:bg-gray-700 animate-slide-in">
          <UIcon name="mdi:calendar" class="w-10 h-10 mb-4 text-blue-500" />
          <h3 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Agenda
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Kelola jadwal acara dan kegiatan penting dengan mudah.
          </p>
          <UButton
            to="/dashboard/agenda"
            color="blue"
            variant="link"
            class="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
          >
            Lihat Agenda
          </UButton>
        </div>

        <!-- Feature Card: Profil (Admin/Superadmin Only) -->
        <div v-if="!isKontributor" class="p-6 transition-all duration-300 bg-white shadow-lg dark:bg-gray-800 rounded-2xl hover:scale-105 hover:shadow-xl hover:bg-blue-50 dark:hover:bg-gray-700 animate-slide-in">
          <UIcon name="mdi:account" class="w-10 h-10 mb-4 text-blue-500" />
          <h3 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Profil
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Perbarui informasi profil dan preferensi akun Anda.
          </p>
          <UButton
            to="/dashboard/profil"
            color="blue"
            variant="link"
            class="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
          >
            Atur Profil
          </UButton>
        </div>

        <!-- Feature Card: Permohonan (Admin/Superadmin Only) -->
        <div v-if="!isKontributor" class="p-6 transition-all duration-300 bg-white shadow-lg dark:bg-gray-800 rounded-2xl hover:scale-105 hover:shadow-xl hover:bg-blue-50 dark:hover:bg-gray-700 animate-slide-in">
          <UIcon name="mdi:clipboard-text" class="w-10 h-10 mb-4 text-blue-500" />
          <h3 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Permohonan
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Kelola permohonan layanan atau informasi dari pengguna.
          </p>
          <UButton
            to="/dashboard/permohonan"
            color="blue"
            variant="link"
            class="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
          >
            Kelola Permohonan
          </UButton>
        </div>

        <!-- Feature Card: Survey Masyarakat (Admin/Superadmin Only) -->
        <div v-if="!isKontributor" class="p-6 transition-all duration-300 bg-white shadow-lg dark:bg-gray-800 rounded-2xl hover:scale-105 hover:shadow-xl hover:bg-blue-50 dark:hover:bg-gray-700 animate-slide-in">
          <UIcon name="material-symbols:assignment" class="w-10 h-10 mb-4 text-blue-500" />
          <h3 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Survey Masyarakat
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Buat dan analisis hasil survey untuk masukan masyarakat.
          </p>
          <UButton
            to="/dashboard/survey-masyarakat/soal"
            color="blue"
            variant="link"
            class="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
          >
            Lihat Survey
          </UButton>
        </div>

        <!-- Feature Card: User (Superadmin Only) -->
        <div v-if="isSuperadmin" class="p-6 transition-all duration-300 bg-white shadow-lg dark:bg-gray-800 rounded-2xl hover:scale-105 hover:shadow-xl hover:bg-blue-50 dark:hover:bg-gray-700 animate-slide-in">
          <UIcon name="material-symbols:account-box" class="w-10 h-10 mb-4 text-blue-500" />
          <h3 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            User
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Kelola akun pengguna dan hak akses di platform.
          </p>
          <UButton
            to="/dashboard/user"
            color="blue"
            variant="link"
            class="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
          >
            Kelola Pengguna
          </UButton>
        </div>

        <!-- Feature Card: Manajemen Role (Superadmin Only) -->
        <div v-if="isSuperadmin" class="p-6 transition-all duration-300 bg-white shadow-lg dark:bg-gray-800 rounded-2xl hover:scale-105 hover:shadow-xl hover:bg-blue-50 dark:hover:bg-gray-700 animate-slide-in">
          <UIcon name="material-symbols:assignment" class="w-10 h-10 mb-4 text-blue-500" />
          <h3 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Manajemen Role
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Atur peran, aplikasi, dan token untuk keamanan sistem.
          </p>
          <UButton
            to="/dashboard/manajemen-role/role"
            color="blue"
            variant="link"
            class="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
          >
            Atur Role
          </UButton>
        </div>
      </div>

      <!-- Quick Stats Section -->
      <div class="p-8 mt-12 text-white shadow-lg bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-900 dark:to-blue-950 rounded-2xl dark:shadow-gray-900/50 animate-fade-in-up">
        <h2 class="mb-4 text-2xl font-bold">Ringkasan Aktivitas</h2>
        <div v-if="loadingAnalytics" class="flex items-center justify-center h-24">
          <div class="w-8 h-8 border-4 border-blue-500 rounded-full dark:border-gray-400 border-t-blue-300 dark:border-t-gray-200 animate-spin"></div>
        </div>
        <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div class="text-center">
            <p class="text-3xl font-semibold">{{ stats.visitors.toLocaleString() }}</p>
            <p class="text-sm opacity-90 dark:text-gray-300">Total Pengunjung</p>
          </div>
          <div class="text-center">
            <p class="text-3xl font-semibold">{{ stats.pageviews.toLocaleString() }}</p>
            <p class="text-sm opacity-90 dark:text-gray-300">Total Halaman Dilihat</p>
          </div>
          <div class="text-center">
            <p class="text-3xl font-semibold">{{ formatTime(stats.avgSessionDuration) }}</p>
            <p class="text-sm opacity-90 dark:text-gray-300">Rata-rata Durasi Sesi</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useLoginStore } from '~/store/auth/login'
import { useGlobalTokenRefresh } from '~/composable/useGlobalTokenRefresh'
import axios from 'axios'

const loginStore = useLoginStore()
const config = useRuntimeConfig()
const { lastTokenRefresh } = useGlobalTokenRefresh()

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'otp-protection']
})

// State for analytics
const loadingAnalytics = ref(true)
const error = ref(null)
const token = ref(null)
const propertyId = ref(null)
const totalStats = ref({
  visitors: 0,
  pageviews: 0,
  avgSessionDuration: 120 // Default 2 minutes
})

// Computed properties
const userName = computed(() => {
  return loginStore.user?.name || loginStore.user?.username || null
})

const isSuperadmin = computed(() => {
  return loginStore.getUsersData?.role?.toLowerCase() === 'superadmin'
})

const isKontributor = computed(() => {
  return loginStore.getUsersData?.role?.toLowerCase() === 'kontributor'
})

const stats = computed(() => ({
  visitors: totalStats.value.visitors,
  pageviews: totalStats.value.pageviews,
  avgSessionDuration: totalStats.value.avgSessionDuration
}))

// Format time helper
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}m ${remainingSeconds}s`
}

// Fetch analytics data
async function fetchAnalyticsData() {
  loadingAnalytics.value = true
  error.value = null

  try {
    // Fetch propertyId from server
    const propertyIdResponse = await fetch('/api/analytics/property-id')
    const propertyIdData = await propertyIdResponse.json()
    propertyId.value = propertyIdData.propertyId

    // Fetch token from server
    const tokenResponse = await fetch('/api/analytics/token')
    if (!tokenResponse.ok) {
      throw new Error(`Failed to fetch token: ${tokenResponse.statusText}`)
    }
    const tokenData = await tokenResponse.json()
    if (!tokenData.success || !tokenData.accessToken) {
      throw new Error('Invalid token response')
    }
    token.value = tokenData.accessToken

    // Fetch total analytics data
    const apiUrl = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId.value}:runReport`
    const payload = {
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'date' }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'activeUsers' },
        { name: 'averageSessionDuration' }
      ]
    }

    const response = await axios.post(apiUrl, payload, {
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      }
    })

    // Process response
    if (response.data.rows && response.data.rows.length > 0) {
      totalStats.value.visitors = response.data.rows.reduce((sum, row) => sum + Number(row.metricValues[1].value), 0)
      totalStats.value.pageviews = response.data.rows.reduce((sum, row) => sum + Number(row.metricValues[0].value), 0)
      totalStats.value.avgSessionDuration = response.data.rows.reduce((sum, row) => sum + Number(row.metricValues[2].value), 0) / response.data.rows.length
    }
  } catch (err) {
    error.value = `Failed to load analytics data: ${err.message}`
  } finally {
    loadingAnalytics.value = false
  }
}

// Handler for token refresh events
const handleTokenRefresh = () => {
  console.log('Dashboard detected token refresh, refreshing data...')
  loginStore.getUsers()
}

onMounted(async () => {
  await loginStore.getUsers()
  await fetchAnalyticsData()
  
  // Listen for token refresh events
  window.addEventListener('auth:token:refreshed', handleTokenRefresh)
})

onUnmounted(() => {
  // Clean up event listener
  window.removeEventListener('auth:token:refreshed', handleTokenRefresh)
})
</script>

<style scoped>
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

/* Slide animations for cards */
@keyframes slideIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-slide-in {
  animation: slideIn 0.8s ease-out;
}

.animate-slide-in-delay {
  animation: slideIn 0.8s ease-out 0.4s both;
}

.animate-slide-in-delay-2 {
  animation: slideIn 0.8s ease-out 0.5s both;
}

/* Fade up for stats section */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out 0.6s both;
}

/* Smooth transitions for dark mode */
.dark {
  transition: all 0.5s ease;
}

/* Ensure content fits viewport */
.content-wrapper {
  overflow-x: hidden;
}
</style>