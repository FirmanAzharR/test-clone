<template>
  <UModal :model-value="isOpen" @update:model-value="updateIsOpen" :ui="{ width: 'sm:max-w-3xl' }"
    :prevent-close="true">
    <UCard :ui="{
      ring: '',
      divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      body: 'p-0',
    }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{ mode === "edit" ? "Edit Role" : "Tambah Role" }}
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="closeModal" />
        </div>
      </template>

      <div class="p-4 space-y-6">
        <!-- Name Input -->
        <Input name="name" placeholder="Input Nama..." label="Nama" />

        <!-- Roles Section -->
        <div>
          <h4 class="mb-4 font-medium text-gray-900 dark:text-white">Roles</h4>

          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4 max-h-[400px] overflow-y-auto">
            <!-- Role Categories -->
            <div v-for="(category, index) in roleCategories" :key="index"
              class="overflow-hidden border border-gray-200 rounded-md dark:border-gray-700">
              <div class="px-4 py-2 font-medium bg-gray-100 dark:bg-gray-700">
                {{ category.name }}
              </div>

              <div class="grid grid-cols-2 gap-2 p-3">
                <UCheckbox v-for="permission in category.permissions" :key="permission.value"
                  v-model="selectedPermissions[permission.value]" :label="permission.label" color="blue"
                  class="whitespace-nowrap" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-between w-full">
          <UButton color="gray" variant="ghost" label="Batal" @click="closeModal" />
          <UButton type="submit" :icon="mode === 'edit' ? 'i-heroicons-pencil' : 'i-material-symbols-add-2-rounded'
            " @click="handleAddEditRole()" color="blue">
            {{ mode === "edit" ? "Simpan Perubahan" : "Tambah Role" }}
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup>
import { watch, reactive, ref } from "vue";
import Input from "~/components/global/input/text.vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { useSuperAdminStore } from "~/store/admin/superadmin";
import { useToast } from "#imports";

const props = defineProps({
  isOpen: Boolean,
  mode: String,
});

const superAdminStore = useSuperAdminStore();
const emit = defineEmits(["close", "submit", "update:modelValue"]);
const toast = useToast();

const validationSchema = yup.object({
  name: yup.string().required("Name is required").label("Title"),
});

const { handleSubmit, values, setValues, resetForm } = useForm({
  initialValues: {
    name: "",
  },
  validationSchema: validationSchema,
});

