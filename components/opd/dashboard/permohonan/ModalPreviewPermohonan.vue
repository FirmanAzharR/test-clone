<template>
  <UModal :model-value="isOpen" @update:model-value="updateIsOpen" :prevent-close="true">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold leading-6 text-gray-900 dark:text-white">
            Detail Permohonan
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="closeModal" />
        </div>
      </template>

      <div class="p-4">
        <div class="mb-4 max-h-[70vh] overflow-y-auto">
          <h4 class="text-lg font-semibold mb-2">
            No Permohonan: {{ data.NoPermohonan }}
          </h4>
          <div class="grid grid-cols-2 gap-4">
            <p class="text-sm text-gray-600 dark:text-gray-300">
              <span class="font-semibold">Kategori:</span> {{ data.KatPemohon }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              <span class="font-semibold">Nama Pemohon:</span> {{ data.NamaPemohon }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              <span class="font-semibold">No. Identitas:</span> {{ data.no_an }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              <span class="font-semibold">Email:</span> {{ data.email }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              <span class="font-semibold">No. Telp/HP:</span> {{ data.telp }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              <span class="font-semibold">Tanggal:</span>
              {{ formatDate(data.created_at) }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              <span class="font-semibold">Status:</span>
              <UBadge :color="getStatusColor(data.Status)" variant="subtle">
                {{ data.Status }}
              </UBadge>
            </p>
            <div class="col-span-2">
              <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">
                <span class="font-semibold">Rincian Informasi:</span>
                <br />{{ data.rincian }}
              </p>
            </div>
            <div class="col-span-2">
              <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">
                <span class="font-semibold">Tujuan:</span>
                <br />{{ data.tujuan }}
              </p>
            </div>
            <div v-if="data.Status === 'ditolak'" class="col-span-2">
              <p class="text-sm text-gray-600 dark:text-gray-300">
                <span class="font-semibold">Alasan Ditolak:</span>
                <br />{{ data.alasan_ditolak }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </UModal>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  isOpen: Boolean,
  data: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:modelValue", "close"]);

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "selesai":
      return "emerald";
    case "proses":
      return "yellow";
    case "ditolak":
      return "red";
    case "diterima":
    case "verifikasi":
      return "blue";
    default:
      return "gray";
  }
};

const updateIsOpen = (value) => {
  emit("update:modelValue", value);
};

const closeModal = () => {
  emit("update:modelValue", false);
  emit("close");
};
</script>
