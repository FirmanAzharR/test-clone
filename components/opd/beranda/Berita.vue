<template>
  <section
    :class="[
      'relative w-full overflow-hidden py-14 transition-colors duration-300',
      isDark
        ? 'bg-gradient-to-t from-green-900 to-green-800/45'
        : 'bg-gradient-to-b from-slate-100 via-blue-50 to-blue-100',
    ]"
  >
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        :class="[
          'absolute w-64 h-64 rounded-full -top-32 -right-32 blur-3xl',
          isDark ? 'bg-blue-500/10' : 'bg-blue-100/5',
        ]"
      ></div>
      <div
        :class="[
          'absolute w-64 h-64 rounded-full -bottom-32 -left-32 blur-3xl',
          isDark ? 'bg-blue-500/10' : 'bg-blue-300/5',
        ]"
      ></div>
    </div>

    <div class="container relative px-4 mx-auto max-w-7xl">
      <div class="mb-12 text-center">
        <div
          :class="[
            'inline-block px-3 py-1 mb-3 text-sm font-medium rounded-full transition-all duration-300 transform hover:scale-105',
            isDark
              ? 'text-blue-300 bg-blue-900/40'
              : 'text-blue-600 bg-blue-100',
          ]"
        >
          <span class="flex items-center">
            <UIcon name="i-heroicons-sparkles" class="w-4 h-4 mr-1" />
            Informasi
          </span>
        </div>
        <h2
          :class="[
            'text-3xl font-bold md:text-4xl lg:text-5xl transition-all duration-300',
            isDark ? 'text-white' : 'text-slate-900',
          ]"
        >
          <span
            :class="[
              'text-2xl font-normal',
              isDark ? 'text-blue-300' : 'text-blue-600',
              'aksara-jawa',
            ]"
            v-if="isAksaraJawaEnabled"
          >
            ꧋{{ beritaTitle }}
          </span>
          <br />
          <div class="mt-4">Berita Terbaru</div>
        </h2>
        <div class="flex items-center justify-center mt-4">
          <div
            :class="[
              'w-12 h-1 rounded-full',
              isDark
                ? 'bg-gradient-to-r from-blue-500 to-blue-300'
                : 'bg-gradient-to-r from-blue-600 to-blue-400',
            ]"
          ></div>
          <div
            :class="[
              'w-2 h-2 mx-2 rounded-full',
              isDark ? 'bg-blue-400' : 'bg-blue-600',
            ]"
          ></div>
          <div
            :class="[
              'w-12 h-1 rounded-full',
              isDark
                ? 'bg-gradient-to-r from-blue-300 to-blue-500'
                : 'bg-gradient-to-r from-blue-400 to-blue-600',
            ]"
          ></div>
        </div>
        <p
          :class="[
            'max-w-2xl mx-auto mt-4',
            isDark ? 'text-slate-300' : 'text-slate-600',
          ]"
        >
          Berita dan informasi terbaru dari
          {{ footerData?.nama_opd || 'Dinas Komunikasi dan Informatika' }}
        </p>
      </div>

      <!-- Category filter tabs with improved styling -->
      <div class="mb-8 overflow-x-auto scrollbar-hide">
        <div class="flex pb-2 space-x-2">
          <button
            v-for="(category, index) in newsCategories"
            :key="index"
            :class="[
              'px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full whitespace-nowrap',
              selectedCategory === category
                ? isDark
                  ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20'
                  : 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : isDark
                ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                : 'bg-white text-slate-700 hover:bg-blue-50',
            ]"
            @click="selectedCategory = category"
            :disabled="isLoading"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <!-- News cards with navigation -->
      <div class="relative">
        <!-- Navigation buttons -->
        <div class="absolute z-10 -translate-y-1/2 -left-4 top-1/2">
          <button
            @click="prevSlide"
            :class="[
              'flex items-center justify-center w-10 h-10 transition-colors rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed',
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-blue-400'
                : 'bg-white hover:bg-blue-50 text-blue-600',
            ]"
            :disabled="currentSlide === 0 || isLoading"
            aria-label="Previous articles"
          >
            <UIcon name="i-heroicons-chevron-left" class="w-5 h-5" />
          </button>
        </div>

        <div class="absolute z-10 -translate-y-1/2 -right-4 top-1/2">
          <button
            @click="nextSlide"
            :class="[
              'flex items-center justify-center w-10 h-10 transition-colors rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed',
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-blue-400'
                : 'bg-white hover:bg-blue-50 text-blue-600',
            ]"
            :disabled="
              currentSlide >=
                Math.ceil(filteredNews.length / itemsPerPage) - 1 || isLoading
            "
            aria-label="Next articles"
          >
            <UIcon name="i-heroicons-chevron-right" class="w-5 h-5" />
          </button>
        </div>

        <!-- Cards container with transition -->
        <div class="overflow-hidden">
          <!-- Shimmer loading state -->
          <div
            v-if="isLoading"
            class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3"
          >
            <div
              v-for="i in 3"
              :key="`shimmer-${i}`"
              :class="[
                'relative overflow-hidden transition-all duration-300 shadow-md rounded-xl',
                isDark ? 'bg-slate-800' : 'bg-white',
              ]"
            >
              <!-- Card content shimmer -->
              <div class="p-6 space-y-1">
                <!-- Category badge shimmer -->
                <div class="mb-4">
                  <Vue3LoadingShimmer
                    :class="[
                      'w-20 h-6 space-y-1 rounded',
                      isDark ? 'shimmer-dark' : '',
                    ]"
                  />
                </div>

                <!-- Title shimmer -->
                <Vue3LoadingShimmer
                  :class="[
                    'w-full mb-2 rounded h-7',
                    isDark ? 'shimmer-dark' : '',
                  ]"
                />
                <Vue3LoadingShimmer
                  :class="[
                    'w-3/4 mb-3 rounded h-7',
                    isDark ? 'shimmer-dark' : '',
                  ]"
                />

                <!-- Excerpt shimmer -->
                <Vue3LoadingShimmer
                  :class="[
                    'w-full h-4 mb-2 rounded',
                    isDark ? 'shimmer-dark' : '',
                  ]"
                />
                <Vue3LoadingShimmer
                  :class="[
                    'w-full h-4 mb-2 rounded',
                    isDark ? 'shimmer-dark' : '',
                  ]"
                />
                <Vue3LoadingShimmer
                  :class="[
                    'w-2/3 h-4 mb-4 rounded',
                    isDark ? 'shimmer-dark' : '',
                  ]"
                />

                <!-- Footer shimmer -->
                <div
                  :class="[
                    'pt-4 mt-2 border-t',
                    isDark ? 'border-slate-700' : 'border-slate-100',
                  ]"
                >
                  <div class="flex items-center justify-between">
                    <Vue3LoadingShimmer
                      :class="[
                        'w-24 h-4 rounded',
                        isDark ? 'shimmer-dark' : '',
                      ]"
                    />
                    <Vue3LoadingShimmer
                      :class="[
                        'w-20 h-8 rounded-full',
                        isDark ? 'shimmer-dark' : '',
                      ]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actual content when loaded -->
          <div
            v-else
            class="flex transition-transform duration-500 ease-out"
            :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
          >
            <!-- Each page of itemsPerPage cards -->
            <div
              v-for="page in Math.ceil(filteredNews.length / itemsPerPage)"
              :key="`page-${page}`"
              class="grid flex-shrink-0 w-full grid-cols-1 gap-2 sm:gap-6 sm:grid-cols-2 md:grid-cols-3"
            >
              <!-- Cards for this page with enhanced styling -->
              <div
                v-for="(item, cardIndex) in getPageItems(page - 1)"
                :key="item.id || cardIndex"
                :class="[
                  'relative overflow-hidden transition-all duration-300 shadow-md rounded-xl news-card group hover:shadow-xl hover:-translate-y-1',
                  isDark ? 'bg-slate-800' : 'bg-white',
                  {
                    active:
                      activeCardIndex ===
                      (page - 1) * itemsPerPage.value + cardIndex,
                  },
                ]"
                @mouseenter="
                  activeCardIndex = (page - 1) * itemsPerPage.value + cardIndex
                "
              >
                <!-- Left border accent that appears on hover -->
                <div
                  :class="[
                    'absolute top-0 left-0 w-1 h-0 transition-all duration-500 group-hover:h-full',
                    isDark ? 'bg-blue-500' : 'bg-blue-600',
                  ]"
                ></div>

                <!-- Card content -->
                <div class="p-6">
                  <!-- Category badge -->
                  <div class="mb-4">
                    <span
                      :class="[
                        'inline-block px-2 py-1 text-xs font-medium rounded',
                        isDark
                          ? 'text-blue-300 bg-blue-900/40'
                          : 'text-blue-600 bg-blue-100',
                      ]"
                    >
                      {{ newsCategories[cardIndex % newsCategories.length] }}
                    </span>
                  </div>

                  <!-- Title -->
                  <h3
                    :class="[
                      'text-xl font-bold mb-3 line-clamp-2 min-h-[3.5rem] transition-colors',
                      isDark
                        ? 'text-white group-hover:text-blue-300'
                        : 'text-slate-900 group-hover:text-blue-600',
                    ]"
                  >
                    {{ item.title }}
                  </h3>

                  <!-- Excerpt -->
                  <p
                    :class="[
                      'mb-4 text-sm line-clamp-3',
                      isDark ? 'text-slate-300' : 'text-slate-600',
                    ]"
                  >
                    {{ item.excert || stripHtml(item.description) }}
                  </p>

                  <!-- Footer with date and read more link -->
                  <div
                    :class="[
                      'flex items-center justify-between pt-4 mt-2 border-t',
                      isDark ? 'border-slate-700' : 'border-slate-100',
                    ]"
                  >
                    <div
                      :class="[
                        'flex items-center text-xs',
                        isDark ? 'text-slate-400' : 'text-slate-500',
                      ]"
                    >
                      <UIcon
                        name="i-heroicons-calendar"
                        :class="[
                          'w-4 h-4 mr-1',
                          isDark ? 'text-blue-400' : 'text-blue-500',
                        ]"
                      />
                      <span>{{
                        formatDate(item.created_at || new Date())
                      }}</span>
                    </div>

                    <NuxtLink
                      :to="`/berita/detail/${item.id}`"
                      :class="[
                        'inline-flex items-center px-3 py-1 text-sm font-medium text-white transition-colors rounded-full bg-gradient-to-r group-hover:shadow-md z-10',
                        isDark
                          ? 'from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700'
                          : 'from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600',
                      ]"
                    >
                      <span class="z-10">Baca</span>
                      <UIcon
                        name="i-heroicons-arrow-right"
                        class="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1 z-10"
                      />
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination indicators with improved styling -->
      <div class="flex justify-center mt-2 sm:mt-8 space-x-2">
        <!-- Shimmer indicators when loading -->
        <template v-if="isLoading">
          <Vue3LoadingShimmer
            v-for="i in 3"
            :key="`indicator-shimmer-${i}`"
            :class="[
              'w-8 h-2.5 mx-1 rounded-full',
              isDark ? 'shimmer-dark' : '',
            ]"
          />
        </template>

        <!-- Actual indicators when loaded -->
        <template v-else>
          <button
            v-for="page in Math.ceil(filteredNews.length / itemsPerPage)"
            :key="`indicator-${page}`"
            @click="currentSlide = page - 1"
            :class="[
              'h-2.5 rounded-full transition-all duration-300',
              currentSlide === page - 1
                ? isDark
                  ? 'bg-blue-500 w-8'
                  : 'bg-blue-600 w-8'
                : isDark
                ? 'bg-slate-600 hover:bg-blue-400 w-2.5'
                : 'bg-slate-300 hover:bg-blue-400 w-2.5',
            ]"
            :aria-label="`Go to page ${page}`"
          ></button>
        </template>
      </div>
      <div class="flex justify-center mt-6">
        <NuxtLink
          :to="`/informasi`"
          :class="[
            'inline-flex items-center px-4 py-2 font-medium text-white transition-colors rounded-lg bg-gradient-to-r',
            isDark
              ? 'from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700'
              : 'from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600',
          ]"
          @click="handleViewAllClick"
        >
          <span>Lihat Semua Artikel</span>
          <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 ml-2" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';
