<template>
  <section
    :class="[
      'w-full py-14 transition-colors duration-300',
      isDark
        ? 'dark bg-gradient-to-t from-green-900 to-green-800/45'
        : 'bg-gradient-to-b from-slate-100 via-blue-50 to-blue-100',
    ]"
  >
    <div class="container px-4 mx-auto">
      <!-- Theme Toggle Button -->

      <!-- Header Section with modern design -->
      <div class="mb-12 text-center">
        <div
          :class="[
            'inline-block px-3 py-1 mb-3 text-sm font-medium rounded-full transition-all duration-300 transform hover:scale-105',
            isDark
              ? 'text-blue-300 bg-blue-900/40'
              : 'text-blue-600 bg-blue-100',
          ]"
        >
          <span class="flex items-center">
            <UIcon name="i-heroicons-sparkles" class="w-4 h-4 mr-1" />
            Layanan
          </span>
        </div>
        <h2
          :class="[
            'text-3xl font-bold md:text-4xl lg:text-5xl transition-all duration-300',
            isDark ? 'text-white' : 'text-slate-900',
          ]"
        >
          <span
            :class="[
              'text-2xl font-normal',
              isDark ? 'text-blue-300' : 'text-blue-600',
              'aksara-jawa',
            ]"
            v-if="isAksaraJawaEnabled"
          >
            ꧋{{ videoTitle }}
          </span>
          <br />
          <div class="mt-4">Video Terbaru</div>
        </h2>
        <div class="flex items-center justify-center mt-4">
          <div
            :class="[
              'w-12 h-1 rounded-full',
              isDark
                ? 'bg-gradient-to-r from-blue-500 to-blue-300'
                : 'bg-gradient-to-r from-blue-600 to-blue-400',
            ]"
          ></div>
          <div
            :class="[
              'w-2 h-2 mx-2 rounded-full',
              isDark ? 'bg-blue-400' : 'bg-blue-600',
            ]"
          ></div>
          <div
            :class="[
              'w-12 h-1 rounded-full',
              isDark
                ? 'bg-gradient-to-r from-blue-300 to-blue-500'
                : 'bg-gradient-to-r from-blue-400 to-blue-600',
            ]"
          ></div>
        </div>
      </div>

      <!-- Shimmer loading state -->
      <div
        v-if="isLoading"
        class="grid grid-cols-1 gap-8 lg:grid-cols-12 items-stretch"
      >
        <div class="lg:col-span-8">
          <div
            :class="[
              'overflow-hidden transition-all duration-300 shadow-lg rounded-xl',
              isDark ? 'bg-slate-800 shadow-slate-700/50' : 'bg-white',
            ]"
          >
            <div class="relative">
              <Vue3LoadingShimmer
                :class="[
                  'w-full aspect-video rounded-t-xl',
                  isDark ? 'shimmer-dark' : '',
                ]"
              />

              <div
                :class="[
                  'absolute bottom-0 left-0 right-0 h-1',
                  isDark
                    ? 'bg-gradient-to-r from-blue-500 via-blue-300 to-blue-500'
                    : 'bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600',
                ]"
              ></div>
            </div>

            <div class="p-6">
              <div class="flex flex-wrap items-center gap-2 mb-4">
                <Vue3LoadingShimmer
                  :class="['w-24 h-6 rounded', isDark ? 'shimmer-dark' : '']"
                />
              </div>

              <Vue3LoadingShimmer
                :class="[
                  'w-full h-8 mb-4 rounded',
                  isDark ? 'shimmer-dark' : '',
                ]"
              />

              <div
                :class="[
                  'p-4 space-y-1 border rounded-lg',
                  isDark
                    ? 'border-blue-800 bg-blue-900/30'
                    : 'border-blue-100 bg-blue-50',
                ]"
              >
                <Vue3LoadingShimmer
                  :class="[
                    'w-full h-4 mb-2 rounded',
                    isDark ? 'shimmer-dark' : '',
                  ]"
                />
                <Vue3LoadingShimmer
                  :class="[
                    'w-full h-4 mb-2 rounded',
                    isDark ? 'shimmer-dark' : '',
                  ]"
                />
                <Vue3LoadingShimmer
                  :class="['w-3/4 h-4 rounded', isDark ? 'shimmer-dark' : '']"
                />
              </div>

              <!-- Button shimmer -->
              <div class="mt-4">
                <Vue3LoadingShimmer
                  :class="[
                    'w-40 h-10 rounded-lg',
                    isDark ? 'shimmer-dark' : '',
                  ]"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Other Videos List shimmer -->
        <div class="lg:col-span-4">
          <div
            :class="[
              'overflow-hidden transition-all duration-300 shadow-lg rounded-xl',
              isDark ? 'bg-slate-800 shadow-slate-700/50' : 'bg-white',
            ]"
          >
            <div
              :class="[
                'p-4 border-b',
                isDark
                  ? 'border-slate-700 bg-gradient-to-r from-blue-800 to-blue-700'
                  : 'border-blue-100 bg-gradient-to-r from-blue-500 to-blue-600',
              ]"
            >
              <h3 class="flex items-center font-bold text-white">
                <UIcon name="i-heroicons-play-circle" class="w-5 h-5 mr-2" />
                Video Lainnya
              </h3>
            </div>

            <div
              :class="[
                'divide-y',
                isDark ? 'divide-slate-700' : 'divide-blue-100',
              ]"
            >
              <div v-for="i in 5" :key="`shimmer-video-${i}`" class="p-4">
                <div class="flex space-x-1">
                  <!-- Thumbnail shimmer -->
                  <Vue3LoadingShimmer
                    :class="[
                      'flex-shrink-0 h-20 mr-3 rounded-lg w-28',
                      isDark ? 'shimmer-dark' : '',
                    ]"
                  />

                  <!-- Info shimmer -->
                  <div class="space-y-1">
                    <Vue3LoadingShimmer
                      :class="[
                        'w-full h-4 mb-2 rounded',
                        isDark ? 'shimmer-dark' : '',
                      ]"
                    />
                    <Vue3LoadingShimmer
                      :class="[
                        'w-3/4 h-4 mb-1 rounded',
                        isDark ? 'shimmer-dark' : '',
                      ]"
                    />
                    <Vue3LoadingShimmer
                      :class="[
                        'w-20 h-3 rounded',
                        isDark ? 'shimmer-dark' : '',
                      ]"
                    />
                  </div>
                </div>
              </div>

              <!-- See All Button shimmer -->
              <div class="p-4">
                <Vue3LoadingShimmer
                  :class="['w-full h-10 rounded', isDark ? 'shimmer-dark' : '']"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Video Content with enhanced layout - shown when loaded -->
      <div
        v-else-if="videoStore.videoData?.data?.length > 0"
        class="grid grid-cols-1 gap-8 lg:grid-cols-12"
      >
        <!-- Main Featured Video -->
        <div class="lg:col-span-8">
          <div
            :class="[
              'h-full overflow-hidden transition-all duration-300 shadow-lg rounded-xl hover:shadow-xl',
              isDark
                ? 'bg-slate-800 shadow-slate-700/50 hover:shadow-slate-700/70'
                : 'bg-white',
            ]"
          >
            <!-- Video Embed -->
            <div class="relative">
              <iframe
                class="relative z-10 w-full h-[400px] md:h-[430px] aspect-video rounded-t-xl"
                :src="getEmbedUrl(videoStore.videoData.data[0].video)"
                frameborder="0"
                allowfullscreen
              ></iframe>

              <!-- Blue Accent Line -->
              <div
                :class="[
                  'absolute bottom-0 left-0 right-0 h-1',
                  isDark
                    ? 'bg-gradient-to-r from-blue-500 via-blue-300 to-blue-500'
                    : 'bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600',
                ]"
              ></div>
            </div>

            <!-- Video Info -->
            <div class="p-6">
              <div class="flex flex-wrap items-center gap-2 mb-2">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded',
                    isDark
                      ? 'text-blue-300 bg-blue-900/40'
                      : 'text-blue-600 bg-blue-100',
                  ]"
                >
                  {{
                    formatDate(
                      videoStore.videoData.data[0].created_at || new Date()
                    )
                  }}
                </span>
              </div>

              <h3
                :class="[
                  'mb-4 text-xl font-bold',
                  isDark ? 'text-white' : 'text-slate-900',
                ]"
              >
                {{ videoStore.videoData.data[0].title }}
              </h3>

              <div
                :class="[
                  'p-4 border rounded-lg',
                  isDark
                    ? 'border-blue-800 bg-blue-900/30'
                    : 'border-blue-100 bg-blue-50',
                ]"
              >
                <p
                  :class="[
                    'text-sm',
                    isDark ? 'text-slate-300' : 'text-slate-600',
                  ]"
                >
                  {{
                    videoStore.videoData.data[0].description ||
                    'Video ini menjelaskan tentang layanan dan informasi dari Dinas Kominfo D.I. Yogyakarta.'
                  }}
                </p>
              </div>

              <div class="mt-4">
                <a
                  :href="getYouTubeUrl(videoStore.videoData.data[0].video)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white transition-colors rounded-lg bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600"
                >
                  <UIcon name="i-mdi-youtube" class="w-4 h-4 mr-2" />
                  Tonton di YouTube
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Video List -->
        <div class="lg:col-span-4">
          <div
            :class="[
              'overflow-hidden transition-all duration-300 shadow-lg rounded-xl hover:shadow-xl',
              isDark
                ? 'bg-slate-800 shadow-slate-700/50 hover:shadow-slate-700/70'
                : 'bg-white',
            ]"
          >
            <div
              :class="[
                'p-4 border-b',
                isDark
                  ? 'border-slate-700 bg-gradient-to-r from-blue-800 to-blue-700'
                  : 'border-blue-100 bg-gradient-to-r from-blue-500 to-blue-600',
              ]"
            >
              <h3 class="flex items-center font-bold text-white">
                <UIcon name="i-heroicons-play-circle" class="w-5 h-5 mr-2" />
                Video Lainnya
              </h3>
            </div>

            <div
              :class="[
                'divide-y',
                isDark ? 'divide-slate-700' : 'divide-blue-100',
              ]"
            >
              <template
                v-for="(video, index) in videoStore.videoData.data.slice(1, 6)"
                :key="video.id"
              >
                <a
                  :href="getYouTubeUrl(video.video)"
                  target="_blank"
                  rel="noopener noreferrer"
                  :class="[
                    'block p-4 transition-all duration-300 group',
                    isDark ? 'hover:bg-slate-700' : 'hover:bg-blue-50',
                  ]"
                >
                  <div class="flex">
                    <div
                      class="relative flex-shrink-0 w-28 h-20 mr-3 overflow-hidden rounded-lg"
                    >
                      <img
                        :src="`https://i.ytimg.com/vi/${getVideoId(
                          video.video
                        )}/mqdefault.jpg`"
                        alt="Thumbnail"
                        class="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                      />
                      <div
                        class="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 bg-black/30 group-hover:opacity-100"
                      >
                        <div
                          class="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full"
                        >
                          <UIcon
                            name="i-heroicons-play"
                            class="w-4 h-4 text-white"
                          />
                        </div>
                      </div>
                      <div
                        :class="[
                          'absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300 group-hover:h-1',
                          'bg-blue-500',
                        ]"
                      ></div>
                    </div>
                    <div>
                      <h4
                        :class="[
                          'mb-1 text-sm font-medium transition-colors duration-300 line-clamp-2',
                          isDark
                            ? 'text-slate-200 group-hover:text-blue-300'
                            : 'text-slate-800 group-hover:text-blue-600',
                        ]"
                      >
                        {{ video.title }}
                      </h4>
                      <div
                        :class="[
                          'flex items-center text-xs',
                          isDark ? 'text-slate-400' : 'text-slate-500',
                        ]"
                      >
                        <UIcon
                          name="i-heroicons-calendar"
                          class="w-3 h-3 mr-1"
                        />
                        <span>{{ formatDate(video.created_at) }}</span>
                      </div>
                    </div>
                  </div>
                </a>
              </template>

              <div class="p-4 text-center">
                <NuxtLink :to="`/video`">
                  <UButton
                    color="blue"
                    variant="link"
                    trailing-icon="i-heroicons-arrow-right"
                  >
                    Lihat Semua Video
                  </UButton>
                </NuxtLink>
              </div>
            </div>
          </div>
          <div class="mt-8 p-6 text-left">
            <h1
              class="text-2xl md:text-4xl font-serif leading-snug tracking-tight transition-colors duration-300"
              :class="isDark ? 'text-white' : 'text-slate-800'"
            >
              Sebuah bukti budaya Jawa yang dinamis yang memadukan sistem
              kepercayaan, warisan budaya yang nyata dan tradisi yang hidup.
            </h1>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useVideoStore } from '~/store/vidio/video';
import { useFooterStore } from '@/store/footer/footer.js';
import Vue3LoadingShimmer from 'vue3-loading-shimmer';
import { useLayout } from '~/store/layouts/layouts';
import { LatinKeAksara } from '@sajenid/aksara.js';

const runtimeConfig = useRuntimeConfig();
const isAksaraJawaEnabled = computed(
  () => runtimeConfig.public.isAksaraJawa === 'true'
);
const videoTitle = computed(() =>
  isAksaraJawaEnabled.value ? LatinKeAksara('Video Terbaru') : ''
);
const layoutStore = useLayout();
const videoStore = useVideoStore();
const footerStore = useFooterStore();
const isLoading = ref(true);
const isDark = computed(() => {
  return layoutStore.theme === 'dark';
});

// Add computed property to access footer data
const footerData = computed(() => {
  return (
    footerStore.footerData?.data?.[0] || footerStore.footerData?.[0] || null
  );
});

onMounted(async () => {
  try {
    isLoading.value = true;

    await videoStore.getVideoData();

    setTimeout(() => {
      isLoading.value = false;
    }, 1000);
  } catch (error) {
    console.error('Error loading video data:', error);
    isLoading.value = false;
  }
});

// Format date to Indonesian format
const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

// Get embed URL for main video player
const getEmbedUrl = (url) => {
  const videoId = getVideoId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

const getYouTubeUrl = (url) => {
  const videoId = getVideoId(url);
  return videoId ? `https://www.youtube.com/watch?v=${videoId}` : url;
};

// Extract video ID from YouTube URL
const getVideoId = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('v') || urlObj.pathname.split('/').pop();
  } catch (e) {
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(regex);
    return match ? match[1] : '';
  }
};
</script>

<style scoped>
/* Smooth animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.container > * {
  animation: fadeIn 0.6s ease-out forwards;
}

.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

.bg-gradient-to-r {
  background-size: 200% auto;
  transition: background-position 0.5s ease;
}

.bg-gradient-to-r:hover {
  background-position: right center;
}

.shimmer-dark {
  --shimmer-color: rgba(51, 65, 85, 0.5);
  --shimmer-highlight: rgba(71, 85, 105, 0.8);
}

.dark {
  transition: all 0.3s ease;
}

:deep(.shimmer-dark .shimmer) {
  background: linear-gradient(
    90deg,
    var(--shimmer-color) 0%,
    var(--shimmer-highlight) 50%,
    var(--shimmer-color) 100%
  );
}

/* Aksara Jawa font styling */
.aksara-jawa {
  font-family: 'nyk Ngayogyan New';
  line-height: 2 !important;
}
</style>
