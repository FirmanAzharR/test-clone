<template>
  <UModal :model-value="isOpen" @update:model-value="updateIsOpen" :prevent-close="true">
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{ mode === "edit" ? "Edit Profile" : "Tambah Profile" }}
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
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Input name="title" placeholder="Masukkan Judul..." label="Judul" />
              <TextArea name="address" placeholder="Masukkan Alamat..." label="Alamat" />
              <Input
                name="googlemaps"
                placeholder="Masukkan Google Maps..."
                label="Google Maps"
              />
              <UButton
                size="md"
                variant="outline"
                class="justify-center w-full mt-5 mb-2"
                color="green"
                icon="material-symbols:add-2-rounded"
                :trailing="false"
                @click="push({ id: '', sosmed: '' })"
                label="Tambah Social Media"
              />
              <div
                v-for="(field, index) in fields"
                :key="field.key"
                class="relative mt-5"
              >
                <div class="bg-gray-50 dark:bg-gray-800 rounded-lg shadow p-4">
                  <UButton
                    size="sm"
                    variant="ghost"
                    class="absolute top-2 right-2 z-10"
                    color="red"
                    icon="i-heroicons-trash"
                    :trailing="false"
                    @click="remove(index)"
                  />
                  <UFormGroup label="Social Media" :name="`sosmed[${index}].id`">
                    <USelect
                      size="lg"
                      placeholder="Pilih Social Media..."
                      :model-value="field.value.id"
                      @update:model-value="
                        (val) =>
                          setValues({
                            ...values,
                            sosmed: values.sosmed.map((s, i) =>
                              i === index ? { ...s, id: val } : s
                            ),
                          })
                      "
                      :options="sosmed"
                      class="max-w-full mb-4 overflow-x-auto"
                    />
                  </UFormGroup>
                  <Input
                    :name="`sosmed[${index}].sosmed`"
                    placeholder="Masukkan Link..."
                    label="Link"
                    v-model="field.value.sosmed"
                    class="mt-2"
                  />
                  <div
                    class="mb-2 text-xs text-red-500"
                    v-if="
                      isSubmitted &&
                      errors.sosmed &&
                      errors.sosmed[index] &&
                      errors.sosmed[index].sosmed
                    "
                  >
                    {{ errors.sosmed[index].sosmed }}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div
                class="flex items-center justify-center mt-6"
                v-if="props.mode == 'edit'"
              >
                <NuxtImg :src="adminStore.detailProfileData?.logo" class="rounded-lg" />
              </div>
              <File name="file" label="Gambar" />
              <!-- Error message untuk file yang sudah ada -->
              <div
                class="mb-2 text-xs text-red-500"
                v-if="values.file && values.file?.message"
              >
                {{ values.file.message }}
              </div>
              <Input name="email" placeholder="Masukkan Email..." label="Email" />
              <Input name="fax" placeholder="Masukkan Fax..." label="Fax" />
              <Input name="notelp" placeholder="Masukkan No. Telp..." label="No. Telp" />
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
                <div
                  class="mb-2 text-xs text-red-500"
                  v-if="isSubmitted && errors.status"
                >
                  {{ errors.status }}
                </div>
              </div>
            </div>
          </div>
          <div class="relative mt-4" style="min-height: 48px">
            <div class="absolute right-0 bottom-0">
              <UButton
                type="submit"
                :icon="
                  mode === 'edit'
                    ? 'i-heroicons-pencil'
                    : 'material-symbols:add-2-rounded'
                "
                @click.prevent="onSubmit"
                color="blue"
              >
                {{ mode === "edit" ? "Simpan Perubahan" : "Tambah Profile" }}
              </UButton>
            </div>
          </div>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup>
import { watch } from "vue";
import Input from "~/components/global/input/text.vue";
import { useForm, useFieldArray } from "vee-validate";
import * as yup from "yup";
import File from "../component/FileUploadProfile";
import TextArea from "~/components/global/input/textarea.vue";
import { useAdminStore } from "~/store/admin/admin";

const props = defineProps({
  isOpen: Boolean,
  mode: String,
});

const adminStore = useAdminStore();
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
  googlemaps: yup.string().required("Google Maps wajib diisi").label("Google Maps"),
  address: yup.string().required("Alamat wajib diisi").label("Address"),
  email: yup.string().required("Email wajib diisi").label("Email"),
  fax: yup.string().required("Fax wajib diisi").label("Fax"),
  notelp: yup.string().required("No. Telp wajib diisi").label("No. Telp"),
  sosmed: yup.array().of(
    yup.object().shape({
      id: yup.string().label("Name"),
      sosmed: yup.string().required("Link sosial media wajib diisi").label("Link"),
    })
  ),
});

