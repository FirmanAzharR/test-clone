<template>
  <nav aria-label="Breadcrumb">
    <!-- Main breadcrumb container with responsive layout -->
    <div class="flex flex-col space-y-1">
      <div class="flex flex-wrap items-center gap-y-1">
        <ol class="inline-flex items-center space-x-1 md:space-x-3">
          <!-- Home -->
          <li class="inline-flex items-center">
            <NuxtLink to="/" class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
              <UIcon name="i-heroicons-home" class="w-4 h-4 mr-2" />
              Beranda
            </NuxtLink>
          </li>

          <!-- Dynamic breadcrumb items (except last) -->
          <li v-for="(item, index) in items.slice(0, -1)" :key="index">
            <div class="flex items-center">
              <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 text-gray-400" />
              <NuxtLink
                :to="item.to"
                class="ml-1 text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                {{ item.text }}
              </NuxtLink>
            </div>
          </li>
        </ol>

        <!-- Last item -->
        <div v-if="items.length > 0" class="flex items-center min-w-0">
          <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 text-gray-400 shrink-0" />
          <div v-if="!loading" class="min-w-0">
            <span class="ml-1 text-sm font-medium text-blue-600 dark:text-blue-400 truncate block">
              {{ items[items.length - 1].text }}
            </span>
          </div>
          <div v-else class="w-20 h-5 ml-1">
            <Vue3LoadingShimmer class="w-20 h-5 rounded" />
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});
</script>