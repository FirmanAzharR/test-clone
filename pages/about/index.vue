<template>
  <!-- eslint-disable vue/no-multiple-template-root -->
  <div
    :class="isDark ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-800'"
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
        class="text-left text-lg w-full prose prose-invert max-w-none"
        :class="isDark ? 'prose-invert text-gray-300' : 'text-gray-700'"
        v-html="heroRenstra.description"
      />
    </div>

    <div v-else-if="loading" class="text-center text-white">Loading...</div>
    <div v-else class="text-center text-red-400">Tidak ada data ditemukan.</div>
  </div>
  <div class="container mx-auto px-4 py-4 mt-1">
    <h2
      class="text-4xl font-bold mb-6 text-center"
      :class="isDark ? 'text-white' : 'text-gray-800'"
    >
      Nilai Universal yang Luar Biasa
    </h2>
    <p class="text-lg mb-4" :class="isDark ? 'text-white' : 'text-gray-800'">
      Nilai Universal yang Luar Biasa (OUV) berkaitan dengan warisan budaya yang
      melampaui batas-batas nasional dan merupakan kepentingan bersama bagi
      generasi sekarang dan masa depan seluruh umat manusia.
    </p>
  </div>
  <div
    v-if="cardRenstra.length"
    class="container flex flex-col-reverse gap-6 justify-center mx-auto p-6 mt-8"
  >
    <div
      v-for="(card, index) in cardRenstra"
      :key="card.id || index"
      class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-row w-full transition-transform hover:scale-[1.02] duration-300"
    >
      <img
        :src="card.image"
        :alt="card.title"
        class="w-48 h-48 object-cover rounded-full m-auto mx-5"
      />
      <div class="p-4">
        <h1
          class="text-2xl font-bold mb-2"
          :class="isDark ? 'text-white' : 'text-gray-800'"
        >
          {{ card.title }}
        </h1>
        <h3
          class="text-lg font-serif mb-2"
          :class="isDark ? 'text-white' : 'text-gray-800'"
        >
          {{ card.excert }}
        </h3>
        <p
          class="text-sm"
          :class="isDark ? 'text-white' : 'text-gray-800'"
          v-html="card.description"
        ></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useBeritaStore } from '~/store/berita/berita';
import { useLayout } from '@/store/layouts/layouts.js';

const beritaStore = useBeritaStore();
const loading = ref(false);
const heroRenstra = ref(null); // index 1
const cardRenstra = ref([]); // index 0
const layoutStore = useLayout();
const isDark = computed(() => layoutStore.theme === 'dark');

// const fetchRenstra = async () => {
//   loading.value = true;
//   try {
//     await beritaStore.getRenstraData();
//     const allData = beritaStore.renstraData?.data || [];

//     // Pisahkan data berdasarkan index
//     cardRenstra.value =
//       allData.find(
//         (item) => item.id === '3b229d7b-dd4d-437a-b193-ba8ce87d640e'
//       ) || null;
//     cardRenstraB.value =
//       allData.find(
//         (item) => item.id === '8ce73954-1888-43b9-941e-710eb917fc12'
//       ) || null;
//     heroRenstra.value =
//       allData.find(
//         (item) => item.id === '963d1231-de1b-4ed6-b539-646dfc27c126'
//       ) || null;
//   } catch (err) {
//     console.error('❌ Gagal memuat data Renstra:', err);
//   } finally {
//     loading.value = false;
//   }
// };

const fetchGeneral = async () => {
  loading.value = true;
  try {
    await beritaStore.getCategoryData('general');
    const rawData = beritaStore.generalData?.data || [];

    // Filter data yang memiliki tag 'hero' atau 'about'
    const filtered = rawData.filter((item) => {
      const tags = (item.tag || '')
        .toLowerCase()
        .split(',')
        .map((t) => t.trim());

      return tags.includes('hero') && tags.includes('about');
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
    cardRenstra.value = rawData.filter((item) => {
      const tags = (item.tag || '')
        .toLowerCase()
        .split(',')
        .map((t) => t.trim());

      return tags.includes('about') && tags.includes('card');
    });

    console.log('✅ Hero:', heroRenstra.value);
    console.log('✅ Atribut:', cardRenstra.value);
    console.log('✅ General:', filtered);
  } catch (err) {
    console.error('❌ Gagal memuat data General:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchGeneral);
</script>
