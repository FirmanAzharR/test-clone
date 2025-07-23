<template>
  <div class="relative min-h-screen bg-slate-100 dark:bg-slate-900">
    <!-- Hero section with image -->
    <div
      class="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden"
    >
      <!-- Main image -->
      <img
        :src="detailImage || '/images/jogja.jpg'"
        alt="Article cover"
        class="object-cover w-full h-full"
        @error="onImageError"
      />

      <!-- Overlay gradient -->
      <div
        class="absolute inset-0 bg-gradient-to-b from-blue-600/30 to-blue-900/80"
      ></div>

      <!-- Article header info -->
      <div class="absolute bottom-0 left-0 w-full p-6 md:p-8 lg:p-10">
        <div class="container mx-auto max-w-7xl">
          <div
            class="inline-block px-3 py-1 mb-3 text-sm font-medium text-white rounded-full bg-gradient-to-r from-blue-500 to-blue-400 backdrop-blur-sm"
          >
            {{ detailKategori || 'Berita' }}
          </div>

          <h1
            class="max-w-4xl mb-2 text-2xl font-bold text-white md:text-3xl lg:text-4xl line-clamp-3"
          >
            {{
              detailTitle ||
              'Detail Berita & Informasi Terkini Dinas Komunikasi dan Informatika DIY'
            }}
          </h1>

          <div class="flex flex-wrap items-center gap-4 mt-4">
            <div class="flex items-center text-blue-100">
              <UIcon name="i-heroicons-calendar" class="w-4 h-4 mr-2" />
              <span class="text-sm">{{
                formatDate(detailDate || new Date())
              }}</span>
            </div>

            <div class="flex items-center text-blue-100">
              <UIcon name="i-heroicons-user-circle" class="w-4 h-4 mr-2" />
              <span class="text-sm">{{
                detailCreator || 'Admin Kominfo'
              }}</span>
            </div>

            <div class="flex items-center text-blue-100">
              <UIcon name="i-heroicons-eye" class="w-4 h-4 mr-2" />
              <span class="text-sm"
                >{{
                  detailVisitor || Math.floor(Math.random() * 1000) + 500
                }}
                views</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Breadcrumb navigation -->
    <div class="container px-4 mx-auto max-w-7xl pt-6 pb-6">
      <div class="py-4">
        <Breadcrumb
          :items="[
            {
              text: selectedCategory || 'Semua Kategori',
              to: `/${
                selectedCategory === 'Article'
                  ? 'artikel'
                  : selectedCategory === 'Berita'
                  ? 'berita'
                  : 'Informasi'
              }`,
            },
            { text: detailTitle || 'Detail Berita', to: '' },
          ]"
          :loading="isDetailBeritaLoading"
        />
      </div>
    </div>

    <!-- Main content area -->
    <div class="container px-4 py-8 mx-auto -mt-10 max-w-7xl">
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <!-- Main article content -->
        <div class="lg:col-span-2">
          <div
            class="p-6 bg-white shadow-xl rounded-2xl dark:bg-slate-800 md:p-8"
          >
            <!-- Article content -->
            <div
              class="prose max-w-none dark:prose-invert prose-blue prose-img:rounded-xl prose-headings:font-bold prose-a:text-blue-600"
            >
              <time class="text-primary-600">{{ formatDate(detailDate) }}</time>

              <p class="text-lg font-medium text-slate-700 dark:text-slate-300">
                {{ detailTitle || '.......' }}
              </p>
            </div>
            <!-- Article content with HTML -->
            <!-- Swiper utama dengan navigasi -->
            <swiper
              v-if="detailImages.length"
              :modules="[Navigation, Thumbs]"
              :thumbs="{ swiper: thumbsSwiper }"
              navigation
              :space-between="4"
              :slides-per-view="1"
              class="mb-4 rounded-md"
            >
              <swiper-slide v-for="(img, i) in detailImages" :key="i">
                <img :src="img" class="w-full rounded-md object-cover" />
              </swiper-slide>
            </swiper>

            <!-- Thumbnail swiper -->
            <swiper
              v-if="detailImages.length"
              :modules="[Thumbs]"
              class="mb-6"
              :space-between="-80"
              :slides-per-view="4"
              watch-slides-progress
              onSwiper="(swiper) => (thumbsSwiper = swiper)"
            >
              <swiper-slide
                v-for="(img, i) in detailImages"
                :key="'thumb-' + i"
              >
                <img
                  :src="img"
                  class="h-36 w-36 object-cover rounded border cursor-pointer"
                />
              </swiper-slide>
            </swiper>

            <!-- Render HTML lainnya tanpa gambar -->
            <div
              class="prose max-w-none [&_*]:!text-slate-700 dark:[&_*]:!text-slate-300 [&>ul>li::marker]:text-slate-700 dark:[&>ul>li::marker]:text-slate-300 [&>ol>li::marker]:text-slate-700 dark:[&>ol>li::marker]:text-slate-300 [&_a]:hover:!text-blue-600 dark:[&_a]:hover:!text-blue-400 [&_table]:!bg-white dark:[&_table]:!bg-slate-800 [&_tr]:!bg-white dark:[&_tr]:!bg-slate-800 [&_th]:!bg-slate-100 dark:[&_th]:!bg-slate-700 [&_td]:!bg-white dark:[&_td]:!bg-slate-800"
              v-html="descriptionWithoutImages"
            />

            <!-- Share buttons -->
            <div
              class="flex flex-wrap items-center gap-3 pt-6 mt-8 border-t border-slate-200 dark:border-slate-700"
            >
              <span
                class="text-sm font-medium text-slate-700 dark:text-slate-300"
                >Bagikan:</span
              >
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
        </div>

        <!-- Sidebar with popular content -->
        <div class="lg:col-span-1">
          <!-- Popular news section -->
          <div
            class="p-6 bg-white shadow-lg rounded-2xl dark:bg-slate-800 md:p-6"
          >
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-slate-800 dark:text-white">
                Berita Terpopuler
              </h2>
              <div
                class="w-10 h-1 rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
              ></div>
            </div>

            <div class="space-y-4">
              <div
                v-for="(item, index) in berita"
                :key="index"
                class="flex gap-3 p-3 transition-colors rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <div class="flex-shrink-0 w-20 h-20 overflow-hidden rounded-lg">
                  <template v-if="item.image">
                    <img
                      :src="item.image"
                      :alt="item.title"
                      class="object-cover w-full h-full transition-transform hover:scale-110"
                    />
                  </template>
                  <template v-else>
                    <div
                      class="flex flex-col items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-900"
                    >
                      <UIcon
                        name="i-heroicons:photo"
                        class="w-8 h-8 text-gray-400"
                      />
                      <span class="mt-1 text-xs text-gray-500">No Image</span>
                    </div>
                  </template>
                </div>
                <div class="flex-1">
                  <h3
                    class="font-medium text-slate-800 dark:text-white line-clamp-2"
                  >
                    {{ item.title }}
                  </h3>
                  <div
                    class="flex items-center mt-2 text-xs text-slate-500 dark:text-slate-400"
                  >
                    <UIcon name="i-heroicons-calendar" class="w-3 h-3 mr-1" />
                    <span>{{ formatDateArray(item.created_at) }}</span>
                  </div>
                  <UButton
                    :to="`/berita/detail/${item.slug}`"
                    color="blue"
                    variant="link"
                    size="xs"
                    class="p-0"
                  >
                    Baca Selengkapnya
                  </UButton>
                </div>
              </div>
            </div>

            <UButton
              color="blue"
              variant="ghost"
              class="w-full mt-4 border border-blue-200 dark:border-blue-800"
              :to="`/berita`"
            >
              Lihat Semua Berita
            </UButton>
          </div>

          <!-- Popular articles section -->
          <div
            class="p-6 mt-6 bg-white shadow-lg rounded-2xl dark:bg-slate-800 md:p-6"
          >
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-slate-800 dark:text-white">
                Artikel Terpopuler
              </h2>
              <!-- {{ beritaStore.detailBeritaData }} -->
              <div
                class="w-10 h-1 rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
              ></div>
            </div>

            <div class="space-y-4">
              <div
                v-for="(item, index) in artikel"
                :key="index"
                class="p-4 transition-colors border rounded-xl border-slate-100 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <div class="flex items-center justify-between mb-3">
                  <div
                    class="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900/50 dark:text-blue-300"
                  >
                    {{ item.kategori }}
                  </div>
                  <div
                    class="flex items-center text-xs text-slate-500 dark:text-slate-400"
                  >
                    <UIcon name="i-heroicons-eye" class="w-3 h-3 mr-1" />
                    <span>{{ item.visitor }}</span>
                  </div>
                </div>
                <h3
                  class="font-medium text-slate-800 dark:text-white line-clamp-2"
                >
                  {{ item.title }}
                </h3>
                <template v-if="isEmbeddedContent(item.description)">
                  <div class="mt-2 text-sm text-blue-600 dark:text-blue-400">
                    <UIcon
                      name="i-heroicons-document"
                      class="w-4 h-4 inline-block mr-1"
                    />
                    <span>File Terlampir</span>
                  </div>
                </template>
                <template v-else>
                  <p
                    class="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2"
                    v-html="item.description"
                  ></p>
                </template>
                <div class="flex items-center justify-between mt-3">
                  <div
                    class="flex items-center text-xs text-slate-500 dark:text-slate-400"
                  >
                    <UIcon name="i-heroicons-calendar" class="w-3 h-3 mr-1" />
                    <span>{{ formatDateArray(item.created_at) }}</span>
                  </div>
                  <UButton
                    :to="`/artikel/detail/${item.slug}`"
                    color="blue"
                    variant="link"
                    size="xs"
                    class="p-0"
                  >
                    Baca Selengkapnya
                  </UButton>
                </div>
              </div>
            </div>

            <UButton
              color="blue"
              variant="ghost"
              class="w-full mt-4 border border-blue-200 dark:border-blue-800"
              :to="`/artikel`"
            >
              Lihat Semua Artikel
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useBeritaStore } from '~/store/berita/berita';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
// Configuration
const config = useRuntimeConfig();
const route = useRoute();
const toast = useToast();

