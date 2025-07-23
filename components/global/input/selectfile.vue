<script setup>
import { computed, toRef, useSlots } from "vue";
import { useField } from "vee-validate";
import Multiselect from "@vueform/multiselect";

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
  options: {
    type: Array,
    default: () => [],
  },
  inline: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String,
    default: "single",
  },
  createOption: {
    type: Boolean,
    default: false,
  },
  searchable: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits();
const name = toRef(props, "name");
const {
  value: inputValue,
  errorMessage,
  handleBlur,
  handleChange,
  meta,
} = useField(name);

const dropdowninput = computed({
  get() {
    // console.log("inputValue.value", `${name.value}`);
    // return 'ADSTAFF'
    return inputValue.value;
  },
  set(value) {
    handleChange(value);
    emit("update:value", value);
  },
});
</script>

<template>
  <div
    class="relative w-full first:mt-0 last:mb-0"
    :class="{ success: meta.valid, 'inline-flex items-center': inline }"
  >
    <label
      v-if="label"
      :for="name"
      class="form-label block w-40"
      :class="{
        'font-bold text-red-500': !!errorMessage,
        'mr-2 inline-block': inline,
      }"
    >
      <span v-if="primary">
        <span class="font-bold text-red-500">*</span>
      </span>
      {{ label }}
    </label>
    <div class="relative h-auto w-full">
      <multiselect
  v-model="dropdowninput"
  :value="dropdowninput"
  :placeholder="placeholder"
  :disabled="disabled || readonly"
  :mode="mode"
  value-prop="id"
  :options="options"
  class="text-dark block h-auto !rounded-[9px] bg-slate-50"
  :class="{
    '!dark:border-red-500 !border-red-500': !!errorMessage,
    'pl-10': !!icon,
  }"
  :classes="{
    search: 'multiselect-search !bg-transparent border-none',
    dropdown:
      'multiselect-dropdown bg-white dark:bg-darkmode-600 border-0 !rounded-[9px]', // Menghapus border pada dropdown
    tag: 'bg-red-500 text-white text-sm font-semibold py-0.5 pl-2 rounded mr-1 mb-1 flex items-center whitespace-nowrap min-w-0 rtl:pl-0 rtl:pr-2 rtl:mr-0 rtl:ml-1',
    containerActive: '',
  }"
  label="name"
  track-by="name"
  :searchable="searchable"
  @blur="handleBlur"
  :create-option="createOption"
>
</multiselect>

      <div
        v-if="icon"
        class="absolute inset-y-0 left-0 flex items-center px-3 text-gray-500"
      >
        <Icon :name="icon" class="h-5 w-5" />
      </div>
    </div>
    <div
      v-if="!!errorMessage"
      class="absolute -bottom-5 left-0 mt-1 text-xs text-red-500 dark:text-red-500"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<style src="@vueform/multiselect/themes/default.css"></style>
