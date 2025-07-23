<template>
  <div :class="isLoading ? 'animate-pulse' : ''">
    <NuxtImg
      :src="src"
      :sizes="sizes"
      :class="`object-cover object-center duration-700 ease-in-out ${
        isLoading
          ? 'scale-[1.02] blur-xl grayscale'
          : 'scale-100 blur-0 grayscale-0'
      } ${width} ${height} ${customclass}`"
      :alt="alt"
      placeholder
      loading="lazy"
      @load="handleLoad"
    />
  </div>
</template>

<script setup>
// variables
const props = defineProps({
  src: {
    type: String,
  },
  alt: {
    type: String,
    default: "Image",
  },
  sizes: {
    type: String,
  },
  width: {
    type: String,
    default: "w-full",
  },
  height: {
    type: String,
    default: "h-full",
  },
  customclass: {
    type: String,
    default: "",
  },
});
const isLoading = ref(true);

// functions
function handleLoad() {
  isLoading.value = false;
}
</script>
