<template>
  <div class="flex items-center justify-center min-h-screen transition-colors duration-500 bg-gradient-to-br from-blue-100 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
    <div class="w-full max-w-md p-8 text-center bg-white shadow-2xl dark:bg-gray-800 rounded-3xl">
      <!-- Logo -->
      <div class="mb-6">
        <div class="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-blue-700">
          <UIcon name="i-heroicons-shield-check-20-solid" class="w-10 h-10 text-white" />
        </div>
      </div>

      <!-- Title -->
      <h2 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
        Verifikasi Kode
      </h2>
      
      <!-- Description -->
      <p class="mb-6 text-gray-600 dark:text-gray-300">
        Masukkan kode verifikasi yang telah dikirimkan
      </p>

      <!-- Form -->
      <form @submit.prevent="submitOtp" class="space-y-6">
        <div>
          <UFormGroup 
            label="Kode" 
            required
            :error="otpError"
          >
            <UInput
              v-model="otpCode"
              type="text"
              placeholder="Masukkan kode"
              size="lg"
              :maxlength="9"
              :disabled="isSubmitting"
              class="text-center text-lg tracking-widest"
              @input="handleOtpInput"
            />
          </UFormGroup>
        </div>

        <UButton
          type="submit"
          block
          size="lg"
          :loading="isSubmitting"
          :disabled="!otpCode || otpCode.length < 6"
          class="font-medium"
        >
          <template v-if="!isSubmitting">
            Verifikasi Kode
          </template>
          <template v-else>
            Memverifikasi...
          </template>
        </UButton>

        <!-- Resend OTP Button - REMOVED -->
        <!-- Timer and resend functionality removed as requested -->
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthToken } from '~/composable/useAuthToken'

// Security: Handle page leave without completing OTP
const router = useRouter()
const toast = useToast()
const config = useRuntimeConfig()

// Use onBeforeRouteLeave to detect when user tries to leave OTP page
onBeforeRouteLeave((to, from) => {
  // Check if user is trying to leave OTP page without completing it
  const hasCompletedOTP = localStorage.getItem('TokenInAuth') && localStorage.getItem('userId')
  
  // If user hasn't completed OTP and is trying to go to dashboard or other protected pages
  const protectedPaths = ['/dashboard']
  const isGoingToProtected = protectedPaths.some(path => to.path.startsWith(path))
  
  if (!hasCompletedOTP && isGoingToProtected) {
    console.log('🚨 Security: User trying to bypass OTP, clearing tokens')
    
    // Clear all authentication tokens for security
    if (process.client) {
      localStorage.removeItem('auth._token.keycloak')
      localStorage.removeItem('auth._token_expiration.keycloak')
      localStorage.removeItem('TokenInAuth')
      localStorage.removeItem('userId')
      localStorage.removeItem('userRole')
      localStorage.removeItem('userEmail')
      
      // Show security warning
      toast.add({
        title: 'Akses Ditolak',
        description: 'Harap selesaikan verifikasi OTP terlebih dahulu',
        color: 'red'
      })
    }
    
    // Prevent navigation and redirect to login
    router.push('/login')
    return false
  }
  
  // Allow navigation for other cases
  return true
})

// Simple JWT decode function for browser
function simpleJwtDecode(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error decoding JWT:', error)
    return null
  }
}

definePageMeta({
  middleware: ['keycloak-required'],
  layout: false
})

// Reactive state
const otpCode = ref('')
const isSubmitting = ref(false)
const otpError = ref('')
const userEmail = ref('')
// Removed resendCooldown and resendTimer as requested