import { useBeritaStore } from '@/store/berita/berita.js';
import { useFooterStore } from '@/store/footer/footer.js';
import Vue3LoadingShimmer from 'vue3-loading-shimmer';
import { useLayout } from '~/store/layouts/layouts';
import { LatinKeAksara } from '@sajenid/aksara.js';

const runtimeConfig = useRuntimeConfig();
const isAksaraJawaEnabled = computed(
  () => runtimeConfig.public.isAksaraJawa === 'true'
);
const beritaTitle = computed(() =>
  isAksaraJawaEnabled.value ? LatinKeAksara('Berita Terbaru') : ''
);
const layoutStore = useLayout();
const beritaStore = useBeritaStore();
const footerStore = useFooterStore();
const selectedCategory = ref('All');
const activeCardIndex = ref(null);
const currentSlide = ref(0);
const isLoading = ref(true);
const isMobile = ref(false);

const newsCategories = [
  'All',
  'Events',
  'Updates',
  'Community',
  'Press Release',
];
const isDark = computed(() => {
  return layoutStore.theme === 'dark';
});

// Add computed property to access footer data
const footerData = computed(() => {
  return (
    footerStore.footerData?.data?.[0] || footerStore.footerData?.[0] || null
  );
});

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 120) + '...';
};

const handleViewAllClick = () => {
  if (process.client) {
    sessionStorage.setItem('fromHome', 'true');
  }
};