// Role categories and permissions
const roleCategories = [
  {
    id: "role",
    name: "Role",
    permissions: [
      { label: "create-role", value: "create-role" },
      { label: "read-role", value: "read-role" },
      { label: "update-role", value: "update-role" },
      { label: "delete-role", value: "delete-role" },
    ],
  },
  {
    id: "user",
    name: "User",
    permissions: [
      { label: "create-user", value: "create-user" },
      { label: "read-user", value: "read-user" },
      { label: "update-user", value: "update-user" },
      { label: "delete-user", value: "delete-user" },
    ],
  },
  {
    id: "user_role",
    name: "User Role",
    permissions: [
      { label: "create-user_role", value: "create-user_role" },
      { label: "read-user_role", value: "read-user_role" },
      { label: "update-user_role", value: "update-user_role" },
      { label: "delete-user_role", value: "delete-user_role" },
    ],
  },
  {
    id: "app",
    name: "App",
    permissions: [
      { label: "create-app", value: "create-app" },
      { label: "read-app", value: "read-app" },
      { label: "update-app", value: "update-app" },
      { label: "delete-app", value: "delete-app" },
    ],
  },
  {
    id: "token",
    name: "Token",
    permissions: [
      { label: "create-token", value: "create-token" },
      { label: "read-token", value: "read-token" },
      { label: "update-token", value: "update-token" },
      { label: "delete-token", value: "delete-token" },
    ],
  },
  {
    id: "artikel",
    name: "Artikel",
    permissions: [
      { label: "create-artikel", value: "create-artikel" },
      { label: "read-artikel", value: "read-artikel" },
      { label: "update-artikel", value: "update-artikel" },
      { label: "delete-artikel", value: "delete-artikel" },
    ],
  },
  {
    id: "berita",
    name: "Berita",
    permissions: [
      { label: "create-berita", value: "create-berita" },
      { label: "read-berita", value: "read-berita" },
      { label: "update-berita", value: "update-berita" },
      { label: "delete-berita", value: "delete-berita" },
    ],
  },
  {
    id: "kegiatan",
    name: "Kegiatan",
    permissions: [
      { label: "create-kegiatan", value: "create-kegiatan" },
      { label: "read-kegiatan", value: "read-kegiatan" },
      { label: "update-kegiatan", value: "update-kegiatan" },
      { label: "delete-kegiatan", value: "delete-kegiatan" },
    ],
  },
  {
    id: "galeri",
    name: "Galeri",
    permissions: [
      { label: "create-galeri", value: "create-galeri" },
      { label: "read-galeri", value: "read-galeri" },
      { label: "update-galeri", value: "update-galeri" },
      { label: "delete-galeri", value: "delete-galeri" },
    ],
  },
  {
    id: "video",
    name: "Video",
    permissions: [
      { label: "create-video", value: "create-video" },
      { label: "read-video", value: "read-video" },
      { label: "update-video", value: "update-video" },
      { label: "delete-video", value: "delete-video" },
    ],
  },
  {
    id: "slider",
    name: "Slider",
    permissions: [
      { label: "create-slider", value: "create-slider" },
      { label: "read-slider", value: "read-slider" },
      { label: "update-slider", value: "update-slider" },
      { label: "delete-slider", value: "delete-slider" },
    ],
  },
  {
    id: "profil",
    name: "Profil",
    permissions: [
      { label: "create-profil", value: "create-profil" },
      { label: "read-profil", value: "read-profil" },
      { label: "update-profil", value: "update-profil" },
      { label: "delete-profil", value: "delete-profil" },
    ],
  },
  {
    id: "agenda",
    name: "Agenda",
    permissions: [
      { label: "create-agenda", value: "create-agenda" },
      { label: "read-agenda", value: "read-agenda" },
      { label: "update-agenda", value: "update-agenda" },
      { label: "delete-agenda", value: "delete-agenda" },
    ],
  },
  {
    id: "layanan",
    name: "Layanan",
    permissions: [
      { label: "create-layanan", value: "create-layanan" },
      { label: "read-layanan", value: "read-layanan" },
      { label: "update-layanan", value: "update-layanan" },
      { label: "delete-layanan", value: "delete-layanan" },
    ],
  },
  {
    id: "menu",
    name: "Menu",
    permissions: [
      { label: "create-menu", value: "create-menu" },
      { label: "read-menu", value: "read-menu" },
      { label: "update-menu", value: "update-menu" },
      { label: "delete-menu", value: "delete-menu" },
    ],
  },
  {
    id: "page",
    name: "Page",
    permissions: [
      { label: "create-page", value: "create-page" },
      { label: "read-page", value: "read-page" },
      { label: "update-page", value: "update-page" },
      { label: "delete-page", value: "delete-page" },
    ],
  },
  {
    id: "widget",
    name: "Widget",
    permissions: [
      { label: "create-widget", value: "create-widget" },
      { label: "read-widget", value: "read-widget" },
      { label: "update-widget", value: "update-widget" },
      { label: "delete-widget", value: "delete-widget" },
    ],
  },
  {
    id: "permohonan",
    name: "Permohonan",
    permissions: [
      { label: "create-permohonan", value: "create-permohonan" },
      { label: "read-permohonan", value: "read-permohonan" },
      { label: "update-permohonan", value: "update-permohonan" },
      { label: "delete-permohonan", value: "delete-permohonan" },
    ],
  },
];

