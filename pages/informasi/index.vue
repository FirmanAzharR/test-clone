<template>
  <!-- Add z-index to ensure proper stacking -->
  <div class="min-h-screen bg-slate-100" :class="isDarkMode ? 'dark:bg-slate-900' : ''">
    <!-- Move header z-index up -->    
     <div class="relative z-10 px-6 h-[320px] lg:h-[350px] text-white bg-gradient-to-r from-blue-600 to-blue-500 flex items-end pb-8">
      <div class="container mx-auto max-w-7xl">
        <div class="flex flex-col items-start space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div class="flex items-center space-x-4">
            <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm">
              <UIcon name="i-heroicons-newspaper" class="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
                Berita dan Informasi
              </h1>
              <p class="mt-1 text-sm text-blue-100">
                Portal berita dan informasi terkini dari {{ footerData?.nama_opd || 'Dinas Komunikasi dan Informatika' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Search and filter section -->
        <div class="flex flex-col gap-3 mt-6 sm:flex-row">
          <UInput
            v-model="searchQuery"
            placeholder="Cari berita..."
            :icon="'i-heroicons-magnifying-glass'"
            class="flex-grow text-white border-0 bg-white/10 backdrop-blur-sm placeholder:text-blue-100"
            size="lg"
          />
          <USelect
            v-model="filterCategory"
            :options="[

              'Semua Kategori',
              'Berita',
              'Article'
            ]"
            placeholder="Kategori"
            class="w-full sm:w-48 text-white border-0 bg-white/10 backdrop-blur-sm"
            size="lg"
          />
        </div>
      </div>
    </div>

    <!-- Main Content - Add positive margin-top and z-index -->
    <div class="container relative z-20 px-4 mx-auto mt-8 max-w-7xl">
      <!-- Category tabs - Add bg-color to ensure visibility -->
      <div class="sticky top-0 z-10 pb-2 mb-6 space-x-2 overflow-x-auto bg-gray-100 dark:bg-slate-900 scrollbar-hide">
        <button 
          v-for="category in ['Semua', 'Berita', 'Article']" 
          :key="category"
          @click="filterCategory = category === 'Semua' ? 'Semua Kategori' : category"
          class="px-4 py-2 text-sm font-medium transition-all duration-200 bg-white rounded-full shadow-sm whitespace-nowrap"
          :class="[

            filterCategory === (category === 'Semua' ? 'Semua Kategori' : category) 
              ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/20' 
              : isDarkMode 
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                : 'bg-white text-slate-700 hover:bg-slate-50'
          ]"
        >
          {{ category }}
        </button>
      </div>

      <!-- View toggle and results count -->
      <div class="flex flex-col justify-between mb-6 space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <!-- Breadcrumb navigation -->
        <div class="container px-2 mx-auto max-w-7xl pt-2 pb-6">
          <div class="py-2">
            <Breadcrumb 
              :items="[
                { text: breadcrumbTitle, to: '' }
              ]"
              :loading="isDetailBeritaLoading"
            />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <!-- Sort dropdown -->
          <USelect
            v-model="sortBy"
            :options="[

              { label: 'Terbaru', value: 'newest' },
              { label: 'Terpopuler', value: 'popular' },
              { label: 'A-Z', value: 'alpha' }
            ]"
            size="sm"
            class="w-40"
          />
          <!-- View toggle -->
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
      </div>

      <!-- Content loading state -->
      <div v-if="isLoading" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="i in 6" :key="i" class="bg-white rounded-xl shadow-sm p-4 dark:bg-slate-800">
          <div class="animate-pulse">
            <div class="h-48 bg-slate-200 dark:bg-slate-700 rounded-lg mb-4"></div>
            <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="filteredContent.length === 0" class="flex flex-col items-center justify-center py-12">
        <div class="flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full dark:bg-blue-900/30">
          <UIcon name="i-heroicons-magnifying-glass" class="w-8 h-8 text-blue-500" />
        </div>
        <h3 class="text-lg font-medium text-slate-700 dark:text-slate-300">Tidak ada artikel ditemukan</h3>
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
      <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="(item, index) in paginatedContent"
          :key="item.id || index"
          :to="getDetailUrl(item)"
          class="group h-full"
        >
          <div class="flex flex-col h-full relative overflow-hidden transition-all duration-300 transform bg-white border rounded-xl hover:shadow-lg hover:-translate-y-1 dark:bg-slate-800 dark:border-slate-700">
            <!-- Image section -->
            <div class="relative h-[220px] overflow-hidden flex-shrink-0">
              <div v-if="!item.image || imageErrors[index]" class="flex flex-col items-center justify-center w-full h-full bg-slate-100 dark:bg-slate-700">
                <UIcon name="i-heroicons-photo" class="w-12 h-12 text-slate-400 dark:text-slate-500" />
                <span class="mt-2 text-sm text-slate-500 dark:text-slate-400">Gambar tidak tersedia</span>
              </div>
              <NuxtImg
                v-else
                :src="item.image"
                alt="Article Image"
                class="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                @error="handleImageError(index)"
                @load="handleImageLoad(index)"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
              
              <!-- Category badge -->
              <div class="absolute px-2 py-1 text-xs font-medium text-white rounded-md top-3 left-3 bg-blue-600/90 backdrop-blur-sm">
                {{ item.category || (item.type === 'article' ? 'Article' : 'Berita') }}
              </div>
            </div>

            <!-- Content section -->
            <div class="flex flex-col flex-1 p-4">
              <div class="flex-1">
                <h3 class="mb-2 text-lg font-semibold tracking-tight line-clamp-2 group-hover:text-blue-600"
                    :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                  {{ item.title }}
                </h3>
                <p class="mb-4 text-sm line-clamp-3" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                  {{ stripHtml(item.description || item.excert) }}
                </p>
              </div>
              
              <!-- Footer -->
              <div class="pt-4 mt-auto border-t border-slate-100 dark:border-slate-700">
                <div class="flex items-center justify-between">
                  <div class="flex items-center text-xs text-slate-500 dark:text-slate-400">
                    <UIcon name="i-heroicons-calendar" class="w-4 h-4 mr-1 text-blue-500" />
                    <span>{{ formatDate(item.created_at) }}</span>
                  </div>
                  <div class="flex items-center text-xs text-slate-500 dark:text-slate-400">
                    <UIcon name="i-heroicons-eye" class="w-4 h-4 mr-1 text-blue-500" />
                    <span>{{ item.visitor || 0 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- List view -->
      <div v-else class="space-y-4">
        <NuxtLink
          v-for="(item, index) in paginatedContent"
          :key="item.id || index"
          :to="getDetailUrl(item)"
          class="block group"
        >
          <div class="flex min-h-[220px] overflow-hidden transition-all duration-300 transform bg-white border rounded-xl hover:shadow-lg hover:-translate-y-1 dark:bg-slate-800 dark:border-slate-700">
            <!-- Thumbnail -->
            <div class="relative flex-shrink-0 w-[280px]">
              <div v-if="!item.image || imageErrors[index]" class="flex flex-col items-center justify-center w-full h-full bg-slate-100 dark:bg-slate-700">
                <UIcon name="i-heroicons-photo" class="w-8 h-8 text-slate-400 dark:text-slate-500" />
              </div>
              <NuxtImg
                v-else
                :src="item.image"
                alt="Article Image"
                class="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                @error="handleImageError(index)"
                @load="handleImageLoad(index)"
              />
              <div class="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
            </div>

            <!-- Content -->
            <div class="flex flex-col justify-between flex-1 p-6">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-3">
                  <span class="px-2 py-1 text-xs font-medium text-blue-600 rounded-full bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300">
                    {{ item.category || (item.type === 'article' ? 'Article' : 'Berita') }}
                  </span>
                  <span class="flex items-center text-xs text-slate-500 dark:text-slate-400">
                    <UIcon name="i-heroicons-calendar" class="w-4 h-4 mr-1" />
                    {{ formatDate(item.created_at) }}
                  </span>
                </div>

                <h3 class="mb-3 text-xl font-semibold tracking-tight line-clamp-2 group-hover:text-blue-600"
                    :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                  {{ item.title }}
                </h3>
                <p class="text-sm line-clamp-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                  {{ stripHtml(item.description || item.excert) }}
                </p>
              </div>

              <div class="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 dark:border-slate-700">
                <div class="flex items-center text-sm text-slate-500 dark:text-slate-400">
                  <UIcon name="i-heroicons-eye" class="w-4 h-4 mr-1" />
                  <span>{{ item.visitor || 0 }} views</span>
                </div>
                <span class="text-sm font-medium text-blue-600 group-hover:text-blue-500">
                  Baca selengkapnya
                  <UIcon name="i-heroicons-arrow-right" class="inline w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Pagination -->
      <div v-if="!isLoading && filteredContent.length > 0" class="flex items-center justify-between py-6 mt-6">
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
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useBeritaStore } from '@/store/berita/berita.js'
import { useFooterStore } from '@/store/footer/footer.js';
import { useLayout } from '@/store/layouts/layouts.js'
import { useRoute } from 'vue-router'
import { useRuntimeConfig } from '#app'

const route = useRoute()
const beritaStore = useBeritaStore()
const footerStore = useFooterStore();
const layoutStore = useLayout()
const config = useRuntimeConfig()

// Add computed property to access footer data
const footerData = computed(() => {
  return footerStore.footerData?.data?.[0] || footerStore.footerData?.[0] || null;
});

// State
const searchQuery = ref('')
const filterCategory = ref('Semua Kategori')
const viewMode = ref('grid')
const currentPage = ref(1)
const sortBy = ref('newest')
const isLoading = ref(false)
const articles = ref([])
const imageLoaded = ref({})
const imageErrors = ref({})
const itemsPerPage = 9
const totalItems = ref(0)
const apiPage = ref(1)
const isLoadingMore = ref(false)
const allBeritaItems = ref([])
const allArticleItems = ref([])

// Check if the user was redirected from /artikel or /berita or home
const checkRedirectSource = () => {
  if (process.client) {
    const fromArtikel = sessionStorage.getItem('fromArtikel')
    const fromBerita = sessionStorage.getItem('fromBerita')
    const fromHome = sessionStorage.getItem('fromHome')
    
    if (fromArtikel === 'true') {
      filterCategory.value = 'Article'
      sessionStorage.removeItem('fromArtikel')
      localStorage.setItem('lastSelectedCategory', 'Article')
    } else if (fromBerita === 'true') {
      filterCategory.value = 'Berita'
      sessionStorage.removeItem('fromBerita')
      localStorage.setItem('lastSelectedCategory', 'Berita')
    } else if (fromHome === 'true') {
      filterCategory.value = 'Semua Kategori'
      sessionStorage.removeItem('fromHome')
      localStorage.removeItem('lastSelectedCategory')
    }
  }
}

// Handle route changes with popstate (browser back/forward)
const handlePopState = () => {
  if (process.client) {
    // When navigating back, reset to default category
    filterCategory.value = 'Semua Kategori'
    localStorage.removeItem('lastSelectedCategory')
  }
}

// Add popstate event listener
onMounted(() => {
  if (process.client) {
    footerStore.getFooterData();
    window.addEventListener('popstate', handlePopState)
    
    // Initial category check
    const lastCategory = localStorage.getItem('lastSelectedCategory')
    filterCategory.value = lastCategory || 'Semua Kategori'
  }
})

// Clean up event listener
onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('popstate', handlePopState)
  }
})

