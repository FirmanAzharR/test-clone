<template>
  <UModal :model-value="isOpen" @update:model-value="updateIsOpen" :prevent-close="true">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{ mode === "edit" ? "Edit Agenda" : "Tambah Agenda" }}
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="closeModal" />
        </div>
      </template>
      <form @submit.prevent="onSubmit" class="p-4">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <div class="mb-4">
              <Text :name="'kegiatan'" :label="'Judul Kegiatan'" :placeholder="'Masukkan judul kegiatan'"
                :value="values.kegiatan" @update:value="(val) => setFieldValue('kegiatan', val)" />
            </div>
            <div class="mb-4">
              <Text :name="'lokasi'" :label="'Lokasi'" :placeholder="'Masukkan lokasi kegiatan'" :value="values.lokasi"
                @update:value="(val) => setFieldValue('lokasi', val)" />
            </div>
            <div class="mb-4">
              <label class="block mb-2 text-gray-700 dark:text-gray-300">Person *</label>
              <div class="relative">
                <div @click="isPersonDropdownOpen = !isPersonDropdownOpen"
                  class="w-full min-h-[40px] rounded-lg border border-gray-300 dark:border-gray-700 py-2 px-3 cursor-pointer flex flex-wrap gap-2">
                  <template v-if="selectedPersons.length">
                    <span v-for="person in selectedPersons" :key="person"
                      class="flex items-center gap-1 px-2 py-1 text-sm rounded-md bg-primary-100 text-primary-700">
                      {{ person }}
                      <button @click.stop="removePerson(person)" class="hover:text-red-500">
                        ×
                      </button>
                    </span>
                  </template>
                  <span v-else class="text-gray-500">Pilih Person</span>
                </div>

                <div v-if="isPersonDropdownOpen"
                  class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                  <div class="overflow-y-auto max-h-60">
                    <div v-if="loadingPersons" class="p-3 text-center text-gray-500">
                      <div
                        class="w-4 h-4 mx-auto border-2 rounded-full animate-spin border-primary-500 border-t-transparent">
                      </div>
                      Loading...
                    </div>
                    <template v-else>
                      <div v-for="person in personOptions" :key="person.value" @click="togglePerson(person.value)"
                        class="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                        <input type="checkbox" :checked="selectedPersons.includes(person.value)"
                          class="rounded text-primary-500" @click.stop />
                        {{ person.label }}
                      </div>
                    </template>
                  </div>
                </div>
              </div>
              <span v-if="isSubmitted && errors.person" class="text-sm text-red-500">{{
                errors.person
              }}</span>
            </div>
          </div>
          <div>
            <div class="mb-4">
              <label class="block mb-2 text-gray-700 dark:text-gray-300">Tanggal</label>
              <UInput :model-value="values.tanggal" @update:model-value="(val) => setFieldValue('tanggal', val)"
                name="tanggal" type="date" class="w-full" />
              <span v-if="errors.tanggal" class="text-sm text-red-600">{{
                errors.tanggal
              }}</span>
            </div>
            <div class="mb-4">
              <label class="block mb-2 text-gray-700 dark:text-gray-300">Jam</label>
              <UInput :model-value="values.jam" @update:model-value="(val) => setFieldValue('jam', val)" name="jam"
                type="time" class="w-full" />
              <span v-if="errors.jam" class="text-sm text-red-600">{{ errors.jam }}</span>
            </div>
            <div class="mb-4">
              <UFormGroup label="Status *" name="status">
                <USelect :model-value="selectedStatus" @update:model-value="(val) => (selectedStatus = val)" :options="[
                  { label: 'Private', value: '2' },
                  { label: 'Publish', value: '1' },
                  { label: 'Pending', value: '0' },
                ]" placeholder="Pilih Status" />
                <span v-if="isSubmitted && errors.status" class="text-sm text-red-500">{{
                  errors.status
                }}</span>
              </UFormGroup>
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-4 mt-4">
          <UButton type="button" :loading="isSubmitting" :icon="props.mode === 'edit'
              ? 'i-heroicons-pencil'
              : 'material-symbols:add-2-rounded'
            " color="blue" @click.prevent="onSubmit">
            {{ props.mode === "edit" ? "Simpan Perubahan" : "Tambah Agenda" }}
          </UButton>
        </div>
      </form>
    </UCard>
  </UModal>
