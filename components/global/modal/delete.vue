<script setup>
import { ref } from 'vue';

const emit = defineEmits()
const isOpen = ref(false)

const confirmDelete = () => {
  emit('confirm')
  isOpen.value = false
}
</script>

<template>
  <div>
      <UButton size="sm" variant="soft" color="red" icon="i-heroicons-trash" :trailing="false" @click="isOpen = true">Delete</UButton>
    <UModal v-model="isOpen" prevent-close>
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-semibold leading-6 text-gray-900 dark:text-white">
              Delete Confirmation
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
              @click="isOpen = false" />
          </div>
        </template>

        <div class="flex justify-center p-4">
          <Vue3Lottie :animationLink="`/animation/delete.json`" :height="200" />
        </div>
        
        <UCardSection class="flex flex-col items-center justify-center space-y-4">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Are you sure you want to delete it?
          </p>
          <div class="flex space-x-4 justify-center items-center gap-2">
            <UButton size="lg" class="w-full items-center justify-center flex" color="red" variant="soft" label="Yes"
              :trailing="false" @click="confirmDelete()"/>
            <UButton size="lg" class="w-full items-center justify-center flex" color="gray" variant="solid" label="No"
              :trailing="false" @click="isOpen = false" />
          </div>
        </UCardSection>
      </UCard>
    </UModal>
  </div>
</template>
