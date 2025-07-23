<script setup>
import { computed, toRef, useSlots } from "vue";
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
  placeholder: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  inline: {
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
});

const name = toRef(props, "name");
const root = ref(null);
const emit = defineEmits();
const {
  value: inputValue,
  errorMessage,
  handleBlur,
  handleChange,
  meta,
} = useField(name);

const onChange = (e) => {
  emit("update:value", e.target.value);
};

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
    class="flex w-full"
    :class="{
      success: meta.valid,
      'flex-row items-center justify-between': inline,
      'flex-col': !inline,
    }"
    ref="root"
  >
    <label
      v-if="label"
      :for="name"
      class="block text-sm md:text-base dark:text-white text-black"
      :class="{
        'inline-block': inline,
      }"
    >
      {{ label }}
      <span v-if="primary">
        <span class="font-bold text-red-500">*</span>
      </span>
    </label>
    <div class="flex w-full">
      <span
        v-if="icon"
        class="inline-flex h-11 items-center rounded-l-lg border border-r-0 border-slate-300 dark:border-slate-500 bg-gray-50 dark:bg-slate-800  px-4 text-gray-900"
        :class="{
          'border-red-500 bg-red-500': !!errorMessage,
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
        :id="name"
        :name="name"
        class="h-11 w-full rounded-lg border border-gray-300 p-2 dark:border-gray-600 text-sm focus:border-gray-300 focus:outline-none focus:ring-0 bg-white dark:text-white text-slate-800 dark:bg-slate-800 "
        :class="{
          '!border-red-500 focus:border-red-500 ': !!errorMessage,
          'cursor-not-allowed': readonly,
          '!rounded-l-none': icon,
          'inline-block': inline,
        }"
        type=""
        :disabled="disabled"
        :readonly="readonly"
        :value="inputValue"
        :placeholder="placeholder"
        @input="handleChange"
        @blur="handleBlur"
        @change="onChange"
        autocomplete="off"
      />
    </div>
    <div
      v-if="!!errorMessage"
      class="mt-1 text-xs text-red-500"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>
