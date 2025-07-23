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
    requiprimary: true,
  },
  label: {
    type: String,
    requiprimary: true,
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
  isTypeNumber: {
    type: Boolean,
    default: true,
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

const onlynumber = (e) => {
  var keyCode = e.which;
  var value = e.target.value;
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
  if (keyCode < 48 || keyCode > 58) {
    e.preventDefault();
  }
};
const onChange = (e) => {
  if (props.isTypeNumber) {
    handleChange(parseInt(e.target.value) || "");
  } else {
    handleChange(e.target.value || "");
  }
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
  <div class="flex w-full flex-col" :class="{ success: meta.valid }" ref="root">
    <label
      v-if="label"
      :for="name"
      class="mb-1 text-sm text-gray-900 dark:text-white md:text-base"
      :class="{
        'font-bold text-primary-500': !!errorMessage,
      }"
    >
      {{ label }}
      <span v-if="primary">
        <span class="font-bold text-primary-500">*</span>
      </span>
    </label>
    <div class="flex">
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
        :id="name"
        :name="name"
        type="text"
        class="h-10 w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-gray-300 focus:outline-none focus:ring-0 dark:border-slate-900 dark:bg-slate-800 dark:text-white"
        :class="{
          '!border-primary-500 focus:border-primary-500': !!errorMessage,
          'cursor-not-allowed': readonly,
          '!rounded-l-none': icon,
          'text-disabled': disabled,
        }"
        :disabled="disabled"
        :readonly="readonly"
        :value="inputValue"
        :placeholder="placeholder"
        @input="onChange"
        @blur="handleBlur"
        @keypress="onlynumber"
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

<style lang="scss" scoped>
.text-disabled {
  @apply cursor-not-allowed bg-gray-200 text-black dark:bg-slate-800;
}
</style>
