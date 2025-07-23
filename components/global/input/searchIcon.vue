<template>
  <div
    class="flex max-w-full cursor-pointer items-center justify-between gap-2 rounded-full bg-white px-2.5 dark:bg-slate-800 md:p-2"
    :class="`${customclass} ${isOpen || isAlwaysOpen ? 'py-0' : 'py-2.5'}`"
  >
    <Icon
      name="ic:sharp-search"
      class="relative h-5 w-5 text-gray-500 dark:text-white sm:h-6 sm:w-6 md:h-7 md:w-7"
      @click="
        () => {
          if (isAlwaysOpen) return;
          isOpen = true;
        }
      "
    />
    <input
      v-if="isOpen || isAlwaysOpen"
      v-model="search_query"
      @input="updateValue()"
      :placeholder="placeholder"
      type="text"
      class="w-full bg-white p-2 text-black dark:bg-slate-800 dark:text-white md:p-0"
    />
    <Icon
      v-if="isOpen || isAlwaysOpen"
      name="ic:sharp-close"
      class="relative h-5 w-5 text-gray-500 dark:text-white"
      @click="clearValue()"
    />
  </div>
</template>

<script setup>
// Variables
const emit = defineEmits();
const props = defineProps({
  placeholder: {
    type: String,
    default: "placeholder",
  },
  customclass: {
    type: String,
    default: "",
  },
  value: {
    type: String,
    default: null,
  },
  opensearch: {
    type: Boolean,
    default: false,
  },
  isAlwaysOpen: {
    type: Boolean,
    default: false,
  },
});
const isOpen = ref(props.opensearch);
const search_query = ref();

// Functions
const updateValue = () => {
  emit("update:value", search_query.value);
};
const clearValue = () => {
  if (props.isAlwaysOpen) {
    return;
  } else {
    isOpen.value = false;
  }
  search_query.value = null;
  emit("clear:value", search_query.value);
};

// Lifecycle
watch(
  () => props.value,
  (val) => {
    search_query.value = val;
  },
);
watch(
  () => props.opensearch,
  (val) => {
    isOpen.value = val;
  },
);
</script>

<style lang="scss" scoped>
:focus {
  outline: none;
}
</style>
