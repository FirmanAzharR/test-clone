<template>
  <section class="relative w-full overflow-hidden mt-24">
    <div class="absolute inset-0 z-0">
      <img
        :src="footerData?.logo || '/images/jogja.jpg'"
        alt="Background"
        class="object-cover w-full h-full"
      />

      <div
        class="absolute inset-0"
        :class="[
          isDark
            ? 'bg-gradient-to-b from-green-900/60 to-green-800'
            : 'bg-gradient-to-b from-blue-600/50 to-blue-900/70',
        ]"
      ></div>

      <div class="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 0 10 L 40 10 M 10 0 L 10 40"
                fill="none"
                stroke="currentColor"
                stroke-width="0.5"
                class="text-white"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    </div>

    <div class="absolute inset-0 overflow-hidden pointer-events-none z-1">
      <div
        class="absolute w-[800px] h-[800px] rounded-full -top-[400px] -right-[400px] blur-3xl"
        :class="isDark ? 'bg-blue-500/10' : 'bg-blue-300/20'"
      ></div>
      <div
        class="absolute w-[600px] h-[600px] rounded-full -bottom-[300px] -left-[300px] blur-3xl"
        :class="isDark ? 'bg-blue-500/10' : 'bg-blue-300/20'"
      ></div>

      <div
        v-for="i in 12"
        :key="`particle-${i}`"
        class="absolute rounded-full blur-sm"
        :class="isDark ? 'bg-blue-400/30' : 'bg-white/40'"
        :style="{
          width: `${Math.random() * 6 + 3}px`,
          height: `${Math.random() * 6 + 3}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `floatParticle ${
            Math.random() * 10 + 15
          }s linear infinite`,
          animationDelay: `${Math.random() * 5}s`,
        }"
      />
    </div>

    <div class="container relative z-10 px-4 py-16 mx-auto max-w-7xl">
      <!-- Section header with modern design -->
      <div class="mb-8 text-center"></div>

      <!-- Enhanced carousel container -->
      <div
        class="relative max-w-5xl mx-auto overflow-hidden carousel-container"
      >
        <!-- Shimmer loading state -->
        <div v-if="isLoading" class="w-full">
          <div
            class="relative flex flex-col overflow-hidden border shadow-xl backdrop-blur-md rounded-2xl md:flex-row"
            :class="[
              isDark
                ? 'bg-slate-800/30 border-slate-700/30'
                : 'bg-white/20 border-white/30',
            ]"
          >
            <div class="relative w-full md:w-1/2">
              <Vue3LoadingShimmer
                class="w-full h-64 md:h-96 rounded-tl-2xl rounded-tr-2xl md:rounded-tr-none md:rounded-bl-2xl"
              />
            </div>
            <div
              class="relative flex flex-col justify-center w-full p-6 space-y-4 md:p-8 md:w-1/2"
            >
              <Vue3LoadingShimmer class="w-3/4 h-8 mb-4 rounded-lg" />
              <Vue3LoadingShimmer class="w-16 h-1 mb-4 rounded-lg" />
              <Vue3LoadingShimmer class="w-full h-4 mb-2 rounded-lg" />
              <Vue3LoadingShimmer class="w-full h-4 mb-2 rounded-lg" />
              <Vue3LoadingShimmer class="w-3/4 h-4 mb-4 rounded-lg" />
              <Vue3LoadingShimmer class="w-32 h-10 mt-2 rounded-lg" />
            </div>
          </div>

          <!-- Shimmer indicators -->
          <div class="absolute left-0 right-0 flex justify-center bottom-6">
            <div
              class="flex items-center p-1.5 space-x-2 rounded-full backdrop-blur-sm"
              :class="isDark ? 'bg-blue-500/20' : 'bg-blue-600/40'"
            >
              <Vue3LoadingShimmer
                v-for="i in 4"
                :key="`indicator-${i}`"
                class="w-2 h-2 mx-1 rounded-full"
              />
            </div>
          </div>
        </div>

        <!-- Actual carousel content (only shown when not loading) -->
        <template v-else>
          <!-- Enhanced navigation buttons - adaptive for dark mode -->
          <button
            @click="prevSlide"
            class="absolute z-10 flex items-center justify-center w-12 h-12 text-white transition-all -translate-y-1/2 rounded-full backdrop-blur-md left-4 top-1/2"
            :class="[
              isDark
                ? 'bg-slate-700/40 hover:bg-blue-600/60'
                : 'bg-blue-500/40 hover:bg-blue-600/80',
            ]"
            aria-label="Previous slide"
          >
            <UIcon name="i-heroicons-chevron-left" class="w-6 h-6" />
          </button>

          <button
            @click="nextSlide"
            class="absolute z-10 flex items-center justify-center w-12 h-12 text-white transition-all -translate-y-1/2 rounded-full backdrop-blur-md right-4 top-1/2"
            :class="[
              isDark
                ? 'bg-slate-700/40 hover:bg-blue-600/60'
                : 'bg-blue-500/40 hover:bg-blue-600/80',
            ]"
            aria-label="Next slide"
          >
            <UIcon name="i-heroicons-chevron-right" class="w-6 h-6" />
          </button>
          <!-- Glass-effect slides - adaptive for dark mode -->
          <div
            ref="carouselTrack"
            class="flex"
            :class="{ 'transition-transform': !isJumping }"
            :style="{
              transform: `translateX(${-getTranslateValue()}%)`,
              transitionDuration: isJumping ? '0ms' : '700ms',
            }"
            @transitionend="handleTransitionEnd"
          >
            <!-- Clone of last slide -->
            <div
              v-if="getCloneSlides.last"
              :key="`clone-last`"
              class="relative flex-shrink-0 w-full p-4"
            >
              <div
                class="relative flex flex-col overflow-hidden border shadow-xl cursor-pointer backdrop-blur-md rounded-2xl md:flex-row"
                :class="[
                  isDark
                    ? 'bg-slate-800/30 border-slate-700/30'
                    : 'bg-white/20 border-white/30',
                ]"
              >
                <!-- Image side with enhanced styling -->
                <div class="relative w-full overflow-hidden md:w-1/2">
                  <img
                    :src="getCloneSlides.last.image"
                    :alt="getCloneSlides.last.title"
                    class="object-cover w-full h-64 transition-transform md:h-full hover:scale-105"
                  />
                  <div
                    class="absolute inset-0 opacity-60"
                    :class="[
                      isDark
                        ? 'bg-gradient-to-tr from-green-900/80 via-slate-800/60 to-transparent'
                        : 'bg-gradient-to-tr from-blue-700/70 via-blue-600/50 to-transparent',
                    ]"
                  ></div>
                  <div
                    class="absolute z-10 px-3 py-1 text-xs font-medium text-white rounded-full top-4 left-4 backdrop-blur-sm"
                    :class="[
                      isDark
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500'
                        : 'bg-gradient-to-r from-blue-500 to-blue-400',
                    ]"
                  >
                    {{ getCloneSlides.last.category || 'Featured' }}
                  </div>
                  <div
                    class="absolute z-10 flex items-center px-3 py-1 text-xs font-medium text-white rounded-full top-4 right-4 backdrop-blur-sm"
                    :class="isDark ? 'bg-slate-700/60' : 'bg-blue-600/60'"
                  >
                    <UIcon name="i-heroicons-calendar" class="w-3 h-3 mr-1" />
                    {{
                      formatDate(getCloneSlides.last.created_at || new Date())
                    }}
                  </div>
                </div>
                <div
                  class="relative flex flex-col justify-center w-full p-6 text-white md:p-8 md:w-1/2"
                >
                  <div class="space-y-4">
                    <h3 class="text-xl font-bold md:text-2xl">
                      {{ getCloneSlides.last.title }}
                    </h3>
                    <div
                      class="w-16 h-0.5"
                      :class="[
                        isDark
                          ? 'bg-gradient-to-r from-blue-400 to-blue-300'
                          : 'bg-gradient-to-r from-blue-300 to-white',
                      ]"
                    ></div>
                    <p
                      class="text-sm line-clamp-3"
                      :class="isDark ? 'text-slate-300' : 'text-blue-50'"
                    >
                      {{ getCloneSlides.last.description }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Original slides -->
            <div
              v-for="(item, index) in carouselStore.carouselData.data"
              :key="item.id || index"
              class="relative flex-shrink-0 w-full p-4 slide-animation"
              :style="{ '--slide-index': index }"
            >
              <div
                class="relative flex flex-col overflow-hidden border shadow-xl cursor-pointer backdrop-blur-md rounded-2xl md:flex-row"
                @click="gotoDetail(item.link)"
                :class="[
                  isDark
                    ? 'bg-slate-800/30 border-slate-700/30'
                    : 'bg-white/20 border-white/30',
                ]"
              >
                <!-- Image side with enhanced styling -->
                <div class="relative w-full overflow-hidden md:w-1/2">
                  <img
                    :src="item.image"
                    :alt="item.title"
                    class="object-cover w-full h-64 transition-transform duration-700 md:h-full hover:scale-105"
                  />

                  <!-- Enhanced overlay gradient - adaptive for dark mode -->
                  <div
                    class="absolute inset-0 opacity-60"
                    :class="[
                      isDark
                        ? 'bg-gradient-to-tr from-green-900/80 via-slate-800/60 to-transparent'
                        : 'bg-gradient-to-tr from-blue-700/70 via-blue-600/50 to-transparent',
                    ]"
                  ></div>

                  <!-- Enhanced category badge - adaptive for dark mode -->
                  <div
                    class="absolute z-10 px-3 py-1 text-xs font-medium text-white rounded-full top-4 left-4 backdrop-blur-sm"
                    :class="[
                      isDark
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500'
                        : 'bg-gradient-to-r from-blue-500 to-blue-400',
                    ]"
                  >
                    {{ item.category || 'Featured' }}
                  </div>

                  <!-- Date badge - adaptive for dark mode -->
                  <div
                    class="absolute z-10 flex items-center px-3 py-1 text-xs font-medium text-white rounded-full top-4 right-4 backdrop-blur-sm"
                    :class="isDark ? 'bg-slate-700/60' : 'bg-blue-600/60'"
                  >
                    <UIcon name="i-heroicons-calendar" class="w-3 h-3 mr-1" />
                    {{ formatDate(item.created_at || new Date()) }}
                  </div>
                </div>

                <!-- Content side with glass morphism - adaptive for dark mode -->
                <div
                  class="relative flex flex-col justify-center w-full p-6 text-white md:p-8 md:w-1/2"
                >
                  <div class="space-y-4">
                    <!-- Title with animation -->
                    <h3 class="text-xl font-bold md:text-2xl title-animation">
                      {{ item.title }}
                    </h3>

                    <!-- Animated divider - adaptive for dark mode -->
                    <div
                      class="w-16 h-0.5 divider-animation"
                      :class="[
                        isDark
                          ? 'bg-gradient-to-r from-blue-400 to-blue-300'
                          : 'bg-gradient-to-r from-blue-300 to-white',
                      ]"
                    ></div>
                    <p
                      class="text-sm line-clamp-3 description-animation"
                      :class="isDark ? 'text-slate-300' : 'text-blue-50'"
                    >
                      {{ item.description }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Clone of first slide -->
            <div
              v-if="getCloneSlides.first"
              :key="`clone-first`"
              class="relative flex-shrink-0 w-full p-4"
            >
              <div
                class="relative flex flex-col overflow-hidden border shadow-xl cursor-pointer backdrop-blur-md rounded-2xl md:flex-row"
                :class="[
                  isDark
                    ? 'bg-slate-800/30 border-slate-700/30'
                    : 'bg-white/20 border-white/30',
                ]"
              >
                <!-- Image side with enhanced styling -->
                <div class="relative w-full overflow-hidden md:w-1/2">
                  <img
                    :src="getCloneSlides.first.image"
                    :alt="getCloneSlides.first.title"
                    class="object-cover w-full h-64 transition-transform md:h-full hover:scale-105"
                  />
                  <div
                    class="absolute inset-0 opacity-60"
                    :class="[
                      isDark
                        ? 'bg-gradient-to-tr from-green-900/80 via-slate-800/60 to-transparent'
                        : 'bg-gradient-to-tr from-blue-700/70 via-blue-600/50 to-transparent',
                    ]"
                  ></div>
                  <div
                    class="absolute z-10 px-3 py-1 text-xs font-medium text-white rounded-full top-4 left-4 backdrop-blur-sm"
                    :class="[
                      isDark
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500'
                        : 'bg-gradient-to-r from-blue-500 to-blue-400',
                    ]"
                  >
                    {{ getCloneSlides.first.category || 'Featured' }}
                  </div>
                  <div
                    class="absolute z-10 flex items-center px-3 py-1 text-xs font-medium text-white rounded-full top-4 right-4 backdrop-blur-sm"
                    :class="isDark ? 'bg-slate-700/60' : 'bg-blue-600/60'"
                  >
                    <UIcon name="i-heroicons-calendar" class="w-3 h-3 mr-1" />
                    {{
                      formatDate(getCloneSlides.first.created_at || new Date())
                    }}
                  </div>
                </div>
                <div
                  class="relative flex flex-col justify-center w-full p-6 text-white md:p-8 md:w-1/2"
                >
                  <div class="space-y-4">
                    <h3 class="text-xl font-bold md:text-2xl">
                      {{ getCloneSlides.first.title }}
                    </h3>
                    <div
                      class="w-16 h-0.5"
                      :class="[
                        isDark
                          ? 'bg-gradient-to-r from-blue-400 to-blue-300'
                          : 'bg-gradient-to-r from-blue-300 to-white',
                      ]"
                    ></div>
                    <p
                      class="text-sm line-clamp-3"
                      :class="isDark ? 'text-slate-300' : 'text-blue-50'"
                    >
                      {{ getCloneSlides.first.description }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="absolute left-0 right-0 flex justify-center bottom-6">
            <div
              class="flex items-center p-1.5 space-x-2 rounded-full backdrop-blur-sm"
              :class="isDark ? 'bg-slate-800/60' : 'bg-blue-600/40'"
            >
              <button
                v-for="(_, index) in carouselStore.carouselData.data"
                :key="index"
                @click="setCurrentIndex(index)"
                class="w-2 h-2 transition-all duration-500 rounded-full"
                :class="[
                  currentIndex === index ||
                  (currentIndex === -1 && index === totalSlides.value - 1) ||
                  (currentIndex === totalSlides.value && index === 0)
                    ? 'bg-white w-8'
                    : isDark
                    ? 'bg-slate-400/50 hover:bg-white/70'
                    : 'bg-white/50 hover:bg-white/80',
                ]"
                :aria-label="`Go to slide ${index + 1}`"
              ></button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup>
import {
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  computed,
  nextTick,
} from 'vue';
import { useCarouselStore } from '@/store/carousel/carousel.js';
import { useLayout } from '~/store/layouts/layouts';
import { useFooterStore } from '@/store/footer/footer.js';
import Vue3LoadingShimmer from 'vue3-loading-shimmer';
import { useRouter } from 'vue-router';

const carouselStore = useCarouselStore();
const layoutStore = useLayout();
const footerStore = useFooterStore();
const currentIndex = ref(0);
const isModalOpen = ref(false);
const slideInterval = ref(5000); // 5 seconds per slide
let interval = null;
const router = useRouter();
const isLoading = ref(true); // Add loading state
const isJumping = ref(false); // Flag to detect transition jumps

// Add computed property to access footer data
const footerData = computed(() => {
  return (
    footerStore.footerData?.data?.[0] || footerStore.footerData?.[0] || null
  );
});

// Computed property for total slides
const totalSlides = computed(
  () => carouselStore.carouselData.data?.length || 0
);

// Helper functions for cloned slides
const getCloneSlides = computed(() => {
  if (!totalSlides.value) return { first: null, last: null };
  return {
    first: carouselStore.carouselData.data[0],
    last: carouselStore.carouselData.data[totalSlides.value - 1],
  };
});

// Fungsi untuk menghitung nilai translateX dengan akurat tanpa akumulasi
const getTranslateValue = () => {
  // Posisi dimulai dengan slide clone terakhir di index -1 (sebagai posisi pertama)
  // Lalu slide asli dari index 0 sampai totalSlides - 1
  // Dan slide clone pertama di posisi totalSlides

  // Koreksi indeks jika melebihi batas yang diizinkan
  if (currentIndex.value > totalSlides.value) {
    // Reset jika melebihi batas maksimal
    currentIndex.value = currentIndex.value % totalSlides.value;
  } else if (currentIndex.value < -1) {
    // Reset jika melebihi batas minimal
    currentIndex.value = -1;
  }

  // Jika currentIndex -1, artinya di clone terakhir
  if (currentIndex.value === -1) {
    return 0; // Posisi paling awal (clone terakhir)
  }
  // Jika currentIndex di range normal (0 sampai totalSlides-1)
  else if (currentIndex.value >= 0 && currentIndex.value < totalSlides.value) {
    return (currentIndex.value + 1) * 100; // +1 karena ada clone di awal
  }
  // Jika currentIndex sama dengan totalSlides, artinya di clone pertama
  else if (currentIndex.value === totalSlides.value) {
    return (totalSlides.value + 1) * 100;
  }

  // Fallback untuk kasus yang tidak terduga
  return (currentIndex.value + 1) * 100;
};

// Computed property to check if dark mode is active
const isDark = computed(() => {
  return layoutStore.theme === 'dark';
});

// Format date to Indonesian format
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

// Open modal with selected item
const gotoDetail = (link) => {
  window.location.href = link;
};

// Variabel untuk mengelola state navigasi
let navigateTimer = null;
let clickCount = 0;
const MAX_CLICKS = 3; // Batas maksimum klik berturutan
const DEBOUNCE_TIME = 150; // 150ms debounce - sedikit lebih lama untuk menangani klik cepat
const RESET_CLICK_COUNT_TIME = 800; // 800ms untuk reset hitungan klik

// Function untuk membatasi klik berturut-turut
const throttleNavigation = (callback) => {
  // Batalkan timer sebelumnya jika ada
  if (navigateTimer) {
    clearTimeout(navigateTimer);
  }

  // Jika klik melebihi batas, force reset carousel
  clickCount++;
  if (clickCount > MAX_CLICKS) {
    isJumping.value = true;

    // Delay untuk memastikan UI tetap responsif
    navigateTimer = setTimeout(() => {
      // Reset ke slide pertama asli
      currentIndex.value = 0;

      // Reset click count
      clickCount = 0;

      // Re-enable transisi setelah sedikit delay
      nextTick(() => {
        setTimeout(() => {
          isJumping.value = false;
        }, 50);
      });

      navigateTimer = null;
      resetAutoSlide();
    }, DEBOUNCE_TIME);

    return;
  }

  // Set timer untuk memanggil callback setelah debounce
  navigateTimer = setTimeout(() => {
    callback();
    navigateTimer = null;

    // Set timer untuk reset hitungan klik
    setTimeout(() => {
      clickCount = 0;
    }, RESET_CLICK_COUNT_TIME);
  }, DEBOUNCE_TIME);
};

// Navigation functions dengan perlindungan terhadap klik cepat berturut-turut
const setCurrentIndex = (index) => {
  // Jika sedang dalam transisi atau sedang jumping, jangan lakukan apa-apa
  if (isJumping.value) return;

  throttleNavigation(() => {
    // Validasi index untuk memastikan dalam batas aman
    if (index >= 0 && index < totalSlides.value) {
      currentIndex.value = index;
      resetAutoSlide();
    }
  });
};

const nextSlide = () => {
  // Jika tidak ada slide atau sedang dalam transisi, jangan lakukan apa-apa
  if (!totalSlides.value || isJumping.value) return;

  throttleNavigation(() => {
    // Validasi sebelum mengubah index
    if (currentIndex.value === totalSlides.value - 1) {
      // Jika sudah di slide terakhir, pindah ke slide kloning pertama
      currentIndex.value = totalSlides.value;
    } else if (currentIndex.value < totalSlides.value) {
      // Memastikan increment tidak melebihi batas
      currentIndex.value++;
    }

    resetAutoSlide();
  });
};

const prevSlide = () => {
  // Jika tidak ada slide atau sedang dalam transisi, jangan lakukan apa-apa
  if (!totalSlides.value || isJumping.value) return;

  throttleNavigation(() => {
    // Validasi sebelum mengubah index
    if (currentIndex.value === 0) {
      // Jika sudah di slide pertama, pindah ke slide kloning terakhir
      currentIndex.value = -1;
    } else if (currentIndex.value > -1) {
      // Memastikan decrement tidak melewati batas
      currentIndex.value--;
    }

    resetAutoSlide();
  });
};

// Handle transitions between clones and originals dengan penanganan yang lebih robust
const handleTransitionEnd = () => {
  // Hanya lakukan transisi jika tidak ada transisi lain yang sedang berjalan
  if (isJumping.value) return;

  if (currentIndex.value === totalSlides.value) {
    // Transisi ke kloning pertama selesai, lompat ke slide pertama tanpa animasi
    isJumping.value = true;

    // Gunakan requestAnimationFrame untuk memastikan browser telah melakukan render
    requestAnimationFrame(() => {
      currentIndex.value = 0;

      // Pastikan DOM diupdate sebelum mengaktifkan transisi lagi
      nextTick(() => {
        // Berikan sedikit delay untuk memastikan perubahan telah diterapkan
        setTimeout(() => {
          isJumping.value = false;
        }, 50);
      });
    });
  } else if (currentIndex.value === -1) {
    // Transisi ke kloning terakhir selesai, lompat ke slide terakhir tanpa animasi
    isJumping.value = true;

    // Gunakan requestAnimationFrame untuk memastikan browser telah melakukan render
    requestAnimationFrame(() => {
      currentIndex.value = totalSlides.value - 1;

      // Pastikan DOM diupdate sebelum mengaktifkan transisi lagi
      nextTick(() => {
        // Berikan sedikit delay untuk memastikan perubahan telah diterapkan
        setTimeout(() => {
          isJumping.value = false;
        }, 50);
      });
    });
  }
};

// Auto-slide functions
const startAutoSlide = () => {
  if (interval) return;
  interval = setInterval(() => {
    if (!isModalOpen.value && !document.hidden && totalSlides.value) {
      nextSlide();
    }
  }, slideInterval.value);
};

const stopAutoSlide = () => {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
};

const resetAutoSlide = () => {
  stopAutoSlide();
  startAutoSlide();
};

// Watch for modal close to resume auto-slide
watch(isModalOpen, (newValue) => {
  if (!newValue) {
    startAutoSlide();
  }
});

// Pause auto-slide when user hovers over carousel
const pauseOnHover = () => {
  const container = document.querySelector('.carousel-container');
  if (container) {
    container.addEventListener('mouseenter', stopAutoSlide);
    container.addEventListener('mouseleave', () => {
      if (!isModalOpen.value) {
        startAutoSlide();
      }
    });
  }
};

onMounted(async () => {
  try {
    // Show shimmer loading while data is being fetched
    isLoading.value = true;
    await carouselStore.getCarouselData();

    // Simulate a minimum loading time for better UX (optional)
    setTimeout(() => {
      isLoading.value = false;

      // Start auto-slide after data is loaded
      startAutoSlide();
      pauseOnHover();

      // Add animation classes after loading for entrance animations
      setTimeout(() => {
        document
          .querySelectorAll('.title-animation')
          .forEach((el) => el.classList.add('animate-in'));

        setTimeout(() => {
          document
            .querySelectorAll('.divider-animation')
            .forEach((el) => el.classList.add('animate-in'));

          setTimeout(() => {
            document
              .querySelectorAll('.description-animation')
              .forEach((el) => el.classList.add('animate-in'));

            setTimeout(() => {
              document
                .querySelectorAll('.button-animation')
                .forEach((el) => el.classList.add('animate-in'));
            }, 200);
          }, 200);
        }, 200);
      }, 100);
    }, 1000); // Minimum 1 second of shimmer loading for better UX

    // Preload images for smoother transitions
    if (carouselStore.carouselData.data?.length) {
      carouselStore.carouselData.data.forEach((item) => {
        if (item.image) {
          const img = new Image();
          img.src = item.image;
        }
      });
    }
  } catch (error) {
    console.error('Error loading carousel data:', error);
    isLoading.value = false;
  }
});

onBeforeUnmount(() => {
  stopAutoSlide();

  // Remove event listeners
  const container = document.querySelector('.carousel-container');
  if (container) {
    container.removeEventListener('mouseenter', stopAutoSlide);
    container.removeEventListener('mouseleave', startAutoSlide);
  }
});
</script>

<style scoped>
/* Card size consistency */
.carousel-container .md\:flex-row {
  min-height: 495px;
  max-height: 495px;
}

/* Smooth transitions */
.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hover effects */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* Animated indicator */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.bg-white.w-8 {
  animation: pulse 2s infinite;
}

/* Particle animations */
@keyframes floatParticle {
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

/* Slide animations */
.slide-animation {
  opacity: 0;
  animation: fadeIn 0.5s forwards;
  animation-delay: calc(0.1s * var(--slide-index, 0));
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Content animations */
.title-animation,
.divider-animation,
.description-animation,
.button-animation {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.title-animation.animate-in,
.divider-animation.animate-in,
.description-animation.animate-in,
.button-animation.animate-in {
  opacity: 1;
  transform: translateY(0);
}

/* Glass effect enhancements */
.backdrop-blur-md {
  backdrop-filter: blur(12px);
}

.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}

/* Dark mode transitions */
.bg-gradient-to-b,
.bg-gradient-to-r,
.bg-gradient-to-tr {
  transition: background 0.3s ease;
}
</style>
