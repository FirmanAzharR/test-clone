<template>
  <div class="animate-pulse rounded-md" :class="[height, width, color]"></div>
</template>

<script setup>
// Variable
const props = defineProps({
  height: {
    type: String,
    default: "h-8",
  },
  width: {
    type: String,
    default: "w-20",
  },
  color: {
    type: String,
    default: "bg-gray-200",
  },
});
</script>
