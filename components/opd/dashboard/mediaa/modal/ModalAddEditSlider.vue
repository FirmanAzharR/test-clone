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
            {{ mode === "edit" ? "Edit Slider" : "Tambah Slider" }}
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
          <Input name="title" placeholder="Masukkan Judul..." label="Title" />

          <TextArea
            name="description"
            placeholder="Masukkan Deskripsi..."
            label="Description"
          />

          <Input name="link" placeholder="Masukkan Link..." label="Link" />

          <div>
            <div
              class="flex items-center justify-center mt-6"
              v-if="props.mode == 'edit'"
            >
              <NuxtImg :src="fotoStore.detailSliderData?.image" class="rounded-lg" />
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
                placeholder="Select Status..."
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
          >
            {{ mode === "edit" ? "Simpan Perubahan" : "Tambah Slider" }}
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
import File from "../component/fileUploadSlider.vue";
import { useFotoStore } from "~/store/foto/foto";
import TextArea from "~/components/global/input/textarea.vue";

const props = defineProps({
  isOpen: Boolean,
  mode: String,
});

const fotoStore = useFotoStore();
const emit = defineEmits(["close", "submit", "update:modelValue"]);

// State untuk tracking form submission
const isSubmitted = ref(false);

const validationSchema = yup.object({
  title: yup.string().required("Judul wajib diisi").label("Title"),
  description: yup.string().required("Deskripsi wajib diisi").label("Description"),
  link: yup.string().required("Link wajib diisi").label("Link"),
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
    description: "",
    link: "",
    file: "",
    status: "",
  },
  validationSchema: validationSchema,
});

const toast = useToast();

// Function untuk menampilkan error validasi
const showValidationErrors = (errs) => {
  isSubmitted.value = true;
  Object.entries(errs).forEach(([field, message], index) => {
    setTimeout(() => {
      switch (field) {
        case "title":
          toast.add({ title: "Judul wajib diisi", color: "red" });
          break;
        case "description":
          toast.add({ title: "Deskripsi wajib diisi", color: "red" });
          break;
        case "link":
          toast.add({ title: "Link wajib diisi", color: "red" });
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

  // Merge manual errors with validation result errors
  const allErrors = { ...validationResult.errors, ...manualErrors };

  // Check if there are any errors
  if (!validationResult.valid || Object.keys(manualErrors).length > 0) {
    showValidationErrors(allErrors);
    setErrors(allErrors);
    return;
  }

  // Lanjutkan dengan submit jika validasi berhasil
  const formData = new FormData();
  formData.append("title", values.title);

  if (values.file?.base64) {
    const mimeType = values.file.base64.match(/^data:(.*);base64,/)[1] || "image/jpeg";
    const blob = base64ToBlob(values.file.base64, mimeType);
    formData.append("image", blob, values.file.name);
  }

  formData.append("publish", values.status === "Published" ? 1 : 0);
  formData.append("descript", values.description);
  formData.append("link", values.link);

  if (props.mode === "add") {
    try {
      await fotoStore.addSliderDataAdmin(formData).then(async () => {
        if (fotoStore.dataAddSlider != null) {
          fotoStore.getAllSlider();
          toast.add({
            title: "Slider berhasil ditambahkan",
            color: "green",
          });
          emit("close");
        } else {
          toast.add({
            title: "Slider gagal ditambahkan",
            color: "red",
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  } else {
     const id = fotoStore.detailSliderData.id;
    try {
      await fotoStore.editSliderDataAdmin(id, formData);
      if (fotoStore.dataEditSliderAdmin.status == 200) {
        fotoStore.getAllSlider();
        toast.add({
          title: "Slider berhasil diperbarui",
          color: "green",
        });
        emit("close");
      } else {
        toast.add({
          title: "Slider gagal diperbarui",
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
      // Reset form submitted state dan error ketika modal dibuka
      isSubmitted.value = false;
      setErrors({});

      if (props.mode === "edit") {
        setValues({
          title: fotoStore.detailSliderData.title,
          file: fotoStore.detailSliderData.image,
          description: fotoStore.detailSliderData.description,
          link: fotoStore.detailSliderData.link,
          status: fotoStore.detailSliderData.publish == 1 ? "Published" : "Pending",
        });
      } else {
        resetForm();
      }
    }
  }
);

const closeModal = () => {
  // Reset form submitted state dan error ketika modal ditutup
  isSubmitted.value = false;
  setErrors({});
  emit("update:modelValue", false);
  emit("close");
};

const updateIsOpen = (value) => {
  emit("update:modelValue", value);
};
</script>
