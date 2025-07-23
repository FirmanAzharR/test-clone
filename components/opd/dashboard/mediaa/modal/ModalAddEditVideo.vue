<template>
  <UModal :model-value="isOpen" @update:model-value="updateIsOpen" @close="closeModal" :prevent-close="true">
    <UCard :ui="{
      ring: '',
      divide: 'divide-y divide-gray-100 dark:divide-gray-800',
    }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{ mode === "edit" ? "Edit Video" : "Tambah Video" }}
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="closeModal" />
        </div>
        <div class="gap-4 p-4 space-y-2">
          <!-- Title Input -->
          <Input name="title" placeholder="Masukkan Judul..." label="Title" :model-value="values.title"
            @update:model-value="(val) => setFieldValue('title', val)" />

          <!-- Link Input -->
          <Input name="video" placeholder="Masukkan Youtube Link..." label="Link Youtube" :model-value="values.video"
            @update:model-value="(val) => setFieldValue('video', val)" />

          <!-- Status Select -->
          <div class="mb-4">
            <UFormGroup label="Status" name="status">
              <USelect size="md" placeholder="Pilih Status..." :model-value="values.status"
                @update:model-value="(val) => setFieldValue('status', val)" :options="status"
                class="max-w-full mb-4 overflow-x-auto" />
            </UFormGroup>
            <div class="mb-2 text-xs text-red-500" v-if="isSubmitted && errors.status">
              {{ errors.status }}
            </div>
          </div>
        </div>
        <div class="flex justify-end">
          <UButton type="submit" :icon="mode === 'edit' ? 'i-heroicons-pencil' : 'material-symbols:add-2-rounded'
            " @click="onSubmit" color="blue" :loading="isSubmitting">
            {{ mode === "edit" ? "Simpan Perubahan" : "Tambah Video" }}
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
import { useFotoStore } from "~/store/foto/foto";

const props = defineProps({
  isOpen: Boolean,
  mode: String,
});

const fotoStore = useFotoStore();
const emit = defineEmits(["close", "submit", "update:modelValue"]);
const isSubmitting = ref(false);
const isSubmitted = ref(false);

const validationSchema = yup.object({
  title: yup.string().required("Judul wajib diisi").label("Title"),
  video: yup.string().required("Link wajib diisi").label("Link"),
  status: yup.string().required("Status wajib diisi").label("Status"),
});

const status = ["Published", "Pending"];

const {
  handleSubmit,
  values,
  setValues,
  resetForm,
  setFieldValue,
  errors,
  validate,
  setErrors,
} = useForm({
  initialValues: {
    title: "",
    video: "",
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
        case "video":
          toast.add({ title: "Link wajib diisi", color: "red" });
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
  isSubmitting.value = true;
  const validationResult = await validate();
  isSubmitted.value = true;

  // Check if there are any errors
  if (!validationResult.valid) {
    showValidationErrors(validationResult.errors);
    isSubmitting.value = false;
    return;
  }

  const formData = new FormData();
  formData.append("title", values.title);
  formData.append("video", values.video);
  formData.append("publish", values.status === "Published" ? 1 : 0);

  try {
    if (props.mode === "add") {
      await fotoStore.addVideosDataAdmin(formData).then(async () => {
        if (fotoStore.dataAddVideo != null) {
          fotoStore.getAllVideo();
          toast.add({
            title: "Video berhasil ditambahkan",
            color: "green",
          });
          emit("close");
        } else {
          toast.add({
            title: "Video gagal ditambahkan",
            color: "red",
          });
        }
      });
    } else {
      const id = fotoStore.detailVideoData.id;
      await fotoStore.editVideosDataAdmin(id, formData);
      if (fotoStore.dataEditVideosAdmin.status == 200) {
        fotoStore.getAllVideo();
        toast.add({
          title: "Video berhasil diperbarui",
          color: "green",
        });
        emit("close");
      } else {
        toast.add({
          title: "Video gagal diperbarui",
          color: "red",
        });
      }
    }
  } catch (error) {
    console.log(error);
    toast.add({
      title: "Terjadi kesalahan saat memproses data",
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
      // Reset form submitted state dan error ketika modal dibuka
      isSubmitted.value = false;
      setErrors({});

      if (props.mode === "edit") {
        setValues({
          title: fotoStore.detailVideoData.title,
          video: fotoStore.detailVideoData.video,
          status: fotoStore.detailVideoData.publish == 1 ? "Published" : "Pending",
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