// Store
const beritaStore = useBeritaStore();

// Data
const detailTitle = ref('');
const detailKategori = ref('');
const detailExcert = ref('');
const detailDescript = ref('');
const detailDate = ref('');
const detailImage = ref('');
const detailVisitor = ref('');
const detailSlug = ref('');
const detailCreator = ref(''); // Menambahkan ref untuk creator
const berita = ref([]);
const kegiatan = ref([]);
const artikel = ref([]);
const page = ref(1);
const recordsPerPage = ref(5);
const isDetailBeritaLoading = ref(false);
const selectedCategory = ref('');

// Navigation handling
const handleBackNavigation = () => {
  if (process.client) {
    // Store the current page state in sessionStorage
    sessionStorage.setItem('fromHome', 'true');
    localStorage.removeItem('lastSelectedCategory');
  }
};

// Get category from localStorage on component mount
onMounted(async () => {
  if (process.client) {
    window.addEventListener('popstate', handleBackNavigation);
    const savedCategory = localStorage.getItem('lastSelectedCategory');
    selectedCategory.value = savedCategory || 'Semua Kategori';
  }
  await fetchData();
});

// Cleanup event listener
onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('popstate', handleBackNavigation);
  }
});

// 👇 Ekstrak image src dari description
const detailImages = computed(() => {
  return Array.from(
    detailDescript.value.matchAll(/<img[^>]+src="([^"]+)"[^>]*>/g)
  ).map((m) => m[1]);
});

