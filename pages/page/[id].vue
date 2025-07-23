<template>
  <div class="min-h-screen bg-slate-100 dark:bg-slate-900">
    <!-- Hero section with image overlay -->
    <div class="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden">
      <!-- Loading shimmer for hero section -->
      <div v-if="isLoading" class="absolute inset-0">
        <Vue3LoadingShimmer class="w-full h-full" />
      </div>
      
      <!-- Main image -->
      <img 
        v-else
        :src="pageData?.image || '/images/jogja.jpg'" 
        alt="Page cover" 
        class="object-cover w-full h-full"
      />
      
      <!-- Overlay gradient -->
      <div class="absolute inset-0 bg-gradient-to-b from-blue-600/30 to-blue-900/80"></div>
      
      <!-- Page header info -->
      <div class="absolute bottom-0 left-0 w-full p-6 md:p-8">
        <div class="container mx-auto max-w-7xl">
          <!-- Loading state for title -->
          <div v-if="isLoading" class="space-y-4">
            <Vue3LoadingShimmer class="w-2/3 h-8 rounded md:h-10" />
            <div class="flex items-center gap-4">
              <Vue3LoadingShimmer class="w-32 h-4 rounded" />
            </div>
          </div>
          
          <!-- Actual content -->
          <div v-else>
            <h1 class="max-w-4xl mb-2 text-2xl font-bold text-white md:text-3xl lg:text-4xl line-clamp-3">
              {{ pageData?.title || 'Halaman Informasi' }}
            </h1>
            
            <div class="flex flex-wrap items-center gap-4 mt-4">
              <div class="flex items-center text-blue-100">
                <UIcon name="i-heroicons-calendar" class="w-4 h-4 mr-2" />
                <span class="text-sm">{{ formatDate(pageData?.created_at) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>      
    <!-- Breadcrumb navigation -->
    <div class="container px-4 mx-auto max-w-7xl pt-8">
      <Breadcrumb 
        :items="[
          { text: pageData?.title || 'Detail Halaman', to: '' }
        ]"
        :loading="isLoading"
      />
    </div>    
    <!-- Main content -->
    <div class="container px-4 py-8 mx-auto max-w-7xl">
      <div class="space-y-6">
        <!-- Main content area -->
        <div class="w-full">
          <div class="p-6 bg-white rounded-lg shadow-sm dark:bg-slate-800">
            <!-- Content loading state -->
            <div v-if="isLoading" class="space-y-6">
              <!-- Content header shimmer -->
              <Vue3LoadingShimmer v-for="i in 2" :key="`header-shimmer-${i}`" class="w-full h-6 rounded" />
              <Vue3LoadingShimmer class="w-3/4 h-6 rounded" />
              
              <!-- Image placeholder shimmer -->
              <Vue3LoadingShimmer class="w-full h-64 rounded" />
              
              <!-- Content paragraphs shimmer -->
              <div class="space-y-4 mt-6">
                <Vue3LoadingShimmer v-for="i in 5" :key="`paragraph-shimmer-${i}`" class="w-full h-4 rounded" />
                <Vue3LoadingShimmer class="w-3/4 h-4 rounded" />
              </div>
            </div>
              <!-- Actual content -->
            <div v-else-if="pageData" class="prose max-w-none dark:prose-invert prose-img:rounded-lg prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400">
              <!-- Page meta info -->
                <div class="flex items-center mb-4">
                  <span>{{ formatDate(pageData.created_at) }}</span>
                </div>
              <!-- Page title -->
              <h1 class="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                {{ pageData.title }}
              </h1>
              
              <!-- Content -->
              <div 
                class="prose max-w-none overflow-hidden [&_*:not([style*='color'])]:!text-slate-700 dark:[&_*:not([style*='color'])]:!text-slate-300 [&>ul>li::marker]:text-slate-700 dark:[&>ul>li::marker]:text-slate-300 [&>ol>li::marker]:text-slate-700 dark:[&>ol>li::marker]:text-slate-300 [&_a]:hover:!text-blue-600 dark:[&_a]:hover:!text-blue-400 [&_table]:!bg-white dark:[&_table]:!bg-slate-800 [&_tr]:!bg-white dark:[&_tr]:!bg-slate-800 [&_th]:!bg-slate-100 dark:[&_th]:!bg-slate-700 [&_td]:!bg-white dark:[&_td]:!bg-slate-800 content-wrapper"
                v-html="pageData.content || pageData.description">
              </div>
              
              <!-- Attachments section if available -->
              <div v-if="pageData.attachments && pageData.attachments.length > 0" class="p-4 mt-8 border rounded-lg dark:border-slate-700">
                <h3 class="mb-4 text-lg font-medium">Lampiran</h3>
                <ul class="space-y-2">
                  <li v-for="(attachment, index) in pageData.attachments" :key="index" class="flex items-center">
                    <UIcon name="i-heroicons-document" class="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                    <a 
                      :href="attachment.url" 
                      target="_blank" 
                      class="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {{ attachment.name }}
                    </a>
                  </li>
                </ul>
              </div>
              <!-- Share buttons -->
            <div class="flex flex-wrap items-center gap-3 pt-6 mt-8 border-t border-slate-200 dark:border-slate-700">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">Bagikan:</span>
              <button 
                class="flex items-center justify-center w-8 h-8 text-white transition-colors bg-blue-600 rounded-full hover:bg-blue-700"
                @click="copyPageUrl"
              >
                <UIcon name="i-heroicons-share" class="w-4 h-4" />
              </button>
              <button 
                class="flex items-center justify-center w-8 h-8 text-white transition-colors rounded-full bg-[#1877F2] hover:bg-[#0e6edf]"
                @click="shareToFacebook"
              >
                <UIcon name="i-simple-icons-facebook" class="w-4 h-4" />
              </button>
              <button 
                class="flex items-center justify-center w-8 h-8 text-white transition-colors rounded-full bg-[#1DA1F2] hover:bg-[#0d95e8]"
                @click="shareToTwitter"
              >
                <UIcon name="i-simple-icons-twitter" class="w-4 h-4" />
              </button>
              <button 
                class="flex items-center justify-center w-8 h-8 text-white transition-colors rounded-full bg-[#25D366] hover:bg-[#1eb958]"
                @click="shareToWhatsApp"
              >
                <UIcon name="i-simple-icons-whatsapp" class="w-4 h-4" />
              </button>
            </div>
            </div>
            <!-- No data state -->
            <div v-else-if="!isLoading && !error" class="p-8 text-center">
              <UIcon name="i-heroicons-document" class="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 class="mb-2 text-xl font-medium text-gray-900 dark:text-white">Halaman tidak ditemukan</h3>
              <p class="text-gray-500 dark:text-gray-400">Halaman yang Anda cari tidak dapat ditemukan.</p>
            </div>
            
            <!-- Error state -->
            <div v-else-if="error" class="p-8 text-center">
              <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 mx-auto mb-4 text-orange-500" />
              <h3 class="mb-2 text-xl font-medium text-gray-900 dark:text-white">Terjadi kesalahan</h3>
              <p class="text-gray-500 dark:text-gray-400">{{ error }}</p>
            </div>          
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useLayout } from '~/store/layouts/layouts';
import { useMenuStore } from '@/store/menu/menu.js';
import { useBeritaStore } from '@/store/berita/berita.js';
import { useToast } from '#imports';
import Breadcrumb from '@/components/general/breadcrumb/index.vue';
import Vue3LoadingShimmer from 'vue3-loading-shimmer';

