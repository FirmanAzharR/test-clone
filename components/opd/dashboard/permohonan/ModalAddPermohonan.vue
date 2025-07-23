<template>
  <UModal :open="isOpen" :ui="{ width: 'max-w-5xl' }" @close="closeModal" :prevent-close="true">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{ mode === "edit" ? "Edit Permohonan" : "Tambah Permohonan" }}
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="closeModal" />
        </div>
      </template>

      <form class="p-4 space-y-4">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <div class="mb-4">
              <label class="block mb-2 text-gray-700 dark:text-gray-300">Kategori Pemohon</label>
              <USelect :model-value="values.kategori" @update:model-value="(val) => setFieldValue('kategori', val)"
                :options="[
                  { label: 'Perorangan', value: 'perorangan' },
                  { label: 'Lembaga', value: 'lembaga' },
                ]" placeholder="Pilih kategori pemohon" />
              <span v-if="isSubmitted && errors.kategori" class="text-xs text-red-500">{{
                errors.kategori
              }}</span>
            </div>

            <div class="mb-4">
              <Text name="nama" label="Nama Pemohon" placeholder="Masukkan nama pemohon" :value="values.nama"
                @update:value="(val) => setFieldValue('nama', val)" />
            </div>

            <div class="mb-4">
              <Text name="no_an" label="No. Identitas" placeholder="Masukkan nomor identitas" :value="values.no_an"
                @update:value="(val) => setFieldValue('no_an', val)" />
            </div>

            <div class="mb-4">
              <Text name="email" label="Email" placeholder="Masukkan email" :value="values.email"
                @update:value="(val) => setFieldValue('email', val)" />
            </div>

            <div class="mb-4">
              <TextArea name="alamat" label="Alamat" placeholder="Masukkan alamat lengkap" :value="values.alamat"
                @update:value="(val) => setFieldValue('alamat', val)" />
            </div>

            <div class="mb-4">
              <Text name="telp" label="No. Telp/HP" placeholder="Masukkan nomor telepon" :value="values.telp"
                @update:value="(val) => setFieldValue('telp', val)" />
            </div>

            <div class="mb-4">
              <Text name="pekerjaan" label="Pekerjaan" placeholder="Masukkan pekerjaan" :value="values.pekerjaan"
                @update:value="(val) => setFieldValue('pekerjaan', val)" />
            </div>
          </div>

          <div>
            <div class="mb-4">
              <label class="block mb-2 text-gray-700 dark:text-gray-300">Status</label>
              <USelect :model-value="values.status" @update:model-value="
                (val) => {
                  setFieldValue('status', val);
                  selectedStatus.value = val;
                }
              " :options="[
                  { label: 'Proses', value: 'proses' },
                  { label: 'Verifikasi', value: 'verifikasi' },
                  { label: 'Diterima', value: 'diterima' },
                  { label: 'Ditolak', value: 'ditolak' },
                  { label: 'Selesai', value: 'selesai' },
                ]" placeholder="Pilih status" class="w-full" />
              <span v-if="isSubmitted && errors.status" class="text-xs text-red-500">{{
                errors.status
              }}</span>
            </div>

            <div class="mb-4">
              <TextArea name="rincian" label="Rincian Informasi" placeholder="Masukkan rincian informasi"
                :value="values.rincian" @update:value="(val) => setFieldValue('rincian', val)" />
            </div>

            <div class="mb-4">
              <TextArea name="tujuan" label="Tujuan" placeholder="Masukkan tujuan permohonan" :value="values.tujuan"
                @update:value="(val) => setFieldValue('tujuan', val)" />
            </div>

            <div class="mb-4">
              <label class="block mb-2 text-gray-700 dark:text-gray-300">Cara Memperoleh Informasi</label>
              <USelect :model-value="values.cara" @update:model-value="(val) => setFieldValue('cara', val)" :options="[
                { label: 'Membaca', value: 'membaca' },
                { label: 'Melihat', value: 'melihat' },
                { label: 'Mendengar', value: 'mendengar' },
                { label: 'Mencatat', value: 'mencatat' },
              ]" placeholder="Pilih cara memperoleh" />
              <span v-if="isSubmitted && errors.cara" class="text-xs text-red-500">{{
                errors.cara
              }}</span>
            </div>

            <div class="mb-4">
              <label class="block mb-2 text-gray-700 dark:text-gray-300">Format Salinan Informasi</label>
              <USelect :model-value="values.salinan_info"
                @update:model-value="(val) => setFieldValue('salinan_info', val)" :options="[
                  { label: 'Softcopy', value: 'softcopy' },
                  { label: 'Hardcopy', value: 'hardcopy' },
                ]" placeholder="Pilih format salinan" />
              <span v-if="isSubmitted && errors.salinan_info" class="text-xs text-red-500">{{ errors.salinan_info
                }}</span>
            </div>

            <div class="mb-4">
              <label class="block mb-2 text-gray-700 dark:text-gray-300">Cara Mendapatkan Salinan</label>
              <USelect :model-value="values.cara_dapat" @update:model-value="(val) => setFieldValue('cara_dapat', val)"
                :options="[
                  { label: 'Email', value: 'email' },
                  { label: 'Kurir', value: 'kurir' },
                  { label: 'Pos', value: 'pos' },
                  { label: 'Ambil Langsung', value: 'ambil_langsung' },
                ]" placeholder="Pilih cara mendapatkan salinan" />
              <span v-if="isSubmitted && errors.cara_dapat" class="text-xs text-red-500">{{ errors.cara_dapat }}</span>
            </div>
            <div v-if="values.status === 'ditolak'" class="mb-4">
              <TextArea name="alasan" label="Alasan Ditolak" placeholder="Masukkan alasan penolakan"
                :value="values.alasan" @update:value="(val) => setFieldValue('alasan', val)" />
            </div>
          </div>
        </div>
        <div class="flex justify-end mt-4">
          <UButton type="submit" :loading="isSubmitting" :icon="mode === 'edit' ? 'i-heroicons-pencil' : 'material-symbols:add-2-rounded'
            " color="blue" @click.prevent="
              async () => {
                const validationResult = await validate();
                if (!validationResult.valid) {
                  showValidationErrors(validationResult.errors);
                  return;
                }
                handleSubmit(onSubmit)();
              }
            ">
            {{ mode === "edit" ? "Simpan Perubahan" : "Tambah Permohonan" }}
          </UButton>
        </div>
      </form>
    </UCard>
  </UModal>