// Update mobile state on window resize
const updateMobileState = () => {
  if (process.client) {
    isMobile.value = window.innerWidth < 768;
  }
};

// Get items per page based on screen size
const itemsPerPage = computed(() => (isMobile.value ? 2 : 3));

// Filter news by category
const filteredNews = computed(() => {
  let news = beritaStore.beritaData.data || [];

  // Apply category filter
  if (selectedCategory.value !== 'All') {
    // This is a placeholder - in a real app, you'd filter by actual category
    const categoryIndex = newsCategories.indexOf(selectedCategory.value);
    news = news.filter(
      (_, index) => index % newsCategories.length === categoryIndex - 1
    );
  }

  return news;
});

// Get items for a specific page (responsive)
const getPageItems = (pageIndex) => {
  const startIndex = pageIndex * itemsPerPage.value;
  return filteredNews.value.slice(startIndex, startIndex + itemsPerPage.value);
};

// Navigation functions
const nextSlide = () => {
  if (isLoading.value) return;

  if (
    currentSlide.value <
    Math.ceil(filteredNews.value.length / itemsPerPage.value) - 1
  ) {
    currentSlide.value++;
  }
};

const prevSlide = () => {
  if (isLoading.value) return;

  if (currentSlide.value > 0) {
    currentSlide.value--;
  }
};

