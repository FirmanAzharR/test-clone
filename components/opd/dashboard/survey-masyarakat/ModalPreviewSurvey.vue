<template>
  <UModal :open="isOpen" :ui="{ width: 'max-w-5xl' }" @close="updateIsOpen(false)" :prevent-close="true">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            Preview Soal
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="closeModal" />
        </div>
      </template>

      <div class="p-4 space-y-6">
        <!-- Preview Soal -->
        <div>
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <span class="text-sm font-medium text-gray-500">Urutan:</span>
              <span class="ml-2 text-gray-900 dark:text-gray-500">{{
                detailData?.urutan
              }}</span>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">Status:</span>
              <span class="ml-2" :class="detailData?.publish === '1' ? 'text-green-600' : 'text-yellow-600'
                ">
                {{ detailData?.publish === "1" ? "Published" : "Pending" }}
              </span>
            </div>
          </div>

          <UCard class="mb-4">
            <div class="p-4">
              <h4 class="font-medium text-gray-900 dark:text-white mb-4">
                {{ detailData?.title }}
              </h4>

              <div v-if="options.length > 0" class="space-y-4">
                <template v-if="options[0].type === 'radio'">
                  <div v-for="(opt, index) in options" :key="index" class="flex items-center space-x-3">
                    <URadio :name="'preview-' + detailData?.id" :value="opt.value" disabled />
                    <label class="text-sm text-gray-700 dark:text-gray-300">{{
                      opt.title
                    }}</label>
                  </div>
                </template>

                <template v-else-if="options[0].type === 'text'">
                  <UTextarea disabled placeholder="Text input field" class="w-full" />
                </template>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Tabel dengan scrollbar -->
        <div>
          <h4 class="font-medium mb-4">Urutan Soal Kepuasan Masyarakat</h4>
          <div class="border rounded-lg">
            <div style="max-height: 400px; overflow-y: auto" class="custom-scrollbar">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50 sticky top-0">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Urutan
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Judul Soal
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="row in sortedQuestions" :key="row.id" :data-id="row.id"
                    :class="{ 'bg-primary-50': row.id === detailData?.id }" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ row.urutan }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm" :class="{
                      'text-primary-600 font-medium': row.id === detailData?.id,
                      'text-gray-900': row.id !== detailData?.id,
                    }">
                      {{ row.title }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 py-1 text-xs rounded-full" :class="row.publish === '1'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                        ">
                        {{ row.publish === "1" ? "Published" : "Pending" }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <UButton color="gray" variant="solid" @click="closeModal"> Tutup </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup>
import { ref, computed, watch, nextTick } from "vue";
import { useSoalStore } from "~/store/survey-masyarakat/soal";

const props = defineProps({
  isOpen: Boolean,
  detailData: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["close", "update:modelValue"]);
const soalStore = useSoalStore();

const options = computed(() => {
  if (!props.detailData?.opt) return [];
  try {
    return typeof props.detailData.opt === "string"
      ? JSON.parse(props.detailData.opt)
      : props.detailData.opt;
  } catch (e) {
    console.error("Error parsing options:", e);
    return [];
  }
});

// Computed untuk mengurutkan questions berdasarkan urutan
const sortedQuestions = computed(() => {
  const questions = soalStore.questions || [];
  return [...questions].sort((a, b) => Number(a.urutan) - Number(b.urutan));
});

// Watch untuk memastikan data terupdate saat modal dibuka
watch(
  () => props.isOpen,
  async (newValue) => {
    if (newValue) {
      await soalStore.getAllSoal();
      // Menunggu DOM diupdate sebelum melakukan scroll
      nextTick(() => {
        scrollToSelectedRow();
      });
    }
  }
);

// Add new function to handle scrolling
const scrollToSelectedRow = () => {
  if (!props.detailData?.id) return;

  const selectedRow = document.querySelector(`tr[data-id="${props.detailData.id}"]`);
  const container = document.querySelector(".custom-scrollbar");
  const thead = document.querySelector("thead");

  if (selectedRow && container && thead) {
    // Mengambil tinggi header untuk offset
    const theadHeight = thead.offsetHeight;

    // Menghitung posisi scroll yang tepat
    const containerRect = container.getBoundingClientRect();
    const rowRect = selectedRow.getBoundingClientRect();

    // Menyesuaikan scroll position dengan mempertimbangkan header
    const scrollTop = selectedRow.offsetTop - theadHeight;

    // Scroll ke posisi yang telah disesuaikan
    container.scrollTo({
      top: scrollTop,
      behavior: "smooth",
    });
  }
};

const closeModal = () => {
  emit("close");
  emit("update:modelValue", false);
};

const updateIsOpen = (value) => {
  emit("update:modelValue", value);
  if (!value) {
    emit("close");
  }
};
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
  position: relative;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 4px;
  border: 2px solid #f1f5f9;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}

thead {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #f8fafc;
}

/* Menambahkan efek hover yang lebih jelas */
tbody tr:hover {
  background-color: #f1f5f9;
}

/* Memperjelas baris yang aktif */
tbody tr[data-id="${props.detailData?.id}"] {
  background-color: #e0f2fe !important;
  transition: background-color 0.3s ease;
}
</style>
