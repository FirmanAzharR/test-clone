<template>
  <UModal
    :model-value="isOpen"
    @update:model-value="updateIsOpen"
    @close="closeModal"
    :prevent-close="true"
  >
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{ mode === "edit" ? "Edit Galleri" : "Tambah Galeri" }}
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="closeModal"
          />
        </div>
        <div class="gap-4 p-4">
          <!-- Title Input -->
          <Input
            name="title"
            placeholder="Masukkan Judul..."
            label="Title"
            :model-value="values.title"
            @update:model-value="(val) => setValues({ ...values, title: val })"
          />

          <!-- File Upload -->
          <div>
            <div
              class="flex items-center justify-center mt-6"
              v-if="props.mode == 'edit'"
            >
              <NuxtImg :src="fotoStore.detailGaleriData?.image" class="rounded-lg" />
            </div>
            <File
              name="file"
              label="Gambar"
              :model-value="values.file"
              @update:model-value="
                (val) => {
                  setValues({ ...values, file: val });
                  validateImageSize(val);
                }
              "
            />
            <!-- Error message untuk file yang sudah ada -->
            <div
              class="mb-2 text-xs text-red-500"
              v-if="values.file && values.file?.message"
            >
              {{ values.file.message }}
            </div>
            <div class="mb-2 text-xs text-red-500" v-if="imageError">
              {{ imageError }}
            </div>
          </div>

          <!-- Status Select -->
          <div class="mb-4">
            <UFormGroup label="Status" name="status">
              <USelect
                size="md"
                placeholder="Pilih Status..."
                :model-value="values.status"
                @update:model-value="(val) => setValues({ ...values, status: val })"
                :options="status"
                class="max-w-full mb-4 overflow-x-auto"
              />
            </UFormGroup>
            <!-- Error message untuk status -->
            <div class="mb-2 text-xs text-red-500" v-if="isSubmitted && errors.status">
              {{ errors.status }}
            </div>
          </div>
        </div>

        <div class="flex justify-end p-4">
          <UButton
            type="submit"
            :icon="
              mode === 'edit' ? 'i-heroicons-pencil' : 'material-symbols:add-2-rounded'
            "
            @click="onSubmit"
            color="blue"
            :loading="isSubmitting"
            :disabled="!!imageError"
          >
            {{ mode === "edit" ? "Simpan Perubahan" : "Tambah Galeri" }}
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup>
import { ref, watch } from "vue";
import Input from "~/components/global/input/text.vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import File from "../component/fileUploadGaleri.vue";
import { useFotoStore } from "~/store/foto/foto";

const props = defineProps({
  isOpen: Boolean,
  mode: String,
});

const fotoStore = useFotoStore();
const emit = defineEmits(["close", "submit", "update:modelValue"]);
const isSubmitting = ref(false);
const isSubmitted = ref(false);
const imageError = ref("");
const toast = useToast();

const status = ["Published", "Pending"];

// Validasi dengan yup schema
const validationSchema = yup.object({
  title: yup.string().required("Judul wajib diisi").label("Title"),
  file: yup.mixed().test({
    name: "fileRequired",
    message: "Gambar wajib diupload",
    test: function (value) {
      // Skip validation if in edit mode
      if (props.mode !== "add") return true;
      // Check if file exists and has base64 content
      return value && value.base64;
    },
  }),
  status: yup.string().required("Status wajib diisi").label("Status"),
});

const {
  handleSubmit,
  values,
  errors,
  setValues,
  resetForm,
  setFieldValue,
  validateField,
  validate,
  setErrors,
} = useForm({
  initialValues: {
    title: "",
    file: "",
    status: "",
  },
  validationSchema: validationSchema,
});

// Validasi ukuran gambar (maksimal 2MB)
const validateImageSize = (file) => {
  imageError.value = "";

  if (!file || !file.base64) return;

  // Hitung ukuran file dari base64 string
  const base64 = file.base64;
  const base64Length = base64.length - (base64.indexOf(",") + 1);
  const fileSizeInBytes = (base64Length * 3) / 4;
  const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

  // Maksimal ukuran file (2MB)
  const maxSizeInMB = 2;

  if (fileSizeInMB > maxSizeInMB) {
    imageError.value = `Ukuran gambar terlalu besar. Maksimal ${maxSizeInMB}MB, ukuran saat ini ${fileSizeInMB.toFixed(
      2
    )}MB`;
  }
};

