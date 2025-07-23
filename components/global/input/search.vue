<template>
  <div
    class="flex flex-row items-center rounded-xl border border-gray-300 bg-white px-2 py-px"
  >
    <Icon
      v-if="icon"
      name="ph:magnifying-glass-bold"
      color="#667085"
      size="20px"
    />
    <input
      type="text"
      :placeholder="placeholder"
      v-model="search_query"
      @input="updateValue()"
      class="w-full border-none text-sm focus:outline-none focus:ring-0 lg:text-base"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";

// Variabel
const props = defineProps({
  placeholder: {
    type: String,
    default: "placeholder",
  },
  icon: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:value"]);
const search_query = ref();

// Function
const updateValue = () => {
  emit("update:value", search_query.value);
};
</script>
