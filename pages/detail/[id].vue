<template>
  <section
    class="bg-slate-100 min-h-screen pt-16"
    :class="isDarkMode ? 'dark:bg-slate-900' : ''"
  >
    <div
      class="absolute top-0 left-0 right-0 w-full h-[62px] lg:h-[120px] bg-gradient-to-r from-blue-600 to-blue-500 dark:from-transparent dark:to-transparent"
    />

    <!-- Breadcrumb -->
    <div class="container px-4 mx-auto max-w-7xl pt-20 pb-2">
      <Breadcrumb
        :items="[
          {
            text: getCategoryTitle(articleCategory),
            to: getCategoryPath(articleCategory),
          },
          { text: data?.data?.title || 'Detail Kategori', to: '' },
        ]"
        :loading="pending"
      />
    </div>

    <!-- Content Area -->
    <div class="container px-4 mx-auto max-w-7xl py-8">
      <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6 dark:bg-slate-800">
        <!-- Loading -->
        <div v-if="pending" class="animate-pulse space-y-4">
          <div
            class="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mx-auto"
          />
          <div class="space-y-3">
            <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
            <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
          </div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="text-center py-6">
          <UIcon
            name="i-heroicons-exclamation-circle"
            class="w-12 h-12 text-red-500 mx-auto mb-3"
          />
          <h2 class="text-xl font-semibold text-red-500 mb-2">
            Error Loading Content
          </h2>
          <p class="text-slate-600 dark:text-slate-400">{{ error.message }}</p>
          <UButton color="red" variant="soft" class="mt-3" @click="refresh"
            >Coba Lagi</UButton
          >
        </div>

        <!-- Success -->
        <div v-else>
          <h1
            class="text-2xl font-semibold text-center mb-4"
            :class="isDarkMode ? 'text-white' : 'text-slate-900'"
          >
            {{ data?.data?.title }}
          </h1>

          <!-- Swiper & Content -->
          <div class="prose max-w-none dark:prose-invert">
            <!-- Gambar Slider -->
            <div v-if="images.length" class="relative mb-6">
              <!-- Counter -->
              <div
                class="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-2 py-1 rounded z-10"
              >
                {{ currentSlide + 1 }} / {{ images.length }}
              </div>

              <Swiper
                :modules="[Navigation, Thumbs]"
                navigation
                class="rounded-xl overflow-hidden"
                @slideChange="onSlideChange"
                @swiper="onSwiperInit"
              >
                <SwiperSlide v-for="(src, i) in images" :key="i">
                  <img :src="src" class="w-full h-auto object-contain" />
                </SwiperSlide>
              </Swiper>
            </div>

            <!-- Deskripsi -->
            <div class="content-wrapper" v-html="description" />

            <!-- Tanggal -->
            <div
              class="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mt-4 pt-3 border-t border-slate-200 dark:border-slate-700"
            >
              <time :datetime="data?.data?.created_at">
                {{ formatDate(data?.data?.created_at) }}
              </time>
            </div>

            <!-- PDF Download -->
            <div class="mt-4" v-if="pdfFile">
              <UButton
                :to="pdfFile"
                target="_blank"
                color="info"
                variant="solid"
                icon="i-heroicons-arrow-down-tray"
              >
                Unduh
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useLayout } from '@/store/layouts/layouts.js';
import { useBeritaStore } from '@/store/berita/berita';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

const layoutStore = useLayout();
const isDarkMode = computed(() => layoutStore.theme === 'dark');

const route = useRoute();
const beritaStore = useBeritaStore();

// State
const images = ref([]);
const description = ref('');
const thumbsSwiper = ref(null);

// Ambil data artikel
const {
  data: articleData,
  pending,
  error,
  refresh,
} = await useAsyncData(`article-${route.params.id}`, () =>
  beritaStore.getDetailBeritaData(route.params.id)
);

const data = computed(() => beritaStore.detailBeritaData);

// Watch untuk parsing deskripsi saat data siap
watch(
  () => data.value?.data?.description,
  (html) => {
    if (!html) return;

    const doc = new DOMParser().parseFromString(html, 'text/html');
    const imgTags = doc.querySelectorAll('img');
    images.value = Array.from(imgTags).map((img) => img.src);
    description.value = html.replace(/<img[^>]*>/g, '');
  },
  { immediate: true }
);

const currentSlide = ref(0);
let mainSwiper = null;

const onSwiperInit = (swiper) => {
  mainSwiper = swiper;
  currentSlide.value = swiper.activeIndex;
};

const onSlideChange = () => {
  if (mainSwiper) {
    currentSlide.value = mainSwiper.activeIndex;
  }
};

// PDF dari link Google Drive
const pdfFile = computed(() => {
  const desc = data.value?.data?.description;
  if (!desc) return null;

  const match = desc.match(
    /https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+\/preview/
  );
  return match ? match[0].replace('/preview', '/view?usp=download') : null;
});

// Kategori
const getCategoryFromArticle = (articleData) => {
  if (route.query.category) return route.query.category.toLowerCase();
  const categories =
    articleData?.data?.categories || articleData?.data?.category || [];
  if (Array.isArray(categories) && categories.length > 0)
    return categories[0].toLowerCase();
  if (typeof categories === 'string') return categories.toLowerCase();
  return 'general';
};

const articleCategory = computed(() => getCategoryFromArticle(data.value));

const getCategoryTitle = (slug) => {
  const titles = {
    renstra: 'Rencana Strategis',
    informasi: 'Informasi',
    kegiatan: 'Kegiatan',
    aset: 'Aset',
    general: 'General',
  };
  return titles[slug] || 'Kategori';
};

const getCategoryPath = (slug) => `/kategori/${slug}`;

// Tanggal
const formatDate = (dateString) => {
  if (!dateString) return '';
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];
  const date = new Date(dateString);
  return `${days[date.getDay()]}, ${date.getDate()} ${
    months[date.getMonth()]
  } ${date.getFullYear()}`;
};
</script>

<style>
.prose {
  @apply max-w-none;
}

.prose img {
  @apply mx-auto rounded-lg max-w-full h-auto;
  max-height: 800px; /* Increased max height */
  object-fit: contain;
}

.prose iframe {
  @apply mx-auto max-w-full rounded-lg;
  aspect-ratio: 16/9;
  width: 100%;
}

.content-wrapper {
  @apply overflow-x-auto;
}

.content-wrapper table {
  @apply w-full border-collapse border border-slate-200 dark:border-slate-700 my-2;
}

.content-wrapper th,
.content-wrapper td {
  @apply border border-slate-200 dark:border-slate-700 p-2;
}

.prose a {
  @apply text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300;
}

.prose > * + * {
  @apply mt-2; /* Reduced spacing between elements */
}

.prose p {
  @apply break-words my-2; /* Reduced paragraph margins */
}

/* Adjusted spacings for content */
.prose h1,
.prose h2,
.prose h3,
.prose h4 {
  @apply my-3; /* Reduced heading margins */
}

.prose ul,
.prose ol {
  @apply my-2 pl-4; /* Reduced list margins */
}

@media (max-width: 640px) {
  .prose img {
    max-height: 500px;
  }
}
</style>
