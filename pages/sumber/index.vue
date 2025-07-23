<template>
  <div class="p-4 mt-24 mb-24 bg-slate-800">
    <h2 class="text-xl text-center font-semibold mb-4">Deskripsi dengan Tag "Sumber"</h2>

    <ul v-if="generalItems.length > 0" class="space-y-6">
      <li
        v-for="item in generalItems"
        :key="item.id"
        class="p-4 rounded-lg shadow text-white bg-slate-100"
      >
        <!-- Render HTML deskripsi -->
        <div v-html="item.description" class="prose max-w-none" />
      </li>
    </ul>

    <p v-else class="text-gray-500">Tidak ada data dengan tag "sumber".</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useBeritaStore } from '~/store/berita/berita';

const beritaStore = useBeritaStore();
const generalItems = ref([]);

const fetchGeneral = async () => {
  try {
    await beritaStore.getCategoryData('general');
    const rawData = beritaStore.generalData?.data || [];

    generalItems.value = rawData.filter(
      (item) => item.tag?.toLowerCase().trim() === 'sumber'
    );

    console.log('📦 Filtered General Items:', generalItems.value);
  } catch (err) {
    console.error('❌ Gagal memuat data General:', err);
  }
};

onMounted(() => {
  fetchGeneral();
});
</script>

<style scoped>
/* Optional: styling to support HTML inside description */
.prose a {
  color: #1d4ed8;
  text-decoration: underline;
}
</style>
