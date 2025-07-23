<template>
  <div class="min-h-screen bg-slate-100 dark:bg-slate-900">
    <!-- Instead of fixed background, add a colored header only for this page -->
    <div class="absolute top-0 left-0 right-0 w-full h-[62px] lg:h-[120px] z-10 bg-gradient-to-r from-blue-600 to-blue-500 dark:from-transparent dark:to-transparent"></div>
    <!-- Hero Section -->
    <section class="relative py-16 pt-32 bg-white/80 dark:bg-slate-800/80">
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute w-64 h-64 rounded-full bg-blue-500/5 dark:bg-blue-400/5 -top-32 -right-32 blur-3xl"></div>
        <div class="absolute w-64 h-64 rounded-full bg-blue-500/5 dark:bg-blue-400/5 -bottom-32 -left-32 blur-3xl"></div>
      </div>

      <div class="container relative px-4 pt-8 mx-auto max-w-7xl">
        <div class="text-center">
          <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Galeri Foto
          </h1>
          <div class="flex items-center justify-center mt-4">
            <div class="w-12 h-1 rounded-full bg-gradient-to-r from-blue-600 to-blue-400"></div>
            <div class="w-2 h-2 mx-2 bg-blue-600 rounded-full"></div>
            <div class="w-12 h-1 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
          </div>
          <p class="max-w-2xl mx-auto mt-6 text-lg text-gray-600 dark:text-slate-400">
            Dokumentasi kegiatan {{ footerData?.nama_opd || 'Dinas Komunikasi dan Informatika' }} dalam bentuk foto
          </p>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="py-12">
      <div class="container px-4 mx-auto max-w-7xl">
        <!-- Search and Breadcrumb Bar -->
        <div class="flex justify-between items-center mb-8">
          <Breadcrumb 
            :items="[

              { text: 'Foto', to: '/foto' }
            ]"
            :loading="false"
          />
          <UInput
            v-model="searchQuery"
            icon="i-heroicons-magnifying-glass-20-solid"
            color="gray"
            variant="outline"
            placeholder="Cari foto..."
            class="w-32 sm:w-auto max-w-sm dark:bg-slate-800 dark:border-slate-700"
          />
        </div>

        <!-- Loading State -->
        <div v-if="pending" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <UCard v-for="i in 6" :key="i" class="h-[300px] dark:bg-slate-800">
            <template #header>
              <div class="h-48 bg-gray-200 dark:bg-slate-700 rounded-t-lg animate-pulse"></div>
            </template>
            <div class="space-y-2 animate-pulse">
              <div class="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
              <div class="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
            </div>
          </UCard>
        </div>

        <!-- Content Grid -->
        <div v-else-if="photos.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="photo in filteredPhotos"
            :key="photo.id"
            :to="`/foto/detail/${photo.id}`"
            class="group block"
          >
            <div class="relative overflow-hidden aspect-w-4 rounded-2xl shadow-lg group">
              <img
                :src="photo.image"
                :alt="photo.title"
                class="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              />
              <div class="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-blue-900/80 via-blue-800/50 to-transparent group-hover:opacity-100 rounded-2xl"></div>
              <div class="absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                <span class="inline-block px-2 py-1 mb-2 text-xs font-medium text-white bg-blue-600 rounded">
                  {{ formatDate(photo.created_at) }}
                </span>
                <h3 class="text-base font-bold text-white line-clamp-2">
                  {{ photo.title }}
                </h3>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <UAlert
            icon="i-heroicons-photo"
            title="Tidak ada foto"
            description="Belum ada foto yang ditampilkan"
            color="gray"
            class="dark:bg-slate-800 dark:text-slate-300"
          />
        </div>

        <!-- Pagination -->
        <div v-if="photos.length" class="flex items-center justify-between py-6 mt-6">
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
import { ref, onMounted, watch, computed } from 'vue';
import { useFotoStore } from '~/store/foto/foto';
import { useFooterStore } from '@/store/footer/footer.js';
import Breadcrumb from '@/components/general/breadcrumb/index.vue';

const config = useRuntimeConfig();
const photos = ref([]);
const pending = ref(true);
const searchQuery = ref('');
const page = ref(1);
const itemsPerPage = 12;

// Store
const fotoStore = useFotoStore();
const footerStore = useFooterStore();

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

// Computed properties
const filteredPhotos = computed(() => {
  const filtered = photos.value.filter(photo =>
    photo.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
  const start = (page.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filtered.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(photos.value.length / itemsPerPage);
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

// Fetch data
const fetchPhotos = async () => {
  try {
    await fotoStore.getFotoData()
    photos.value = fotoStore.fotoData.data || []
  } catch (error) {
    console.error('Error fetching photos:', error);
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
  fetchPhotos();
  footerStore.getFooterData();
});
</script>

<style scoped>
.aspect-w-4 {
  position: relative;
  padding-bottom: 75%; /* 4:3 Aspect Ratio */
}

.aspect-w-4 > * {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}
</style>
