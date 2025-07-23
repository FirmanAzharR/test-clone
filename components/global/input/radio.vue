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
  options: {
    type: Array,
    default: () => [],
  },
  inline: {
    type: Boolean,
    default: false,
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
    emit("update:value", value);
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
    class="flex gap-2"
    :class="{
      'flex-col items-start': !inline,
      'flex-row items-center': inline,
    }"
    ref="root"
  >
    <div
      v-for="(item, index) in options"
      :key="index"
      class="justify-left inline-flex w-fit items-center gap-1"
      :class="{ success: meta.valid }"
    >
      <input
        :id="item.value"
        :name="item.value"
        type="radio"
        class="cursor-pointer text-primary-500 shadow checked:accent-red-500 focus:ring-transparent sm:text-sm"
        :class="{
          'border-red-500 dark:border-red-500': !!errorMessage,
        }"
        :value="item.value"
        v-model="modelValue"
        :disabled="disabled"
        :readonly="readonly"
        :checked="item.value === modelValue"
      />
      <div class="justify-left item relative inline-flex flex-col">
        <label
          v-if="item.label"
          :for="item.value"
          class="form-label inline-flex items-center text-sm dark:text-white"
          :class="{
            'font-bold text-red-500': !!errorMessage,
          }"
        >
          <span v-if="primary">
            <span class="font-bold text-red-500">*</span>
          </span>
          {{ item.label }}
        </label>
      </div>
    </div>
    <div v-if="!!errorMessage" class="text-xs text-red-500 dark:text-red-500">
      {{ errorMessage }}
    </div>
  </div>
</template>
