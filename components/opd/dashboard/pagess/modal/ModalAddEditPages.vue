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
            {{ mode === "edit" ? "Edit Page" : "Tambah Page" }}
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
              <NuxtImg :src="adminStore.dataDetailPages?.image" class="rounded-lg" />
            </div>
            <File name="file" label="Gambar" />
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
        <div class="flex justify-end p-4">
          <UButton
            type="submit"
            :icon="
              mode === 'edit' ? 'i-heroicons-pencil' : 'material-symbols:add-2-rounded'
            "
            @click="handleAddEditPage()"
            color="blue"
          >
            {{ mode === "edit" ? "Simpan Perubahan" : "Tambah Page" }}
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
import File from "../component/FileUploadPages";
import Editor from "~/components/global/input/editor.vue";
import { useAdminStore } from "~/store/admin/admin";

const props = defineProps({
  isOpen: Boolean,
  mode: String,
});

const adminStore = useAdminStore();
const emit = defineEmits(["close", "submit", "update:modelValue"]);
const validationSchema = yup.object({
  title: yup.string().required("Judul wajib diisi").label("Title"),
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

const isSubmitted = ref(false);
const toast = useToast();

const showValidationErrors = (errs) => {
  isSubmitted.value = true;
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

const handleAddEditPage = async () => {
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
      await adminStore.addPagesAdmin(formData).then(async () => {
        if (adminStore.dataAddPages.status == 201) {
          toast.add({
            title: "Page berhasil ditambahkan",
            color: "green",
          });
          emit("close");
          await adminStore.getAllPages();
        } else {
          toast.add({
            title: "Page gagal ditambahkan",
            color: "red",
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    const id = adminStore.dataDetailPages.id;
    try {
      await adminStore.editPagesAdmin(id, formData).then(async () => {
        if (adminStore.dataEditPages.status == 200) {
          toast.add({
            title: "Page berhasil diperbarui",
            color: "green",
          });
          emit("close");
          await adminStore.getAllPages();
        } else {
          toast.add({
            title: "Page gagal diperbarui",
            color: "red",
          });
        }
      });
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
          title: adminStore.dataDetailPages.title,
          file: adminStore.dataDetailPages.image,
          status: adminStore.dataDetailPages.publish == 1 ? "Published" : "Pending",
          description: adminStore.dataDetailPages.description,
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
  isSubmitted.value = false;
  setErrors({});
};

const updateIsOpen = (value) => {
  emit("update:modelValue", value);
};
</script>
