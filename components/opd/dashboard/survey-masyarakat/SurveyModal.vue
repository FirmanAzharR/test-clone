<template>
  <UModal :open="isOpen" :ui="{ width: 'max-w-4xl' }" @close="updateIsOpen(false)" :prevent-close="true">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{ mode === "edit" ? "Edit Soal" : "Tambah Soal" }}
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="closeModal" />
        </div>
      </template>

      <form class="p-4 space-y-4">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <div class="mb-4">
              <Text name="title" label="Judul Soal *" placeholder="Masukkan judul soal" :value="values.title"
                @update:value="(val) => setFieldValue('title', val)" />
            </div>

            <div class="mb-4">
              <Text name="qcode" label="Q Code *" placeholder="Masukkan Q Code" :value="values.qcode"
                @update:value="(val) => setFieldValue('qcode', val)" />
              <p class="mt-1 text-xs text-gray-500">
                *menggunakan huruf kecil dan spasi diubah jadi '_'
              </p>
            </div>

            <div class="mb-4">
              <Text name="urutan" label="Urutan *" type="number" placeholder="Masukkan urutan" :value="values.urutan"
                @update:value="(val) => setFieldValue('urutan', val)" />
            </div>

            <div class="mb-4">
              <UFormGroup label="Status *">
                <USelect :model-value="values.publish" @update:model-value="(val) => setFieldValue('publish', val)"
                  :options="[
                    { label: 'Publish', value: '1' },
                    { label: 'Pending', value: '0' },
                  ]" placeholder="Pilih status" />
              </UFormGroup>
              <span v-if="isSubmitted && errors.publish" class="text-xs text-red-500">{{
                errors.publish
              }}</span>
            </div>
          </div>

          <div>
            <div class="mb-4">
              <div class="flex flex-col space-y-2">
                <label class="font-medium text-gray-700">Tipe Jawaban</label>
                <div class="flex space-x-2">
                  <UButton :variant="optionType === 'radio' ? 'solid' : 'outline'" @click="setOptionType('radio')">
                    Radio Button
                  </UButton>
                  <UButton :variant="optionType === 'text' ? 'solid' : 'outline'" @click="setOptionType('text')">
                    Text
                  </UButton>
                </div>
              </div>
            </div>

            <div v-if="optionType" class="space-y-4">
              <div class="max-h-[400px] overflow-y-auto pr-2 space-y-4">
                <div v-for="(option, index) in values.opt" :key="index" class="p-4 border rounded-lg">
                  <div class="flex items-start justify-between mb-2">
                    <h4 class="text-sm font-medium">Option {{ index + 1 }}</h4>
                    <UButton v-if="values.opt.length > 1" color="red" variant="ghost" icon="i-heroicons-trash" size="xs"
                      @click="removeOption(index)" />
                  </div>

                  <div class="space-y-3">
                    <Text :name="`opt.${index}.title`" label="Judul" placeholder="Masukkan judul option"
                      :value="option.title" @update:value="(val) => updateOption(index, 'title', val)" />

                    <Text :name="`opt.${index}.value`" label="Value" placeholder="Masukkan value option"
                      :value="option.value" @update:value="(val) => updateOption(index, 'value', val)" />
                  </div>
                </div>
              </div>

              <UButton block color="gray" variant="soft" icon="i-heroicons-plus" @click="addOption">
                Tambah Option
              </UButton>
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
            {{ mode === "edit" ? "Simpan Perubahan" : "Tambah Soal" }}
          </UButton>
        </div>
      </form>
    </UCard>
  </UModal>
</template>

<script setup>
import { ref, watch } from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { useSoalStore } from "~/store/survey-masyarakat/soal";
import Text from "~/components/global/input/text.vue";

const config = useRuntimeConfig();
const props = defineProps({
  isOpen: Boolean,
  mode: String,
  detailData: Object,
});

const emit = defineEmits(["close", "submit", "update:modelValue"]);
const soalStore = useSoalStore();
const toast = useToast();

const isSubmitting = ref(false);
const optionType = ref("");
const isSubmitted = ref(false);

const validationSchema = yup.object({
  title: yup.string().required("Judul soal wajib diisi"),
  qcode: yup.string().required("Q Code wajib diisi"),
  urutan: yup.string().required("Urutan wajib diisi"),
  publish: yup.string().required("Status wajib diisi"),
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
    title: "",
    qcode: "",
    urutan: "",
    publish: "",
    opt: [],
  },
  validationSchema,
});

const setOptionType = (type) => {
  optionType.value = type;
  // Inisialisasi array options dengan satu option kosong menggunakan setFieldValue
  setFieldValue("opt", [
    {
      title: "",
      value: "",
      type: type,
    },
  ]);
};

const addOption = () => {
  if (!optionType.value) return;

  // Menggunakan current values.opt untuk membuat array baru
  const currentOpt = Array.isArray(values.opt) ? [...values.opt] : [];

  // Membuat option baru
  const newOption = {
    title: "",
    value: "",
    type: optionType.value,
  };

  // Update form values dengan array baru
  setFieldValue("opt", [...currentOpt, newOption]);
};

const removeOption = (index) => {
  const currentOpt = [...values.opt];
  currentOpt.splice(index, 1);
  setFieldValue("opt", currentOpt);
};

const updateOption = (index, field, value) => {
  const currentOpt = [...values.opt];
  currentOpt[index] = {
    ...currentOpt[index],
    [field]: value,
  };
  setFieldValue("opt", currentOpt);
};

// Ganti watch untuk memantau perubahan isOpen
watch(
  () => props.isOpen,
  (newValue) => {
    if (!newValue) {
      // Reset form ketika modal ditutup
      setValues({
        title: "",
        qcode: "",
        urutan: "",
        publish: "",
        opt: [],
      });
      optionType.value = "";

      // Reset error validasi
      setErrors({});
      isSubmitted.value = false;
    } else if (newValue && props.mode === "edit" && props.detailData) {
      // Set data ketika modal dibuka dalam mode edit
      let parsedOpt = [];
      try {
        if (props.detailData.opt) {
          parsedOpt = JSON.parse(props.detailData.opt);
          optionType.value = parsedOpt[0]?.type || "radio";
        }
      } catch (e) {
        console.error("Error parsing opt:", e);
        parsedOpt = [];
      }

      setValues({
        title: props.detailData.title || "",
        qcode: props.detailData.qcode || "",
        urutan: props.detailData.urutan || "",
        publish: props.detailData.publish?.toString() || "",
        opt: parsedOpt,
      });
    }
  },
  { immediate: true }
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
      }
    }, index * 100); // Add 100ms delay between each toast
  });
};

const onSubmit = async (values) => {
  try {
    isSubmitted.value = true; // Pastikan isSubmitted diatur ke true sebelum validasi

    isSubmitting.value = true;
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("qcode", values.qcode);
    formData.append("urutan", values.urutan);
    formData.append("publish", values.publish);
    formData.append("opt", JSON.stringify(values.opt));

    if (props.mode === "edit") {
      await soalStore.updateSoal(props.detailData.id, formData);
      toast.add({ title: "Soal berhasil diperbarui", color: "green" });
    } else {
      await soalStore.storeSoal(formData);
      toast.add({ title: "Soal berhasil ditambahkan", color: "green" });
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

const closeModal = () => {
  emit("update:modelValue", false);
  emit("close");
};

const updateIsOpen = (value) => {
  emit("update:modelValue", value);
};
</script>
