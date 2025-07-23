<script setup>
import { computed, toRef } from "vue";
import { useField } from "vee-validate";
import Multiselect from "@vueform/multiselect";
import { useInfiniteScroll } from "@vueuse/core";

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
  canClear: {
    type: Boolean,
    default: true,
  },
  isNumberOnly: {
    type: Boolean,
    default: false,
  },
  customOption: {
    type: Boolean,
    default: false,
  },
  trackBy: {
    type: String,
    default: "name",
  },
  noOptionsText: {
    type: String,
    default: "The list is empty",
  },
  isInfiniteScroll: {
    type: Boolean,
    default: false,
  },
  isShowLoading: {
    type: Boolean,
    default: false,
  },
  isMax: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits();
const root = ref(null);
const name = toRef(props, "name");
const el = ref(null);
const {
  value: inputValue,
  errorMessage,
  handleBlur,
  handleChange,
  meta,
} = useField(name);

const dropdowninput = computed({
  get() {
    return inputValue.value;
  },
  set(value) {
    handleChange(value);
    emit("update:value", value);
  },
});
const functionSearch = (search) => {
  emit("functionSearch", search);
};
const onlynumber = (e) => {
  let keyCode = e.which;
  /* 
  48-57 - (0-9)Numbers
  45 - (strip)
  46 - (titik)
  65-90 - (A-Z)
  97-122 - (a-z)
  8 - (backspace)
  32 - (space)
  */
  // Not allow special
  if ((keyCode < 48 || keyCode > 57) && keyCode !== 8) {
    e.preventDefault();
  }
};
watch(errorMessage, (newVal) => {
  if (newVal) {
    nextTick(() => {
      root.value.scrollIntoView({ behavior: "smooth" });
    });
  }
});

useInfiniteScroll(
  el,
  async () => {
    try {
      await emit("loadMore");
    } catch (error) {
      console.error(error);
    }
  },
  { distance: 0 },
);
</script>

<template>
  <div
    class="relative w-full first:mt-0 last:mb-0"
    :class="{ success: meta.valid, 'inline-flex items-center': inline }"
    ref="root"
  >
    <label
      v-if="label"
      :for="name"
      class="block w-40 text-sm form-label dark:text-slate-200 md:text-base"
      :class="{
        'font-bold text-red-500': !!errorMessage,
        'mr-2 inline-block': inline,
      }"
    >
      {{ label }}
      <span v-if="primary">
        <span class="font-bold text-red-500">*</span>
      </span>
    </label>
    <div class="relative w-full h-auto">
      <multiselect
        v-model="dropdowninput"
        :value="dropdowninput"
        :placeholder="placeholder"
        :disabled="disabled || readonly"
        :mode="mode"
        value-prop="id"
        :options="options"
        :no-options-text="noOptionsText"
        class="text-dark block h-auto !rounded-[9px] border border-slate-300 bg-slate-50 dark:border-slate-900 dark:bg-slate-800 dark:text-white"
        :class="{
          '!dark:border-red-500 !border-red-500': !!errorMessage,
          'pl-10': !!icon,
        }"
        :classes="{
          container:
            'relative mx-auto w-full flex items-center justify-end box-border cursor-pointer border border-gray-300 rounded text-sm leading-snug outline-none',
          containerDisabled: 'cursor-default bg-gray-200 dark:bg-slate-800',
          search: 'multiselect-search !bg-transparent border-none',
          dropdown:
            'multiselect-dropdown bg-white dark:bg-slate-800 dark:text-white border-2 border-gray-300 dark:border-gray-700 !rounded-[9px]',
          search:
            'w-full absolute inset-0 outline-none focus:ring-0 appearance-none box-border border-0 text-sm font-sans bg-white dark:bg-slate-800 rounded pl-3.5 rtl:pl-0 rtl:pr-3.5',
          tags: 'flex-grow flex-shrink flex bg-white dark:bg-slate-800 flex-wrap items-center mt-1 pl-2 min-w-0 rtl:pl-0 rtl:pr-2',
          tag: 'bg-blue-600 text-white text-sm font-semibold py-0.5 pl-2 rounded mr-1 mb-1 flex items-center whitespace-nowrap min-w-0 rtl:pl-0 rtl:pr-2 rtl:mr-0 rtl:ml-1',
          tagsSearch:
            'absolute inset-0 border-0 outline-none focus:ring-0 appearance-none bg-white dark:bg-slate-800 dark:text-white p-0 text-sm font-sans box-border w-full',
          containerActive: '',
          optionSelected: 'bg-slate-100 text-black',
          optionSelectedPointed: 'bg-slate-200 text-black',
          optionPointed: 'text-gray-800 bg-gray-100',
          option:
            ' items-center justify-start box-border text-left cursor-pointer text-sm leading-snug py-2 px-3',
          noOptions:
            'py-2 px-3 text-red-500 text-sm bg-white text-left rtl:text-right',
        }"
        label="name"
        :track-by="trackBy"
        :searchable="searchable"
        @blur="handleBlur"
        @change="handleChangeEvent"
        @search-change="functionSearch"
        :create-option="createOption"
        :can-clear="canClear"
        @keydown="isNumberOnly ? onlynumber($event) : null"
      >
        <template v-if="customOption" v-slot:option="{ option }">
          <div class="flex flex-col">
            <div class="text-sm font-semibold text-black">
              {{ option.name }}
            </div>
            <div class="text-xs text-black">{{ option.child }}</div>
          </div>
        </template>
        <template v-slot:afterlist v-if="isInfiniteScroll && isShowLoading">
          <p class="px-3 py-2" ref="el">Loading...</p>
        </template>
        <template v-slot:afterlist v-if="isMax">
          <p class="px-3 py-2 text-red-500">No more data</p>
        </template>
      </multiselect>
      <div
        v-if="icon"
        class="absolute inset-y-0 left-0 flex items-center px-3 text-gray-500"
      >
        <Icon :name="icon" class="w-5 h-5" />
      </div>
    </div>
    <div
      v-if="!!errorMessage"
      class="absolute left-0 mt-1 text-xs text-red-500 -bottom-5 dark:text-red-500"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<style src="@vueform/multiselect/themes/default.css"></style>