// Reset to first slide when category changes
watch(selectedCategory, () => {
  currentSlide.value = 0;
});

onMounted(async () => {
  try {
    // Show shimmer loading while data is being fetched
    isLoading.value = true;

    await footerStore.getFooterData();
    await beritaStore.getBeritaData();

    // Initialize mobile state
    updateMobileState();
    window.addEventListener('resize', updateMobileState);

    // Simulate a minimum loading time for better UX (optional)
    setTimeout(() => {
      isLoading.value = false;
    }, 1000); // Minimum 1 second of shimmer loading for better UX
  } catch (error) {
    console.error('Error loading news data:', error);
    isLoading.value = false;
  }
});

onBeforeUnmount(() => {
  if (process.client) {
    window.removeEventListener('resize', updateMobileState);
  }
});
</script>

<style scoped>
/* Card animations and hover effects */
.news-card {
  transform: translateZ(0);
  backface-visibility: hidden;
}

.news-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, rgba(59, 130, 246, 0.05), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.dark .news-card::before {
  background: linear-gradient(to right, rgba(59, 130, 246, 0.1), transparent);
}

.news-card:hover::before {
  opacity: 1;
}

/* Staggered animation on initial load */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.news-card {
  animation: fadeInUp 0.5s ease-out forwards;
  animation-delay: calc(var(--index) * 0.1s);
}

/* Hide scrollbar but keep functionality */
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

/* Gradient animations */
.bg-gradient-to-r {
  background-size: 200% auto;
  transition: background-position 0.5s ease;
}

.bg-gradient-to-r:hover {
  background-position: right center;
}

/* Dark mode shimmer styles */
.shimmer-dark {
  --shimmer-color: rgba(51, 65, 85, 0.5);
  --shimmer-highlight: rgba(71, 85, 105, 0.8);
}

/* Transition for dark mode */
.dark {
  transition: all 0.3s ease;
}

/* Custom shimmer for dark mode */
:deep(.shimmer-dark .shimmer) {
  background: linear-gradient(
    90deg,
    var(--shimmer-color) 0%,
    var(--shimmer-highlight) 50%,
    var(--shimmer-color) 100%
  );
}

/* Aksara Jawa font styling */
.aksara-jawa {
  font-family: 'nyk Ngayogyan New';
  line-height: 2 !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .news-card {
    margin-bottom: 1rem;
  }
}
</style>