// Check if user is authenticated
onMounted(async () => {
  if (process.client) {
    // Add security event listener for page unload (refresh/close)
    const handleBeforeUnload = (event) => {
      const hasCompletedOTP = localStorage.getItem('TokenInAuth') && localStorage.getItem('userId')
      
      if (!hasCompletedOTP) {
        // Clear tokens if user tries to close/refresh without completing OTP
        console.log('🚨 Security: Page unload without OTP completion, clearing tokens')
        localStorage.removeItem('auth._token.keycloak')
        localStorage.removeItem('auth._token_expiration.keycloak')
        localStorage.removeItem('TokenInAuth')
        localStorage.removeItem('userId')
        localStorage.removeItem('userRole')
        localStorage.removeItem('userEmail')
      }
    }
    
    // Add event listener
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    // Cleanup function to remove event listener
    onUnmounted(() => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    })
    
    // Check Keycloak authentication using correct localStorage key
    const keycloakToken = localStorage.getItem("auth._token.keycloak")
    
    if (!keycloakToken || keycloakToken.trim() === "") {
      await router.push('/login')
      return
    }

    // Check if token is expired
    const tokenExpiry = parseInt(localStorage.getItem('auth._token_expiration.keycloak') || '0')
    if (tokenExpiry <= Date.now()) {
      await router.push('/login')
      return
    }

    // Get user email from keycloak token (decode it)
    try {
      const cleanToken = keycloakToken.replace('Bearer ', '')
      const decodedToken = simpleJwtDecode(cleanToken)
      if (decodedToken && decodedToken.email) {
        userEmail.value = decodedToken.email
      } else {
        console.error('No email found in token')
        await router.push('/login')
        return
      }
    } catch (error) {
      console.error('Error decoding token:', error)
      await router.push('/login')
      return
    }
  }
  
  // No longer start resend cooldown - timer functionality removed
})

// Removed onUnmounted since no timer to cleanup

// Handle OTP input formatting
const handleOtpInput = () => {
  // Remove any non-numeric characters and limit length
  otpCode.value = otpCode.value.replace(/\D/g, '').slice(0, 9)
  
  // Clear error when user starts typing
  if (otpError.value) {
    otpError.value = ''
  }
}

// Submit OTP for verification
const { token, fetchToken } = useAuthToken();
const submitOtp = async () => {
  if (!otpCode.value || otpCode.value.length < 6) {
    otpError.value = 'Kode OTP harus minimal 6 digit'
    return
  }

  isSubmitting.value = true
  otpError.value = ''

  const apiBaseUrl = config.public.apiBaseUrl;
  try {
    // Pastikan token tersedia sebelum API call
    if (!token.value) {
      await fetchToken()
    }

    // Call API to verify OTP
    const response = await $fetch(`${apiBaseUrl}/api/user/getusers-new/${userEmail.value}/${otpCode.value}`, {
      method: 'GET',
      headers: {
        Authorization: token.value,
      }
    })

    const { token: tokenResult, id, role } = response.data
    const message = response.message

    // Decode token and store authentication data
    const decodedToken = simpleJwtDecode(tokenResult)
    
    if (process.client) {
      localStorage.setItem("TokenInAuth", `Bearer ${tokenResult}`)
      localStorage.setItem("userId", id)
      if (decodedToken && decodedToken.app_id) {
        localStorage.setItem("appId", decodedToken.app_id)
      }
    }

    // Show success message
    toast.add({
      title: 'Verifikasi Berhasil',
      description: message || 'Kode berhasil diverifikasi',
      color: 'green'
    })

    // Redirect to dashboard after short delay (simplified flow)
    setTimeout(() => {
      router.push('/dashboard')
    }, 1500)

  } catch (error) {
    console.error('OTP verification error:', error)
    
    // Simple error message without exposing API response
    let errorMessage = 'Kode tidak valid atau sudah kedaluwarsa'
    
    // Don't expose detailed API error messages to user
    // Keep it simple and user-friendly
    
    otpError.value = errorMessage
    toast.add({
      title: 'Verifikasi Gagal',
      description: errorMessage,
      color: 'red'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Additional custom styles if needed */
.tracking-widest {
  letter-spacing: 0.25em;
}

/* Animation for smooth transitions */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
</style>
