<template>
  <div class="p-4 dark:text-slate-100">
    <Loading v-if="layoutStore.isLoading" />
    <div class="flex flex-col pt-4 space-y-8">
      <!-- Search and Add Button -->
      <div>
        <div class="flex flex-col items-start w-full gap-4 sm:flex-row sm:items-center">
          <!-- Input Search with clear button -->
          <UInputGroup class="flex flex-1 w-full">
            <UInput
              v-model="searchQuery"
              icon="i-heroicons-magnifying-glass-20-solid"
              size="md"
              placeholder="Search agenda..."
              class="w-full"
            />
            <UButton
              v-if="searchQuery"
              icon="i-heroicons-x-mark"
              color="gray"
              variant="ghost"
              @click="clearSearch"
            />
          </UInputGroup>

          <div class="flex items-center gap-4">
            <UButton
              size="sm"
              variant="solid"
              color="blue"
              class="w-auto"
              @click="navigateToAgendaShow"
            >
              Lebih Luas
            </UButton>

            <UButton
              size="sm"
              variant="solid"
              color="blue"
              icon="material-symbols:add-2-rounded"
              @click="openAddModal"
              class="w-auto"
            >
              Tambah Agenda
            </UButton>

            <UDropdown :items="exportItems" :popper="{ placement: 'bottom-end' }">
              <UButton
                size="sm"
                variant="solid"
                color="blue"
                icon="i-heroicons-arrow-down-tray"
                class="w-auto"
              >
                Export
              </UButton>
            </UDropdown>
          </div>
        </div>
      </div>

      <!-- Table -->
      <UCard class="w-full">
        <UTable
          :columns="columns"
          :rows="paginatedRows"
          :loading="loading"
          :sort="sort"
          @sort="sort = $event"
          class="w-full"
        >
          <template #no-data="{ row, index }">
            <div class="items-center justify-start max-w-md gap-2">
              <div class="font-medium">{{ startIndex + 1 + index }}</div>
            </div>
          </template>
          <template #kegiatan-data="{ row }">
            <div class="items-center justify-start max-w-md gap-2">
              <div class="font-medium break-words whitespace-normal">
                {{ row.kegiatan }}
              </div>
              <div
                v-if="row.lokasi"
                class="mt-1 text-sm text-gray-500 dark:text-gray-400"
              >
                <UIcon name="i-heroicons-map-pin" class="inline-block mr-1" />
                {{ row.lokasi }}
              </div>
              <div
                v-if="row.tanggal"
                class="mt-1 text-sm text-gray-500 dark:text-gray-400"
              >
                <UIcon name="i-heroicons-calendar" class="inline-block mr-1" />
                {{ formatDate(row.tanggal) }}
              </div>
            </div>
          </template>

          <template #person-data="{ row }">
            <div class="flex flex-col max-w-sm gap-2">
              <div
                v-for="person in parsePersons(row.person)"
                :key="person"
                class="flex items-center gap-2"
              >
                <UAvatar
                  :alt="person"
                  size="sm"
                  :text="getInitials(person)"
                  color="blue"
                />
                <span>{{ person }}</span>
              </div>
            </div>
          </template>

          <template #publish-data="{ row }">
            <UBadge :color="getStatusColor(row.publish)" variant="soft" class="px-2 py-1">
              {{ getStatusText(row.publish) }}
            </UBadge>
          </template>

          <template #created_at-data="{ row }">
            <div class="flex flex-col">
              <span>{{ formatDate(row.created_at) }}</span>
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatTime(row.created_at) }}
              </span>
            </div>
          </template>

          <template #action-data="{ row }">
            <div class="flex flex-col items-center gap-2">
              <UDropdown
                :items="getActionItems(row.id)"
                :popper="{ placement: 'bottom-end' }"
              >
                <UButton
                  size="xs"
                  color="gray"
                  variant="ghost"
                  icon="i-heroicons-ellipsis-vertical"
                />
              </UDropdown>
            </div>
          </template>

          <template #empty-state>
            <div class="flex flex-col items-center justify-center py-6">
              <NoData />
            </div>
          </template>
        </UTable>

        <!-- Pagination -->
        <div
          class="flex flex-col items-center justify-between px-4 pb-2 mt-6 sm:flex-row"
        >
          <div class="text-sm text-gray-500 dark:text-gray-400">
            Showing {{ filteredRows.length > 0 ? startIndex + 1 : 0 }} to
            {{ endIndex }} of {{ filteredRows.length }} entries
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <USelect
              v-model="itemsPerPage"
              :options="[5, 10, 25, 50, 100]"
              size="sm"
              class="w-20"
              @update:model-value="handlePerPageChange"
            />

            <div class="flex items-center gap-1">
              <UButton
                size="sm"
                variant="ghost"
                color="gray"
                icon="i-heroicons-chevron-double-left"
                :disabled="currentPage === 1"
                @click="goToFirstPage"
              />
              <UButton
                size="sm"
                variant="ghost"
                color="gray"
                icon="i-heroicons-chevron-left"
                :disabled="currentPage === 1"
                @click="goToPrevPage"
              />

              <div class="flex items-center gap-1">
                <UInput
                  v-model="pageInput"
                  type="number"
                  size="sm"
                  class="w-12"
                  min="1"
                  :max="totalPages"
                  @keyup.enter="goToPage"
                />
                <span class="text-sm">of {{ totalPages }}</span>
              </div>

              <UButton
                size="sm"
                variant="ghost"
                color="gray"
                icon="i-heroicons-chevron-right"
                :disabled="currentPage === totalPages"
                @click="goToNextPage"
              />
              <UButton
                size="sm"
                variant="ghost"
                color="gray"
                icon="i-heroicons-chevron-double-right"
                :disabled="currentPage === totalPages"
                @click="goToLastPage"
              />
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Modal Add/Edit Agenda -->
    <ModalAddAgenda
      v-model="isModalOpen"
      :is-open="isModalOpen"
      :mode="modalMode"
      :detail-data="selectedDetail"
      @close="closeModal"
      @submit="handleSubmit"
    />

    <!-- Modal Preview Agenda -->
    <ModalPreviewAgenda
      v-model="isModalOpenPreview"
      :is-open="isModalOpenPreview"
      :data="selectedDetail"
      @close="closePreviewModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useAgendaStore } from "~/store/agenda/agenda";
