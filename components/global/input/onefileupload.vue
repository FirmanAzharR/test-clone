<script setup>
import { ref, toRef } from "vue";
import { useField } from "vee-validate";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: false,
  },
  icon: {
    type: String,
    default: "mdi:file-document-outline",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  accept: {
    type: String,
    default: ".jpg, .jpeg, .png",
  },
  comment: {
    type: String,
    default: "Maximum file size is 350KB. Image dimensions must be 1024x700 pixels",
  },
});

const emit = defineEmits(['update:modelValue']);
const name = toRef(props, "name");
const { value: inputValue, errorMessage, handleChange, meta } = useField(name);

const file = ref(null);
const fileBase64 = ref(null);

// const validateImageDimensions = (file) => {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.src = URL.createObjectURL(file);
    
//     img.onload = () => {
//       URL.revokeObjectURL(img.src);
//       if (img.width === 1024 && img.height === 700) {
//         resolve(true);
//       } else {
//         reject(new Error(`Dimensi gambar harus 1024x700 pixel. Dimensi saat ini: ${img.width}x${img.height}`));
//       }
//     };
    
//     img.onerror = () => {
//       URL.revokeObjectURL(img.src);
//       reject(new Error('Gagal memuat gambar'));
//     };
//   });
// };

// const validateFileSize = (file) => {
//   const maxSize = 350 * 1024; // 350KB
//   if (file.size > maxSize) {
//     throw new Error(`Ukuran file tidak boleh lebih dari 350KB. Ukuran saat ini: ${(file.size / 1024).toFixed(2)}KB`);
//   }
//   return true;
// };

const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const handleFile = async (event) => {
  const selectedFile = event.target.files[0];
  if (!selectedFile) return;

  try {
    // validateFileSize(selectedFile);
    // await validateImageDimensions(selectedFile);
    
    const base64 = await toBase64(selectedFile);
    file.value = selectedFile;
    fileBase64.value = base64;

    handleChange({
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
      base64: base64
    });
    
    emit('update:modelValue', {
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
      base64: base64
    });

  } catch (error) {
    event.target.value = '';
    file.value = null;
    fileBase64.value = null;
    
    handleChange({
      __type: 'validation',
      message: error.message
    });
  }
};

const removeFile = () => {
  file.value = null;
  fileBase64.value = null;
  handleChange(null);
  emit('update:modelValue', null);
};
</script>

<template>
  <div class="relative my-3" :class="{ success: meta.valid }">
    <label v-if="label" :for="name" class="mb-2 block text-sm dark:text-white md:text-base"
      :class="{ 'text-red-500': !!errorMessage }">
      {{ label }}
    </label>

    <div class="h-fit">
      <label :class="{
        'border-red-500': !!errorMessage,
        'border-gray-300': !errorMessage,
        'cursor-not-allowed bg-gray-100': disabled
      }" class="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed p-4">
        
        <!-- File Preview -->
        <div v-if="file" class="w-full">
          <div class="flex items-center justify-between rounded-lg border p-3">
            <div class="flex items-center">
              <Icon :name="icon" class="h-8 w-8 text-gray-500" />
              <span class="ml-2 text-sm text-gray-500">{{ file.name }}</span>
            </div>
            <button @click="removeFile" class="text-red-500 hover:text-red-700">
              <Icon name="material-symbols:delete-outline-rounded" class="h-5 w-5" />
            </button>
          </div>
          <div class="mt-4">
            <img :src="fileBase64" alt="Image Preview" class="rounded-lg max-w-full h-auto" />
          </div>
        </div>

        <!-- Upload Area -->
        <div v-else class="text-center">
          <Icon name="ph:cloud-arrow-up-duotone" class="mx-auto h-12 w-12 text-gray-400" />
          <div class="mt-2">
            <span class="text-sm font-semibold text-green-500 ml-1">Browse a File</span>
          </div>
          <p class="mt-1 text-xs text-gray-500">{{ comment }}</p>
        </div>

        <!-- Hidden File Input -->
        <input
          v-if="!file && !disabled"
          :id="name"
          :name="name"
          type="file"
          class="hidden"
          :accept="accept"
          @change="handleFile"
        />
      </label>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="mt-1 text-xs text-red-500">
      {{ errorMessage }}
    </div>
  </div>
</template>