const route = useRoute();
const layoutStore = useLayout();
const menuStore = useMenuStore();
const beritaStore = useBeritaStore();
const toast = useToast();

// State variables
const isLoading = ref(true);
const error = ref(null);
const linkCopied = ref(false);

// Computed property for page data from store
const pageData = computed(() => {
  if (beritaStore.detailPageData && beritaStore.detailPageData.data) {
    return beritaStore.detailPageData.data;
  }
  return null;
});

// Computed property to check if dark mode is active
const isDark = computed(() => {
  return layoutStore.theme === 'dark';
});

// Format date helper function
const formatDate = (dateString) => {
  const days = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const date = new Date(dateString);
  const dayName = days[date.getDay()];
  const day = date.getDate();
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();

  return `${dayName}, ${day} ${monthName} ${year}`;
};

// Get current page URL
const getCurrentPageUrl = () => {
  if (process.client) {
    return window.location.href;
  }
  return '';
};

// Copy current page URL
const copyPageUrl = () => {
  try {
    const url = getCurrentPageUrl();
    if (process.client) {
      if (navigator.clipboard && window.isSecureContext) {
        // Use Clipboard API if available
        navigator.clipboard.writeText(url)
          .then(() => {
            toast.add({ title: 'URL berhasil disalin!', color: 'green' });
          })
          .catch((err) => {
            console.error('Gagal menyalin URL:', err);
            fallbackCopyToClipboard(url);
          });
      } else {
        // Fallback for browsers that don't support Clipboard API
        fallbackCopyToClipboard(url);
      }
    }
  } catch (err) {
    console.error('Gagal menyalin URL:', err);
    toast.add({ title: 'Gagal menyalin URL', color: 'red' });
  }
};

