<template>
  <!-- Add z-index to ensure proper stacking -->
  <div class="min-h-screen bg-slate-100" :class="isDarkMode ? 'dark:bg-slate-900' : ''">
    <!-- Move header z-index up -->
    <div class="relative z-10 px-6 h-[320px] lg:h-[350px] text-white bg-gradient-to-r from-blue-600 to-blue-500 flex items-end pb-8">
      <div class="container mx-auto max-w-7xl">
        <div class="flex flex-col items-start space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div class="flex items-center space-x-4">
            <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm">
              <UIcon :name="getCategoryIcon(categorySlug)" class="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
                {{ getCategoryTitle(categorySlug) }}
              </h1>
              <p class="mt-1 text-sm text-blue-100">
                {{ getCategoryDescription(categorySlug) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Search section -->
        <div class="flex flex-col gap-3 mt-6 sm:flex-row">
          <UInput
            v-model="searchQuery"
            placeholder="Cari dokumen..."
            :icon="'i-heroicons-magnifying-glass'"
            class="flex-grow text-white border-0 bg-white/10 backdrop-blur-sm placeholder:text-blue-100"
            size="lg"
          />
        </div>
      </div>
    </div>

    <!-- Main Content - Add positive margin-top and z-index -->
    <div class="container relative z-20 px-4 mx-auto mt-8 max-w-7xl">
      <!-- View toggle and results count -->
      <div class="flex flex-col justify-between mb-6 space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <!-- Breadcrumb navigation -->
        <div class="container px-2 mx-auto max-w-7xl pt-2 pb-6">
          <div class="py-2">
            <Breadcrumb 
              :items="[
                { text: getCategoryTitle(categorySlug), to: '' }
              ]"
              :loading="isLoading"
            />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <!-- Sort dropdown -->
          <USelect
            v-model="sortBy"
            :options="[
              { label: 'Terbaru', value: 'newest' },
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
            <div class="h-24 bg-slate-200 dark:bg-slate-700 rounded-lg mb-4"></div>
            <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="filteredData.length === 0" class="flex flex-col items-center justify-center py-12">
        <div class="flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full dark:bg-blue-900/30">
          <UIcon name="i-heroicons-magnifying-glass" class="w-8 h-8 text-blue-500" />
        </div>
        <h3 class="text-lg font-medium text-slate-700 dark:text-slate-300">Tidak ada dokumen ditemukan</h3>
        <p class="mt-2 text-sm text-center text-slate-500 dark:text-slate-400">
          Coba ubah kata kunci pencarian
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
      <div v-else-if="viewMode === 'grid'" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="(item, index) in paginatedData"
          :key="item.id || index"
          :to="`/detail/${item.id}?category=${categorySlug}`"
          class="group h-full"
        >
          <div class="flex flex-col h-full relative overflow-hidden transition-all duration-300 transform bg-white border rounded-xl hover:shadow-lg hover:-translate-y-1 dark:bg-slate-800 dark:border-slate-700">
            <!-- Document Icon -->
            <div class="p-3 flex justify-center items-center">
              <img :src="item.image" alt="Item Image" class="w-full h-56 object-cover rounded-lg" />
            </div>

            <!-- Content section -->
            <div class="flex flex-col flex-1 p-4">
              <div class="flex-1">
                <h3 class="mb-2 text-lg font-semibold tracking-tight line-clamp-2 group-hover:text-blue-600"
                    :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                  {{ item.title }}
                </h3>
                <p class="mb-4 text-sm line-clamp-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                  {{ stripHtml(item.excert) }}
                </p>
              </div>
              
              <!-- Footer -->
              <div class="flex items-center justify-between pt-4 mt-auto border-t border-slate-100 dark:border-slate-700">
                <div class="flex items-center text-xs text-slate-500 dark:text-slate-400">
                  <UIcon name="i-heroicons-calendar" class="w-4 h-4 mr-1 text-blue-500" />
                  <span>{{ formatDate(item.created_at) }}</span>
                </div>
                <div class="flex items-center">
                  <UButton
                    size="xs"
                    color="blue"
                    variant="ghost"
                    trailing-icon="i-heroicons-chevron-right"
                    class="text-xs"
                  >
                    selengkapnya
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- List view -->
      <div v-else class="space-y-4">
        <NuxtLink
          v-for="(item, index) in paginatedData"
          :key="item.id || index"
          :to="getDetailUrl(item)"
          class="block group"
        >
          <div class="flex h-48 overflow-hidden transition-all duration-300 transform bg-white border rounded-xl hover:shadow-lg hover:-translate-y-1 dark:bg-slate-800 dark:border-slate-700">
            <!-- Document Icon -->
            <div class="relative flex-shrink-0 w-24 h-auto flex items-center justify-center bg-blue-50 dark:bg-blue-900/20">
              <UIcon :name="getCategoryIcon(categorySlug)" class="w-12 h-12 text-blue-500" />
            </div>

            <!-- Content -->
            <div class="flex flex-col justify-between flex-1 p-4">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <span class="flex items-center text-xs text-slate-500 dark:text-slate-400">
                    <UIcon name="i-heroicons-calendar" class="w-4 h-4 mr-1" />
                    {{ formatDate(item.created_at) }}
                  </span>
                </div>

                <h3 class="mb-2 text-xl font-semibold tracking-tight line-clamp-2 group-hover:text-blue-600"
                    :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                  {{ item.title }}
                </h3>
                <p class="mb-4 text-sm line-clamp-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                  {{ stripHtml(item.excert) }}
                </p>
              </div>

              <div class="flex items-center justify-between mt-auto">
                <span class="text-sm font-medium text-blue-600 group-hover:text-blue-500">
                  Baca selengkapnya
                  <UIcon name="i-heroicons-arrow-right" class="inline w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </span>
                <UButton
                  size="xs"
                  color="blue"
                  variant="soft"
                  icon="i-heroicons-arrow-down-tray"
                  class="text-xs"
                >
                  Unduh
                </UButton>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Pagination -->
      <div v-if="!isLoading && filteredData.length > 0" class="flex items-center justify-between py-6 mt-6">
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
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useLayout } from '@/store/layouts/layouts.js'
import { useBeritaStore } from '@/store/berita/berita'
import { useFooterStore } from '@/store/footer/footer.js';
import { ar } from 'date-fns/locale';

