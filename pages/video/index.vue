<template>
  <div class="min-h-screen bg-slate-100 dark:bg-slate-900">
    <!-- Instead of fixed background, add a colored header only for this page -->
    <div class="absolute top-0 left-0 right-0 h-[62px] lg:h-[120px] z-10 bg-gradient-to-r from-blue-600 to-blue-500 dark:from-transparent dark:to-transparent"></div>
    <!-- Hero Section -->
    <section class="relative py-16 pt-32 bg-white/80 dark:bg-slate-800/80">
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute w-64 h-64 rounded-full bg-blue-500/5 dark:bg-blue-400/5 -top-32 -right-32 blur-3xl"></div>
        <div class="absolute w-64 h-64 rounded-full bg-blue-500/5 dark:bg-blue-400/5 -bottom-32 -left-32 blur-3xl"></div>
      </div>

      <div class="container relative px-4 pt-8 mx-auto max-w-7xl">
        <div class="text-center">
          <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Galeri Video
          </h1>
          <div class="flex items-center justify-center mt-4">
            <div class="w-12 h-1 rounded-full bg-gradient-to-r from-blue-600 to-blue-400"></div>
            <div class="w-2 h-2 mx-2 bg-blue-600 rounded-full"></div>
            <div class="w-12 h-1 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
          </div>
          <p class="max-w-2xl mx-auto mt-6 text-lg text-gray-600 dark:text-slate-400">
            Tonton video informatif dan edukatif dari {{ footerData?.nama_opd || 'Dinas Komunikasi dan Informatika' }}
          </p>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="py-12">
      <div class="container px-4 mx-auto max-w-7xl">
        <!-- Search Bar -->
        <div class="flex justify-between items-center mb-8">
          <Breadcrumb 
            :items="[
              { text: 'Video', to: '/video' }
            ]"
            :loading="false"
          />
          <UInput
            v-model="searchQuery"
            icon="i-heroicons-magnifying-glass-20-solid"
            color="gray"
            variant="outline"
            placeholder="Cari video..."
            class="w-32 sm:w-auto max-w-sm dark:bg-slate-800 dark:border-slate-700"
          />
        </div>

        <!-- Loading State -->
        <div v-if="pending" class="grid gap-6 sm:grid-cols-2">
          <UCard v-for="i in 6" :key="i" class="dark:bg-slate-800">
            <template #header>
              <div class="h-72 bg-gray-200 dark:bg-slate-700 rounded-t-lg animate-pulse"></div>
            </template>
            <div class="space-y-2 animate-pulse">
              <div class="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
              <div class="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
            </div>
          </UCard>
        </div>

        <!-- Video Grid -->
        <div v-else-if="videos.length" class="grid gap-6 sm:grid-cols-2">
          <UCard
            v-for="video in paginatedVideos"
            :key="video.id"
            class="group overflow-hidden dark:bg-slate-800 hover:shadow-xl transition-all duration-300"
          >
            <template #header>
              <div class="relative aspect-[16/9]">
                <iframe 
                  class="w-full h-full"
                  :src="getEmbedUrl(video.video)"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </div>
            </template>
              <h3 class="text-sm font-medium line-clamp-1 dark:text-white">{{ video.title }}</h3>
              <p class="mt-0.5 text-[11px] text-gray-500 dark:text-slate-400">
                {{ formatDate(video.created_at) }}
              </p>
          </UCard>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <UAlert
            icon="i-heroicons-video-camera"
            title="Tidak ada video"
            description="Belum ada video yang ditampilkan"
            color="gray"
            class="dark:bg-slate-800 dark:text-slate-300"
          />
        </div>

        <!-- Pagination -->
        <div v-if="videos.length" class="flex items-center justify-between py-6 mt-6">
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Halaman {{ page }} dari {{ totalPages }}
          </p>
          
          <div class="flex space-x-2">
            <UButton
              color="blue"
              variant="ghost"
              icon="i-heroicons-chevron-left"
              :disabled="page === 1"
              @click="page--"
            />
            
            <UButton
              v-for="pageNum in paginationArray"
              :key="pageNum"
              color="blue"
              :variant="page === pageNum ? 'solid' : 'ghost'"
              @click="page = pageNum"
            >
              {{ pageNum }}
            </UButton>
            
            <UButton
              color="blue"
              variant="ghost"
              icon="i-heroicons-chevron-right"
              :disabled="page === totalPages"
              @click="page++"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useVideoStore } from '~/store/vidio/video';
import { useFooterStore } from '@/store/footer/footer.js';

// Store
const videoStore = useVideoStore()
const footerStore = useFooterStore();
const config = useRuntimeConfig();
const videos = ref([]);
const pending = ref(true);
const searchQuery = ref('');
const page = ref(1);
const itemsPerPage = 6;

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Add computed property to access footer data
const footerData = computed(() => {
  return footerStore.footerData?.data?.[0] || footerStore.footerData?.[0] || null;
});

// Get embed URL for video player
const getEmbedUrl = (url) => {
  const videoId = getVideoId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

// Extract video ID from YouTube URL
const getVideoId = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get("v") || urlObj.pathname.split('/').pop();
  } catch (e) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url?.match(regex);
    return match ? match[1] : '';
  }
};

// Computed properties
const filteredVideos = computed(() => {
  return videos.value.filter(video =>
    video.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const paginatedVideos = computed(() => {
  const start = (page.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredVideos.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredVideos.value.length / itemsPerPage);
});

const paginationArray = computed(() => {
  const pages = [];
  const maxVisiblePages = 3;
  
  if (totalPages.value <= maxVisiblePages) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    if (page.value <= 2) {
      pages.push(1, 2, 3);
    } else if (page.value >= totalPages.value - 1) {
      pages.push(totalPages.value - 2, totalPages.value - 1, totalPages.value);
    } else {
      pages.push(page.value - 1, page.value, page.value + 1);
    }
  }
  
  return pages;
});

// Fetch video data
const fetchVideos = async () => {
  try {
    pending.value = true;
    await videoStore.getVideoData()
    videos.value = videoStore.videoData.data || [];
  } catch (error) {
    console.error('Error fetching videos:', error);
  } finally {
    pending.value = false;
  }
};

// Watch for search query changes
watch(searchQuery, () => {
  page.value = 1;
});

// Lifecycle hooks
onMounted(() => {
  fetchVideos();
  footerStore.getFooterData();
});
</script>