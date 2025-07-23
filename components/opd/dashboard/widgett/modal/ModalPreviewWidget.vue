<template>
  <UModal :model-value="isOpen" @update:model-value="updateIsOpen" :prevent-close="true">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }"
      class="max-h-[90vh] flex flex-col">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold leading-6 text-gray-900 dark:text-white">
            Preview Widget
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="closeModal" />
        </div>
      </template>

      <div class="p-4 overflow-y-auto">
        <div class="mb-4">
          <h4 class="text-lg font-semibold mb-2">{{ data?.title }}</h4>
          <div class="space-y-4">
            <div class="mb-4 flex justify-center">
              <img :src="data?.iconfab" alt="Widget Icon" class="rounded-lg max-w-full h-auto" @load="onImageLoad"
                ref="previewImg" />
            </div>
            <div class="space-y-2">
              <p class="text-sm text-gray-600 dark:text-gray-300">
                <span class="font-semibold">Kategori:</span>
                <span class="ml-1 capitalize">{{ data?.opt }}</span>
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                <span class="font-semibold">Status:</span>
                <UBadge :color="data?.publish === '1' || data?.publish === 1 ? 'emerald' : 'yellow'
                  " variant="subtle" class="ml-1">
                  {{
                    data?.publish === "1" || data?.publish === 1 ? "Published" : "Pending"
                  }}
                </UBadge>
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                <span class="font-semibold">Tanggal:</span>
                {{ formatDate(data?.created_at) }}
              </p>
              <div class="text-sm text-gray-600 dark:text-gray-300">
                <span class="font-semibold">Pesan:</span>
                <div class="mt-1 whitespace-pre-line break-words">
                  {{ data?.message }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </UModal>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { format } from "date-fns";
import { id } from "date-fns/locale";
const previewImg = ref(null);

const onImageLoad = () => {
  nextTick(() => {
    const img = previewImg.value;
    if (img && img.naturalWidth && img.naturalHeight) {
      // Set card height to image height (responsive)
      const card = img.closest(".max-h-[90vh]");
      if (card) {
        card.style.height = img.height + 80 + "px"; // 80px for paddings/header
        card.style.maxHeight = "90vh";
      }
    }
  });
};

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
  return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: id });
};

const updateIsOpen = (value) => {
  emit("update:modelValue", value);
};

const closeModal = () => {
  emit("update:modelValue", false);
  emit("close");
};
</script>
