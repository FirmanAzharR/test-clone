<template>
<div class="min-h-screen bg-slate-100" :class="isDarkMode ? 'dark:bg-slate-900' : ''" :key="`tag-${tagName}-${currentPage}`">
  <!-- Header Section -->
  <div class="relative z-10 px-6 h-[320px] lg:h-[350px] text-white bg-gradient-to-r from-blue-600 to-blue-500 flex items-end pb-8">
    <div class="container mx-auto max-w-7xl">
      <div class="flex flex-col items-start space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div class="flex items-center space-x-4">
          <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm">
            <UIcon name="i-heroicons-hashtag" class="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
              Tag: {{ tagName }}
            </h1>
            <p class="mt-1 text-sm text-blue-100">
              {{ taggedArticles.length }} artikel dengan tag "{{ tagName }}"
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="container relative z-20 px-4 mx-auto mt-8 max-w-7xl">
    <!-- Breadcrumb navigation -->
    <div class="container px-2 mx-auto max-w-7xl pt-2 pb-6">
      <div class="py-2">
        <Breadcrumb 
          :items="[
            { text: `Tag: ${tagName}`, to: '' }
          ]"
          :loading="isLoading"
        />
      </div>
    </div>


    <!-- Loading state -->
    <div v-if="isLoading" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="i in 6" :key="i" class="bg-white rounded-xl shadow-sm p-6 dark:bg-slate-800">
        <div class="animate-pulse">
          <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
          <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2"></div>
          <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
        </div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="flex flex-col items-center justify-center py-12">
      <div class="flex items-center justify-center w-16 h-16 mb-4 bg-red-100 rounded-full dark:bg-red-900/30">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-8 h-8 text-red-500" />
      </div>
      <h3 class="text-lg font-medium text-slate-700 dark:text-slate-300">Terjadi Kesalahan</h3>
      <p class="mt-2 text-sm text-center text-slate-500 dark:text-slate-400">
        {{ error }}
      </p>
      <UButton 
        color="blue" 
        variant="soft" 
        class="mt-4" 
        @click="refreshData"
        icon="i-heroicons-arrow-path"
      >
        Coba Lagi
      </UButton>
    </div>


    <!-- Empty state -->
    <div v-else-if="shouldShowContent && taggedArticles.length === 0" class="flex flex-col items-center justify-center py-12">
      <div class="flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full dark:bg-blue-900/30">
        <UIcon name="i-heroicons-document-text" class="w-8 h-8 text-blue-500" />
      </div>
      <h3 class="text-lg font-medium text-slate-700 dark:text-slate-300">Tidak ada artikel</h3>
      <p class="mt-2 text-sm text-center text-slate-500 dark:text-slate-400">
        Belum ada artikel dengan tag "{{ tagName }}"
      </p>
    </div>

    <!-- Articles grid -->
    <div v-else-if="shouldShowContent" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="article in taggedArticles"
        :key="article.id"
        :to="`/detail/${article.slug || article.id}?tag=${tagName}`"
        class="group"
      >
        <div class="flex flex-col h-full relative overflow-hidden transition-all duration-300 transform bg-white border rounded-xl hover:shadow-lg hover:-translate-y-1 dark:bg-slate-800 dark:border-slate-700">
          <!-- Article image -->
          <div v-if="article.featured_image" class="aspect-video overflow-hidden">
            <img 
              :src="article.featured_image" 
              :alt="article.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          
            <div class="p-6 flex-1">
              <h3 class="text-lg font-semibold tracking-tight group-hover:text-blue-600 line-clamp-2"
                  :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                {{ article.title }}
              </h3>

              <p v-if="article.excerpt" class="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                {{ article.excerpt }}
              </p>

              <!-- Tag List -->
              <div v-if="article.tag" class="flex flex-wrap gap-2 mt-3">
                <span v-for="tag in article.tag.split(',')" :key="tag.trim()" class="inline-block bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200 px-2 py-1 rounded text-xs font-medium">
                  {{ tag.trim() }}
                </span>
              </div>

              <div class="flex items-center justify-between mt-4 text-sm text-slate-500 dark:text-slate-400">
                <div class="flex items-center">
                  <UIcon name="i-heroicons-calendar" class="w-4 h-4 mr-1" />
                  <span>{{ formatDate(article.created_at || article.published_at) }}</span>
                </div>
                <UButton
                  color="blue"
                  variant="ghost"
                  size="xs"
                  icon="i-heroicons-arrow-right"
                  class="group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30"
                >
                  Baca
                </UButton>
              </div>
            </div>
        </div>
      </NuxtLink>
    </div>


    <!-- Pagination -->
    <div v-if="shouldShowContent && taggedArticles.length > 0 && totalPages > 1" class="flex items-center justify-between py-6 mt-6">
      <p class="text-sm text-slate-500 dark:text-slate-400">
        Halaman {{ currentPage }} dari {{ totalPages }}
      </p>
      
      <div class="flex space-x-2">
        <UButton
          color="blue"
          variant="ghost"
          icon="i-heroicons-chevron-left"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        />
        
        <UButton
          v-for="page in paginationArray"
          :key="page"
          color="blue"
          :variant="currentPage === page ? 'solid' : 'ghost'"
          @click="changePage(page)"
        >
          {{ page }}
        </UButton>
        
        <UButton
          color="blue"
          variant="ghost"
          icon="i-heroicons-chevron-right"
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        />
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { useTagStore } from '@/store/tag/tag.js'
import { useLayout } from '@/store/layouts/layouts.js'

