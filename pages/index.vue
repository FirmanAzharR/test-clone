<template>
  <div>
    <Carousel />
    <!-- <Pelayanan /> -->
    <About />
    <Berita />
    <Foto />
    <Video />
    <!-- <Cookie />
    <ScrolltoTop/>
    <Widget/> -->
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import Carousel from '@/components/opd/beranda/Carousel.vue';
import About from '@/components/opd/beranda/About.vue';
// import Pelayanan from '@/components/opd/beranda/Pelayanan.vue';
import Berita from '@/components/opd/beranda/Berita.vue';
import Foto from '@/components/opd/beranda/Foto.vue';
import Video from '@/components/opd/beranda/Video.vue';
import Cookie from '@/components/opd/beranda/ModalCookie.vue';
import ScrolltoTop from '@/components/opd/beranda/ScrolltoTop.vue'
import Widget from '@/components/opd/beranda/Widget.vue'
import { useAuthKeycloakStore } from '~/store/auth/auth'
import { useTokenManager } from '~/composable/useTokenManager'

const authStore = useAuthKeycloakStore()
const { onTokenChange } = useTokenManager()

let tokenChangeUnsubscribe = null

onMounted(() => {
  // Delay to ensure auth store is fully initialized
  setTimeout(() => {
    
    // Ensure token refresh is running if user is authenticated
    if (authStore.isAuthenticated && !authStore.loading && !authStore.refreshInterval) {
      console.log('Home page - setting up token refresh')
      authStore.setupTokenRefresh()
    }
  }, 1000) // 1 second delay
  
  // Listen for token changes globally to maintain reactivity
  tokenChangeUnsubscribe = onTokenChange((detail) => {
    
    // If Keycloak tokens are updated, ensure page state is maintained
    if (detail.tokenType.includes('keycloak') && authStore.isAuthenticated) {
      // Page will automatically react to token changes through reactive stores
      // console.log('Home page: Maintaining authentication state after token refresh')
    }
  })
})

onUnmounted(() => {
  if (tokenChangeUnsubscribe) {
    tokenChangeUnsubscribe()
  }
})
</script>
