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
    required: true,
  },
  label: {
    type: String,
    required: false,
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
    class="relative my-3 w-full first:mt-0 last:mb-0"
    :class="{ success: meta.valid, 'inline-flex items-center': inline }"
  >
    <label
      v-if="label"
      :for="name"
      class="block text-sm md:text-base dark:text-white text-black"
      :class="{
        'font-bold text-red-500': !!errorMessage,
        'mr-2 inline-block': inline,
      }"
    >
      <span v-if="primary">
        <span class="font-bold text-red-500">*</span>
      </span>
      {{ label }}</label
    >
    <div class="relative w-full">
      <textarea
        :id="name"
        :name="name"
        type="text"
        class="form-control text-dark block w-full rounded-[9px] border border-slate-300 dark:border-slate-600 shadow dark:bg-slate-800 focus:border-gray-300 focus:outline-none focus:ring-0"
        :class="{
          '!dark:border-red-500 !border-red-500': !!errorMessage,
          'pl-10': !!icon,
          'cursor-not-allowed': disabled || readonly,
        }"
        rows="3"
        :disabled="disabled"
        :readonly="readonly"
        :value="inputValue"
        :placeholder="placeholder"
        @input="handleChange"
        @blur="handleBlur"
      >
      </textarea>

      <!-- <BaseIcon
        v-if="icon"
        :path="icon"
        w="w-10"
        h="h-12"
        class="absolute top-0 left-0 z-10 pointer-events-none text-gray-500 dark:text-slate-400"
      /> -->
      <!-- <div class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600">
        <i class="fa fa-eye" :class="iconClasses"></i>
      </div> -->

      <div
        v-if="icon"
        class="absolute inset-y-0 left-0 flex items-center px-3 text-gray-500"
      >
        <Icon :name="icon" class="h-5 w-5" />
      </div>
    </div>
    <div
      v-if="!!errorMessage"
      class="mt-1 text-xs text-red-500 dark:text-red-500"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
textarea {
  padding: 0.5rem; /* Adjust padding to ensure input is not too close to the frame */
}
</style>