// Initialize selected permissions - flattened structure for easier management
const selectedPermissions = ref({});

// Initialize all permissions to false
const initializePermissions = () => {
  const initialPermissions = {};
  roleCategories.forEach((category) => {
    category.permissions.forEach((permission) => {
      initialPermissions[permission.value] = false;
    });
  });
  selectedPermissions.value = initialPermissions;
};

// Initialize permissions on component creation
initializePermissions();

// Parse JSON string to array
const parseAccessString = (accessString) => {
  try {
    return JSON.parse(accessString);
  } catch (e) {
    console.error("Failed to parse access JSON:", e);
    return [];
  }
};

// Set permissions from API data
const setPermissionsFromData = (accessData) => {
  // Reset all permissions first
  initializePermissions();

  // Parse the access string if it's a string
  const permissions =
    typeof accessData === "string"
      ? parseAccessString(accessData)
      : Array.isArray(accessData)
        ? accessData
        : [];

  // Set each permission to true if it exists in the permissions array
  permissions.forEach((permission) => {
    if (selectedPermissions.value.hasOwnProperty(permission)) {
      selectedPermissions.value[permission] = true;
    }
  });
};

const handleAddEditRole = handleSubmit(async () => {
  try {
    const permissions = Object.entries(selectedPermissions.value)
      .filter(([_, isSelected]) => isSelected)
      .map(([permission]) => permission);

    const payload = {
      name: values.name,
      access: JSON.stringify(permissions),
    };

    if (props.mode === "add") {
      try {
        const response = await superAdminStore.addRolesData(payload);
        if (response?.data?.status === 201 || response?.status === 201) {
          toast.add({
            icon: "i-heroicons-information-circle",
            title: "Success",
            description: "Role has been added",
          });
          emit("close");
          await superAdminStore.getAllRoles();
        } else {
          toast.add({
            icon: "i-heroicons-information-circle",
            title: "Failed",
            description: "Role failed to add",
            color: "red",
          });
        }
      } catch (error) {
        console.error("Error adding role:", error);
        toast.add({
          icon: "i-heroicons-exclamation-triangle",
          title: "Error",
          description: error.message || "Failed to add role",
          color: "red",
        });
      }
    } else {
      try {
        const id = superAdminStore.detailRolesData.id;
        const response = await superAdminStore.editRolesData(id, payload);
        if (superAdminStore.dataEditRolesData) {
          toast.add({
            icon: "i-heroicons-information-circle",
            title: "Success",
            description: "Role has been updated",
          });
          emit("close");
          await superAdminStore.getAllRoles();
        } else {
          toast.add({
            icon: "i-heroicons-information-circle",
            title: "Failed",
            description: "Role failed to update",
            color: "red",
          });
        }
      } catch (error) {
        console.error("Error updating role:", error);
        toast.add({
          icon: "i-heroicons-exclamation-triangle",
          title: "Error",
          description: error.message || "Failed to update role",
          color: "red",
        });
      }
    }
  } catch (error) {
    console.error(error);
    toast.add({
      icon: "i-heroicons-exclamation-triangle",
      title: "Error",
      description: "An unexpected error occurred",
      color: "red",
    });
  }
});

// Watch for modal open/close
watch(
  () => props.isOpen,
  (newIsOpen) => {
    if (newIsOpen) {
      if (props.mode === "edit" && superAdminStore.detailRolesData) {
        setValues({
          name: superAdminStore.detailRolesData?.name || "",
        });

        // Set permissions from the access field
        const accessData = superAdminStore.detailRolesData?.access;
        setPermissionsFromData(accessData);
      } else {
        resetForm();
        // Reset all permissions
        initializePermissions();
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

<style scoped>
/* Custom scrollbar for the permissions section */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Dark mode scrollbar */
.dark .overflow-y-auto::-webkit-scrollbar-track {
  background: #2d3748;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background: #4a5568;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #718096;
}
</style>
