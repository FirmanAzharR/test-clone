<template>
  <UModal :open="isOpen" :prevent-close="true">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <UAvatar :alt="detail.NamaPemohon || ''" size="sm"
              :text="detail.NamaPemohon ? detail.NamaPemohon.charAt(0).toUpperCase() : ''" color="blue" />
            Detail Pemohon
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" class="-my-1" @click="close" />
        </div>
      </template>

      <div class="space-y-4">
        <div class="grid grid-cols-1 gap-4">
          <div>
            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Nama</h4>
            <p class="mt-1 text-base font-medium">{{ detail.NamaPemohon || "-" }}</p>
          </div>

          <div>
            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Identitas
            </h4>
            <p class="mt-1">{{ detail.no_an || "-" }}</p>
          </div>

          <div>
            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h4>
            <p class="mt-1">{{ detail.email || "-" }}</p>
          </div>

          <div>
            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">
              No Telp/HP
            </h4>
            <p class="mt-1">{{ detail.telp || "-" }}</p>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <UButton color="gray" variant="soft" @click="close"> Tutup </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  detail: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};
</script>
