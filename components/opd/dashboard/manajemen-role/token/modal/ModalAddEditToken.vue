<template>
  <UModal :model-value="isOpen" @update:model-value="updateIsOpen" :prevent-close="true">
    <UCard :ui="{
      ring: '',
      divide: 'divide-y divide-gray-100 dark:divide-gray-800',
    }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="mb-3 text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{ mode === "edit" ? "Edit Token" : "Tambah Token" }}
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="closeModal" />
        </div>
        <div class="space-y-2">
          <div class="mb-4">
            <UFormGroup label="App" name="app">
              <USelect size="md" placeholder="Select App..." :model-value="values.app"
                @update:model-value="(val) => setValues({ ...values, app: val })" :options="appOption"
                class="max-w-full mb-4 overflow-x-auto" />
            </UFormGroup>
          </div>
          <Input name="name" placeholder="Input Nama..." label="Nama" />
          <div class="relative space-y-1">
            <div class="relative" v-if="values.app">
              <UInput class="flex" color="blue" disabled highlight v-model="valueToken"
                placeholder="Please Generate Token" size="xl" />
              <div class="flex justify-end mt-2">
                <UButton color="blue" variant="soft" label="Generate Token" @click="handleGenerateToken(values.app)" />
              </div>
            </div>
          </div>
          <TextArea name="description" placeholder="Input Deskripsi ..." label="Deskripsi" />
          <div class="mb-4">
            <UFormGroup label="Status" name="status">
              <USelect size="md" placeholder="Select Status..." :model-value="values.status"
                @update:model-value="(val) => setValues({ ...values, status: val })" :options="status"
                class="max-w-full mb-4 overflow-x-auto" />
            </UFormGroup>
          </div>
        </div>
        <div class="flex justify-between">
          <UButton color="gray" variant="ghost" label="Back" class="-my-1" @click="closeModal" />
          <UButton type="submit" :icon="mode === 'edit' ? 'i-heroicons-pencil' : 'material-symbols:add-2-rounded'
            " @click="handleAddEditProfile()" color="blue">
            {{ mode === "edit" ? "Simpan Perubahan" : "Tambah Token" }}
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup>
import { watch, ref } from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { useSuperAdminStore } from "~/store/admin/superadmin";
import Input from "~/components/global/input/text.vue";
import TextArea from "~/components/global/input/textarea.vue";
import { toRaw } from "vue";

const props = defineProps({
  isOpen: Boolean,
  mode: String,
});

const status = ["Published", "Pending"];
const superAdminStore = useSuperAdminStore();
const emit = defineEmits(["close", "submit", "update:modelValue"]);
const validationSchema = yup.object({
  app: yup.string().label("App").required("App is required"),
  name: yup.string().label("Nama").required("Nama is required"),
  token: yup.string().label("Token").required("Token is required"),
  description: yup.string().label("Description").required("Description is required"),
  status: yup.string().label("Status").required("Status is required"),
});

const valueToken = ref(superAdminStore.dataGenerateToken.token);

const appOption = computed(() => {
  return (
    superAdminStore.allDataApps.data?.map((instansi) => ({
      label: instansi.title,
      value: instansi.id,
    })) || []
  );
});

const { handleSubmit, values, setValues, resetForm } = useForm({
  initialValues: {
    app: "",
    name: "",
    token: "",
    description: "",
    status: "",
  },
  validationSchema: validationSchema,
});

const toast = useToast();

const handleGenerateToken = async (id) => {
  try {
    await superAdminStore.generateToken(id);
  } catch (error) {
    console.log(error);
  }
};

const handleAddEditProfile = async () => {
  const payload = {
    app_id: toRaw(Number(values.app)),
    description: toRaw(values.description),
    name: toRaw(values.name),
    publish: values.status === "Published" ? "1" : "0",
    token: toRaw(valueToken.value),
  };

  if (props.mode === "add") {
    try {
      await superAdminStore.addTokenData(payload).then(async () => {
        if (superAdminStore.dataAddToken != null) {
          toast.add({
            icon: "i-heroicons-information-circle",
            title: "Success",
            description: "Data has been added",
          });
          emit("close");
          await superAdminStore.getAllToken();
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
    const id = superAdminStore.detailTokenData.id;
    try {
      await superAdminStore.editTokenData(id, payload).then(async () => {
        if (superAdminStore.dataEditTokenData != null) {
          toast.add({
            icon: "i-heroicons-information-circle",
            title: "Success",
            description: "Data has been updated",
          });
          emit("close");
          await superAdminStore.getAllToken();
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
};

watch(
  () => props.isOpen,
  (newIsOpen) => {
    if (newIsOpen) {
      if (props.mode === "edit") {
        setValues({
          app: superAdminStore.detailTokenData?.app?.id,
          status:
            superAdminStore.detailTokenData?.publish === "1" ? "Published" : "Pending",
          description: superAdminStore.detailTokenData?.description,
          name: superAdminStore.detailTokenData?.name,
          token: superAdminStore.detailTokenData?.token,
        });
        valueToken.value = superAdminStore.detailTokenData?.token || "";
      } else {
        resetForm();
        valueToken.value = "";
      }
    }
  }
);

watch(
  () => superAdminStore.dataGenerateToken,
  (newToken) => {
    if (props.mode === "add" && newToken?.token) {
      valueToken.value = newToken.token;
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