</template>

<script setup>
import { ref, watch } from "vue";
import { usePermohonanStore } from "~/store/permohonan/permohonan";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { useToast } from "#imports";
import Text from "~/components/global/input/text.vue";
import TextArea from "~/components/global/input/textarea.vue";

const permohonanStore = usePermohonanStore();
const toast = useToast();

const props = defineProps({
  isOpen: Boolean,
  mode: String,
  detailData: Object,
});

const emit = defineEmits(["close", "submit", "update:modelValue"]);

const selectedStatus = ref("proses");
const isSubmitting = ref(false);
const isSubmitted = ref(false);

const validationSchema = yup.object({
  kategori: yup.string().required("Kategori pemohon wajib diisi"),
  nama: yup.string().required("Nama pemohon wajib diisi"),
  no_an: yup.string().required("Nomor identitas wajib diisi"),
  email: yup.string().email("Format email tidak valid").required("Email wajib diisi"),
  alamat: yup.string().required("Alamat wajib diisi"),
  telp: yup.string().required("Nomor telepon wajib diisi"),
  pekerjaan: yup.string().required("Pekerjaan wajib diisi"),
  rincian: yup.string().required("Rincian informasi wajib diisi"),
  tujuan: yup.string().required("Tujuan wajib diisi"),
  cara: yup.string().required("Cara memperoleh informasi wajib diisi"),
  salinan_info: yup.string().required("Format salinan informasi wajib diisi"),
  cara_dapat: yup.string().required("Cara mendapatkan salinan wajib diisi"),
  status: yup.string().required("Status wajib diisi"),
  alasan: yup.string().when("status", {
    is: "ditolak",
    then: () => yup.string().required("Alasan ditolak wajib diisi"),
    otherwise: () => yup.string(),
  }),
});

const {
  handleSubmit,
  values,
  errors,
  setValues,
  setFieldValue,
  validate,
  setErrors,
} = useForm({
  initialValues: {
    kategori: "",
    nama: "",
    no_an: "",
    email: "",
    alamat: "",
    telp: "",
    pekerjaan: "",
    rincian: "",
    tujuan: "",
    cara: "",
    salinan_info: "",
    cara_dapat: "",
    status: "",
    alasan: "",
  },
  validationSchema,
});

watch(
  () => props.isOpen,
  (newIsOpen) => {
    if (newIsOpen && props.mode === "edit" && props.detailData) {
      // Get status value first
      const statusValue = props.detailData.status || props.detailData.Status || "proses";

      // Initialize form values from detailData, keeping the same keys as the form submission
      setValues({
        kategori: props.detailData.kategori || props.detailData.KatPemohon || "",
        nama: props.detailData.nama || props.detailData.NamaPemohon || "",
        no_an: props.detailData.no_an || "",
        email: props.detailData.email || "",
        alamat: props.detailData.alamat || "",
        telp: props.detailData.telp || "",
        pekerjaan: props.detailData.pekerjaan || "",
        rincian: props.detailData.rincian || "",
        tujuan: props.detailData.tujuan || "",
        cara: props.detailData.cara || "",
        salinan_info: props.detailData.salinan_info || "",
        cara_dapat: props.detailData.cara_dapat || "",
        status: statusValue, // Set status di form values
        alasan: props.detailData.alasan_ditolak || "",
      });

      // Update selectedStatus for reactive handling
      selectedStatus.value = statusValue;
    } else {
      // Reset form for new entry
      setValues({
        kategori: "",
        nama: "",
        no_an: "",
        email: "",
        alamat: "",
        telp: "",
        pekerjaan: "",
        rincian: "",
        tujuan: "",
        cara: "",
        salinan_info: "",
        cara_dapat: "",
        alasan: "",
      });
      selectedStatus.value = "proses";
    }
  },
  { immediate: true }
);