// Rest of existing code...
const isDarkMode = computed(() => layoutStore.theme === 'dark')

// Computed properties for merged content (berita + artikel)
const allContent = computed(() => {
  // Combine news and articles from all fetched pages
  const news = allBeritaItems.value || []
  const articlesData = allArticleItems.value || []

  // Add type field to distinguish sources
  const markedNews = news.map(item => ({ ...item, type: 'news' }))
  const markedArticles = articlesData.map(item => ({ ...item, type: 'article' }))
  
  return [...markedNews, ...markedArticles]
})

// Filter content based on search and category
const filteredContent = computed(() => {
  let content = allContent.value

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    content = content.filter(
      item =>
        item.title?.toLowerCase().includes(query) ||
        stripHtml(item.description || item.excert)?.toLowerCase().includes(query)
    )
  }

  // Apply category filter
  if (filterCategory.value === 'Berita') {
    content = content.filter(item => item.type === 'news')
  } else if (filterCategory.value === 'Article') {
    content = content.filter(item => item.type === 'article')
  }

  // Apply sorting
  content = [...content].sort((a, b) => {
    switch (sortBy.value) {
      case 'newest':
        return new Date(b.created_at) - new Date(a.created_at)
      case 'popular':
        return (b.visitor || 0) - (a.visitor || 0)
      case 'alpha':
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  return content
})

// Paginated content - client-side pagination after filtering
const paginatedContent = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return filteredContent.value.slice(startIndex, endIndex)
})