// Fallback method using temporary textarea
const fallbackCopyToClipboard = (text) => {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '0';
    textarea.style.top = '0';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    toast.add({ title: 'URL berhasil disalin!', color: 'green' });
  } catch (err) {
    console.error('Gagal menyalin URL:', err);
    toast.add({ title: 'Gagal menyalin URL', color: 'red' });
  }
};

// Share to Facebook
const shareToFacebook = () => {
  const url = encodeURIComponent(getCurrentPageUrl());
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
};

// Share to Twitter
const shareToTwitter = () => {
  const url = encodeURIComponent(getCurrentPageUrl());
  const text = encodeURIComponent(pageData.value?.title || '');
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
};

// Share to WhatsApp
const shareToWhatsApp = () => {
  const url = encodeURIComponent(getCurrentPageUrl());
  const text = encodeURIComponent(`${pageData.value?.title || ''}\n\n`);
  window.open(`https://wa.me/?text=${text}${url}`, '_blank');
};

onMounted(async () => {
  try {
    // Fetch page detail data using the route parameter
    const pageId = route.params.id;
    if (pageId) {
      await beritaStore.getDetailPageData(pageId);
    }
  } catch (err) {
    console.error('Error fetching page data:', err);
    error.value = 'Gagal memuat data halaman';
  } finally {
    isLoading.value = false;
  }
});

// Set page meta data
useSeoMeta({
  ogTitle: () => pageData.value?.title || 'Detail Halaman',
  description: () => pageData.value?.description || pageData.value?.content?.replace(/<[^>]*>/g, '').substring(0, 160) || 'Detail halaman informasi',
  ogDescription: () => pageData.value?.description || pageData.value?.content?.replace(/<[^>]*>/g, '').substring(0, 160) || 'Detail halaman informasi',
});

// Watch for changes in page data to fetch related content
watch(() => pageData.value, (newData) => {
  // Page data changed, you can add any additional logic here if needed
});

// Watch for route parameter changes
watch(() => route.params.id, async (newId, oldId) => {
  if (newId && newId !== oldId) {
    isLoading.value = true;
    error.value = null;
    
    try {
      await beritaStore.getDetailPageData(newId);
    } catch (err) {
      console.error('Error fetching page data:', err);
      error.value = 'Gagal memuat data halaman';
    } finally {
      isLoading.value = false;
    }
  }
});
</script>

<style>
/* Component-specific styles */
.prose img {
  margin-left: auto;
  margin-right: auto;
}

/* Dark mode text styling */
:root.dark .prose {
  color: rgb(209 213 219);
}

/* Transitions */
a, button {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Loading animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>