// Function untuk menampilkan error validasi
const showValidationErrors = (errs) => {
  isSubmitted.value = true;
  Object.entries(errs).forEach(([field, message], index) => {
    setTimeout(() => {
      switch (field) {
        case "title":
          toast.add({ title: "Judul wajib diisi", color: "red" });
          break;
        case "file":
          toast.add({ title: "Gambar wajib diupload", color: "red" });
          break;
        case "status":
          toast.add({ title: "Status wajib diisi", color: "red" });
          break;
        default:
          toast.add({ title: message, color: "red" });
          break;
      }
    }, index * 100);
  });
};

const onSubmit = async () => {
  const validationResult = await validate();
  isSubmitted.value = true;

  // Manual validation for file in add mode
  const manualErrors = {};
  if (props.mode === "add" && (!values.file || !values.file?.base64)) {
    manualErrors.file = "Gambar wajib diupload";
  }

  // Check for image size error
  if (imageError.value) {
    toast.add({
      icon: "i-heroicons-exclamation-triangle",
      title: "Validasi Gagal",
      description: imageError.value,
      color: "red",
      timeout: 5000,
    });
    return;
  }

  // Merge manual errors with validation result errors
  const allErrors = { ...validationResult.errors, ...manualErrors };

  // Check if there are any errors
  if (!validationResult.valid || Object.keys(manualErrors).length > 0) {
    showValidationErrors(allErrors);
    setErrors(allErrors);
    return;
  }

  // Fungsi helper konversi base64 ke Blob
  // function base64ToBlob(base64, mime = "image/jpeg") {
  //   const byteCharacters = atob(base64.split(",")[1]);
  //   const byteArrays = [];

  //   for (let offset = 0; offset < byteCharacters.length; offset += 512) {
  //     const slice = byteCharacters.slice(offset, offset + 512);
  //     const byteNumbers = new Array(slice.length);

  //     for (let i = 0; i < slice.length; i++) {
  //       byteNumbers[i] = slice.charCodeAt(i);
  //     }

  //     byteArrays.push(new Uint8Array(byteNumbers));
  //   }

  //   return new Blob(byteArrays, { type: mime });
  // }

  isSubmitting.value = true;

  const formData = new FormData();
  formData.append("title", values.title);
  // Proses gambar jika ada base64
  if (values.file?.base64) {
    const mimeType = values.file.base64.match(/^data:(.*);base64,/)[1] || "image/jpeg";
    const blob = base64ToBlob(values.file.base64, mimeType);
    formData.append("image", blob, values.file.name);
  }

  formData.append("publish", values.status === "Published" ? 1 : 0);

  try {
    if (props.mode === "add") {
      await fotoStore.addGaleriDataAdmin(formData);
      // Dapatkan response dari store
      const response = fotoStore.dataAddGaleri;

      if (response) {
        await fotoStore.getAllGaleries();
        toast.add({
          title: "Galeri berhasil ditambahkan",
          color: "green",
        });
        emit("close");
      } else {
        toast.add({
          title: "Galeri gagal ditambahkan",
          color: "red",
        });
      }
    } else {
      const id = fotoStore.detailGaleriData.id;
      await fotoStore.editGalleriesDataAdmin(id, formData);

      // Dapatkan response dari store
      const response = fotoStore.dataAEditBeritaAdmin;

      if (response) {
        await fotoStore.getAllGaleries();
        toast.add({
          title: "Galeri berhasil diperbarui",
          color: "green",
        });
        emit("close");
      } else {
        toast.add({
          title: "Galeri gagal diperbarui",
          color: "red",
        });
      }
    }
  } catch (error) {
    console.error(error);
    toast.add({
      title: error.message || "Terjadi kesalahan saat memproses data",
      color: "red",
    });
  } finally {
    isSubmitting.value = false;
  }
};

watch(
  () => props.isOpen,
  (newIsOpen) => {
    if (newIsOpen) {
      // Reset error state
      imageError.value = "";
      isSubmitted.value = false;
      setErrors({});

      if (props.mode === "edit") {
        setValues({
          title: fotoStore.detailGaleriData.title,
          file: fotoStore.detailGaleriData.image,
          status: fotoStore.detailGaleriData.publish == 1 ? "Published" : "Pending",
        });
      } else {
        resetForm();
      }
    }
  }
);

const closeModal = () => {
  // Reset form submitted state and error when modal is closed
  isSubmitted.value = false;
  setErrors({});
  emit("update:modelValue", false);
  emit("close");
};

const updateIsOpen = (value) => {
  emit("update:modelValue", value);
};
</script>