</template>

<script setup>
import { ref, watch, onMounted, computed, nextTick } from "vue";
import { format } from "date-fns";
import { useAgendaStore } from "~/store/agenda/agenda";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { useToast } from "#imports";
import Text from "~/components/global/input/text.vue";

const agendaStore = useAgendaStore();
const toast = useToast();

const props = defineProps({
  isOpen: Boolean,
  mode: String,
  detailData: Object,
});

const emit = defineEmits(["close", "submit", "update:modelValue"]);

const selectedStatus = ref("");
const selectedPersons = ref([]);
const isSubmitted = ref(false);
const loadingPersons = ref(false);
const personOptions = computed(() => {
  const options = (agendaStore.persons || []).map((person) => ({
    label: person.nama,
    value: person.nama,
  }));
  return options;
});

const validationSchema = yup.object({
  kegiatan: yup.string().required("Judul kegiatan wajib diisi").label("Judul Kegiatan"),
  lokasi: yup.string().required("Lokasi wajib diisi").label("Lokasi"),
  tanggal: yup.string().required("Tanggal wajib diisi").label("Tanggal"),
  jam: yup.string().required("Jam wajib diisi").label("Jam"),
  person: yup.string().required("Person wajib diisi").label("Person"),
  status: yup.string().required("Status wajib diisi").label("Status"),
});

const isSubmitting = ref(false);

const {
  handleSubmit,
  values,
  errors,
  setValues,
  setFieldValue,
  resetForm,
  validate,
} = useForm({
  initialValues: {
    kegiatan: "",
    lokasi: "",
    tanggal: format(new Date(), "yyyy-MM-dd"),
    jam: format(new Date(), "HH:mm"),
    person: "",
    status: "", // Kosong, harus dipilih user
  },
  validationSchema,
});

// Watch for changes in mode and detailData
watch(
  () => props.isOpen,
  (newIsOpen) => {
    if (newIsOpen) {
      isSubmitted.value = false;
      if (props.mode === "edit" && props.detailData) {
        console.log("Edit mode");
        // Parse persons dari string menjadi array
        const persons = props.detailData.person ? props.detailData.person.split("-") : [];

        // Parse tanggal dan jam dari created_at
        const date = new Date(props.detailData.created_at);
        const formattedDate = format(date, "yyyy-MM-dd");
        const formattedTime = format(date, "HH:mm");

        setValues({
          kegiatan: props.detailData.kegiatan || "",
          lokasi: props.detailData.lokasi || "",
          tanggal: formattedDate,
          jam: formattedTime,
          person: props.detailData.person || "",
          status: props.detailData.publish?.toString() || "",
        });

        // Set selected persons dan status
        selectedPersons.value = persons;
        selectedStatus.value = props.detailData.publish?.toString() || "";
      } else {
        // Reset form untuk mode tambah
        resetForm();
        setValues({
          kegiatan: "",
          lokasi: "",
          tanggal: format(new Date(), "yyyy-MM-dd"),
          jam: format(new Date(), "HH:mm"),
          person: "",
          status: "",
        });
        selectedPersons.value = [];
        selectedStatus.value = ""; // Pastikan status kosong untuk mode add
      }
    }
  }
);

const showValidationErrors = (errors) => {
  // Create a slight delay between toasts for better visibility
  Object.entries(errors).forEach(([field, message], index) => {
    setTimeout(() => {
      switch (field) {
        case "kegiatan":
          toast.add({ title: "Judul kegiatan wajib diisi", color: "red" });
          break;
        case "lokasi":
          toast.add({ title: "Lokasi wajib diisi", color: "red" });
          break;
        case "tanggal":
          toast.add({ title: "Tanggal wajib diisi", color: "red" });
          break;
        case "jam":
          toast.add({ title: "Jam wajib diisi", color: "red" });
          break;
        case "person":
          toast.add({ title: "Person wajib diisi", color: "red" });
          break;
        case "status":
          toast.add({ title: "Status wajib diisi", color: "red" });
          break;
      }
    }, index * 100); // Add 100ms delay between each toast
  });
};

