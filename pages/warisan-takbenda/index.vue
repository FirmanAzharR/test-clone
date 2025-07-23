<template>
  <!-- eslint-disable vue/no-multiple-template-root -->
  <div
    :class="isDark ? ' text-white' : ' text-gray-800'"
    class="container mx-auto px-4 py-12 mt-16"
  >
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
        class="text-left text-lg w-full max-w-none prose"
        :class="isDark ? 'prose-invert text-gray-300' : 'text-gray-700'"
        v-html="heroRenstra.description"
      />
    </div>

    <div v-else-if="loading" class="text-center">
      <span :class="isDark ? 'text-gray-300' : 'text-gray-700'"
        >Loading...</span
      >
    </div>

    <div v-else class="text-center">
      <span :class="isDark ? 'text-red-400' : 'text-red-500'"
        >Tidak ada data ditemukan.</span
      >
    </div>
  </div>

  <div
    v-if="generalItems.length"
    class="container flex flex-col gap-8 mx-auto mt-12"
    :class="isDrak ? TextColor : 'text-gray-800'"
  >
    <div
      v-for="artikel in generalItems"
      :key="artikel.id"
      class="flex flex-col md:flex-row items-center rounded-lg shadow-lg p-6 bg-gray-800"
    >
      <img
        :src="artikel.image"
        :alt="artikel.title"
        class="w-40 h-40 md:w-64 md:h-64 object-cover rounded-lg mb-4 md:mb-0 md:mr-6"
      />
      <div class="flex-1 text-center md:text-left">
        <h1 class="text-3xl font-bold text-white mb-2">
          {{ artikel.title }}
        </h1>
        <!-- <h3 class="text-2xl font-serif text-white mb-2">
        {{ artikel.excert }}
      </h3> -->
        <!-- <p class="text-white mb-4" v-html="artikel.description"></p> -->
        <NuxtLink
          :to="getDetailUrl(artikel)"
          class="text-blue-400 hover:underline"
        >
          Baca Selengkapnya →
        </NuxtLink>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useBeritaStore } from '~/store/berita/berita';
import { useLayout } from '@/store/layouts/layouts.js';

const layoutStore = useLayout();
const isDark = computed(() => layoutStore.theme === 'dark');

const beritaStore = useBeritaStore();
const loading = ref(false);

const heroRenstra = ref(null);
const generalItems = ref([]); // Tambahan untuk data general

// Ambil data kategori 'general'
const fetchGeneral = async () => {
  try {
    await beritaStore.getCategoryData('general');

    // ✅ Pastikan rawData dideklarasikan dulu
    const rawData = beritaStore.generalData?.data || [];

    // ✅ Filter hanya yang memiliki tag 'warisan_takbenda'
    generalItems.value = rawData.filter(
      (item) => item.tag?.toLowerCase().trim() === 'warisan_takbenda'
    );

    heroRenstra.value = rawData.find((item) => {
      const tags = (item.tag || '')
        .toLowerCase()
        .split(',')
        .map((t) => t.trim());

      return tags.includes('hero') && tags.includes('warisan_takbenda');
    }) || null;

    console.log('📦 Filtered General Items:', generalItems.value);
  } catch (err) {
    console.error('❌ Gagal memuat data General:', err);
  }
};


// Buat URL ke halaman detail
const getDetailUrl = (item) => {
  return item.type === 'article'
    ? `/artikel/detail/${item.slug}`
    : `/berita/detail/${item.slug}`;
};

// Jalankan saat component dimount
onMounted(async () => {
  await fetchGeneral(); // ✅ Ambil data general
});
</script>
