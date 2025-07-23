<script setup>
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
    required: false,
  },
  placeholder: {
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
  icon: {
    type: String,
    default: "",
  },
  icon_only: {
    type: Boolean,
    default: false,
  },
  doc_type: {
    type: String,
    default: ".pdf",
  },
  file_name: {
    type: String,
  },
  file_uploaded: {
    type: String,
    default: null,
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

let log_file = ref([]);
let log_base64 = ref([]);

const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};

const changeFile = async (event) => {
  if (!!!event.target.files[0]) {
    handleChange(null);
    return;
  }
  let files = event.target.files;
  log_file.value = files[0];
  let base64 = await toBase64(files[0]);
  log_base64.value = {
    base64: base64,
    name: files[0].name,
    size: files[0].size,
    type: files[0].type,
  };
  emit("fileChange", log_base64.value);
  handleChange(log_base64.value);
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
  <div class="flex flex-col" :class="{ success: meta.valid }" ref="root">
    <label
      v-if="label"
      :for="name"
      class="mb-1 text-sm text-gray-900 dark:text-slate-200 md:text-base"
    >
      {{ label }}
      <span v-if="primary">
        <span class="font-bold text-primary-500">*</span>
      </span>
    </label>
    <div
      class="flex"
      :class="{
        'gap-4': icon_only,
      }"
    >
      <span v-if="icon_only && icon">
        <Icon :name="icon" class="h-5 w-5 cursor-pointer text-gray-500" />
      </span>
      <span
        v-if="icon && !icon_only"
        class="inline-flex h-11 items-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-4 text-gray-900 dark:border-slate-800 dark:bg-slate-800"
        :class="{
          'border-primary-500 bg-primary-500': !!errorMessage,
        }"
      >
        <div
          v-if="icon && !icon_only"
          class="text-gray-400 dark:text-slate-200"
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
        type="file"
        :accept="doc_type"
        @change="changeFile"
        class="h-11 w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-gray-300 focus:outline-none focus:ring-0 dark:border-slate-900 dark:bg-slate-800 dark:text-gray-400"
        :class="{
          '!border-primary-500 focus:border-primary-500': !!errorMessage,
          'cursor-not-allowed': readonly,
          '!rounded-l-none': icon,
          hidden: icon_only,
        }"
        :disabled="disabled"
        :readonly="readonly"
        :placeholder="placeholder"
        autocomplete="off"
      />
      <span
        v-if="log_base64 && icon_only && log_base64.name"
        class="w-12 truncate"
        >{{
          file_name ? file_name : log_base64.name ? log_base64.name : "-"
        }}</span
      >
    </div>

    <div
      v-if="file_uploaded"
      class="mt-1 text-xs text-green-700 dark:text-green-500"
    >
      File uploaded {{ file_uploaded }}
    </div>
    <div
      v-if="!!errorMessage"
      class="mt-1 text-xs text-primary-500 dark:text-primary-500"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>
