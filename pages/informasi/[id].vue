<template>
  <section class="bg-slate-100 min-h-screen pt-16" :class="isDarkMode ? 'dark:bg-slate-900' : ''">
    <!-- Header gradient -->
    <div class="absolute top-0 left-0 right-0 w-full h-[62px] lg:h-[120px] bg-gradient-to-r from-blue-600 to-blue-500 dark:from-transparent dark:to-transparent"></div>
    <!-- Breadcrumb navigation -->
    <div class="container px-4 mx-auto max-w-7xl pt-20 pb-2">      
        <div class="py-2">
        <Breadcrumb 
          :items="[
            { text: data?.data?.title || 'Informasi', to: '' }
          ]"
          :loading="pending"
        />
      </div>
    </div>

    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <div class="mx-auto">
        <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6 dark:bg-slate-800">
          <!-- Loading state -->
          <div v-if="pending" class="animate-pulse space-y-4">
            <div class="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mx-auto"></div>
            <div class="space-y-3">
              <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
              <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
            </div>
          </div>

          <!-- Error state -->
          <div v-else-if="error" class="text-center py-6">
            <UIcon name="i-heroicons-exclamation-circle" class="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h2 class="text-xl font-semibold text-red-500 mb-2">Error Loading Content</h2>
            <p class="text-slate-600 dark:text-slate-400">{{ error.message }}</p>
            <UButton color="red" variant="soft" class="mt-3" @click="refresh">
              Try Again
            </UButton>
          </div>

          <!-- Content -->
          <div v-else class="max-w-none">
            <!-- Logo/Image -->
            <div v-if="data?.data?.image" class="flex justify-center mb-6">
              <img 
                :src="data.data.image" 
                :alt="data.data.title"
                class="max-w-[150px] h-auto mt-10 mb-5"
              >
            </div>

            <!-- Main Content -->
            <div class="prose max-w-none dark:prose-invert">
              <div 
                class="content-wrapper" 
                v-html="decodeContent(data?.data?.description)" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useLayout } from '@/store/layouts/layouts.js'
import { useAuthToken } from '~/composable/useAuthToken'

const layoutStore = useLayout()
const isDarkMode = computed(() => layoutStore.theme === 'dark')

// Get route parameter
const route = useRoute()
const pageId = route.params.id

// Fetch page data with dynamic ID
const config = useRuntimeConfig()
const { token } = useAuthToken();
const apiBaseUrl = config.public.apiBaseUrl;
const { data, pending, error, refresh } = await useFetch(
  () => `${apiBaseUrl}/api/page/page/${pageId}`,
  {
    headers: {
      'Authorization': token.value,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
)

// Decode content helper
const decodeContent = (content) => {
  if (!content) return ''
  return decodeURIComponent(content.replace(/&lt;/g, '<').replace(/&gt;/g, '>'))
}

// Set dynamic meta tags
watchEffect(() => {
  if (data.value?.data) {
    useSeoMeta({
      title: data.value.data.title,
      ogTitle: data.value.data.title,
      description: data.value.data.description ? data.value.data.description.substring(0, 160) : '',
      ogDescription: data.value.data.description ? data.value.data.description.substring(0, 160) : '',
      ogImage: data.value.data.image || '',
    })
  }
})
</script>

<style>
.prose {
  @apply max-w-none;
}

.prose img {
  @apply mx-auto rounded-lg max-w-full h-auto;
  max-height: 800px;
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
  @apply mt-2;
}

.prose p {
  @apply break-words my-2;
}

.prose h1, .prose h2, .prose h3, .prose h4 {
  @apply my-3;
}

.prose ul, .prose ol {
  @apply my-2 pl-4;
}

@media (max-width: 640px) {
  .prose img {
    max-height: 500px;
  }
}
</style>
