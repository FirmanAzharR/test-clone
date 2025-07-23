<template>
  <UModal :model-value="isOpen" @update:model-value="updateIsOpen" @close="closeModal" :prevent-close="true">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }" class="w-full max-w-4xl">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold leading-6 text-gray-900 dark:text-white">
            Preview Konten
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="closeModal" />
        </div>
      </template>
      <!-- Image Section -->
      <div class="w-full px-6 pt-6">
        <div v-if="getImageUrl()" class="w-full">
          <NuxtImg :src="getImageUrl()" alt="Gambar Konten" class="w-full h-auto rounded-lg shadow-md" />
        </div>
        <div v-else
          class="w-full h-48 rounded-lg shadow-md bg-gray-100 dark:bg-slate-800 flex flex-col items-center justify-center gap-2">
          <div class="text-4xl text-gray-400">
            <Icon name="i-heroicons:photo" />
          </div>
          <span class="text-gray-500 dark:text-gray-400 text-sm font-medium">No Image</span>
        </div>
      </div>
      <!-- Content Section -->
      <div class="flex flex-col gap-6 p-6" v-for="(item, index) in getContentData()" :key="index">
        <div class="w-full space-y-4">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ item?.title }}
          </h2>
          <div
            class="prose max-w-none dark:prose-invert text-gray-700 dark:text-gray-300 content-wrapper overflow-hidden">
            <div v-html="cleanDescription(item?.description)"></div>

            <!-- File Embed dari drive_id jika tidak ada dalam deskripsi -->
            <div v-if="item?.drive_id && !getEmbedUrl(item?.description)"
              class="w-full rounded-lg overflow-hidden bg-gray-50 dark:bg-slate-800/50 my-4">
              <div class="aspect-video w-full">
                <iframe class="w-full h-full" :src="'https://drive.google.com/file/d/' + item.drive_id + '/preview'"
                  frameborder="0" allowfullscreen></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end p-4">
          <UButton type="button" color="blue" @click="closeModal"> Back </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup>
import { useBeritaStore } from "~/store/berita/berita";

const props = defineProps({
  isOpen: Boolean,
  articleId: String,
});

const emit = defineEmits(["close", "update:modelValue"]);
const beritaStore = useBeritaStore();

const getImageUrl = () => {
  const data = beritaStore?.detailBeritaAdmin;
  if (!data) return null;

  // Coba berbagai kemungkinan struktur data
  if (data.data && Array.isArray(data.data) && data.data[0]?.image) {
    return data.data[0].image;
  }
  if (data.data && data.data.image) {
    return data.data.image;
  }
  if (data.image) {
    return data.image;
  }
  if (Array.isArray(data) && data[0]?.image) {
    return data[0].image;
  }

  return null;
};

const getContentData = () => {
  const data = beritaStore?.detailBeritaAdmin;
  if (!data) return [];

  // Coba berbagai kemungkinan struktur data
  if (data.data && Array.isArray(data.data)) {
    return data.data;
  }
  if (data.data && !Array.isArray(data.data)) {
    return [data.data];
  }
  if (Array.isArray(data)) {
    return data;
  }
  if (data.title || data.description) {
    return [data];
  }

  return [];
};

const getEmbedUrl = (description) => {
  if (!description) return null;

  // Mencari URL embed dari konten
  const match = description.match(
    /src="(https:\/\/drive\.google\.com\/file\/d\/[^/]+\/preview[^"]*)/
  );
  return match ? match[1] : null;
};

const cleanDescription = (description) => {
  if (!description) return "";

  return description;
};

const closeModal = () => {
  emit("update:modelValue", false);
  emit("close");
};

const updateIsOpen = (value) => {
  emit("update:modelValue", value);
};
</script>

<style scoped>
.aspect-video {
  position: relative;
  padding-bottom: 56.25%;
  /* 16:9 Aspect Ratio */
}

.aspect-video iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Style untuk tabel yang bisa di-scroll horizontal */
.content-wrapper :deep(figure.table) {
  display: block;
  width: 100%;
  overflow-x: auto;
  margin: 1rem 0;
  border-radius: 4px;
  position: relative;
  /* Gaya scroll yang lebih baik */
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.content-wrapper :deep(figure.table::-webkit-scrollbar) {
  height: 8px;
}

.content-wrapper :deep(figure.table::-webkit-scrollbar-track) {
  background: #f7fafc;
}

.content-wrapper :deep(figure.table::-webkit-scrollbar-thumb) {
  background-color: #cbd5e0;
  border-radius: 4px;
}

.content-wrapper :deep(table) {
  border-collapse: collapse;
  width: 100%;
  table-layout: auto;
  min-width: 100%;
  /* Memastikan tabel mengisi penuh container */
}

.content-wrapper :deep(table th),
.content-wrapper :deep(table td) {
  border: 1px solid #e2e8f0;
  padding: 0.5rem;
  text-align: left;
  min-width: 120px;
  /* Lebar minimum yang lebih besar untuk tiap kolom */
  max-width: auto;
  /* Lebar maksimum untuk menghindari kolom yang terlalu lebar */
  white-space: nowrap;
  /* Mencegah text wrapping dalam tabel untuk scroll horizontal */
}

.dark .content-wrapper :deep(table th) {
  background-color: #27354c !important;
}

.content-wrapper :deep(table th) {
  background-color: #f8fafc;
  font-weight: 600;
}

/* Style untuk iframe yang ada di dalam konten */
.content-wrapper :deep(iframe) {
  max-width: 100%;
  margin: 1rem 0;
  border-radius: 4px;
}

/* Style untuk figure dan gambar */
.content-wrapper :deep(figure) {
  margin: 1rem 0;
}
</style>