import { useToast } from "#imports";
import ModalAddAgenda from "./ModalAddAgenda.vue";
import ModalPreviewAgenda from "./ModalPreviewAgenda.vue";
import ModalDelete from "~/components/global/modal/delete.vue";
import { useLayout } from "~/store/layouts/layouts";
import Loading from "@/components/global/loading/index.vue";
import NoData from "@/components/global/loading/nodata.vue";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const layoutStore = useLayout();
const searchQuery = ref("");
const agendaStore = useAgendaStore();
const loading = ref(true);
const isModalOpen = ref(false);
const selectedDetail = ref({});
const isModalOpenPreview = ref(false);
const currentPage = ref(1);
const pageInput = ref("1");
const itemsPerPage = ref(10);
const modalMode = ref("add");
const toast = useToast();
const sort = ref({ column: "created_at", direction: "desc" });
const exporting = ref(false);

// Format date and time functions
const formatDate = (dateString) => {
  if (!dateString) return "";
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

const formatTime = (dateString) => {
  if (!dateString) return "";
  const options = { hour: "2-digit", minute: "2-digit" };
  return new Date(dateString).toLocaleTimeString("id-ID", options);
};

const exportItems = [
  [
    {
      label: "Export Excel",
      icon: "i-heroicons-document-arrow-down",
      click: () => exportExcel(),
    },
    {
      label: "Export PDF",
      icon: "i-heroicons-document-arrow-down",
      click: () => exportPDF(),
    },
  ],
];

// Dummy export handlers (replace with actual logic)
function exportExcel() {
  // TODO: Implement export to Excel
  console.log("Export Excel clicked");
  console.log("Exporting data:", rows_table.value);
  console.log("data form api:", filteredRows.value);
  try {
    exporting.value = true;
    // Data mentah (misal: answersData)
    let number = 0;
    const rows = filteredRows.value.map((item) => ({
      //...item //untuk memasukkan semua data dari response

      //custom data reponse
      No: ++number,
      Kegiatan: item.kegiatan,
      Kreator: item.person,
      Lokasi: item.lokasi,
      Tanggal: formatDate(item.tanggal),
      Status:
        item.publish === "1" ? "Published" : item.publish === "0" ? "Pending" : "Private",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Semua Data Jawaban");
    const date = new Date().toISOString().split("T")[0];
    XLSX.writeFile(workbook, `data_agenda${date}.xlsx`);
    toast.add({ title: "Berhasil export data ke Excel", color: "green" });
  } catch (error) {
    console.log("Gagal export data ke Excel:", error);
    toast.add({ title: "Gagal export data ke Excel", color: "red" });
  } finally {
    exporting.value = false;
  }
}

function exportPDF() {
  // TODO: Implement export to PDF
  console.log("Export PDF clicked!");
  try {
    exporting.value = true;

    const doc = new jsPDF("p", "mm", "a4");
    const tableColumn = ["No", "Nama Kegiatan", "Kreator", "Status", "Tanggal"];

    let number = 0;
    const tableRows = filteredRows.value.map((item) => [
      ++number,
      item.kegiatan,
      item.person,
      getStatusText(item.publish),
      formatDate(item.created_at),
    ]);

    // Judul
    doc.text("Data Agenda", 14, 15);

    // Tabel
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    const date = new Date().toISOString().split("T")[0];
    doc.save(`data_agenda_${date}.pdf`);
    toast.add({ title: "Berhasil export data ke PDF", color: "green" });
  } catch (error) {
    console.error("Gagal export data ke PDF:", error);
    toast.add({ title: "Gagal export data ke PDF", color: "red" });
  } finally {
    exporting.value = false;
  }
}

const getActionItems = (id) => {
  const row = rows_table.value.find((item) => item.id === id);
  return [
    [
      {
        label: "Detail Permohonan",
        icon: "i-heroicons-eye",
        click: () => openPreviewModal(row),
      },
      {
        label: "Edit",
        icon: "i-heroicons-pencil",
        click: () => openEditModal(row),
      },
    ],
    [
      {
        label: "Copy UUID",
        icon: "i-heroicons-clipboard-document",
        click: () => copyToClipboard(id),
      },
      {
        label: "Hapus",
        icon: "i-heroicons-trash",
        color: "red",
        click: () => handleDelete(id),
      },
    ],
  ];
};

// Get initials for avatar
const getInitials = (name) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

const parsePersons = (persons) => {
  return persons.split("-");
};

// Status helpers
const getStatusColor = (status) => {
  switch (status) {
    case "1":
      return "emerald";
    case "0":
      return "red";
    case "2":
      return "gray";
    default:
      return "gray";
  }
};

const getStatusText = (status) => {
  switch (status) {
    case "1":
      return "Published";
    case "0":
      return "Pending";
    case "2":
      return "Private";
    default:
      return "Unknown";
  }
};

// Search handlers
const clearSearch = () => {
  searchQuery.value = "";
  currentPage.value = 1;
  pageInput.value = "1";
};

const handlePerPageChange = () => {
  currentPage.value = 1; // Reset to first page when changing items per page
  pageInput.value = "1";
};

// Pagination navigation functions
const goToPage = () => {
  const page = parseInt(pageInput.value);
  if (page && page > 0 && page <= totalPages.value) {
    currentPage.value = page;
  } else {
    // Reset to valid value if input is invalid
    pageInput.value = currentPage.value.toString();
    toast.add({
      title: `Page must be between 1 and ${totalPages.value}`,
      color: "yellow",
    });
  }
};

const navigateToAgendaShow = () => {
  window.open("/agenda/show", "_blank");
};

const goToFirstPage = () => {
  currentPage.value = 1;
  pageInput.value = "1";
};

const goToLastPage = () => {
  currentPage.value = totalPages.value;
  pageInput.value = totalPages.value.toString();
};

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    pageInput.value = currentPage.value.toString();
  }
};

const goToPrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    pageInput.value = currentPage.value.toString();
  }
};