// Pagination
const totalPages = computed(() => {
  return Math.ceil(filteredContent.value.length / itemsPerPage)
})

const paginationArray = computed(() => {
  const pages = []
  const maxVisiblePages = 3
  
  if (totalPages.value <= maxVisiblePages) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    if (currentPage.value <= 2) {
      pages.push(1, 2, 3)
    } else if (currentPage.value >= totalPages.value - 1) {
      pages.push(totalPages.value - 2, totalPages.value - 1, totalPages.value)
    } else {
      pages.push(currentPage.value - 1, currentPage.value, currentPage.value + 1)
    }
  }
  
  return pages
})

// Computed property for breadcrumb title
const breadcrumbTitle = computed(() => {
  if (filterCategory.value === 'Article') return 'Article'
  if (filterCategory.value === 'Berita') return 'Berita'
  return 'Semua Kategori'
})

// Methods
const stripHtml = (html) => {
  if (!html) return ''
  return html.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 120) + '...'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const resetFilters = () => {
  searchQuery.value = ''
  filterCategory.value = 'Semua Kategori'
  sortBy.value = 'newest'
  currentPage.value = 1
  resetImageStates()
}

const getDetailUrl = (item) => {
  if (item.type === 'article') {
    return `/artikel/detail/${item.slug}`
  } else {
    return `/berita/detail/${item.slug}`
  }
}

