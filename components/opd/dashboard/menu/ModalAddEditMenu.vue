<template>
  <UModal :model-value="isOpen" @update:model-value="updateIsOpen" @close="closeModal" :prevent-close="true">
    <UCard :ui="{
      ring: '',
      divide: 'divide-y divide-gray-100 dark:divide-gray-800',
    }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{ mode === "edit" ? "Edit Menu" : "Tambah Menu" }}
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="closeModal" />
        </div>
      </template>
      <div class="mb-1 pl-4">
        <span class="text-xs text-red-500">*Setiap link harus di awali dengan "/" seperti "/page/id"</span>
      </div>
      <div class="gap-4 p-4 space-y-4">
        <Input name="menu_name" placeholder="Masukkan Nama Menu..." label="Nama Menu *" />
        <Input name="link_name" placeholder="Masukkan Link Menu..." label="Link Menu *" />
        <div class="mb-4">
          <UFormGroup label="Status *" name="status">
            <USelect size="md" placeholder="Pilih Status..." :model-value="values.status"
              @update:model-value="(val) => setValues({ ...values, status: val })" :options="status"
              class="max-w-full overflow-x-auto" />
          </UFormGroup>
          <span v-if="isSubmitted && errors.status" class="mt-1 text-xs text-red-500">{{
            errors.status
          }}</span>
        </div>
        <div class="flex justify-end">
          <UButton type="submit" :loading="isSubmitting" :icon="mode === 'edit' ? 'i-heroicons-pencil' : 'material-symbols:add-2-rounded'
            " @click="handleAddEditMenu" color="blue">
            {{ mode === "edit" ? "Simpan Perubahan" : "Tambah Menu" }}
          </UButton>
        </div>
      </div>
    </UCard>
  </UModal>
</template>

<script setup>
import { ref, watch, nextTick } from "vue";
import Input from "~/components/global/input/text.vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { useMenuStore } from "~/store/menu/menu";
import { useToast } from "#imports";

const props = defineProps({
  isOpen: Boolean,
  mode: String,
  detailData: Object,
  isSubmenu: Boolean,
  parentMenuId: [Number, String],
});

const emit = defineEmits(["close", "submit", "update:modelValue"]);
const menuStore = useMenuStore();
const toast = useToast();
const isSubmitting = ref(false);
const isSubmitted = ref(false);

const validationSchema = yup.object({
  menu_name: yup.string().required("Nama menu wajib diisi").label("Title"),
  link_name: yup.string().required("Link menu wajib diisi").label("Title"),
  status: yup.string().required("Status wajib diisi").label("Status"),
});

const status = ["Published", "Pending"];

const { handleSubmit, values, setValues, resetForm, errors, validate } = useForm({
  initialValues: {
    menu_name: "",
    link_name: "",
    status: "",
  },
  validationSchema: validationSchema,
});

const showValidationErrors = (errors) => {
  // Use Vue 3 nextTick to ensure DOM is updated
  nextTick(() => {
    Object.entries(errors).forEach(([field, message], index) => {
      setTimeout(() => {
        switch (field) {
          case "menu_name":
            toast.add({ title: "Nama menu wajib diisi", color: "red" });
            break;
          case "link_name":
            toast.add({ title: "Link menu wajib diisi", color: "red" });
            break;
          case "status":
            toast.add({ title: "Status wajib diisi", color: "red" });
            break;
        }
      }, index * 100);
    });
  });
};

const handleAddEditMenu = async (e) => {
  if (e) e.preventDefault();
  isSubmitted.value = true;
  const { valid, errors: validationErrors } = await validate();

  if (!valid) {
    showValidationErrors(validationErrors);
    return;
  }

  try {
    isSubmitting.value = true;
    const newMenu = {
      id: Date.now(),
      title: values.menu_name,
      link: values.link_name,
      publish: values.status === "Published" ? 1 : 0,
      submenu: "[]",
    };

    if (props.mode === "add") {
      emit("submit", newMenu, props.isSubmenu, props.parentMenuId);
      toast.add({ title: "Menu berhasil ditambahkan", color: "green" });
    } else {
      emit(
        "submit",
        { ...newMenu, id: props.detailData.id },
        props.isSubmenu,
        props.parentMenuId
      );
      toast.add({ title: "Menu berhasil diperbarui", color: "green" });
    }

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

watch(
  () => props.isOpen,
  (newIsOpen) => {
    if (newIsOpen) {
      isSubmitted.value = false;
      if (props.mode === "edit") {
        setValues({
          menu_name: props.detailData.title,
          link_name: props.detailData.link,
          status: props.detailData.publish == 1 ? "Published" : "Pending",
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