// Modal handlers
const openPreviewModal = (row) => {
  selectedDetail.value = row;
  isModalOpenPreview.value = true;
};

const closePreviewModal = () => {
  selectedDetail.value = {};
  isModalOpenPreview.value = false;
};

const openAddModal = () => {
  selectedDetail.value = {};
  isModalOpen.value = true;
  modalMode.value = "add";
};

const openEditModal = (row) => {
  selectedDetail.value = row;
  isModalOpen.value = true;
  modalMode.value = "edit";
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedDetail.value = {};
};

const handleSubmit = async () => {
  await agendaStore.getAllAgenda();
  closeModal();
};

// Data operations
const handleDelete = async (id) => {
  layoutStore.setLoading(true);
  try {
    await agendaStore.deleteAgenda(id);
    await agendaStore.getAllAgenda();
    toast.add({ title: "Agenda berhasil dihapus", color: "green" });
  } catch (err) {
    console.error("Gagal menghapus agenda:", err);
    toast.add({ title: "Gagal menghapus agenda", color: "red" });
  } finally {
    layoutStore.setLoading(false);
  }
};

const copyToClipboard = async (id) => {
  try {
    await navigator.clipboard.writeText(id);
    toast.add({ title: `ID ${id} Berhasil Disalin!`, color: "green" });
  } catch (err) {
    console.error("Gagal menyalin ke clipboard:", err);
    toast.add({ title: "Gagal menyalin ID", color: "red" });
  }
};

