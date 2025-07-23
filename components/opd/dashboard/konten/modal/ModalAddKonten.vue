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
            {{ mode === "edit" ? "Edit Konten" : "Tambah Konten" }}
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
          <div class="mb-4">
            <UFormGroup label="Pilih Kategori" name="kategori">
              <div class="mb-4">
                <USelect
                  size="md"
                  placeholder="Pilih Kategori..."
                  :model-value="values.kategori"
                  @update:model-value="(val) => setValues({ ...values, kategori: val })"
                  :options="categories"
                  class="max-w-full overflow-x-auto"
                />
                <span
                  v-if="isSubmitted && errors.kategori"
                  class="text-xs text-red-500"
                  >{{ errors.kategori }}</span
                >
              </div>
            </UFormGroup>
            <Input name="title" label="Masukkan Judul" placeholder="Masukkan Judul" />
            <TextArea
              label="Deskripsi Singkat"
              name="desc_singkat"
              placeholder="Masukkan deskripsi singkat"
            />
            <Editor
              label="Deskripsi"
              name="descarea"
              placeholder="Masukkan deskripsi"
              :is-submitted="isSubmitted"
            />
            <Select
              v-if="values.kategori == 'General'"
              name="tag"
              label="Tag"
              mode="tags"
              placeholder="Input Tag"
              class="h-auto"
              :options="values.tags"
              :createOption="true"
              :canClear="false"
              :is-for-tagging="true"
              @update:value="(val) => handleChangeTagging(val)"
            />
          </div>
          <div>
            <div class="mb-4">
              <template v-if="props.mode == 'edit'">
                <template v-if="beritaStore.dataToEdit.image">
                  <div class="relative inline-block">
                    <NuxtImg
                      alt="Image"
                      class="rounded-lg"
                      :src="beritaStore.dataToEdit.image"
                      height="400px"
                      width="400px"
                    />
                    <!--<UButton
                      icon="i-heroicons-trash"
                      color="red"
                      variant="solid"
                      size="xs"
                      class="absolute top-2 right-2"
                      @click="handleDeleteImage"
                      title="Hapus Gambar"
                    />-->
                  </div>
                </template>
                <template v-else>
                  <div
                    class="flex flex-col items-center justify-center h-[200px] w-full border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800"
                  >
                    <span class="text-6xl text-gray-400">
                      <Icon name="i-heroicons:photo" />
                    </span>
                    <span class="mt-2 text-gray-500 text-sm">Gambar tidak tersedia</span>
                  </div>
                </template>
              </template>
              <File label="Gambar" name="file" />
              <div v-if="values.file && values.file.message" class="text-red-500">
                {{ values.file.message }}
              </div>
            </div>
            <div class="mb-4">
              <UFormGroup label="Status" name="status">
                <div class="mb-4">
                  <USelect
                    size="md"
                    placeholder="Pilih Status..."
                    :model-value="values.status"
                    @update:model-value="(val) => setValues({ ...values, status: val })"
                    :options="status"
                    class="max-w-full overflow-x-auto"
                  />
                  <span
                    v-if="isSubmitted && errors.status"
                    class="text-xs text-red-500"
                    >{{ errors.status }}</span
                  >
                </div>
              </UFormGroup>
            </div>
            <div class="mb-4" v-if="props.mode == 'edit' || values.status === 'Publish'">
              <label class="block text-gray-700 dark:text-gray-300"
                >Tanggal Publish</label
              >
              <UPopover :popper="{ placement: 'bottom-start' }">
                <UButton
                  icon="i-heroicons-calendar-days-20-solid"
                  :label="
                    values.tgl_publish
                      ? format(new Date(values.tgl_publish), 'd MMM, yyyy')
                      : ''
                  "
                />
                <template #panel="{ close }">
                  <DatePicker
                    v-model="date"
                    is-required
                    @close="close"
                    @update:model-value="
                      (newDate) => {
                        setValues({
                          ...values,
                          tgl_publish: format(newDate, 'yyyy-MM-dd'),
                        });
                      }
                    "
                  />
                </template>
              </UPopover>
            </div>
          </div>
          <div class="flex justify-end col-span-2">
            <UButton
              type="submit"
              :icon="
                mode === 'edit' ? 'i-heroicons-pencil' : 'material-symbols:add-2-rounded'
              "
              @click="handleAddEditKonten()"
              color="blue"
            >
              {{ mode === "edit" ? "Simpan Perubahan" : "Tambah Konten" }}
            </UButton>
          </div>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup>
import { ref, watch } from "vue";
import DatePicker from "~/components/global/datepicker/index.vue";
import Input from "~/components/global/input/text.vue";
import TextArea from "~/components/global/input/textarea.vue";
import { useBeritaStore } from "~/store/berita/berita";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { format, parseISO } from "date-fns";
import Editor from "~/components/global/input/editor.vue";
import File from "../component/FileUploadKonten";
import Select from "~/components/global/input/select.vue";

const beritaStore = useBeritaStore();
const date = ref(new Date());
const props = defineProps({
  isOpen: Boolean,
  mode: String,
});
const tags = ref([]);

const emit = defineEmits(["close", "submit", "update:modelValue"]);
const categories = [
  "Berita",
  "Artikel",
  "Kegiatan",
  "Renstra",
  "Informasi",
  "Aset",
  "General",
];
const status = ["Publish", "Pending"];

