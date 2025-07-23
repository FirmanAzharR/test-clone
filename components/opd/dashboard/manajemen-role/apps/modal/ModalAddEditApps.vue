<template>
  <UModal :model-value="isOpen" @update:model-value="updateIsOpen">
    <UCard :ui="{
      ring: '',
      divide: 'divide-y divide-gray-100 dark:divide-gray-800',
    }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="mb-3 text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{ mode === "edit" ? "Edit Profile" : "Tambah Profile" }}
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="closeModal" />
        </div>
        <div class="space-y-2">
          <div class="space-y-2">
            <Input name="title" placeholder="Input Title..." label="Title" />
            <Input name="description" placeholder="Input Deskripsi..." label="Deskripsi" />
          </div>
            <div class="mb-4">
              <UFormGroup label="Status" name="status">
                <USelect size="md" placeholder="Select Status..." :model-value="values.status" @update:model-value="
                  (val) => setValues({ ...values, status: val })
                " :options="status" class="max-w-full mb-4 overflow-x-auto" />
              </UFormGroup>
            </div>
            <div class="mb-4">
              <UFormGroup label="Instansi" name="instansi">
                <USelect
                  size="md"
                  placeholder="Select Instansi..."
                  :model-value="values.instansi"
                  @update:model-value="(val) => setValues({ ...values, instansi: val })"
                  :options="instansiOptions"
                />
              </UFormGroup>
            </div>
        </div>
        <div class="flex justify-between">
          <UButton color="gray" variant="ghost" label="Back" class="-my-1" @click="closeModal" />
          <UButton type="submit" :icon="mode === 'edit'
              ? 'i-heroicons-pencil'
              : 'material-symbols:add-2-rounded'
            " @click="handleAddEditProfile()" color="blue">
            {{ mode === "edit" ? "Simpan Perubahan" : "Tambah Profile" }}
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup>
import { watch } from "vue";
import Input from "~/components/global/input/text.vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { useSuperAdminStore } from "~/store/admin/superadmin";

const props = defineProps({
  isOpen: Boolean,
  mode: String,
});

const superAdminStore = useSuperAdminStore();
const emit = defineEmits(["close", "submit", "update:modelValue"]);
const validationSchema = yup.object({
  title: yup.string().required("Title is required").label("Title"),
  description: yup.mixed().label("File"),
  status: yup.string().required("Status is required").label("Status"),
  instansi: yup.string().label("Instansi").required("Instansi is required"),
});

const status = ["Published", "Pending"];
const instansiOptions = computed(() => {
  return superAdminStore.allDataInstansi?.map((instansi) => ({
    label: instansi.nama,
    value: instansi.id, 
  })) || [];
});

const { handleSubmit, values, setValues, resetForm } = useForm({
  initialValues: {
    title: "",
    description: "",
    status: "",
    instansi: "",
  },
  validationSchema: validationSchema,
});


const toast = useToast();

const handleAddEditProfile = handleSubmit(async () => {
  const payload = {
    title : values.title,
    description: values.description,
    instansi_id: values.instansi,
    publish : values.status === "Published" ? "1" : "0",
    unique_id : crypto.randomUUID().slice(0, 5).toString()
  }
  if (props.mode === "add") {
    try {
      await superAdminStore.addAppsData(payload).then(async () => {
        if (superAdminStore.dataAddApps != null) {
          toast.add({
            icon: "i-heroicons-information-circle",
            title: "Success",
            description: "Data has been added",
          });
          emit("close");
          await superAdminStore.getAllApps();
        } else {
          toast.add({
            icon: "i-heroicons-information-circle",
            title: "Failed",
            description: "Data failed to add",
            color: "red",
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    const id = superAdminStore.detailAppsData.id;
    try {
      await superAdminStore.editAppsData(id, payload).then(async () => {
        if (superAdminStore.dataEditAppsData != null) {
          toast.add({
            icon: "i-heroicons-information-circle",
            title: "Success",
            description: "Data has been updated",
          });
          emit("close");
          await superAdminStore.getAllApps();
      } else {
        toast.add({
          icon: "i-heroicons-information-circle",
          title: "Failed",
          description: "Data failed to update",
          color: "red",
        });
      }
      });
    } catch (error) {
      console.log(error);
    }
  }
});

watch(
  () => props.isOpen,
  (newIsOpen) => {
    if (newIsOpen) {
      if (props.mode === "edit") {
        setValues({
          title: superAdminStore.detailAppsData?.title,
          status: superAdminStore.detailAppsData?.status === "1" ? "Published" : "Pending", 
          description: superAdminStore.detailAppsData?.description,
          instansi: superAdminStore.detailAppsData?.instansi_id,
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