const handleImageLoad = (index) => {
  imageLoaded.value[index] = true
  imageErrors.value[index] = false
}

const handleImageError = (index) => {
  imageLoaded.value[index] = false
  imageErrors.value[index] = true
}

const resetImageStates = () => {
  imageLoaded.value = {}
  imageErrors.value = {}
}

// Fetch Articles data
const fetchArticles = async () => {
  try {
    allArticleItems.value = [];
    apiPage.value = 1;
    
    // First fetch to get initial data and total count
    beritaStore.page = 1; // Reset to page 1
    await beritaStore.getArtikelData();
    
    const initialArticles = beritaStore.artikelData.data || [];
    const totalArticles = beritaStore.artikelData.total || 0;
    
    // Add first page results to our collection
    allArticleItems.value = [...initialArticles];
    
    // Calculate how many more pages we need to fetch
    const totalPages = Math.ceil(totalArticles / beritaStore.recordsPerPage);
    
    // Fetch remaining pages one at a time to avoid race conditions
    for (let page = 2; page <= totalPages; page++) {
      await fetchArticlePage(page);
    }
    
    return allArticleItems.value;
  } catch (err) {
    console.error('Error fetching articles:', err);
    return [];
  }
};

const fetchArticlePage = async (page) => {
  try {
    beritaStore.page = page;
    await beritaStore.getArtikelData();
    const pageArticles = beritaStore.artikelData.data || [];
    if (pageArticles && pageArticles.length) {
      allArticleItems.value = [...allArticleItems.value, ...pageArticles];
    }
  } catch (err) {
    console.error(`Error fetching articles page ${page}:`, err);
  }
};