// 👇 Hapus semua tag <img> agar hanya tersisa teks/paragraf
const descriptionWithoutImages = computed(() => {
  return detailDescript.value.replace(/<img[^>]*>/g, '');
});

const thumbsSwiper = ref(null);

// Methods
const fetchData = async () => {
  try {
    isDetailBeritaLoading.value = true;
    const id = route.params.id;

    // Menggunakan store untuk fetch detail berita
    await beritaStore.getDetailBeritaData(id);

    if (beritaStore.detailBeritaData.data) {
      const get = beritaStore.detailBeritaData.data;
      detailTitle.value = get.title;
      detailKategori.value = get.kategori;
      detailExcert.value = get.Excert;
      detailDescript.value = get.description;
      detailImage.value = get.image;
      detailVisitor.value = get.visitor;
      detailDate.value = get.created_at;
      detailSlug.value = get.slug;
      detailCreator.value = get.creator || 'Admin Kominfo';

      // Update selectedCategory based on the article type
      if (get.type === 'article') {
        selectedCategory.value = 'Article';
      } else if (get.type === 'news') {
        selectedCategory.value = 'Berita';
      }
    }
    console.log('Detail Berita Data:', beritaStore.detailBeritaData.data);
    // Fetch berita populer
    await beritaStore.getBeritaData();
    if (beritaStore.beritaData.data && beritaStore.beritaData.data.length > 0) {
      berita.value = beritaStore.beritaData.data;
    }
    // Fetch artikel populer using store
    await beritaStore.getArtikelData();
    if (
      beritaStore.artikelData.data &&
      beritaStore.artikelData.data.length > 0
    ) {
      artikel.value = beritaStore.artikelData.data;
    }

    // Fetch events using store
    await beritaStore.getKegiatanData();
    if (
      beritaStore.kegiatanData.data &&
      beritaStore.kegiatanData.data.length > 0
    ) {
      kegiatan.value = beritaStore.kegiatanData.data;
    }
    const eventsData = await eventsResponse.json();

    if (eventsData.data && eventsData.data.length > 0) {
      kegiatan.value = eventsData.data;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    isDetailBeritaLoading.value = false;
  }
};

const formatDate = (dateString) => {
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
        navigator.clipboard
          .writeText(url)
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
  const text = encodeURIComponent(detailTitle.value);
  window.open(
    `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
    '_blank'
  );
};

// Share to WhatsApp
const shareToWhatsApp = () => {
  const url = encodeURIComponent(getCurrentPageUrl());
  const text = encodeURIComponent(`${detailTitle.value}\n\n`);
  window.open(`https://wa.me/?text=${text}${url}`, '_blank');
};

const formatDateArray = (dateString) => {
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
  const day = date.getDate();
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${monthName} ${year}`;
};

const isEmbeddedContent = (content) => {
  if (!content) return false;
  const contentStr = content.toLowerCase();
  return (
    contentStr.includes('iframe') ||
    contentStr.includes('embed') ||
    contentStr.includes('.pdf') ||
    contentStr.includes('.doc') ||
    contentStr.includes('.xls') ||
    contentStr.startsWith('http') ||
    contentStr.startsWith('https')
  );
};

onMounted(async () => {
  fetchData();
});
</script>

<style scoped>
/* Add any additional styling here */
.prose img {
  border-radius: 0.75rem;
  margin: 2rem 0;
}

.prose h2 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: theme('colors.slate.800');
}

.dark .prose h2 {
  color: theme('colors.white');
}

.prose p {
  margin-bottom: 1.25rem;
  line-height: 1.7;
}

/* Hover effects */
.hover\:scale-110:hover {
  transform: scale(1.1);
}

/* Transition effects */
.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 500ms;
}

.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Style untuk tabel yang bisa di-scroll horizontal */
:deep(figure.table) {
  display: block;
  width: 100%;
  overflow-x: auto;
  margin: 1rem 0;
  border-radius: 4px;
  position: relative;
  /* Gaya scroll yang lebih baik */
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

:deep(table) {
  border-collapse: collapse;
  width: 100%;
  table-layout: auto;
  min-width: 100%; /* Memastikan tabel mengisi penuh container */
}

:deep(table th),
:deep(table td) {
  border: 1px solid #e2e8f0;
  padding: 0.75rem 1rem;
  text-align: left;
  min-width: 120px; /* Lebar minimum yang lebih besar untuk tiap kolom */
  max-width: auto; /* Lebar maksimum untuk menghindari kolom yang terlalu lebar */
  white-space: nowrap; /* Mencegah text wrapping dalam tabel untuk scroll horizontal */
}

:deep(table th) {
  font-weight: 600;
}

/* Style untuk iframe yang ada di dalam konten */
:deep(iframe) {
  max-width: 100%;
  margin: 1rem 0;
  border-radius: 4px;
}

/* Style untuk figure dan gambar */
:deep(figure) {
  margin: 1rem 0;
}
</style>
