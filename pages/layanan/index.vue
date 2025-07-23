<template>
  <!-- Main layout container -->
  <div class="min-h-screen bg-slate-100" :class="isDarkMode ? 'dark:bg-slate-900' : ''">
    <!-- Header with blue gradient -->
    <div class="relative z-10 px-6 h-[320px] lg:h-[350px] text-white bg-gradient-to-r from-blue-600 to-blue-500 flex items-end pb-8">
      <div class="container mx-auto max-w-7xl">
        <div class="flex flex-col items-start space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div class="flex items-center space-x-4">
            <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm">
              <UIcon name="i-heroicons-server" class="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
                Layanan {{ footerData?.nama_opd || 'Dinas Komunikasi dan Informatika' }}
              </h1>
              <p class="mt-1 text-sm text-blue-100">
                Pilih dari {{ bannerStore.bannerData.data?.length || 0 }} layanan yang tersedia
              </p>
            </div>
          </div>
        </div>

        <!-- Search and filter section -->
        <div class="flex flex-col gap-3 mt-6 sm:flex-row">
          <UInput
            v-model="searchQuery"
            placeholder="Cari layanan..."
            :icon="'i-heroicons-magnifying-glass'"
            class="flex-grow text-white border-0 bg-white/10 backdrop-blur-sm placeholder:text-blue-100"
            size="lg"
          />          <USelect
            v-model="filterCategory"
            :options="[
              'Semua Kategori',
              'Digital',
              'Infrastruktur', 
              'Aplikasi',
            ]"
            placeholder="Kategori"
            class="w-full sm:w-48 text-white border-0 bg-white/10 backdrop-blur-sm"
            size="lg"
          />
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container relative z-20 px-4 mx-auto mt-8 max-w-7xl">      <!-- Category tabs -->
      <div class="sticky top-0 z-10 pb-2 mb-6 space-x-2 overflow-x-auto bg-gray-100 dark:bg-slate-900 scrollbar-hide">
        <button 
          v-for="category in ['Semua', 'Digital', 'Infrastruktur', 'Aplikasi']" 
          :key="category"
          @click="filterCategory = category === 'Semua' ? 'Semua Kategori' : category"
          class="px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full whitespace-nowrap"
          :class="[
            filterCategory === (category === 'Semua' ? 'Semua Kategori' : category) 
              ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/20' 
              : isDarkMode 
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                : 'bg-white text-slate-700 hover:bg-slate-100'
          ]"
        >
          {{ category }}
        </button>
      </div>

      <!-- Results count and view toggle -->
      <div class="flex items-center justify-between mb-4">
        <!-- Breadcrumb navigation -->
        <div class="py-2">
          <Breadcrumb 
            :items="[
              { text: 'Layanan', to: '' }
            ]"
            :loading="false"
          />
        </div>
        
        <div class="flex space-x-2">
          <UButton 
            :icon="viewMode === 'grid' ? 'i-heroicons-squares-2x2-solid' : 'i-heroicons-squares-2x2'" 
            color="blue" 
            variant="ghost" 
            class="rounded-md"
            @click="viewMode = 'grid'"
          />
          <UButton 
            :icon="viewMode === 'list' ? 'i-heroicons-bars-3-solid' : 'i-heroicons-bars-3'" 
            color="blue" 
            variant="ghost" 
            class="rounded-md"
            @click="viewMode = 'list'"
          />
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="filteredServices.length === 0" class="flex flex-col items-center justify-center py-12">
        <div class="flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full dark:bg-blue-900/30">
          <UIcon name="i-heroicons-magnifying-glass" class="w-8 h-8 text-blue-500" />
        </div>
        <h3 class="text-lg font-medium text-slate-700 dark:text-slate-300">Tidak ada layanan ditemukan</h3>
        <p class="mt-2 text-sm text-center text-slate-500 dark:text-slate-400">
          Coba ubah filter atau kata kunci pencarian
        </p>
        <UButton 
          color="blue" 
          variant="soft" 
          class="mt-4" 
          @click="resetFilters"
          icon="i-heroicons-arrow-path"
        >
          Reset Filter
        </UButton>
      </div>

      <!-- Grid view -->
      <div 
        v-else-if="viewMode === 'grid'"
        class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        <!-- Service cards with enhanced design -->
        <div
          v-for="(item, index) in filteredServices"
          :key="item.id || index"
          class="relative overflow-hidden transition-all duration-300 transform bg-white border border-slate-200 group rounded-xl hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 dark:bg-slate-800 dark:border-slate-700"
        >
          <!-- Card top section with image and gradient overlay -->
          <div class="relative h-40 overflow-hidden">
            <!-- Background image with hover effect -->
            <NuxtImg
              :src="item.image"
              alt="Service Image"
              class="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
            />

            <!-- Gradient overlay -->
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"
            ></div>            <!-- Category badge -->
            <div
              class="absolute px-2 py-1 text-xs font-medium text-white rounded-md top-3 left-3 bg-blue-600/90 backdrop-blur-sm"
            >
              {{ getServiceCategory(item, index) }}
            </div>
            
            <!-- Title on image -->
            <div class="absolute bottom-0 left-0 right-0 p-4">
              <h4 class="text-lg font-bold text-white line-clamp-1">
                {{ item.title }}
              </h4>
            </div>
          </div>

          <!-- Card content -->
          <div class="p-4">
            <!-- Description with line clamp -->
            <p
              class="mb-4 text-sm line-clamp-3"
              :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'"
            >
              {{ stripHtml(item.description) }}
            </p>
            <div class="flex items-center justify-between">
              <!-- Badge -->
              <span
                class="px-2 py-1 text-xs font-medium text-blue-600 rounded-full bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300"
              >
                {{
                  index % 3 === 0
                    ? "Populer"
                    : index % 3 === 1
                    ? "Baru"
                    : "Rekomendasi"
                }}
              </span>

              <!-- Action button -->
              <UButton
                color="blue"
                variant="soft"
                size="xs"
                :to="`/layanan/${item.id}`"
                trailing-icon="i-heroicons-arrow-right"
                class="transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white"
              >
                Detail
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <!-- List view -->
      <div v-else class="space-y-3">
        <div
          v-for="(item, index) in filteredServices"
          :key="item.id || index"
          class="flex overflow-hidden transition-all duration-300 transform bg-white border border-slate-200 group rounded-xl hover:shadow-md hover:shadow-blue-500/10 hover:-translate-y-1 dark:bg-slate-800 dark:border-slate-700"
        >
          <!-- Image thumbnail -->
          <div class="relative flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32">
            <NuxtImg
              :src="item.image"
              alt="Service Image"
              class="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
            />
            <div class="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
              <!-- Category badge -->
            <div
              class="absolute px-1.5 py-0.5 text-[10px] font-medium text-white rounded bottom-2 left-2 bg-blue-600/90 backdrop-blur-sm"
            >
              {{ getServiceCategory(item, index) }}
            </div>
          </div>
          
          <!-- Content -->
          <div class="flex flex-col justify-between flex-1 p-4">            <div>
              <div class="flex items-center justify-between">
                <h4
                  class="text-base font-semibold line-clamp-1"
                  :class="isDarkMode ? 'text-white' : 'text-slate-900'"
                >
                  {{ item.title }}
                </h4>
              </div>
              
              <p
                class="mt-1 text-sm line-clamp-2"
                :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'"
              >
                {{ stripHtml(item.description) }}
              </p>
            </div>
            
            <!-- Features in list view -->
            <div class="flex flex-wrap gap-2 mt-2">
              <span class="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 rounded-full bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300">
                <UIcon name="i-heroicons-check" class="w-3 h-3 mr-1" />
                Akses Cepat
              </span>
              <span class="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 rounded-full bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300">
                <UIcon name="i-heroicons-check" class="w-3 h-3 mr-1" />
                Dukungan 24/7
              </span>
            </div>
            
            <div class="flex items-center justify-between mt-3">
              <span
                class="px-2 py-1 text-xs font-medium text-blue-600 rounded-full bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300"
              >
                {{
                  index % 3 === 0
                    ? "Populer"
                    : index % 3 === 1
                    ? "Baru"
                    : "Rekomendasi"
                }}
              </span>
              
              <UButton
                color="blue"
                variant="soft"
                size="xs"
                :to="`/layanan/${item.id}`"
                trailing-icon="i-heroicons-arrow-right"
                class="transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white"
              >
                Detail
              </UButton>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer with pagination -->
      <div v-if="filteredServices.length > 0" class="flex items-center justify-between py-6 mt-6">
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Halaman {{ currentPage }} dari {{ totalPages }}
        </p>
        
        <div class="flex space-x-2">
          <UButton
            color="blue"
            variant="ghost"
            icon="i-heroicons-chevron-left"
            :disabled="currentPage === 1"
            @click="currentPage--"
          />
          
          <UButton
            v-for="page in paginationArray"
            :key="page"
            color="blue"
            :variant="currentPage === page ? 'solid' : 'ghost'"
            @click="currentPage = page"
          >
            {{ page }}
          </UButton>
          
          <UButton
            color="blue"
            variant="ghost"
            icon="i-heroicons-chevron-right"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useBannerStore } from "@/store/banner/banner.js";
