<template>
  <div
    :class="isDark ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-800'"
    class="container mx-auto px-4 py-12 mt-16"
  >
    <!-- Hero Section -->
    <div class="flex flex-col items-center" v-if="heroRenstra">
      <img
        :src="heroRenstra.image"
        alt="Renstra Image"
        class="w-full h-[550px] object-cover bg-center rounded-lg mb-10"
      />
      <h1
        :class="isDark ? 'text-white' : 'text-gray-800'"
        class="text-4xl font-bold mb-4"
      >
        {{ heroRenstra.title }}
      </h1>
      <div
        class="text-left text-lg w-full prose max-w-none"
        :class="isDark ? 'prose-invert text-white' : 'text-gray-700'"
        v-html="heroRenstra.description"
      />
    </div>

    <div v-else-if="loading" class="text-center text-white">Loading...</div>
    <div v-else class="text-center text-red-400">Tidak ada data ditemukan.</div>
    <!-- Gambar statis tambahan -->
    <div v-if="imageRenstra" class="container mx-auto px-4 py-4 mt-1">
      <img
        :src="imageRenstra.image"
        alt="status"
        class="w-full h-full object-cover bg-center rounded-lg mb-10"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useBeritaStore } from '~/store/berita/berita';
import { useLayout } from '@/store/layouts/layouts.js';

const beritaStore = useBeritaStore();
const layoutStore = useLayout();

const isDark = computed(() => layoutStore.theme === 'dark');
const loading = ref(false);
const heroRenstra = ref(null);
const imageRenstra = ref(null);

// ✅ Ambil data dari kategori 'general' dan filter untuk tag 'hero' + 'konservasi'
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
        return tags.includes('hero') && tags.includes('konservasi');
      }) || null;

    imageRenstra.value =
      rawData.find((item) => {
        const tags = (item.tag || '')
          .toLowerCase()
          .split(',')
          .map((t) => t.trim());
        return tags.includes('image') && tags.includes('konservasi');
      }) || null;

    console.log('🟢 Hero Renstra:', heroRenstra.value);
  } catch (err) {
    console.error('❌ Gagal memuat data General:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchGeneral);
</script>