const route = useRoute()
const layoutStore = useLayout()
const beritaStore = useBeritaStore()
const footerStore = useFooterStore()

// Add computed property to access footer data
const footerData = computed(() => {
  console.log('Footer store data:', footerStore.footerData);
  return footerStore.footerData?.data?.[0] || footerStore.footerData?.[0] || null;
});

// Add a watcher to debug footer data changes
watch(() => footerStore.footerData, (newData) => {
  console.log('Footer data changed:', newData);
}, { deep: true });

// Get category slug from route params
const categorySlug = computed(() => route.params.slug)

// State
const searchQuery = ref('')
const viewMode = ref('grid')
const currentPage = ref(1)
const sortBy = ref('newest')
const isLoading = ref(false)
const itemsPerPage = 9

const isDarkMode = computed(() => layoutStore.theme === 'dark')

// Add loading ref for footer data
const footerLoading = ref(true)

// Get category data based on slug
const categoryData = computed(() => {
  switch (categorySlug.value) {
    case 'renstra':
      return beritaStore.renstraData.data || []
    case 'informasi':
      return beritaStore.informasiData.data || []
    case 'kegiatan':
      return beritaStore.kegiatanData.data || []
    case 'aset':
      return beritaStore.asetData.data || []
    case 'general':
      return beritaStore.generalData.data || []
    case 'artikel':
      return beritaStore.artikelData.data || []
    case 'berita':
      return beritaStore.beritaData.data || []
    default:
      return []
  }
})

// Category configuration
const getCategoryTitle = (slug) => {
  const titles = {
    renstra: 'Rencana Strategis',
    informasi: 'Informasi',
    kegiatan: 'Kegiatan',
    aset: 'Aset',
    general: 'General',
    artikel: 'Artikel',
    berita: 'Berita'
  }
  return titles[slug] || 'Kategori'
}

const getCategoryDescription = (slug) => {
  if (footerLoading.value) {
    return 'Loading...'
  }
  
  const opdName = footerData.value?.nama_opd || 'Dinas Komunikasi dan Informatika'
  const descriptions = {
    renstra: `Dokumen Rencana Strategis ${opdName}`,
    informasi: `Dokumen dan informasi penting dari ${opdName}`,
    kegiatan: `Dokumentasi kegiatan dan acara ${opdName}`,
    aset: `Informasi aset dan inventaris ${opdName}`,
    general: `Dokumen umum ${opdName}`,
    artikel: `Artikel dan tulisan dari ${opdName}`,
    berita: `Berita terbaru dari ${opdName}`
  }
  return descriptions[slug] || 'Dokumen kategori'
}

const getCategoryIcon = (slug) => {
  const icons = {
    renstra: 'i-heroicons-document-text',
    informasi: 'i-heroicons-information-circle',
    kegiatan: 'i-heroicons-calendar-days',
    aset: 'i-heroicons-building-office',
    general: 'i-heroicons-folder'
  }
  return icons[slug] || 'i-heroicons-document-text'
}

// Filter content based on search
const filteredData = computed(() => {
  let data = categoryData.value
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    data = data.filter(
      item =>
        item.title?.toLowerCase().includes(query) ||
        stripHtml(item.excert)?.toLowerCase().includes(query)
    )
  }

  // Apply sorting
  data = [...data].sort((a, b) => {
    switch (sortBy.value) {
      case 'newest':
        return new Date(b.created_at) - new Date(a.created_at)
      case 'alpha':
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  return data
})

// Paginated content
const paginatedData = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return filteredData.value.slice(startIndex, endIndex)
})

// Pagination
const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / itemsPerPage)
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
  sortBy.value = 'newest'
  currentPage.value = 1
}

const getDetailUrl = (item) => {
  return `/detail/${item.id}`
}

// Fetch category data based on slug
const fetchCategoryData = async () => {
  isLoading.value = true
  try {
    await beritaStore.getCategoryData(categorySlug.value)
    console.log(`Fetched ${categorySlug.value} data:`, categoryData.value)
  } catch (err) {
    console.error(`Error fetching ${categorySlug.value} data:`, err)
  } finally {
    isLoading.value = false
  }
}

// Watchers
watch([searchQuery, sortBy], () => {
  currentPage.value = 1
})

// Watch for route changes
watch(() => route.params.slug, () => {
  fetchCategoryData()
}, { immediate: true })

// Modify onMounted to handle loading state
onMounted(async () => {
    footerLoading.value = true
    try {
        await footerStore.getFooterData()
    } finally {
        footerLoading.value = false
    }
    fetchCategoryData()
})

// SEO Meta
useSeoMeta({
  title: () => getCategoryTitle(categorySlug.value),
  description: () => getCategoryDescription(categorySlug.value),
  ogTitle: () => getCategoryTitle(categorySlug.value),
  ogDescription: () => getCategoryDescription(categorySlug.value),
})
</script>

<style scoped>
/* Gradient animations */
.bg-gradient-to-r {
  background-size: 200% auto;
  transition: background-position 0.5s ease;
}

.bg-gradient-to-r:hover {
  background-position: right center;
}
</style>
