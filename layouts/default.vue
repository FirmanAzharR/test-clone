<template>
  <div class="font-poppins">
    <KeepAlive>
      <Header />
    </KeepAlive>
    <NuxtPage />
    <KeepAlive>
      <Footer />
    </KeepAlive>
    <KeepAlive>
      <Runningtext />
    </KeepAlive>
    <ScrolltoTop />
  </div>
</template>

<script setup>
import Header from '@/components/general/header/index.vue';
import Footer from '@/components/general/footer/index.vue';
import Runningtext from '~/components/opd/beranda/RunningText.vue';
import ScrolltoTop from '~/components/opd/beranda/ScrolltoTop.vue';
</script>

<style scoped>
@import '@/css/font.css';

.font-poppins {
  font-family: 'Poppins', sans-serif;
}
</style>