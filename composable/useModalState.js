import { ref, computed, readonly } from 'vue'

// Global state untuk mengelola modal
const cookieModalVisible = ref(false)
const cookieModalAccepted = ref(false)
const cookieModalDeclined = ref(false)

export const useModalState = () => {
  // Cookie modal dapat ditampilkan
  const canShowCookieModal = computed(() => !cookieModalAccepted.value)
  
  // Widget modal dapat ditampilkan selama cookie modal tidak sedang tampil
  const canShowWidgetModal = computed(() => !cookieModalVisible.value)

  const showCookieModal = () => {
    cookieModalVisible.value = true
  }

  const hideCookieModal = () => {
    cookieModalVisible.value = false
  }

  const acceptCookieModal = () => {
    cookieModalAccepted.value = true
    // hideCookieModal() akan dipanggil terpisah
  }

  const declineCookieModal = () => {
    cookieModalDeclined.value = true
    // hideCookieModal() akan dipanggil terpisah
  }

  const resetCookieState = () => {
    cookieModalAccepted.value = false
    cookieModalDeclined.value = false
    cookieModalVisible.value = false
  }

  // Reset state saat page di-refresh atau navigate ulang
  const resetForNewVisit = () => {
    cookieModalDeclined.value = false
    cookieModalVisible.value = false
    // Jangan reset cookieModalAccepted karena itu permanent choice
  }

  return {
    // State
    cookieModalVisible: readonly(cookieModalVisible),
    cookieModalAccepted: readonly(cookieModalAccepted),
    cookieModalDeclined: readonly(cookieModalDeclined),
    
    // Computed
    canShowCookieModal,
    canShowWidgetModal,
    
    // Actions
    showCookieModal,
    hideCookieModal,
    acceptCookieModal,
    declineCookieModal,
    resetCookieState,
    resetForNewVisit
  }
}
