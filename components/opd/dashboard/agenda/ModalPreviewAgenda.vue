<template>
  <UModal :model-value="isOpen" @update:model-value="updateModelValue" :prevent-close="true">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold leading-6 text-gray-900 dark:text-white">
            Preview Agenda
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="closeModal" />
        </div>
      </template>

      <div class="p-4 max-h-[80vh] overflow-y-auto">
        <div class="mb-4">
          <h4 class="text-lg font-semibold mb-2">{{ data.kegiatan }}</h4>
          <div class="grid grid-cols-2 gap-4">
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">
              <span class="font-semibold">Lokasi:</span> {{ data.lokasi }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">
              <span class="font-semibold">Tanggal:</span>
              {{ formatDate(data.created_at) }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">
              <span class="font-semibold">Jam:</span> {{ formatTime(data.created_at) }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">
              <span class="font-semibold">Status:</span>
              <UBadge :color="data.publish === '1'
                  ? 'emerald'
                  : data.publish === '2'
                    ? 'gray'
                    : 'yellow'
                " variant="subtle">
                {{
                  data.publish === "1"
                    ? "Published"
                    : data.publish === "2"
                      ? "Private"
                      : "Pending"
                }}
              </UBadge>
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-2 col-span-2">
              <span class="font-semibold">Penanggung Jawab:</span>
              <template v-if="data.person">
                <div v-for="(person, index) in data.person.split('-')" :key="index" class="ml-4">
                  {{ person.trim() }}
                </div>
              </template>
            </p>
          </div>
        </div>
      </div>
    </UCard>
  </UModal>
</template>

<script setup>
import { ref } from "vue";
import { format } from "date-fns";

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
  const date = new Date(dateString);
  return format(date, "yyyy-MM-dd");
};

const formatTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return format(date, "HH:mm");
};

const updateModelValue = (value) => {
  emit("update:modelValue", value);
};

const closeModal = () => {
  emit("update:modelValue", false);
  emit("close");
};
</script>