// Add status watcher to handle alasan field visibility
watch(
  () => values.status,
  (newStatus) => {
    if (newStatus === "ditolak") {
      // Keep existing alasan if available, otherwise empty
      if (!values.alasan) {
        setFieldValue("alasan", "");
      }
    } else {
      // Clear alasan when status is not 'ditolak'
      setFieldValue("alasan", "");
    }
    // Keep selectedStatus in sync for any other usage
    selectedStatus.value = newStatus;
  }
);

const showValidationErrors = (errors) => {
  isSubmitted.value = true; // Pastikan isSubmitted diatur ke true

  // Create a slight delay between toasts for better visibility
  Object.entries(errors).forEach(([field, message], index) => {
    setTimeout(() => {
      switch (field) {
        case "title":
          toast.add({ title: "Judul soal wajib diisi", color: "red" });
          break;
        case "qcode":
          toast.add({ title: "Q Code wajib diisi", color: "red" });
          break;
        case "urutan":
          toast.add({ title: "Urutan wajib diisi", color: "red" });
          break;
        case "publish":
          toast.add({ title: "Status wajib diisi", color: "red" });
          break;
        default:
          toast.add({ title: message, color: "red" }); // Default case
          break;
      }
    }, index * 100); // Add 100ms delay between each toast
  });
};

const onSubmit = async (values) => {
  try {
    if (
      !values.nama ||
      !values.no_an ||
      !values.email ||
      !values.telp ||
      !values.rincian ||
      !values.tujuan
    ) {
      toast.add({
        title: "Harap isi semua field yang wajib",
        color: "red",
      });
      return;
    }
    if (values.status === "ditolak" && !values.alasan) {
      toast.add({
        title: "Alasan ditolak wajib diisi",
        color: "red",
      });
      return;
    }
    isSubmitted.value = true;
    isSubmitting.value = true;

    // Format the data to match the expected structure
    const formArray = [
      ["kategori", values.kategori],
      ["nama", values.nama],
      ["no_an", values.no_an],
      ["email", values.email],
      ["alamat", values.alamat],
      ["telp", values.telp],
      ["pekerjaan", values.pekerjaan],
      ["rincian", values.rincian],
      ["tujuan", values.tujuan],
      ["cara", values.cara],
      ["salinan_info", values.salinan_info],
      ["cara_dapat", values.cara_dapat],
      ["status", values.status],
      ["alasan_ditolak", values.alasan],
    ];

    // Debug logs
    //console.log('=== FORM VALUES DEBUG ===');
    //console.log('Raw form values:', values);
    //console.log('Selected status:', values.status);

    //console.log('=== FORM DATA TO BE SENT ===');
    //console.log('Edit mode:', props.mode === 'edit');
    //console.log('ID (if edit):', props.detailData?.ID);
    //console.log('Final form data:', formArray);

    try {
      if (props.mode === "edit") {
        await permohonanStore.updatePermohonan(props.detailData.ID, formArray);
        toast.add({ title: "Permohonan berhasil diperbarui", color: "green" });
      } else {
        await permohonanStore.createPermohonan(formArray);
        toast.add({ title: "Permohonan berhasil ditambahkan", color: "green" });
      }

      emit("submit");
      closeModal();
    } catch (error) {
      console.error("=== SUBMIT ERROR ===");
      console.error("Error details:", error);
      console.error("Error response:", error.response?.data);
      toast.add({
        title: error.response?.data?.message || "Terjadi kesalahan saat menyimpan",
        color: "red",
      });
    }
  } catch (error) {
    console.error("Error in form validation:", error);
    toast.add({
      title: "Terjadi kesalahan",
      color: "red",
    });
  } finally {
    isSubmitting.value = false;
  }
};

const closeModal = () => {
  emit("update:modelValue", false);
  emit("close");

  // Reset form state
  setValues({
    kategori: "",
    nama: "",
    no_an: "",
    email: "",
    alamat: "",
    telp: "",
    pekerjaan: "",
    rincian: "",
    tujuan: "",
    cara: "",
    salinan_info: "",
    cara_dapat: "",
    alasan: "",
    status: "",
  });
  isSubmitted.value = false;
  setErrors({}); // Clear errors
};

const updateIsOpen = (value) => {
  emit("update:modelValue", value);
};
</script>