import { useFooterStore } from '@/store/footer/footer.js';
import { useLayout } from "@/store/layouts/layouts.js";

const bannerStore = useBannerStore();
const footerStore = useFooterStore();
const layoutStore = useLayout();
const searchQuery = ref("");
const filterCategory = ref("Semua Kategori");
const viewMode = ref("grid"); // grid or list
const currentPage = ref(1);
const itemsPerPage = 6;

const isDarkMode = computed(() => layoutStore.theme === "dark");

// Function to get category for each service
const getServiceCategory = (item, index) => {
  // If item has a category field, use it
  if (item.category) {
    return item.category;
  }
  
  // If item has a kategori field, use it
  if (item.kategori && item.kategori !== 'banner') {
    return item.kategori;
  }
  
  // Fallback to deterministic category based on title/description content
  const content = (item.title + " " + (item.description || "")).toLowerCase();
  
  // More specific keyword matching for better categorization - prioritize specific matches
  if (content.includes('aplikasi') || content.includes('app') || content.includes('software') || content.includes('program') || content.includes('lapor') || content.includes('elapor') || content.includes('e-lapor')) {
    return 'Aplikasi';
  } else if (content.includes('infrastruktur') || content.includes('server') || content.includes('jaringan') || content.includes('network') || content.includes('ip') || content.includes('vpn')) {
    return 'Infrastruktur';
  } else if (content.includes('digital') || content.includes('sistem informasi') || content.includes('website') || content.includes('portal') || content.includes('e-service')) {
    return 'Digital';
  } else {
    // More consistent categorization - avoid round-robin, use content-based logic
    if (content.includes('layanan') || content.includes('service')) {
      return 'Aplikasi';
    } else if (content.includes('sistem') || content.includes('teknologi')) {
      return 'Digital';
    } else {
      return 'Infrastruktur';
    }
  }
};

