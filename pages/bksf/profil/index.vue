<script setup>
import { ref, onMounted, computed } from 'vue';
import { useBeritaStore } from '@/store/berita/berita';
import { useLayout } from '@/store/layouts/layouts.js';

const beritaStore = useBeritaStore();
const layoutStore = useLayout();

const loading = ref(false);
const heroRenstra = ref(null);
const imageRenstra = ref(null);

// computed agar bisa dipakai langsung di template tanpa .value
const hero = computed(() => heroRenstra.value);
const image = computed(() => imageRenstra.value);

const fetchGeneral = async () => {
  loading.value = true;
  try {
    await beritaStore.getCategoryData('general');
    const rawData = beritaStore.generalData?.data || [];

    heroRenstra.value =
      rawData.find((item) => {
        const tags = (item.tag || '')
          .toLowerCase()
          .split(',')
          .map((t) => t.trim());
        return tags.includes('hero') && tags.includes('profile');
      }) || null;

    imageRenstra.value =
      rawData.find((item) => {
        const tags = (item.tag || '')
          .toLowerCase()
          .split(',')
          .map((t) => t.trim());
        return tags.includes('image') && tags.includes('profile');
      }) || null;

    console.log('🟢 Hero Renstra:', heroRenstra.value);
    console.log('🟢 Image Renstra:', imageRenstra.value);
  } catch (err) {
    console.error('❌ Gagal memuat data General:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchGeneral);
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 mt-24">
    <div class="container mx-auto px-4">
      <div v-if="loading" class="flex justify-center items-center h-64">
        <span class="text-gray-500 dark:text-gray-300 text-lg"
          >Memuat data...</span
        >
      </div>

      <div v-else>
        <!-- Hero Renstra Section -->
        <div v-if="hero" class="mb-8">
          <!-- Gambar Hero -->
          <div class="flex justify-center mb-4">
            <img
              v-if="hero.image"
              :src="hero.image"
              :alt="hero.title"
              class="rounded-lg shadow-md w-full object-cover"
            />
          </div>
          <h1
            class="text-3xl font-bold text-gray-800 dark:text-white mb-4 text-center"
          >
            {{ hero.title }}
          </h1>
          <!-- Deskripsi Hero -->
          <div
            class="text-gray-600 dark:text-gray-300"
            v-html="hero.description"
          ></div>
        </div>

        <!-- Image Section -->
        <div v-if="image" class="mb-8 flex justify-center">
          <img
            :src="image.image"
            :alt="image.title"
            class="rounded-lg shadow-lg max-w-md w-full object-cover"
          />
        </div>

        <!-- No Data -->
        <div
          v-if="!hero && !image"
          class="text-center text-gray-500 dark:text-gray-300"
        >
          Data profil belum tersedia.
        </div>
      </div>
    </div>
  </div>
</template>
