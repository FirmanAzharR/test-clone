<script setup>
import { computed, toRef, useSlots } from "vue";
import { useField } from "vee-validate";
// import BaseIcon from "@/components/BaseIcon.vue";
// import { mdiFile, mdiFileRemove, mdiFileUpload } from "@mdi/js";

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
    default: "mdi:file-document-outline",
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
  accept: {
    type: String,
    default: ".jpg , .jpeg, .png",
  },
  comment: {
    type: String,
    default: "Maximum file size is 350KB",
  },
  isOnlyOne: {
    type: Boolean,
    default: false,
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

// data
var log_file = ref([]);
var log_base64 = ref([]);

// const validateImageDimensions = (file) => {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.src = URL.createObjectURL(file);
    
//     img.onload = () => {
//       URL.revokeObjectURL(img.src);
//       if (img.width === 1024 && img.height === 700) {
//         resolve(true);
//       } else {
//         reject(new Error(`Image dimensions must be 1024x700 pixels. Current dimensions: ${img.width}x${img.height}`));
//       }
//     };
    
//     img.onerror = () => {
//       URL.revokeObjectURL(img.src);
//       reject(new Error('Error loading image'));
//     };
//   });
// };

// const validateFileSize = (file) => {
//   const maxSize = 350 * 1024; // 350KB in bytes
//   if (file.size > maxSize) {
//     throw new Error('File size must not exceed 350KB');
//   }
//   return true;
// };

// Update the changeFile function
const changeFile = async (event) => {
  if (!event.target.files[0]) return;
  let files = event.target.files;
  
  try {
    // Validate file size
    //validateFileSize(files[0]);
    
    // Validate image dimensions
    //await validateImageDimensions(files[0]);
    
    // If validations pass, proceed with file handling
    var base64 = await toBase64(files[0]);
    let newFileData = {
      base64: base64,
      name: files[0].name,
      size: files[0].size,
      type: files[0].type,
    };

    if (props.isOnlyOne) {
      log_file.value = [files[0]];
      log_base64.value = newFileData;
    } else {
      log_file.value.push(files[0]);
      log_base64.value.push(newFileData);
    }

    emit("fileChange", log_base64.value);
    handleChange(log_base64.value);
    
  } catch (error) {
    // Handle validation errors
    handleChange({
      __type: 'validation',
      message: error.message
    });
  }
};




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

const handleDrop = async (event) => {
  event.preventDefault();
  let files = event.dataTransfer.files;
  
  if (files.length > 0) {
    try {
      // Validate file size
      //validateFileSize(files[0]);
      
      // Validate image dimensions
      //await validateImageDimensions(files[0]);
      
      // If validations pass, proceed with file handling
      var base64 = await toBase64(files[0]);
      let newFileData = {
        base64: base64,
        name: files[0].name,
        size: files[0].size,
        type: files[0].type,
      };
      
      if (props.isOnlyOne) {
        log_file.value = [files[0]];
        log_base64.value = newFileData;
      } else {
        log_file.value.push(files[0]);
        log_base64.value.push(newFileData);
      }
      
      emit("fileChange", log_base64.value);
      handleChange(log_base64.value);
      
    } catch (error) {
      // Handle validation errors
      handleChange({
        __type: 'validation',
        message: error.message
      });
    }
  }
};
</script>

<template>
  <div
    class="relative my-3 first:mt-0 last:mb-0"
    :class="{ success: meta.valid }"
  >
    <label
      v-if="label"
      :for="name"
      class="mb-2 block text-sm dark:text-white md:text-base"
      :class="{
        'text-red-500': !!errorMessage,
      }"
    >
      {{ label }}
      <span v-if="primary">
        <span class="font-bold text-red-500">*</span>
      </span>
    </label>
    <div class="h-fit" @dragover.prevent @dragenter.prevent @drop="handleDrop">
      <label
        :class="{
          'border-red-500 ': !!errorMessage,
          'border-gray-300': !!!errorMessage,
          'is-disabled cursor-not-allowed bg-gray-400': disabled,
        }"
        class="flex h-full shrink grow basis-0 flex-col items-center justify-center self-stretch rounded-[10px] border border-gray-200 bg-white p-4 dark:border-slate-900 dark:bg-slate-800"
      >
        <div
          v-if="!!log_file?.length"
          class="flex h-full w-full flex-col items-center justify-center gap-4 rounded-[10px] py-2"
        >
          <div class="relative grid w-full grid-cols-1 gap-2 px-2">
            <div
              v-for="(item, index) in log_file"
              :key="index"
              :class="{ 'border-red-500 ': !!errorMessage }"
              class="group relative inline-flex w-full cursor-pointer items-center rounded-lg border bg-white p-3 shadow-sm dark:border-slate-900 dark:bg-slate-800"
            >
              <div class="flex grow-0 items-center text-lg font-semibold">
                <Icon :name="icon" class="relative h-10 w-10 dark:text-white" />
              </div>
              <div class="grow truncate p-2 text-gray-600 dark:text-white">
                {{ item?.name }}
              </div>
              <div
                v-if="!isOnlyOne"
                class="absolute -top-8 hidden w-full items-center justify-center rounded-lg p-1 group-hover:inline-flex"
              >
                <label
                  class="grow-0 cursor-pointer rounded-lg bg-white p-2 text-green-500 shadow-md hover:bg-green-500 hover:text-white dark:bg-slate-800"
                >
                  <Icon name="material-symbols:add" class="relative h-5 w-5" />
                  <input
                    :id="name"
                    :name="name"
                    type="file"
                    class="hidden"
                    :accept="accept"
                    @change="changeFile"
                  />
                </label>
                <button
                  type="button"
                  class="grow-0 rounded-lg bg-white p-2 text-red-500 shadow-md hover:bg-red-500 hover:text-white dark:bg-slate-800"
                  @click="removeFile(index)"
                >
                  <Icon
                    name="material-symbols:delete-outline-rounded"
                    class="relative h-5 w-5"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="!!!log_file?.length"
          class="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-[10px] hover:bg-slate-100 dark:bg-slate-800"
        >
          <div
            class="flex h-[94px] flex-col items-center justify-start gap-3 self-stretch dark:border-slate-900 dark:bg-slate-800"
          >
            <div
              class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white p-2.5 shadow dark:border-slate-900 dark:bg-slate-800"
            >
              <Icon
                name="ph:cloud-arrow-up-duotone"
                class="relative flex h-5 w-5 flex-col items-start justify-start dark:text-white"
              />
            </div>
            <div
              class="flex h-[42px] flex-col items-center justify-start gap-1 self-stretch"
            >
              <div
                class="inline-flex items-start justify-center gap-1 self-stretch"
              >
                <div class="flex items-center justify-center gap-2">
                  <div
                    class="text-xs font-semibold leading-tight text-gray-700 dark:text-white md:text-sm"
                  >
                    Drag your files here, or
                  </div>
                </div>
                <div
                  class="text-xs font-semibold leading-tight text-green-500 md:text-sm"
                >
                  Browse
                </div>
              </div>
              <div
                class="self-stretch text-center text-xs font-normal leading-[18px] text-slate-600 dark:text-white"
              >
                {{ comment }}
              </div>
            </div>
          </div>
        </div>
        <input
          v-if="
            isOnlyOne && !disabled ? true : !!!log_file?.length && !disabled
          "
          :id="name"
          :name="name"
          type="file"
          class="hidden"
          :accept="accept"
          @change="changeFile"
        />
      </label>
    </div>
    <div
      v-if="!!errorMessage"
      class="absolute -bottom-5 left-0 mt-1 text-xs text-red-500 dark:text-red-500"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<style lang="scss"></style>