const status = ["Published", "Pending"];
const sosmed = [
  { label: "Facebook", value: "facebook" },
  { label: "Instagram", value: "instagram" },
  { label: "Twitter/X", value: "twitter" },
  { label: "Youtube", value: "youtube" },
];

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
    googlemaps: "",
    address: "",
    email: "",
    fax: "",
    notelp: "",
    sosmed: [{ id: "", sosmed: "" }],
  },
  validationSchema: validationSchema,
});

const { remove, push, fields } = useFieldArray("sosmed");

const isSubmitted = ref(false);

const toast = useToast();

const showValidationErrors = (errs) => {
  isSubmitted.value = true;
  // Flatten vee-validate errors for array fields
  const flatErrors = {};
  Object.entries(errs).forEach(([field, message]) => {
    if (Array.isArray(message)) {
      message.forEach((item, idx) => {
        if (item && typeof item === "object") {
          Object.entries(item).forEach(([subField, subMsg]) => {
            if (subMsg) {
              flatErrors[`${field}[${idx}].${subField}`] = subMsg;
            }
          });
        }
      });
    } else {
      flatErrors[field] = message;
    }
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
        case "googlemaps":
          toast.add({ title: "Google Maps wajib diisi", color: "red" });
          break;
        case "address":
          toast.add({ title: "Alamat wajib diisi", color: "red" });
          break;
        case "email":
          toast.add({ title: "Email wajib diisi", color: "red" });
          break;
        case "fax":
          toast.add({ title: "Fax wajib diisi", color: "red" });
          break;
        case "notelp":
          toast.add({ title: "No. Telp wajib diisi", color: "red" });
          break;
        default:
          // Jangan tampilkan toast jika error field adalah id sosial media
          if (!field.startsWith("sosmed") || !field.endsWith(".id")) {
            toast.add({ title: message, color: "red" });
          }
          break;
      }
    }, index * 100);
  });
};

const onSubmit = async () => {
  const validationResult = await validate();
  isSubmitted.value = true;
  if (!validationResult.valid) {
    showValidationErrors(validationResult.errors);
    setErrors(validationResult.errors);
    return;
  }
  const formData = new FormData();
  formData.append("nama", values.title);
  if (values.file?.base64) {
    const mimeType = values.file.base64.match(/^data:(.*);base64,/)[1] || "image/jpeg";
    const blob = base64ToBlob(values.file.base64, mimeType);
    formData.append("image", blob, values.file.name);
  }
  formData.append("publish", values.status === "Published" ? 1 : 0);
  formData.append("gmap", values.googlemaps);
  formData.append("alamat", values.address);
  formData.append("email", values.email);
  formData.append("fax", values.fax);
  formData.append("telp", values.notelp);
  formData.append("social", JSON.stringify(values.sosmed));
  if (props.mode === "add") {
    try {
      await adminStore.addProfileDataAdmin(formData).then(async () => {
        if (adminStore.dataAddProflie.status == 201) {
          toast.add({
            title: "Profil berhasil ditambahkan",
            color: "green",
          });
          emit("close");
          await adminStore.getAllProfile();
        } else {
          toast.add({
            title: "Profil gagal ditambahkan",
            color: "red",
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    const id = adminStore.detailProfileData.id;
    try {
      await adminStore.editProfileDataAdmin(id, formData).then(async () => {
        if (adminStore.dataEditProfileAdmin.status == 200) {
          toast.add({
            title: "Profil berhasil diperbarui",
            color: "green",
          });
          emit("close");
          await adminStore.getAllProfile();
        } else {
          toast.add({
            title: "Profil gagal diperbarui",
            color: "red",
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
};

const parseSocial = (social) => {
  try {
    return JSON.parse(social);
  } catch (e) {
    console.error("Failed to parse social JSON:", e);
    return [];
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
          title: adminStore.detailProfileData?.nama_opd,
          status: adminStore.detailProfileData?.publish === "1" ? "Published" : "Pending",
          googlemaps: adminStore.detailProfileData?.gmap,
          address: adminStore.detailProfileData?.alamat,
          email: adminStore.detailProfileData?.email,
          fax: adminStore.detailProfileData?.fax,
          notelp: adminStore.detailProfileData?.telp,
          sosmed: parseSocial(adminStore.detailProfileData?.social) || [
            { id: "", sosmed: "" },
          ],
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
