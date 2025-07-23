<template>
  <!-- eslint-disable vue/no-multiple-template-root -->
  <div
    :class="isDark ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-800'"
    class="mx-auto px-4 py-12 mt-16 h-full"
  >
    <!-- Hero Section -->
    <div class="flex flex-col items-center" v-if="heroRenstra">
      <img
        :src="heroRenstra.image"
        alt="Renstra Image"
        class="w-full h-[350px] object-cover bg-center rounded-lg mb-10"
      />
      <h1
        :class="isDark ? 'text-white' : 'text-gray-800'"
        class="w-[50%] text-3xl font-bold mb-4 text-center"
      >
        {{ heroRenstra.title }}
      </h1>
      <div
        class="text-left text-lg w-[80%] prose max-w-none"
        :class="isDark ? 'prose-invert text-gray-300' : 'text-gray-700'"
        v-html="heroRenstra.description"
      />
    </div>

    <!-- Loading / Empty -->
    <div v-else-if="loading" class="text-center text-white">Loading...</div>
    <div v-else class="text-center text-red-400">Tidak ada data ditemukan.</div>
  </div>

  <!-- Atribut Cards Grid -->
  <div
    v-if="cardRenstraList.length"
    class="w-[80%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10 px-4 mx-auto"
  >
    <div
      v-for="(card, index) in cardRenstraList"
      :key="card.id || index"
      class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform hover:scale-[1.02] duration-300 my-5"
    >
      <img
        :src="card.image"
        :alt="card.title"
        class="w-full h-44 object-cover"
      />

      <div class="p-4 flex flex-col flex-grow">
        <h1
          class="text-lg font-bold mb-2"
          :class="isDark ? 'text-white' : 'text-gray-800'"
        >
          {{ card.title }}
        </h1>
        <p class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
          {{ card.excert }}
        </p>
      </div>
      <NuxtLink
        :to="getDetailUrl(card)"
        class="text-blue-400 hover:underline m-4"
      >
        Baca Selengkapnya →
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useBeritaStore } from '~/store/berita/berita';
import { useLayout } from '@/store/layouts/layouts.js';

const beritaStore = useBeritaStore();
const layoutStore = useLayout();

const loading = ref(false);
const heroRenstra = ref(null); // data untuk tag 'hero'
const cardRenstraList = ref([]); // array untuk semua data 'atribut'
const isDark = computed(() => layoutStore.theme === 'dark');

const fetchGeneral = async () => {
  loading.value = true;
  try {
    await beritaStore.getCategoryData('general');
    const rawData = beritaStore.generalData?.data || [];

    // Filter data yang memiliki tag 'hero' atau 'atribut'
    const filtered = rawData.filter((item) => {
      const tags = (item.tag || '')
        .toLowerCase()
        .split(',')
        .map((t) => t.trim());

      return tags.includes('hero') || tags.includes('atribut');
    });

    // Ambil satu data dengan tag 'hero'
    heroRenstra.value =
      filtered.find((item) =>
        (item.tag || '')
          .toLowerCase()
          .split(',')
          .map((t) => t.trim())
          .includes('hero')
      ) || null;

    // Ambil semua data dengan tag 'atribut'
    cardRenstraList.value = filtered.filter((item) =>
      (item.tag || '')
        .toLowerCase()
        .split(',')
        .map((t) => t.trim())
        .includes('atribut')
    );

    console.log('✅ Hero:', heroRenstra.value);
    console.log('✅ Atribut:', cardRenstraList.value);
  } catch (err) {
    console.error('❌ Gagal memuat data General:', err);
  } finally {
    loading.value = false;
  }
};

const getDetailUrl = (item) => {
  return item.type === 'article'
    ? `/artikel/detail/${item.slug}`
    : `/berita/detail/${item.slug}`;
};

onMounted(() => {
  fetchGeneral();
});
</script>