// Route and router
const route = useRoute()
const router = useRouter()
const tagStore = useTagStore()
const layoutStore = useLayout()

// Get tag name from URL parameter
const tagName = computed(() => route.params.id)

// Get current page from query parameter
const currentPageFromQuery = computed(() => {
  const page = parseInt(route.query.page) || 1
  return page > 0 ? page : 1
})

// Local loading state to prevent UI flicker
const localLoading = ref(false)

// Reactive data with proper fallbacks
const isLoading = computed(() => tagStore.getIsLoading || localLoading.value)
const error = computed(() => tagStore.getError)
const taggedArticles = computed(() => tagStore.getTaggedArticles || [])
const currentPage = computed(() => currentPageFromQuery.value) // Use query param as source of truth
const totalPages = computed(() => tagStore.getTotalPages || 1)

// Computed property to check if we have data for current tag
const hasCurrentData = computed(() => {
  return tagStore.selectedTag === tagName.value && 
         taggedArticles.value.length > 0 && 
         !error.value
})

// Computed property to determine if we should show content
const shouldShowContent = computed(() => {
  return hasCurrentData.value && !isLoading.value
})

// Dark mode state
const isDarkMode = computed(() => layoutStore.theme === 'dark')

// Pagination
const paginationArray = computed(() => {
const pages = [];
const maxVisiblePages = 5;

if (totalPages.value <= maxVisiblePages) {
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i);
  }
} else {
  if (currentPage.value <= 3) {
    pages.push(1, 2, 3, 4, 5);
  } else if (currentPage.value >= totalPages.value - 2) {
    for (let i = totalPages.value - 4; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    for (let i = currentPage.value - 2; i <= currentPage.value + 2; i++) {
      pages.push(i);
    }
  }
}

return pages;
});

// Methods
const fetchArticles = async (page = 1, force = false) => {
  try {
    // Check if we already have the data and don't need to fetch
    if (!force && tagStore.hasDataFor(tagName.value, page)) {
      return;
    }
    
    // Prevent multiple simultaneous requests unless forced
    if (tagStore.getIsLoading && !force) return;
    
    localLoading.value = true;
    await tagStore.getArticlesByTag(tagName.value, page);
  } catch (error) {
    console.error('Error fetching articles:', error);
  } finally {
    localLoading.value = false;
  }
};

const changePage = async (page) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    localLoading.value = true;
    
    try {
      // Update URL first
      await router.push({
        path: `/tag/${tagName.value}`,
        query: page > 1 ? { page: page.toString() } : {}
      });
      
      // Force fetch if needed
      if (tagStore.page !== page) {
        await fetchArticles(page, true);
      }
    } catch (error) {
      console.error('Error changing page:', error);
    } finally {
      localLoading.value = false;
    }
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

// Refresh method for error state
const refreshData = async () => {
  tagStore.clearTaggedArticles();
  await fetchArticles(currentPage.value, true);
};

// Watch for route changes with better debouncing
let fetchTimeout = null;

const debouncedFetch = async (tagName, page) => {
  if (fetchTimeout) clearTimeout(fetchTimeout);
  
  fetchTimeout = setTimeout(async () => {
    if (tagName) {
      tagStore.clearTaggedArticles();
      await fetchArticles(page, true);
    }
  }, 100);
};

// Watch for route parameter changes
watch(() => route.params.id, async (newTagName, oldTagName) => {
  if (newTagName !== oldTagName) {
    await debouncedFetch(newTagName, 1);
  }
}, { immediate: false });

// Watch for query parameter changes
watch(() => route.query.page, async (newPage, oldPage) => {
  if (newPage !== oldPage) {
    const page = parseInt(newPage) || 1;
    if (page !== tagStore.page) {
      await fetchArticles(page, true);
    }
  }
}, { immediate: false });

// Fetch articles on mount
onMounted(async () => {
  if (tagName.value) {
    tagStore.clearTaggedArticles();
    const page = currentPageFromQuery.value;
    await fetchArticles(page, true);
  }
});

// Add visibility change listener to refetch when tab becomes visible
const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible' && tagName.value) {
    // Only refetch if we don't have data or if there was an error
    if (!hasCurrentData.value || error.value) {
      fetchArticles(currentPage.value, true);
    }
  }
};

onMounted(() => {
  document.addEventListener('visibilitychange', handleVisibilityChange);
});

// Clean up on unmount
onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  if (fetchTimeout) clearTimeout(fetchTimeout);
  tagStore.clearTaggedArticles();
  localLoading.value = false;
});

// Add beforeRouteLeave guard to prevent navigation issues
onBeforeRouteLeave((to, from, next) => {
  // Clear any pending requests or states
  if (fetchTimeout) clearTimeout(fetchTimeout);
  tagStore.clearTaggedArticles();
  localLoading.value = false;
  next();
});

// Meta tags
useHead({
title: `Tag: ${tagName.value}`,
meta: [
  {
    name: 'description',
    content: `Artikel dengan tag ${tagName.value}`
  }
]
});
</script>

<style scoped>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .line-clamp-3 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>