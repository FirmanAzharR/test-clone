<template>
  <div :class="[
    'flex flex-col items-center justify-center min-h-screen px-4 py-12 transition-colors duration-300',
    isDark 
      ? 'bg-gradient-to-t from-slate-900 to-slate-800' 
      : 'bg-gradient-to-b from-white to-blue-50'
  ]">
    <!-- Background decorative elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div :class="[
        'absolute w-64 h-64 rounded-full -top-32 -right-32 blur-3xl animate-pulse-slow',
        isDark ? 'bg-blue-500/15' : 'bg-blue-500/10'
      ]"></div>
      <div :class="[
        'absolute w-64 h-64 rounded-full -bottom-32 -left-32 blur-3xl animate-pulse-slow',
        isDark ? 'bg-blue-500/15' : 'bg-blue-500/10'
      ]"></div>
      <div :class="[
        'absolute w-32 h-32 rounded-full top-1/4 left-1/4 blur-2xl animate-float',
        isDark ? 'bg-purple-500/20' : 'bg-purple-300/20'
      ]"></div>
    </div>

    <div class="container relative z-10 max-w-4xl mx-auto">
      <div class="flex flex-col items-center text-center">
        <div class="w-full max-w-md mb-6">
          <client-only>
            <Vue3Lottie :animationLink="`/animation/404.json`" :height="200" />
          </client-only>
        </div>

        <h2 :class="[
          'mb-4 text-2xl font-bold md:text-3xl',
          isDark ? 'text-white' : 'text-slate-800'
        ]">
        Page Not Found
        </h2>
        <p :class="[
          'max-w-md mb-8',
          isDark ? 'text-slate-300' : 'text-slate-600'
        ]">
          Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
        </p>
        
        <!-- Action buttons with enhanced styling -->
        <div class="flex flex-col gap-4 sm:flex-row">
          <UButton
            block
            size="lg"
            :color="isDark ? 'white' : 'blue'"
            variant="solid"
            to="/"
            class="relative overflow-hidden transition-all duration-300 transform rounded-full group hover:scale-105 hover:shadow-lg"
          >
            <div :class="[
              'absolute inset-0 w-full h-full transition-all duration-500 bg-gradient-to-r',
              isDark 
                ? 'from-blue-700 to-blue-600 group-hover:from-blue-600 group-hover:to-blue-500' 
                : 'from-blue-600 to-blue-500 group-hover:from-blue-500 group-hover:to-blue-600'
            ]"></div>
            <span class="relative flex items-center justify-center gap-2">
              <UIcon name="ci:house-01" class="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" :class="[
              isDark 
                ? 'text-slate-900' 
                : 'text-white'
            ]"/>
              <span :class="[
              isDark 
                ? 'text-slate-900' 
                : 'text-white'
            ]">Kembali ke Beranda</span>
            </span>
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { useLayout } from '~/store/layouts/layouts';
const layoutStore = useLayout();

const isDark = computed(() => {
  return layoutStore.theme === 'dark';
});

</script>
