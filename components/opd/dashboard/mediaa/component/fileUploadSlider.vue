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
    default: "mdi:image-document-outline",
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
    default: "Maximum image size is 300KB. Image dimensions must be 1024x800 pixels",
  },
});

const emit = defineEmits(['update:modelValue']);
const name = toRef(props, "name");
const { value: inputValue, errorMessage, handleChange, meta } = useField(name);

const image = ref(null);
const imageBase64 = ref(null);

const validateImageDimensions = (image) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(image);
    
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      if (img.width === 1024 && img.height === 800) {
        resolve(true);
      } else {
        reject(new Error(`Dimensi gambar harus 1024x800 pixel. Dimensi saat ini: ${img.width}x${img.height}`));
      }
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Gagal memuat gambar'));
    };
  });
};

const validateimageSize = (image) => {
  const maxSize = 300 * 1024; // 350KB
  if (image.size > maxSize) {
    throw new Error(`Ukuran image tidak boleh lebih dari 350KB. Ukuran saat ini: ${(image.size / 1024).toFixed(2)}KB`);
  }
  return true;
};

const toBase64 = (image) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const handleimage = async (event) => {
  const selectedimage = event.target.files[0];
  if (!selectedimage) return;

  try {
    // validateimageSize(selectedimage);
    // await validateImageDimensions(selectedimage);
    
    const base64 = await toBase64(selectedimage);
    image.value = selectedimage;
    imageBase64.value = base64;

    handleChange({
      name: selectedimage.name,
      size: selectedimage.size,
      type: selectedimage.type,
      base64: base64
    });
    
    emit('update:modelValue', {
      name: selectedimage.name,
      size: selectedimage.size,
      type: selectedimage.type,
      base64: base64
    });

  } catch (error) {
    event.target.value = '';
    image.value = null;
    imageBase64.value = null;
    
    handleChange({
      __type: 'validation',
      message: error.message
    });
  }
};

const removeimage = () => {
  image.value = null;
  imageBase64.value = null;
  handleChange(null);
  emit('update:modelValue', null);
};
</script>

<template>
  <div class="relative my-3" :class="{ success: meta.valid }">
    <label v-if="label" :for="name" class="block mb-2 text-sm dark:text-white md:text-base"
      :class="{ 'text-red-500': !!errorMessage }">
      {{ label }}
    </label>

    <div class="h-fit">
      <label :class="{
        'border-red-500': !!errorMessage,
        'border-gray-300': !errorMessage,
        'cursor-not-allowed bg-gray-100': disabled
      }" class="flex flex-col items-center justify-center h-full p-4 border-2 border-dashed rounded-lg">
        
        <!-- image Preview -->
        <div v-if="image" class="w-full">
          <div class="flex items-center justify-between p-3 border rounded-lg">
            <div class="flex items-center">
              <Icon :name="icon" class="w-8 h-8 text-gray-500" />
              <span class="ml-2 text-sm text-gray-500">{{ image.name }}</span>
            </div>
            <button @click="removeimage" class="text-red-500 hover:text-red-700">
              <Icon name="material-symbols:delete-outline-rounded" class="w-5 h-5" />
            </button>
          </div>
          <div class="mt-4">
            <img :src="imageBase64" alt="Image Preview" class="h-auto max-w-full rounded-lg" />
          </div>
        </div>

        <!-- Upload Area -->
        <div v-else class="text-center">
          <Icon name="ph:cloud-arrow-up-duotone" class="w-12 h-12 mx-auto text-gray-400" />
          <div class="mt-2">
            <span class="ml-1 text-sm font-semibold text-blue-500">Browse a image</span>
          </div>
          <p class="mt-1 text-xs text-gray-500">{{ comment }}</p>
        </div>

        <!-- Hidden image Input -->
        <input
          v-if="!image && !disabled"
          :id="name"
          :name="name"
          type="file"
          class="hidden"
          :accept="accept"
          @change="handleimage"
        />
      </label>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="mt-1 text-xs text-red-500">
      {{ errorMessage }}
    </div>
  </div>
</template>