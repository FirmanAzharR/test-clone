<template>
  <UModal :model-value="isOpen" @update:model-value="updateIsOpen" :prevent-close="true">
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
          <div class="mb-4">
            <UFormGroup label="App" name="app">
              <USelect size="md" placeholder="Select App..." :model-value="values.app"
                @update:model-value="(val) => setValues({ ...values, app: val })" :options="appOption"
                class="max-w-full mb-4 overflow-x-auto" />
            </UFormGroup>
          </div>
          <div class="mb-4">
            <UFormGroup label="User" name="user">
              <USelect size="md" placeholder="Select User..." :model-value="values.user"
                @update:model-value="(val) => setValues({ ...values, user: val })" :options="userOption"
                class="max-w-full mb-4 overflow-x-auto" />
            </UFormGroup>
          </div>
          <div class="mb-4">
            <UFormGroup label="Role" name="role">
              <USelect size="md" placeholder="Select Role..." :model-value="values.role"
                @update:model-value="(val) => setValues({ ...values, role: val })" :options="roleOption" />
            </UFormGroup>
          </div>
        </div>
        <div class="flex justify-between">
          <UButton color="gray" variant="ghost" label="Back" class="-my-1" @click="closeModal" />
          <UButton type="submit" :icon="mode === 'edit' ? 'i-heroicons-pencil' : 'material-symbols:add-2-rounded'
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
  app: yup.string().label("App").required("App is required"),
  user: yup.string().label("User").required("User is required"),
  role: yup.string().label("Role").required("Role is required"),
});

const appOption = computed(() => {
  return (
    superAdminStore.allDataApps.data?.map((instansi) => ({
      label: instansi.title,
      value: instansi.id,
    })) || []
  );
});
const userOption = computed(() => {
  return (
    superAdminStore.allDataUser.data?.map((instansi) => ({
      label: instansi.nickname,
      value: instansi.id,
    })) || []
  );
});
const roleOption = computed(() => {
  return (
    superAdminStore.allDataRoles.data?.map((instansi) => ({
      label: instansi.name,
      value: instansi.id,
    })) || []
  );
});

const { handleSubmit, values, setValues, resetForm } = useForm({
  initialValues: {
    app: "",
    user: "",
    role: "",
  },
  validationSchema: validationSchema,
});

const toast = useToast();

const handleAddEditProfile = handleSubmit(async () => {
  const payload = {
    app_id: Number(values.app),
    user_id: Number(values.user),
    role_id: Number(values.role),
  };
  if (props.mode === "add") {
    try {
      await superAdminStore.addUserRoles(payload).then(async () => {
        if (superAdminStore.dataAddUserRole != null) {
          toast.add({
            icon: "i-heroicons-information-circle",
            title: "Success",
            description: "Data has been added",
          });
          emit("close");
          await superAdminStore.getAllUserRole();
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
    const id = superAdminStore.detailDataUserRole.id;
    try {
      await superAdminStore.editUserRoles(id, payload).then(async () => {
        if (superAdminStore.dataEditUserRoles != null) {
          toast.add({
            icon: "i-heroicons-information-circle",
            title: "Success",
            description: "Data has been updated",
          });
          emit("close");
          await superAdminStore.getAllUserRole();
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
          app: superAdminStore.detailDataUserRole?.app?.id || "",
          user: superAdminStore.detailDataUserRole?.user?.id || "",
          role: superAdminStore.detailDataUserRole?.role?.id || "",
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
