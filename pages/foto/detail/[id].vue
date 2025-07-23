<template>
  <div class="relative min-h-screen pt-24 bg-slate-100 dark:bg-slate-900">
    <!-- Instead of fixed background, add a colored header only for this page -->
    <div class="absolute top-0 left-0 right-0 w-full h-[62px] lg:h-[120px] bg-gradient-to-r from-blue-600 to-blue-500 dark:from-transparent dark:to-transparent"></div>

    <div class="container px-4 mx-auto max-w-7xl pt-12 pb-2">
      <div class="w-full">
        <!-- Main image card -->
        <div class="p-6 mb-8 bg-white shadow-xl rounded-2xl dark:bg-slate-800 md:p-8">
          <!-- Breadcrumb and info header -->
          <div class="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div class="min-w-0 flex-1">
              <Breadcrumb 
                :items="[
                  { text: 'Foto', to: '/foto' },
                  { text: detailData?.title || 'Detail Foto', to: '' }
                ]"
                :loading="pending"
              />
            </div>
            <div class="flex items-center shrink-0">
              <div class="flex items-center text-slate-600 dark:text-slate-400">
                <UIcon name="i-heroicons-calendar" class="w-4 h-4 mr-2" />
                <span class="text-sm">{{ formatDate(detailData?.created_at) }}</span>
              </div>
            </div>
          </div>

          <!-- Main image container -->
          <div class="relative w-full h-[60vh] mb-6 overflow-hidden rounded-xl">
            <img 
              :src="detailImage" 
              alt="Detail foto"
              class="object-contain w-full h-full bg-slate-900/95"
            />
          </div>

          <!-- Image title -->
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
            {{ detailData?.title }}
          </h1>
        </div>

        <!-- Related images section -->
        <div class="mb-16">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-slate-800 dark:text-white">Foto Lainnya</h2>
            <div class="w-10 h-1 rounded-full bg-gradient-to-r from-blue-500 to-blue-400"></div>
          </div>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <div v-for="(item, index) in galeri" :key="index">
              <NuxtLink :to="`/foto/detail/${item.id}`">
                <div class="relative overflow-hidden rounded-xl shadow-lg group aspect-w-4 aspect-h-3">
                  <!-- Image -->
                  <img 
                    :src="item.image" 
                    :alt="item.title"
                    class="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  <!-- Overlay -->
                  <div class="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-blue-900/80 via-blue-800/50 to-transparent group-hover:opacity-100">
                    <div class="absolute bottom-0 left-0 right-0 p-4">
                      <span class="inline-block px-2 py-1 mb-2 text-xs font-medium text-white bg-blue-600 rounded">
                        {{ formatDate(item.created_at) }}
                      </span>
                      <h3 class="text-base font-bold text-white line-clamp-2">
                        {{ item.title }}
                      </h3>
                    </div>
                  </div>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from '#vue-router'
import { useFotoStore } from '~/store/foto/foto';

const route = useRoute()
const config = useRuntimeConfig()

const detailData = ref(null)
const detailImage = ref('')
const galeri = ref([])

// Store
const fotoStore = useFotoStore()

const formatDate = (dateString) => {
  if (!dateString) return ''
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

// Shuffle array function untuk random galeri foto lainnya
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function fetchData() {
  try {
    const id = route.params.id
    
    // Fetch detail foto using store
    const detail = await fotoStore.getDetailFoto(id)
    if (detail) {
      detailData.value = detail
      detailImage.value = detail.image
    }

    // Fetch galeri foto lainnya using store
    await fotoStore.getFotoData()
    if (fotoStore.fotoData.data) {
      // Filter out current photo and shuffle the rest
      const otherPhotos = fotoStore.fotoData.data.filter(photo => photo.id !== id)
      const shuffledPhotos = shuffleArray(otherPhotos)
      // Take only 8 photos
      galeri.value = shuffledPhotos.slice(0, 8)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

// Watch route changes to refresh data
watch(() => route.params.id, () => {
  fetchData()
})

onMounted(() => {
  fetchData()
})
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