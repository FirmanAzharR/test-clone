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
            {{ mode === "edit" ? "Edit Layanan" : "Tambah Layanan" }}
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
          <Input name="title" placeholder="Masukkan Judul..." label="Judul" />
          <Editor
            name="description"
            placeholder="Masukkan Deskripsi..."
            label="Deskripsi"
            :is-submitted="isSubmitted"
          />
          <div>
            <div
              class="flex items-center justify-center mt-6"
              v-if="props.mode == 'edit'"
            >
              <NuxtImg :src="bannerStore.dataDetailLayanan?.image" class="rounded-lg" />
            </div>
            <File name="file" label="Gambar" />
            <!-- Error message untuk file yang sudah ada -->
            <div
              class="mb-2 text-xs text-red-500"
              v-if="values.file && values.file?.message"
            >
              {{ values.file.message }}
            </div>
          </div>
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
            <div class="mb-2 text-xs text-red-500" v-if="isSubmitted && errors.status">
              {{ errors.status }}
            </div>
          </div>
        </div>
        <div class="relative mt-4" style="min-height: 48px">
          <div class="absolute right-0 bottom-0">
            <UButton
              type="submit"
              :icon="
                mode === 'edit' ? 'i-heroicons-pencil' : 'material-symbols:add-2-rounded'
              "
              @click="handleAddEditLayanan()"
              color="blue"
            >
              {{ mode === "edit" ? "Simpan Perubahan" : "Tambah Layanan" }}
            </UButton>
          </div>
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
import File from "../component/FileUploadLayanan";
import Editor from "~/components/global/input/editor.vue";
import { useBannerStore } from "~/store/banner/banner";

const props = defineProps({
  isOpen: Boolean,
  mode: String,
});

const bannerStore = useBannerStore();
const emit = defineEmits(["close", "submit", "update:modelValue"]);
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
  description: yup.string().required("Deskripsi wajib diisi").label("Description"),
});

const status = ["Published", "Pending"];

const {
  handleSubmit,
  values,
  setValues,
  resetForm,
  errors,
  validate,
  setErrors,
} = useForm({
  initialValues: {
    title: "",
    file: "",
    status: "",
    description: "",
  },
  validationSchema: validationSchema,
});
const toast = useToast();

const isSubmitted = ref(false);

const showValidationErrors = (errs) => {
  isSubmitted.value = true;
  // Flatten vee-validate errors for array fields (not needed here, but for consistency)
  const flatErrors = {};
  Object.entries(errs).forEach(([field, message]) => {
    flatErrors[field] = message;
  });
  Object.entries(flatErrors).forEach(([field, message], index) => {
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
        case "description":
          toast.add({ title: "Deskripsi wajib diisi", color: "red" });
          break;
        default:
          toast.add({ title: message, color: "red" });
          break;
      }
    }, index * 100);
  });
};

const handleAddEditLayanan = async () => {
  const validationResult = await validate();
  isSubmitted.value = true;
  if (!validationResult.valid) {
    showValidationErrors(validationResult.errors);
    setErrors(validationResult.errors);
    return;
  }
  const formData = new FormData();
  formData.append("title", values.title);
  if (values.file?.base64) {
    const mimeType = values.file.base64.match(/^data:(.*);base64,/)[1] || "image/jpeg";
    const blob = base64ToBlob(values.file.base64, mimeType);
    formData.append("image", blob, values.file.name);
  }
  formData.append("publish", values.status === "Published" ? 1 : 0);
  formData.append("descript", values.description);
  formData.append("kategori", "banner");
  if (props.mode === "add") {
    try {
      await bannerStore.addLayananAdmin(formData).then(async () => {
        if (bannerStore.dataAddLayanan.status == 201) {
          bannerStore.getAllBanner();
          toast.add({
            title: "Layanan berhasil ditambahkan",
            color: "green",
          });
          emit("close");
        } else {
          toast.add({
            title: "Layanan gagal ditambahkan",
            color: "red",
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    const id = bannerStore.dataDetailLayanan.id;
    try {
      await bannerStore.editLayananAdmin(id, formData);
      if (bannerStore.dataEditLayanan.status == 200) {
        bannerStore.getAllBanner();
        toast.add({
          title: "Layanan berhasil diperbarui",
          color: "green",
        });
        emit("close");
      } else {
        toast.add({
          title: "Layanan gagal diperbarui",
          color: "red",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
};

watch(
  () => props.isOpen,
  (newIsOpen) => {
    if (newIsOpen) {
      isSubmitted.value = false;
      setErrors({});
      if (props.mode === "edit") {
        setValues({
          title: bannerStore.dataDetailLayanan.title,
          file: bannerStore.dataDetailLayanan.image,
          status: bannerStore.dataDetailLayanan.publish == 1 ? "Published" : "Pending",
          description: bannerStore.dataDetailLayanan.description,
        });
      } else {
        resetForm();
      }
    }
  }
);

const closeModal = () => {
  emit("update:modelValue", false);
  emit("close");
};

const updateIsOpen = (value) => {
  emit("update:modelValue", value);
};
</script>