// Add computed property to access footer data
const footerData = computed(() => {
  return footerStore.footerData?.data?.[0] || footerStore.footerData?.[0] || null;
});

const allFilteredServices = computed(() => {
  let services = bannerStore.bannerData.data || [];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    services = services.filter(
      (item) =>
        item.title?.toLowerCase().includes(query) ||
        stripHtml(item.description)?.toLowerCase().includes(query)
    );
  }

  // Apply category filter
  if (filterCategory.value && filterCategory.value !== "Semua Kategori") {
    services = services.filter((item, index) => {
      const originalIndex = bannerStore.bannerData.data?.indexOf(item) || index;
      const itemCategory = getServiceCategory(item, originalIndex);
      return itemCategory === filterCategory.value;
    });
  }

  return services;
});

// Paginated services
const filteredServices = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return allFilteredServices.value.slice(startIndex, endIndex);
});

// Pagination
const totalPages = computed(() => {
  return Math.ceil(allFilteredServices.value.length / itemsPerPage);
});

const paginationArray = computed(() => {
  const pages = [];
  const maxVisiblePages = 3;
  
  if (totalPages.value <= maxVisiblePages) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage.value <= 2) {
      pages.push(1, 2, 3);
    } else if (currentPage.value >= totalPages.value - 1) {
      pages.push(totalPages.value - 2, totalPages.value - 1, totalPages.value);
    } else {
      pages.push(currentPage.value - 1, currentPage.value, currentPage.value + 1);
    }
  }
  
  return pages;
});

// Strip HTML tags from description
const stripHtml = (html) => {
  if (!html) return "";
  return html.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 100) + "...";
};

// Reset filters
const resetFilters = () => {
  searchQuery.value = "";
  filterCategory.value = "Semua Kategori";
  currentPage.value = 1;
};

// Reset page when filters change
watch([searchQuery, filterCategory], () => {
  currentPage.value = 1;
});

// Fetch banner data on component mount
onMounted(() => {
  bannerStore.getBannerData();
  footerStore.getFooterData();
});
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

/* Card animations */
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

.grid > div {
  animation: fadeIn 0.5s ease-out forwards;
  animation-delay: calc(var(--index, 0) * 0.1s);
}

.grid > div:nth-child(1) { --index: 1; }
.grid > div:nth-child(2) { --index: 2; }
.grid > div:nth-child(3) { --index: 3; }
.grid > div:nth-child(4) { --index: 4; }
.grid > div:nth-child(5) { --index: 5; }
.grid > div:nth-child(6) { --index: 6; }

/* List animations */
.space-y-3 > div {
  animation: fadeIn 0.4s ease-out forwards;
  animation-delay: calc(var(--index, 0) * 0.08s);
}

.space-y-3 > div:nth-child(1) { --index: 1; }
.space-y-3 > div:nth-child(2) { --index: 2; }
.space-y-3 > div:nth-child(3) { --index: 3; }
.space-y-3 > div:nth-child(4) { --index: 4; }
.space-y-3 > div:nth-child(5) { --index: 5; }
.space-y-3 > div:nth-child(6) { --index: 6; }

/* Custom scrollbar for content area */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: v-bind('isDarkMode ? "#1e293b" : "#f1f5f9"');
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: v-bind('isDarkMode ? "#475569" : "#cbd5e1"');
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: v-bind('isDarkMode ? "#64748b" : "#94a3b8"');
}

/* Gradient animations */
.bg-gradient-to-r {
  background-size: 200% auto;
  transition: background-position 0.5s ease;
}

.bg-gradient-to-r:hover {
  background-position: right center;
}
</style>
