<template>
  <div class="min-h-screen bg-slate-100 dark:bg-slate-900">
    <!-- Page header with title -->
    <div class="relative h-[300px] lg:h-[380px] pb-10 bg-gradient-to-r from-blue-600 to-blue-500 flex items-end pb-12">
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute w-64 h-64 rounded-full bg-blue-400/10 -top-32 -right-32 blur-3xl"></div>
        <div class="absolute w-64 h-64 rounded-full bg-blue-400/10 -bottom-32 -left-32 blur-3xl"></div>
      </div>
      
      <div class="container relative z-10 px-4 mx-auto max-w-7xl">
        <div class="text-center">
          <div class="inline-block px-3 py-1 mb-4 text-sm font-medium text-blue-100 rounded-full bg-white/10 backdrop-blur-sm">
            Hubungi Kami
          </div>
          <h1 class="text-3xl font-bold tracking-tight text-white md:text-4xl">
            {{ title }}
          </h1>
          <p class="max-w-2xl mx-auto mt-4 text-blue-100">
            Jangan ragu untuk menghubungi kami untuk informasi lebih lanjut atau pertanyaan
          </p>
        </div>
      </div>
    </div>

    <div class="container px-4 py-20 mx-auto -mt-10 max-w-7xl">
      <!-- Breadcrumb navigation -->
      <div class="container px-2 mx-auto max-w-7xl pt-2 pb-6">
          <div class="py-2">
            <Breadcrumb 
              :items="[
                { text: detailTitle || 'Kontak', to: '' }
              ]"
              :loading="isDetailBeritaLoading"
            />
          </div>
        </div>
      <UCard class="overflow-hidden shadow-xl dark:bg-slate-800">
        <div class="p-6">
          <div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <!-- Map Section -->
            <div class="lg:col-span-5">
              <div class="h-full rounded-lg overflow-hidden">
                <client-only>
                  <div v-html="detailMaps" :key="detailMaps" class="w-full h-full min-h-[300px]"></div>
                </client-only>
              </div>
            </div>
            
            <!-- Contact Details Section -->
            <div class="lg:col-span-7">
              <div class="p-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-slate-700/50 dark:to-slate-800/50 rounded-xl shadow-lg h-full flex flex-col justify-between">
                <!-- Address (full width) -->
                <div class="mb-6">
                  <h3 class="flex items-center mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                    <UIcon name="i-heroicons-map-pin" class="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                    Alamat
                  </h3>
                  <p class="text-gray-600 dark:text-gray-300">{{ detailAlamat }}</p>
                </div>
                <!-- Konten lain 2x2 -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Email -->
                  <div>
                    <h3 class="flex items-center mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                      <UIcon name="i-heroicons-envelope" class="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                      Email
                    </h3>
                    <p class="text-gray-600 dark:text-gray-300">{{ detailEmail }}</p>
                  </div>
                  <!-- Phone -->
                  <div>
                    <h3 class="flex items-center mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                      <UIcon name="i-heroicons-phone" class="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                      Telepon
                    </h3>
                    <p class="text-gray-600 dark:text-gray-300">{{ detailFax }}</p>
                    <p v-if="detailHp" class="text-gray-600 dark:text-gray-300">{{ detailHp }}</p>
                  </div>
                  <!-- Social Media -->
                  <div class="md:col-span-2">
                    <h3 class="flex items-center mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                      <UIcon name="i-heroicons-globe-alt" class="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                      Sosial Media
                    </h3>
                    <div class="flex items-center space-x-4">
                      <UTooltip v-for="(item, index) in detailSosmed" :key="index" :text="`Kunjungi kami di ${item.id}`">
                        <a 
                          :href="item.sosmed" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          class="flex items-center justify-center w-10 h-10 text-gray-500 transition-all duration-300 bg-gray-100 rounded-full dark:bg-slate-800 dark:text-gray-300 hover:text-white hover:bg-blue-600 dark:hover:bg-blue-600 hover:-translate-y-1"
                        >
                          <UIcon :name="`i-mdi-${item.id}`" class="w-5 h-5" />
                        </a>
                      </UTooltip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect, computed } from 'vue';
import { useRuntimeConfig } from '#app';
import { useFooterStore } from '@/store/footer/footer.js';

const footerStore = useFooterStore();
const config = useRuntimeConfig();
const isLoading = ref(true);  // Initialize isLoading

const title = ref('Dinas Komunikasi dan Informatika');
const detailNama = ref('');
const detailAlamat = ref('');
const detailMaps = ref('');
const detailDescript = ref('');
const detailImage = ref('');
const detailEmail = ref('');
const detailFax = ref('');
const detailHp = ref('');
const detailSosmed = ref([]);

// Meta tags for SEO
useHead({
  title: 'Kontak Kami - ' + title.value,
  meta: [
    { name: 'description', content: 'Hubungi Dinas Komunikasi dan Informatika untuk informasi lebih lanjut' },
    { property: 'og:title', content: 'Kontak Kami - ' + title.value },
    { property: 'og:description', content: 'Hubungi Dinas Komunikasi dan Informatika untuk informasi lebih lanjut' }
  ]
});

// Using footer store to fetch data
await footerStore.getFooterData();
const profileData = computed(() => footerStore.footerData?.data?.[0] || null);
const pending = ref(false);
const error = ref(null);

// Watch for errors
watchEffect(() => {
  if (error.value) {
    console.error('API Error:', error.value);
  }
});

// Update loading state based on pending status
watchEffect(() => {
  console.log('Loading state:', pending.value);
  isLoading.value = pending.value;
});

// Watch for data changes and update reactive refs
watchEffect(() => {
  if (profileData.value) {
    detailAlamat.value = profileData.value.alamat ?? '';
    detailNama.value = profileData.value.nama_opd ?? '';
    detailMaps.value = profileData.value.gmap ?? '';
    detailDescript.value = profileData.value.description ?? '';
    detailImage.value = profileData.value.logo ?? '';
    detailEmail.value = profileData.value.email ?? '';
    detailFax.value = profileData.value.fax ?? '';
    detailHp.value = profileData.value.telp ?? '';
    try {
      detailSosmed.value = typeof profileData.value.social === 'string'
        ? JSON.parse(profileData.value.social)
        : (profileData.value.social ?? []);
    } catch (e) {
      detailSosmed.value = [];
    }
    title.value = profileData.value.nama_opd ?? title.value;
  }
});
</script>

<style scoped>
/* Additional custom styling if needed */
</style>