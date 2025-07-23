<template>
  <transition name="fade">
    <UButton icon="material-symbols:keyboard-arrow-up-rounded" size="xl" color="blue" variant="solid" 
      class="rounded-full scroll-to-top" @click="scrollToTop" aria-label="Scroll to top" v-show="showButton" />
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const showButton = ref(false);
const scrollThreshold = 300;

const checkScroll = () => {
  showButton.value = window.scrollY > scrollThreshold;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // Smooth scrolling animation
  });
};

onMounted(() => {
  window.addEventListener('scroll', checkScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll);
});
</script>

<style scoped>
.scroll-to-top {
  position: fixed;
  bottom: 90px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #1e40af;
  /* Blue-800 */
  color: white;
  border: none;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
  transition: transform 0.3s, background-color 0.3s;
}

.scroll-to-top:hover {
  background-color: #1e3a8a;
  /* Blue-900 */
  transform: translateY(-3px);
}

.scroll-to-top:active {
  transform: translateY(0);
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 640px) {
  .scroll-to-top {
    width: 40px;
    height: 40px;
    bottom: 20px;
    right: 20px;
  }
}
</style>