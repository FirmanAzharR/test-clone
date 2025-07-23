<template>
  <div class="relative w-full">
    <!-- Gradient background with enhanced animation -->
    <div class="relative py-24 overflow-hidden transition-all duration-500 md:py-32 bg-gradient-to-r from-blue-600 to-blue-500">
      <!-- Animated decorative background elements -->
      <div class="absolute inset-0 overflow-hidden">
        <!-- Gradient overlay -->
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.2),rgba(255,255,255,0))]"></div>
        
        <!-- Decorative grid pattern -->
        <div class="absolute inset-0 opacity-10">
          <svg class="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="batik-pattern" patternUnits="userSpaceOnUse" width="50" height="50" patternTransform="scale(0.5) rotate(0)">
              <path d="M10,10 Q15,5 20,10 T30,10 T40,10 T50,10" fill="none" stroke="currentColor" stroke-width="0.5" class="text-white" />
              <path d="M0,20 Q5,15 10,20 T20,20 T30,20 T40,20 T50,20" fill="none" stroke="currentColor" stroke-width="0.5" class="text-white" />
              <path d="M0,30 Q5,25 10,30 T20,30 T30,30 T40,30 T50,30" fill="none" stroke="currentColor" stroke-width="0.5" class="text-white" />
              <path d="M0,40 Q5,35 10,40 T20,40 T30,40 T40,40 T50,40" fill="none" stroke="currentColor" stroke-width="0.5" class="text-white" />
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#batik-pattern)" />
          </svg>
        </div>
        
        <!-- Decorative circles -->
        <div class="absolute w-64 h-64 rounded-full bg-blue-400/10 -top-32 -right-32 blur-3xl"></div>
        <div class="absolute w-64 h-64 rounded-full bg-blue-400/10 -bottom-32 -left-32 blur-3xl"></div>
      </div>

      <!-- Content with enhanced styling -->
      <div class="relative z-10 max-w-4xl px-6 mx-auto text-center">
        <!-- Badge -->
        <div class="inline-block px-3 py-1 mb-6 text-sm font-medium text-blue-600 rounded-full bg-white/20 backdrop-blur-sm">
          Kominfo DIY
        </div>
        
        <!-- Heading with animation -->
        <h2 class="mb-4 text-3xl font-bold tracking-tight text-white md:text-5xl heading-animation">
          Layanan Digital Terpadu
        </h2>
        
        <!-- Divider with animation -->
        <div class="flex items-center justify-center mt-4 mb-6 divider-animation">
          <div class="w-12 h-1 rounded-full bg-white/30"></div>
          <div class="w-2 h-2 mx-2 bg-white rounded-full"></div>
          <div class="w-12 h-1 rounded-full bg-white/30"></div>
        </div>
        
        <!-- Description with animation -->
        <p class="max-w-2xl mx-auto mb-8 text-lg md:text-xl text-blue-50 description-animation">
          Solusi digital terintegrasi untuk memenuhi kebutuhan layanan publik yang modern, 
          efisien, dan terpercaya
        </p>
        
        <!-- CTA Buttons with animation -->
        <div class="flex flex-col items-center justify-center gap-4 mt-8 sm:flex-row buttons-animation">
          <UButton
            color="white"
            size="lg"
            class="px-6 font-medium transition-all duration-300 hover:scale-105"
          >
            Jelajahi Layanan
          </UButton>
          <UButton
            color="white"
            variant="ghost"
            size="lg"
            class="px-6 font-medium transition-all duration-300 hover:scale-105"
            trailing-icon="i-heroicons-arrow-right"
          >
            Pelajari Lebih Lanjut
          </UButton>
        </div>
      </div>

      <!-- Enhanced scroll indicator -->
      <div class="absolute left-0 right-0 flex justify-center bottom-6">
        <div 
          class="flex flex-col items-center text-white transition-all duration-500 cursor-pointer hover:scale-110"
          :class="scrolled ? 'opacity-0' : 'opacity-100'"
          @click="scrollToContent"
        >
          <p class="mb-2 text-sm font-medium">Lihat Kategori</p>
          <div class="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm">
            <UIcon name="i-heroicons-chevron-down" class="w-5 h-5 animate-bounce" />
          </div>
        </div>
      </div>

      <!-- Enhanced floating particles -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <!-- Small particles -->
        <div 
          v-for="i in 15" 
          :key="`small-${i}`"
          class="absolute rounded-full bg-white/30 blur-sm"
          :style="{
            width: `${Math.random() * 6 + 3}px`,
            height: `${Math.random() * 6 + 3}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `floatSmall ${Math.random() * 10 + 15}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`
          }"
        />
        
        <!-- Medium particles -->
        <div 
          v-for="i in 10" 
          :key="`medium-${i}`"
          class="absolute rounded-full bg-white/20 blur-sm"
          :style="{
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `floatMedium ${Math.random() * 15 + 20}s linear infinite`,
            animationDelay: `${Math.random() * 7}s`
          }"
        />
        
        <!-- Large glowing orbs -->
        <div 
          v-for="i in 5" 
          :key="`large-${i}`"
          class="absolute rounded-full bg-white/10 blur-lg"
          :style="{
            width: `${Math.random() * 50 + 30}px`,
            height: `${Math.random() * 50 + 30}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `floatLarge ${Math.random() * 20 + 30}s linear infinite`,
            animationDelay: `${Math.random() * 10}s`
          }"
        />
      </div>
      
      <!-- Wave separator -->
      <div class="absolute bottom-0 left-0 right-0 border-none">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" class="w-full h-auto fill-slate-50 dark:fill-slate-900">
          <path d="M0,96L48,85.3C96,75,192,53,288,53.3C384,53,480,75,576,80C672,85,768,75,864,64C960,53,1056,43,1152,48C1248,53,1344,75,1392,85.3L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const scrolled = ref(false);

const handleScroll = () => {
  scrolled.value = window.scrollY > 50;
};

const scrollToContent = () => {
  const contentSection = document.querySelector('#content-section') || document.querySelector('section');
  if (contentSection) {
    contentSection.scrollIntoView({ behavior: 'smooth' });
  } else {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  
  // Add animation classes after mount for entrance animations
  setTimeout(() => {
    document.querySelector('.heading-animation')?.classList.add('animate-in');
    
    setTimeout(() => {
      document.querySelector('.divider-animation')?.classList.add('animate-in');
      
      setTimeout(() => {
        document.querySelector('.description-animation')?.classList.add('animate-in');
        
        setTimeout(() => {
          document.querySelector('.buttons-animation')?.classList.add('animate-in');
        }, 200);
      }, 200);
    }, 200);
  }, 100);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* Particle animations */
@keyframes floatSmall {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) translateX(30px);
    opacity: 0;
  }
}

@keyframes floatMedium {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  90% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-150px) translateX(-40px);
    opacity: 0;
  }
}

@keyframes floatLarge {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  20% {
    opacity: 0.5;
  }
  80% {
    opacity: 0.5;
  }
  100% {
    transform: translateY(-100px) translateX(50px);
    opacity: 0;
  }
}

/* Content animations */
.heading-animation,
.divider-animation,
.description-animation,
.buttons-animation {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.heading-animation.animate-in,
.divider-animation.animate-in,
.description-animation.animate-in,
.buttons-animation.animate-in {
  opacity: 1;
  transform: translateY(0);
}

/* Button hover effects */
.hover\:scale-105:hover {
  transform: scale(1.05);
}
</style>