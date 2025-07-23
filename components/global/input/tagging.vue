<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="name"
      class="form-label block w-40"
      :class="{
        'font-bold text-red-500': isError,
        'mr-2 inline-block': inline,
      }"
    >
      <span v-if="primary">
        <span class="font-bold text-red-500">*</span>
      </span>
      {{ label }}
    </label>
    <div
      :class="`flex h-fit w-full max-w-lg flex-wrap rounded-lg border ${
        isError ? 'border-red-500' : 'border-gray-300'
      }`"
    >
      <div
        v-for="(badge, index) in badges"
        :key="index"
        class="m-1 flex max-w-lg items-center bg-gray-100 px-2 py-1 text-gray-500"
      >
        <p class="max-w-md overflow-hidden overflow-ellipsis whitespace-nowrap">
          {{ badge }}
        </p>
        <Icon
          name="material-symbols-light:close-small-outline"
          size="25"
          @click="removeBadge(index)"
          class="cursor-pointer"
        />
      </div>
      <input
        type="text"
        :placeholder="placeholder"
        v-model="inputText"
        @keyup.enter="addBadge"
        class="m-1 h-10 w-full"
        :disabled="disabled"
        :readonly="readonly"
      />
    </div>
    <div v-if="isError" class="mt-1 text-xs text-red-500 dark:text-red-500">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
// Imports
import { ref } from "vue";

// Variables
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  primary: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  value: {
    type: String,
    default: "",
  },
  errorMessage: {
    type: String,
    default: "",
  },
});
const inputText = ref("");
const badges = ref([]);
const emit = defineEmits();
const isError = ref(false);

// Function
const addBadge = () => {
  if (inputText.value.trim() !== "") {
    badges.value.push(inputText.value.trim());
    emit("update:value", badges.value);
    inputText.value = "";
    isError.value = false;
  }
};
const removeBadge = (index) => {
  badges.value.splice(index, 1);
  emit("update:value", badges.value);
  if (badges.value.length === 0) {
    isError.value = true;
  }
};
</script>

<style scoped>
:focus {
  outline: none;
}
</style>