// Table columns
const columns = [
  { key: "no", label: "No" },
  { key: "kegiatan", label: "Nama Kegiatan", sortable: true },
  { key: "person", label: "Kreator", sortable: true },
  { key: "publish", label: "Status", sortable: true },
  { key: "created_at", label: "Tanggal", sortable: true },
  { key: "action", label: "Aksi" },
];

// Data access and filtering
const rows_table = computed(() => {
  return Array.isArray(agendaStore.allAgendaData?.data)
    ? agendaStore.allAgendaData.data
    : [];
});

// Improved search
const filteredRows = computed(() => {
  if (!rows_table.value.length) return [];

  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return rows_table.value;

  return rows_table.value.filter((row) => {
    return (
      (row.kegiatan && row.kegiatan.toLowerCase().includes(query)) ||
      (row.person && row.person.toLowerCase().includes(query)) ||
      (row.lokasi && row.lokasi.toLowerCase().includes(query))
    );
  });
});

// Sorting function
const sortedRows = computed(() => {
  if (!sort.value.column || !filteredRows.value.length) return filteredRows.value;

  return [...filteredRows.value].sort((a, b) => {
    const aValue = a[sort.value.column];
    const bValue = b[sort.value.column];

    if (aValue === bValue) return 0;

    const direction = sort.value.direction === "asc" ? 1 : -1;

    if (aValue === null || aValue === undefined) return direction;
    if (bValue === null || bValue === undefined) return -direction;

    // Special handling for dates
    if (sort.value.column === "created_at" || sort.value.column === "tanggal") {
      return (new Date(aValue) - new Date(bValue)) * direction;
    }

    return aValue.toString().localeCompare(bValue.toString()) * direction;
  });
});

// Pagination calculations
const totalPages = computed(() =>
  Math.ceil(filteredRows.value.length / itemsPerPage.value)
);
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() =>
  Math.min(startIndex.value + itemsPerPage.value, filteredRows.value.length)
);

// Paginated rows
const paginatedRows = computed(() => {
  const start = startIndex.value;
  const end = endIndex.value;
  return sortedRows.value.slice(start, end);
});

// Watch for changes in pagination-related values
watch(
  [filteredRows, itemsPerPage],
  () => {
    if (currentPage.value > totalPages.value && totalPages.value > 0) {
      currentPage.value = 1;
      pageInput.value = "1";
    }
  },
  { deep: true }
);

// Update pageInput when currentPage changes
watch(currentPage, (newPage) => {
  pageInput.value = newPage.toString();
});

// Reset currentPage when search query changes
watch(searchQuery, () => {
  currentPage.value = 1;
  pageInput.value = "1";
});

// Load data on component mount
onMounted(async () => {
  loading.value = true;
  try {
    await agendaStore.getAllAgenda();
  } catch (error) {
    console.error("Error loading agenda data:", error);
    toast.add({ title: "Gagal memuat data agenda", color: "red" });
  } finally {
    loading.value = false;
  }
});
</script>
