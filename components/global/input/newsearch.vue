<template>
  <div
    class="search-container flex cursor-pointer items-center justify-between gap-2 rounded-full bg-white p-2 dark:bg-slate-800"
    :class="class"
  >
    <Icon
      name="ic:sharp-search"
      class="search-icon relative h-7 w-7 text-gray-500 dark:text-slate-200"
      @click="isOpen = true"
    />
    <input
      v-if="isOpen"
      v-model="search_query"
      @input="updateValue()"
      :placeholder="placeholder"
      type="text"
      class="search-input dark:bg-slate-800 dark:text-white"
    />
    <Icon
      v-if="isOpen"
      name="ic:sharp-close"
      class="close-icon relative h-5 w-5 text-gray-500"
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
  class: {
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
});
const isOpen = ref(props.opensearch);
const search_query = ref();

// Functions
const updateValue = () => {
  emit("update:value", search_query.value);
};
const clearValue = () => {
  isOpen.value = false;
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
.search-input {
  width: 100px;
}
</style>
