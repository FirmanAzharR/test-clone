<script setup>
import { ref } from 'vue';

const emit = defineEmits()
const isOpen = ref(false)

const consfirmSlider = () => {
  emit('confirm')
  isOpen.value = false
}
</script>

<template>
  <div>
      <UButton size="sm" variant="soft" color="blue" icon="material-symbols:add-to-queue-outline-rounded" @click="isOpen = true" :trailing="false">To
        Slider</UButton>
    <UModal v-model="isOpen" prevent-close>
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-semibold leading-6 text-gray-900 dark:text-white">
              Slider Confirmation
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
              @click="isOpen = false" />
          </div>
        </template>

        <div class="flex justify-center p-4">
          <Vue3Lottie :animationLink="`/animation/image.json`" :height="200" />
        </div>
        
        <UCardSection class="flex flex-col items-center justify-center space-y-4">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Are you sure you want to insert into the slider?
          </p>
          <div class="flex items-center justify-center gap-2 space-x-4">
            <UButton size="lg" class="flex items-center justify-center w-full" color="blue" variant="soft" label="Yes"
              :trailing="false" @click="consfirmSlider()"/>
            <UButton size="lg" class="flex items-center justify-center w-full" color="gray" variant="solid" label="No"
              :trailing="false" @click="isOpen = false" />
          </div>
        </UCardSection>
      </UCard>
    </UModal>
  </div>
</template>
