<template>
  <ClientOnly>
    <button
      :class="{
        [`${props.class}`]: true,
        'cursor-not-allowed opacity-50': !!isLoading,
      }"
      :style="props.style"
      :type="props.type"
      :disabled="isLoading"
    >
      <slot v-if="!!!isLoading"></slot>
      <span v-if="!!isLoading"
        ><Icon name="eos-icons:hourglass" /> Loading...</span
      >
    </button>
  </ClientOnly>
</template>

<script setup>

const props = defineProps({
  class: {
    type: String,
    default: "btn",
  },
  style: {
    type: Object,
    default: () => {},
  },
  type: {
    type: String,
    default: "button",
  },
});

</script>
