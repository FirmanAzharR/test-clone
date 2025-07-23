<script setup>
import { computed, toRef, ref } from "vue";
import { useField } from "vee-validate";
import { useLayout } from "@/stores/layout";

import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const layoutStore = useLayout();
const darkMode = computed(() => layoutStore.theme === "dark");

const emit = defineEmits();

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
  min: {
    type: String,
    default: "",
  },
  max: {
    type: String,
    default: "",
  },
  startTime: {
    type: Object,
    default: () => {
      return { hours: 0, minutes: 0 };
    },
  },
  yearPicker: {
    type: Boolean,
    default: false,
  },
  addTimepicker: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  range: {
    type: Boolean,
    default: false,
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

const datevalue = computed({
  get() {
    if (props.yearPicker) {
      return new Date(inputValue.value).getFullYear();
    } else {
      return inputValue.value;
    }
  },
  set(value) {
    const isRange = props.range;
    const isYearPicker = props.yearPicker;

    // condition for year picker
    let formattedValue;
    if (isRange) {
      if (Array.isArray(value)) {
        formattedValue = [formatDate(value[0]), formatDate(value[1])];
      } else {
        formattedValue = null;
      }
    } else {
      formattedValue = formatDate(value);
    }

    if (isYearPicker) {
      handleChange(`${value}-12-31`);
    } else {
      handleChange(formattedValue);
    }

    emit("update:changeDate", formattedValue);
  },
});

const formatDate = (date) => {
  let d = new Date(date),
    year = d.getFullYear(),
    month = ("0" + (d.getMonth() + 1)).slice(-2),
    day = ("0" + d.getDate()).slice(-2),
    hours = ("0" + d.getHours()).slice(-2),
    minutes = ("0" + d.getMinutes()).slice(-2),
    seconds = ("0" + d.getSeconds()).slice(-2);

  return (
    [year, month, day].join("-") + " " + [hours, minutes, seconds].join(":")
  );
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
    class="relative my-3 w-full first:mt-0 last:mb-0"
    :class="{ success: meta.valid, 'inline-flex items-center': inline }"
    ref="root"
  >
    <label
      v-if="label"
      :for="name"
      class="form-label mb-2 block w-40 text-sm dark:text-slate-200 md:text-base"
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
      <VueDatePicker
        :id="name"
        v-model="datevalue"
        :name="name"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="{
          'pl-10': !!icon,
        }"
        :input-class-name="
          !!errorMessage ? '!border-red-500 dark:!border-red-500' : ''
        "
        class="text-dark block w-full rounded-[9px] border border-slate-300 bg-slate-50 shadow dark:border-slate-900 dark:bg-slate-800"
        :enable-time-picker="addTimepicker"
        :min-date="min ? new Date(min) : null"
        :max-date="max ? new Date(max) : null"
        :start-time="startTime"
        :dark="darkMode"
        hide-input-icon
        :year-picker="yearPicker"
        :clearable="clearable"
        format="dd-MM-yyyy"
        auto-apply
        @blur="handleBlur"
        :range="range"
      >
      </VueDatePicker>

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
<style lang="scss" scoped>
.dp__theme_dark {
  --dp-background-color: rgb(30 41 59 / 1);
  --dp-text-color: #fff;
  --dp-border-color: rgb(15 23 42 / 1);
  color: #fff !important;
}
</style>