const onSubmit = async () => {
  isSubmitted.value = true;

  // Update form values untuk person dan status sebelum validasi
  setFieldValue("person", selectedPersons.value.join("-"));
  setFieldValue("status", selectedStatus.value);

  // Tunggu sebentar agar setFieldValue selesai
  await nextTick();

  const { valid, errors: validationErrors } = await validate();

  if (!valid) {
    console.log("Validation errors:", validationErrors);
    showValidationErrors(validationErrors);
    return;
  }

  try {
    isSubmitting.value = true;

    // Format date exactly as expected by API
    const formatDateTime = (date, time) => {
      const [year, month, day] = date.split("-");
      const [hours, minutes] = time.split(":");
      // Format to match API expectations with Z suffix for UTC
      return `${year}-${month}-${day}T${hours}:${minutes}:00Z`;
    };

    // Create payload with exact format
    const formData = {
      kegiatan: values.kegiatan.trim(),
      lokasi: values.lokasi.trim(),
      person: selectedPersons.value.join("-"),
      publish: String(selectedStatus.value),
      created_at: formatDateTime(values.tanggal, values.jam),
    };

    // Debug log the final form data
    //console.log('=== FORM DATA TO BE SENT ===');
    //console.log('Edit mode:', props.mode === 'edit');
    //console.log('ID (if edit):', props.detailData?.id);
    //console.log('Final form data:', formData);
    //console.log('Date parts:', {
    //tanggal: values.tanggal,
    //jam: values.jam,
    //formatted: formData.created_at
    //});

    if (props.mode === "edit") {
      await agendaStore.updateAgenda(props.detailData.id, formData);
      toast.add({ title: "Agenda berhasil diperbarui", color: "green" });
    } else {
      await agendaStore.createAgenda(formData);
      toast.add({ title: "Agenda berhasil ditambahkan", color: "green" });
    }

    await agendaStore.getAllAgenda();
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
  } finally {
    isSubmitting.value = false;
  }
};

const closeModal = () => {
  console.log("Closing modal...");
  isSubmitted.value = false;
  selectedStatus.value = "";
  selectedPersons.value = [];
  resetForm();
  emit("update:modelValue", false);
  emit("close");
};

const updateIsOpen = (value) => {
  emit("update:modelValue", value);
};

// Add this to fetch available persons if needed
const fetchAvailablePersons = async () => {
  try {
    loadingPersons.value = true;
    await agendaStore.getPersons();
    // console.log("Fetched persons:", agendaStore.persons);
  } catch (error) {
    console.error("Error fetching persons:", error);
    toast.add({
      title: "Gagal mengambil data person",
      color: "red",
      timeout: 3000,
    });
  } finally {
    loadingPersons.value = false;
  }
};

// Tambahkan ref untuk dropdown
const isPersonDropdownOpen = ref(false);

// Tambahkan method untuk toggle person
const togglePerson = (personValue) => {
  const index = selectedPersons.value.indexOf(personValue);
  if (index === -1) {
    selectedPersons.value.push(personValue);
  } else {
    selectedPersons.value.splice(index, 1);
  }
};

// Tambahkan method untuk remove person
const removePerson = (personValue) => {
  const index = selectedPersons.value.indexOf(personValue);
  if (index !== -1) {
    selectedPersons.value.splice(index, 1);
  }
};

onMounted(() => {
  fetchAvailablePersons();

  document.addEventListener("click", (e) => {
    const dropdown = document.querySelector(".relative");
    if (dropdown && !dropdown.contains(e.target)) {
      isPersonDropdownOpen.value = false;
    }
  });
});
</script>

<style></style>
