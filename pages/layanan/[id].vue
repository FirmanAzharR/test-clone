<template>
  <div class="relative min-h-screen bg-slate-100 dark:bg-slate-900">
    <!-- Hero section -->
    <div class="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden">
      <img 
        :src="detailImage || '/images/bg-layanan.jpg'" 
        alt="Service cover" 
        class="object-cover w-full h-full"
      />
      
      <!-- Overlay gradient -->
      <div class="absolute inset-0 bg-gradient-to-b from-blue-600/30 to-blue-900/80"></div>
      
      <!-- Service header info -->
      <div class="absolute bottom-0 left-0 w-full p-6 md:p-8 lg:p-10">
        <div class="container mx-auto max-w-7xl">
          <div class="inline-block px-3 py-1 mb-3 text-sm font-medium text-white rounded-full bg-gradient-to-r from-blue-500 to-blue-400 backdrop-blur-sm">
            {{ detailKategori || 'Layanan' }}
          </div>
          
          <h1 class="max-w-4xl mb-2 text-2xl font-bold text-white md:text-3xl lg:text-4xl  line-clamp-3">
            {{ detailTitle || 'Detail Layanan Dinas Komunikasi dan Informatika DIY' }}
          </h1>
        </div>
      </div>
    </div>
    <!-- Breadcrumb navigation -->
    <div class="container px-4 mx-auto max-w-7xl pt-6 pb-6">
      <div class="py-4">
        <Breadcrumb 
          :items="[
            { text: 'Layanan', to: '/layanan' },
            { text: detailTitle || 'Detail Layanan', to: '' }
          ]"
          :loading="pending"
        />
      </div>
    </div>
    <!-- Main content -->
    <div class="container px-4 py-8 mx-auto -mt-10 max-w-7xl">
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <!-- Main content -->
        <div class="lg:col-span-2">
          <div class="p-6 bg-white shadow-xl rounded-2xl dark:bg-slate-800 md:p-8">
            <div v-if="pending" class="animate-pulse space-y-4">
              <div class="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
              <div class="space-y-3">
                <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
              </div>
            </div>
            
            <div v-else-if="error" class="p-4">
              <UAlert title="Error" :description="error" color="red" variant="soft" />
            </div>
            
            <div v-else>
              <div class="prose max-w-none dark:prose-invert prose-blue">
                <h2 class="text-xl font-semibold mb-4 text-slate-900 dark:text-white">{{ detailTitle }}</h2>
                <div class="border-t-2 border-slate-200 dark:border-slate-700 w-full mb-4"></div>
                <div class="text-slate-700 dark:text-slate-300" v-html="detailDescript"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <div class="p-6 bg-white shadow-lg rounded-2xl dark:bg-slate-800">
            <h2 class="text-xl font-bold mb-4 text-slate-800 dark:text-white">Layanan Lainnya</h2>
            <div class="space-y-4 overflow-auto max-h-[586px] scrollbar-thin">
              <div v-if="pending" class="space-y-4">
                <div v-for="n in 3" :key="n" class="animate-pulse">
                  <div class="h-32 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"></div>
                  <div class="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mx-auto"></div>
                </div>
              </div>
              
              <div v-else class="space-y-4">
                <NuxtLink 
                  v-for="item in relatedServices" 
                  :key="item.id"
                  :to="`/layanan/${item.id}`" 
                  class="block group"
                >
                  <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                    <img 
                      :src="item.image" 
                      :alt="item.title"
                      class="w-full h-32 object-cover" 
                    />
                    <div class="p-4">
                      <h3 class="text-center text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300 transition-colors">
                        {{ item.title }}
                      </h3>
                    </div>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useBannerStore } from '~/store/banner/banner';

// Store
const bannerStore = useBannerStore()

const route = useRoute();
const config = useRuntimeConfig();
const id = route.params.id;

// State management
const error = ref(null);
const detailImage = ref(null);
const detailTitle = ref("");
const detailKategori = ref("");
const detailDescript = ref("");

// State for loading
const pending = ref(true);

// Fetch service details
const refresh = async () => {
  pending.value = true;
  error.value = null;
  
  try {
    const response = await bannerStore.getDetailBanner(id);
    const data = response?.data;
    if (data) {
      detailTitle.value = data.title;
      detailKategori.value = data.kategori;
      detailDescript.value = data.description;
      detailImage.value = data.image;
    }
  } catch (err) {
    console.error('Request error:', err);
    error.value = 'Gagal memuat data layanan';
  } finally {
    pending.value = false;
  }
};

// Initial fetch of detail
await refresh();

// Fetch related services
await bannerStore.getBannerData();
const servicesData = computed(() => bannerStore.bannerData);

// Compute related services excluding current
const relatedServices = computed(() => {
  const services = servicesData.value?.data || [];
  return services.filter(item => item.id !== id);
});

// Refresh data on route change
watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      error.value = null;
      await refresh();
    }
  }
);

// Route navigation guard
onBeforeRouteUpdate(async (to, from, next) => {
  if (to.params.id !== from.params.id) {
    error.value = null;
    await refresh();
  }
  next();
});
</script>

<style scoped>
.prose img {
  max-width: 100%;
  height: auto;
  border-radius: 0.75rem;
}

/* Scrollbar styling */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>