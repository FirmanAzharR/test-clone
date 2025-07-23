<template>
  <div
    class="flex min-h-[10rem] w-full flex-col items-center justify-center gap-2"
  >
    <ClientOnly>
      <Vue3Lottie :animationLink="`/animation/no-data.json`" :height="200" />
    </ClientOnly>
    <span
      class="text-center text-base font-bold text-gray-700 dark:text-slate-200 sm:text-lg md:text-xl"
      >Seems there is nothing here</span
    >
    <span class="text-center text-sm text-gray-500 dark:text-slate-200 md:text-base"
      >Try to look for another {{ data_for }} data</span
    >
    <slot />
  </div>
</template>

<script setup>
const prop = defineProps({
  data_for: {
    type: String,
    default: "specific",
  },
});
</script>

<style lang="scss" scoped></style>
