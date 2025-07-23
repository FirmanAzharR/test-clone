<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center text-center"
  >
    <div class="absolute inset-0 bg-black opacity-40"></div>
    
    <ClientOnly
      class="absolute flex items-center justify-center"
    >
      <Vue3Lottie :animationLink="`/animation/loading.json`" :height="200" />
    </ClientOnly>
  </div>
</template>