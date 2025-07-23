<script setup>
// import
import { toRef } from "vue";
import { useField } from "vee-validate";

const props = defineProps({
  value: {
    type: String,
    default: "",
  },
  name: {
    type: String,
  },
  label: {
    type: String,
    requiprimary: false,
  },
  icon: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  primary: {
    type: Boolean,
    default: false,
  },
  min: {
    type: String,
  },
  max: {
    type: String,
  },
});

const name = toRef(props, "name");
const root = ref(null);
const {
  value: inputValue,
  errorMessage,
  handleBlur,
  handleChange,
  meta,
} = useField(name);

watch(errorMessage, (newVal) => {
  if (newVal) {
    nextTick(() => {
      root.value.scrollIntoView({ behavior: "smooth" });
    });
  }
});
</script>

<template>
  <div
    class="flex w-full flex-col"
    :class="{
      success: meta.valid,
    }"
    ref="root"
  >
    <label
      v-if="label"
      :for="name"
      class="block text-sm text-gray-900 md:text-base"
      :class="{
        'font-bold text-primary-500': !!errorMessage,
        'inline-block': inline,
      }"
    >
      {{ label }}
      <span v-if="primary">
        <span class="font-bold text-primary-500">*</span>
      </span>
    </label>
    <div class="flex w-full">
      <span
        v-if="icon"
        class="inline-flex h-12 items-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-4 text-gray-900"
        :class="{
          'border-primary-500 bg-primary-500': !!errorMessage,
        }"
      >
        <div
          v-if="icon"
          class="text-gray-400"
          :class="{
            'text-white': !!errorMessage,
          }"
        >
          <Icon :name="icon" class="h-5 w-5" />
        </div>
      </span>
      <input
        type="time"
        :id="name"
        :name="name"
        :min="min"
        :max="max"
        class="h-11 w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-gray-300 focus:outline-none focus:ring-0 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
        :class="{
          '!border-primary-500 focus:border-primary-500': !!errorMessage,
          'cursor-not-allowed': readonly,
          '!rounded-l-none': icon,
        }"
        :disabled="disabled"
        :readonly="readonly"
        :value="inputValue"
        @input="handleChange"
        @blur="handleBlur"
      />
    </div>
    <div
      v-if="!!errorMessage"
      class="mt-1 text-xs text-primary-500 dark:text-primary-500"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>