const fetchBerita = async () => {
  try {
    allBeritaItems.value = [];
    apiPage.value = 1;
    
    // First fetch to get initial data and total count
    beritaStore.page = 1; // Reset to page 1
    await beritaStore.getBeritaData();
    
    const initialBerita = beritaStore.beritaData.data || [];
    const totalBerita = beritaStore.beritaData.total || 0;
    
    // Add first page results to our collection
    allBeritaItems.value = [...initialBerita];
    
    // Calculate how many more pages we need to fetch
    const totalPages = Math.ceil(totalBerita / beritaStore.recordsPerPage);
    
    // Fetch remaining pages one at a time to avoid race conditions
    for (let page = 2; page <= totalPages; page++) {
      await fetchBeritaPage(page);
    }
    
    return allBeritaItems.value;
  } catch (err) {
    console.error('Error fetching berita:', err);
    return [];
  }
};

const fetchBeritaPage = async (page) => {
  try {
    beritaStore.page = page;
    await beritaStore.getBeritaData();
    const pageBerita = beritaStore.beritaData.data || [];
    if (pageBerita && pageBerita.length) {
      allBeritaItems.value = [...allBeritaItems.value, ...pageBerita];
    }
  } catch (err) {
    console.error(`Error fetching berita page ${page}:`, err);
  }
};

// Watchers
watch([searchQuery, filterCategory, sortBy], () => {
  currentPage.value = 1
  resetImageStates()
  
  // Save the selected category to localStorage when it changes
  if (process.client && filterCategory.value) {
    localStorage.setItem('lastSelectedCategory', filterCategory.value)
  }
})

watch([currentPage], () => {
  resetImageStates()
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

// Watchers for debugging
watch([filteredContent, currentPage], ([newFilteredContent, newPage]) => {
  console.log(`Filtered items: ${newFilteredContent.length}, Current page: ${newPage}/${totalPages.value}`);
  console.log(`Items per page: ${itemsPerPage}, Showing items ${(newPage-1)*itemsPerPage+1} to ${Math.min(newPage*itemsPerPage, newFilteredContent.length)}`);
});

// Fetch data on mount
onMounted(async () => {
  isLoading.value = true;
  try {
    // Check if user was redirected from /artikel or /berita
    checkRedirectSource();
    
    // Reset store pagination state
    beritaStore.page = 1;
    
    // Set records per page to a higher number to get more data at once
    const originalRecordsPerPage = beritaStore.recordsPerPage;
    beritaStore.recordsPerPage = 100; // Temporarily increase to load more data at once
    
    // Fetch both data sources sequentially to avoid race conditions
    await fetchBerita();
    await fetchArticles();
    
    // Restore original setting
    beritaStore.recordsPerPage = originalRecordsPerPage;
    beritaStore.page = 1;
    
    // Log combined data for debugging
    console.log(`Data loaded successfully: ${allBeritaItems.value.length} news items and ${allArticleItems.value.length} articles`);
    
  } catch (error) {
    console.error('Error loading content:', error);
  } finally {
    isLoading.value = false;
  }
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

/* Gradient animations */
.bg-gradient-to-r {
  background-size: 200% auto;
  transition: background-position 0.5s ease;
}

.bg-gradient-to-r:hover {
  background-position: right center;
}

/* Add styles for sticky category tabs */
.sticky {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
</style>