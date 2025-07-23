<script setup>
import { computed, toRef, ref } from "vue";
import { useField } from "vee-validate";

const props = defineProps({
  value: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    requiprimary: true,
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
    default: null,
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
  inline: { 
    type: Boolean,
    default: false,  
  },
});

const name = toRef(props, "name");
const showPassword = ref(true);

const {
  value: inputValue,
  errorMessage,
  handleBlur,
  handleChange,
  meta,
} = useField(name);
</script>

<template>
  <div
    class="mb-4 flex w-full flex-col last:mb-0"
    :class="{ success: meta.valid }"
  >
    <label
      v-if="label"
      :for="name"
      class="text-sm md:text-base dark:text-white text-black"
      :class="{
        'font-bold text-red-500': !!errorMessage,
        'inline-block': inline,
      }"
    >
      {{ label }}
      <span v-if="primary">
        <span class="font-bold text-red-500">*</span>
      </span>
    </label>

    <div class="relative flex">
      <span
        class="inline-flex h-11 items-center rounded-l-lg border border-r-0 border-slate-300 dark:border-slate-500 bg-gray-50 dark:bg-slate-800  px-4 text-gray-900"
        :class="{
          'border-red-500 bg-red-500': !!errorMessage,
        }"
        v-if="icon"
      >
        <div
          class="text-gray-400"
          :class="{
            'text-gray-50': !!errorMessage,
          }"
        >
          <Icon :name="icon" class="h-5 w-5" />
        </div>
      </span>
      <input
        :id="name"
        :name="name"
        :type="showPassword ? 'password' : 'text'"
        class="h-11 w-full rounded-lg border border-gray-300 p-2 dark:border-gray-600 text-sm focus:border-gray-300 focus:outline-none focus:ring-0 bg-white dark:bg-slate-800 dark:text-white text-slate-800"
        :class="{
          '!border-red-500 focus:border-red-500 ': !!errorMessage,
          'cursor-not-allowed': readonly,
          '!rounded-l-none': icon,
          'inline-block': inline,
        }"
        :disabled="disabled"
        :readonly="readonly"
        :value="inputValue"
        :placeholder="placeholder"
        @input="handleChange"
        @blur="handleBlur"
      />

      <div
        class="absolute inset-y-0 right-0 flex cursor-pointer items-center px-3 text-gray-600"
      >
        <Icon
          @click="showPassword = !showPassword"
          :name="showPassword ? 'iconoir:eye-alt' : 'iconoir:eye-close'"
          class="h-5 w-5 dark:text-slate-100"
        />
      </div>
    </div>
    <div
      v-if="!!errorMessage"
      class="mt-1 text-xs text-red-500"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
