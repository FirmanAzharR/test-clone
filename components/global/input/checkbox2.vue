<script setup>
import { computed, toRef } from "vue";
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
  tooltipTitle: {
    type: String,
    default: "",
  },
  tooltipDescription: {
    type: String,
    default: "",
  },
});
const emit = defineEmits();
const name = toRef(props, "name");
const root = ref(null);
const {
  value: inputValue,
  errorMessage,
  handleBlur,
  handleChange,
  meta,
} = useField(name);

const modelValue = computed({
  get() {
    return inputValue.value;
  },
  set(value) {
    handleChange(value);
    emit("update:value", {
      value: props.value,
      // checked: value?.includes(props.value),
    });
  },
});
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
    class="justify-left inline-flex w-fit items-center gap-2"
    :class="{ success: meta.valid }"
    ref="root"
  >
    <input
      :id="name"
      :name="name"
      type="checkbox"
      class="cursor-pointer rounded-md border border-gray-300 bg-white text-primary-500 shadow checked:accent-red-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-gray-600 dark:focus:ring-offset-gray-900 sm:text-sm"
      :class="{
        'border-red-500 dark:border-red-500': !!errorMessage,
      }"
      :value="value"
      v-model="modelValue"
      :disabled="disabled"
      :readonly="readonly"
    />
    <div class="justify-left item relative inline-flex flex-col">
      <label
        v-if="label"
        :for="name"
        class="form-label inline-flex items-center text-sm dark:text-white"
        :class="{
          'font-bold text-red-500': !!errorMessage && !disabled,
        }"
      >
        <span v-if="primary">
          <span class="font-bold text-red-500">*</span>
        </span>
        {{ label }}
        <GlobalTooltip
          v-if="tooltipTitle || tooltipDescription"
          :title="tooltipTitle"
          :description="tooltipDescription"
        />
      </label>
    </div>
    <div
      v-if="!!errorMessage && !disabled"
      class="mt-1 text-xs text-red-500 dark:text-red-500"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>
