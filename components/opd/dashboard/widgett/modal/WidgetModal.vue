<template>
  <UModal
    :open="isOpen"
    :ui="{ width: 'max-w-3xl' }"
    @close="updateIsOpen(false)"
    :prevent-close="true"
  >
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{ mode === "edit" ? "Edit Widget" : "Tambah Widget" }}
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="closeModal"
          />
        </div>
      </template>

      <form class="p-4 space-y-4">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <div class="mb-4">
              <Input
                name="title"
                label="Nama Widget *"
                placeholder="Masukkan judul widget"
              />
            </div>

            <div class="mb-4">
              <TextArea name="message" label="Pesan *" placeholder="Masukkan pesan widget" />
            </div>

            <div class="mb-4">
              <UFormGroup label="Kategori *" name="opt">
                <USelect :model-value="values.opt" @update:model-value="(val) => setValues({ ...values, opt: val })"
                  :options="[
                    { label: 'Fab', value: 'fab' },
                    { label: 'Popup', value: 'popup' },
                    { label: 'Running Text', value: 'runningtext' },
                  ]"
                  placeholder="Pilih kategori widget"
                />
                <span
                  v-if="isSubmitted && errors.opt"
                  class="mt-1 text-xs text-red-500"
                  >{{ errors.opt }}</span
                >
              </UFormGroup>
            </div>
          </div>

          <div>
            <div class="mb-4">
              <UFormGroup label="Status *" name="publish">
                <USelect :model-value="values.publish"
                  @update:model-value="(val) => setValues({ ...values, publish: val })" :options="[
                    { label: 'Publish', value: '1' },
                    { label: 'Pending', value: '0' },
                  ]"
                  placeholder="Pilih status widget"
                />
                <span
                  v-if="isSubmitted && errors.publish"
                  class="mt-1 text-xs text-red-500"
                  >{{ errors.publish }}</span
                >
              </UFormGroup>
            </div>

            <div class="mb-4">
              <!-- Preview gambar saat mode edit dan iconfab ada (bukan file baru) -->
              <div
                v-if="
                  mode === 'edit' && values.iconfab && typeof values.iconfab === 'string'
                "
                class="mb-2"
              >
                <span class="font-semibold block mb-1">Preview Icon:</span>
                <img
                  :src="values.iconfab"
                  alt="Widget Icon"
                  class="h-full w-auto object-contain rounded-lg"
                />
              </div>
              <File name="iconfab" label="Icon" :current-image="mode === 'edit' ? values.iconfab : null"
                accept="image/jpeg,image/png,image/jpg"
                :info="'Dimensi gambar 1024px x 700px\nMax ukuran file 300KB\nFormat: jpg, jpeg, png'" />
              <!-- Error message untuk file -->
              <div
                class="mb-2 text-xs text-red-500"
                v-if="values.iconfab && values.iconfab?.message"
              >
                {{ values.iconfab.message }}
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end mt-4">
          <UButton
            type="submit"
            :loading="isSubmitting"
            :icon="
              mode === 'edit' ? 'i-heroicons-pencil' : 'material-symbols:add-2-rounded'
            "
            color="blue"
            @click.prevent="handleAddEditWidget"
          >
            {{ mode === "edit" ? "Simpan Perubahan" : "Tambah Widget" }}
          </UButton>
        </div>
      </form>
    </UCard>
  </UModal>
</template>

<script setup>
import { ref, watch } from "vue";
import { useWidgetStore } from "~/store/widgett/widget";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { useToast } from "#imports";
import Input from "~/components/global/input/text.vue";
import TextArea from "~/components/global/input/textarea.vue";
import File from "../component/FileUploadWidget";

const widgetStore = useWidgetStore();
const toast = useToast();
const isSubmitting = ref(false);
const isSubmitted = ref(false);

const props = defineProps({
  isOpen: Boolean,
  mode: String,
  detailData: Object,
});

const emit = defineEmits(["close", "submit", "update:modelValue"]);

const validationSchema = yup.object({
  title: yup.string().required("Nama widget wajib diisi").label("Nama Widget"),
  message: yup.string().required("Pesan wajib diisi").label("Pesan"),
  opt: yup.string().required("Kategori wajib diisi").label("Kategori"),
  publish: yup.string().required("Status wajib diisi").label("Status"),
});

const {
  handleSubmit,
  values,
  setValues,
  resetForm,
  errors,
  meta,
  validate,
  touched,
} = useForm({
  initialValues: {
    title: "",
    message: "",
    opt: "",
    publish: "",
    allpages: "0",
    iconfab: "",
  },
  validationSchema,
});

watch(
  () => props.isOpen,
  (newIsOpen) => {
    if (newIsOpen) {
      isSubmitted.value = false; // Reset submitted state when modal opens
      if (props.mode === "edit" && props.detailData) {
        setValues({
          title: props.detailData.title || "",
          message: props.detailData.message || "",
          opt: props.detailData.opt || "fab",
          publish: props.detailData.publish?.toString() || "1",
          allpages: props.detailData.allpages?.toString() || "0",
          iconfab: props.detailData.iconfab || "",
        });
      } else {
        resetForm();
        setValues({
          ...values,
          allpages: "0",
        });
      }
    }
  }
);

const handleAddEditWidget = async () => {
  isSubmitted.value = true;
  const { valid, errors: validationErrors } = await validate();

  if (!valid) {
    showValidationErrors(validationErrors);
    return;
  }

  try {
    isSubmitting.value = true;
    const formData = new FormData();

    if (values.iconfab?.base64) {
      const blob = base64ToBlob(values.iconfab.base64);
      formData.append("iconfab", blob, values.iconfab.name);
    }

    formData.append("title", values.title);
    formData.append("message", values.message);
    formData.append("opt", values.opt);
    formData.append("publish", values.publish);
    formData.append("allpages", values.allpages || "0");

    if (props.mode === "edit") {
      const data = [props.detailData.id, formData];
      await widgetStore.updateWidget(data);
      toast.add({ title: "Widget berhasil diperbarui", color: "green" });
    } else {
      formData.append("kategori", "widget");
      await widgetStore.storeWidget(formData);
      toast.add({ title: "Widget berhasil ditambahkan", color: "green" });
    }

    emit("submit");
    closeModal();
  } catch (error) {
    console.error("Error:", error);
    toast.add({
      title: error.response?.data?.message || "Terjadi kesalahan saat menyimpan",
      color: "red",
    });
  } finally {
    isSubmitting.value = false;
  }
};

const showValidationErrors = (errors) => {
  // Create a slight delay between toasts for better visibility
  Object.entries(errors).forEach(([field, message], index) => {
    setTimeout(() => {
      switch (field) {
        case "title":
          toast.add({ title: "Nama widget wajib diisi", color: "red" });
          break;
        case "message":
          toast.add({ title: "Pesan wajib diisi", color: "red" });
          break;
        case "opt":
          toast.add({ title: "Kategori wajib diisi", color: "red" });
          break;
        case "publish":
          toast.add({ title: "Status wajib diisi", color: "red" });
          break;
      }
    }, index * 100); // Add 100ms delay between each toast
  });
};

const closeModal = () => {
  emit("update:modelValue", false);
  emit("close");
};

const updateIsOpen = (value) => {
  emit("update:modelValue", value);
};
</script>