const validationSchema = yup.object({
  title: yup.string().required("Judul wajib diisi").label("Title"),
  desc_singkat: yup
    .string()
    .required("Deskripsi Singkat wajib diisi")
    .label("Deskripsi Singkat"),
  descarea: yup.string().required("Deskripsi wajib diisi").label("Deskripsi"),
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
  kategori: yup.string().required("Kategori wajib diisi").label("Kategori"),
  status: yup.string().required("Status wajib diisi").label("Status"),
  tgl_publish: yup.string().label("Tanggal Publish"),
  tag: yup.array().of(yup.string()).label("Tag"),
});

const toast = useToast();

const isSubmitted = ref(false);
const errors = ref({});
const { handleSubmit, values, setValues, resetForm, setErrors, validate } = useForm({
  initialValues: {
    title: "",
    desc_singkat: "",
    descarea: "",
    file: "",
    tag: [],
    kategori: "",
    status: "",
    tgl_publish: format(new Date(), "yyyy-MM-dd"),
  },
  validationSchema: validationSchema,
});

watch(date, (newDate) => {
  setValues({
    ...values,
    tgl_publish: format(newDate, "yyyy-MM-dd"),
  });
});

// Fungsi helper konversi base64 ke Blob
// function base64ToBlob(base64, mime = "image/jpeg") {
//   const byteCharacters = atob(base64.split(",")[1]);
//   const byteArrays = [];

//   for (let offset = 0; offset < byteCharacters.length; offset += 512) {
//     const slice = byteCharacters.slice(offset, offset + 512);
//     const byteNumbers = new Array(slice.length);

//     for (let i = 0; i < slice.length; i++) {
//       byteNumbers[i] = slice.charCodeAt(i);
//     }

//     byteArrays.push(new Uint8Array(byteNumbers));
//   }

//   return new Blob(byteArrays, { type: mime });
// }

// new add edit
const handleAddEditKonten = async () => {
  isSubmitted.value = true;

  const validationResult = await validate();
  if (!validationResult.valid) {
    errors.value = validationResult.errors;

    // Tampilkan toast error
    Object.values(validationResult.errors).forEach((msg, idx) => {
      setTimeout(() => {
        toast.add({ title: msg, color: "red" });
      }, idx * 100);
    });
    return;
  }

  errors.value = {};
  const formData = new FormData();

  // Proses gambar jika ada base64
  if (values.file?.base64) {
    const mimeType = values.file.base64.match(/^data:(.*);base64,/)[1] || "image/jpeg";
    const blob = base64ToBlob(values.file.base64, mimeType);
    formData.append("image", blob, values.file.name);
  }

  // Append field lainnya
  formData.append("title", values.title);
  formData.append("excert", values.desc_singkat);
  formData.append("descript", values.descarea);
  formData.append("kategori", values.kategori);
  formData.append("publish", values.status === "Publish" ? "1" : "0");
  formData.append("tgl_publish", format(date.value, "yyyy-MM-dd"));
  formData.append("tag", values.tag && values.tag.length ? values.tag.join(",") : "");

  if (props.mode === "add") {
    try {
      await beritaStore.addBeritaDataAdmin(formData);
      console.log(
        `beritaStore.dataAddBeritaAdmin`,
        beritaStore.dataAddBeritaAdmin.status
      );
      if (beritaStore.dataAddBeritaAdmin?.status == 201) {
        beritaStore.getAllBeritaDataAdmin();
        toast.add({ title: "Konten berhasil ditambahkan", color: "green" });
        emit("close");
      } else {
        toast.add({ title: "Konten gagal ditambahkan", color: "red" });
      }
    } catch (err) {
      console.error(err);
    }
  } else {
    const id = beritaStore.dataToEdit.id;
    try {
      await beritaStore.editBeritaDataAdmin(id, formData);
      if (beritaStore.dataAEditBeritaAdmin != null) {
        beritaStore.getAllBeritaDataAdmin();
        toast.add({ title: "Konten berhasil diperbarui", color: "green" });
        emit("close");
      } else {
        toast.add({ title: "Konten gagal diperbarui", color: "red" });
      }
    } catch (error) {
      console.error(error);
    }
  }
};

function handleChangeTagging(value) {
  value = value.map((item) => item.trim().replace(/ /g, "-"));
  tags.value = value;
}

watch(
  () => props.isOpen,
  (newIsOpen) => {
    if (newIsOpen) {
      isSubmitted.value = false;
      errors.value = {};
      if (props.mode === "edit") {
        setValues({
          title: beritaStore?.dataToEdit?.title || "",
          desc_singkat: beritaStore?.dataToEdit?.excert || "",
          descarea: beritaStore?.dataToEdit?.description || "",
          kategori: beritaStore?.dataToEdit?.kategori || "",
          status: beritaStore?.dataToEdit?.publish === "1" ? "Publish" : "Pending",
          tgl_publish:
            beritaStore?.dataToEdit?.created_at || format(new Date(), "yyyy-MM-dd"),
        });
        date.value = parseISO(beritaStore?.dataToEdit?.created_at || new Date());
      } else {
        resetForm();
        setValues({
          ...values,
          kategori: "",
          status: "",
          tgl_publish: format(new Date(), "yyyy-MM-dd"),
        });
        date.value = new Date();
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

const handleDeleteImage = () => {
  // Hilangkan gambar dari dataToEdit (hanya di UI, tidak langsung hapus di server)
  beritaStore.dataToEdit.image = null;
  // Jika ingin juga menghapus di backend, panggil API di sini
  // example: await beritaStore.deleteImage(beritaStore.dataToEdit.id)
};
</script>
