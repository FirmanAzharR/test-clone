<template>
  <div class="p-4 dark:text-slate-100">
    <Loading v-if="layoutStore.isLoading" />
    <div class="flex flex-col pt-4 space-y-8">
      <!-- Search and Add Button -->
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center flex-grow space-x-2">
          <!-- Input Search with clear button -->
          <UInputGroup class="flex w-full">
            <UInput
              v-model="searchQuery"
              icon="i-heroicons-magnifying-glass-20-solid"
              size="md"
              placeholder="Cari nomor, nama, atau email..."
              class="w-full"
              @update:model-value="handleSearch"
            />
            <UButton
              v-if="searchQuery"
              icon="i-heroicons-x-mark"
              color="gray"
              variant="link"
              @click="clearSearch"
            />
          </UInputGroup>
          <UButton
            size="sm"
            variant="solid"
            color="blue"
            icon="material-symbols:add-2-rounded"
            @click="openAddModal"
          >
            Tambah Permohonan
          </UButton>
        </div>
      </div>
      <UCard>
        <!-- Table with simplified columns -->
        <UTable
          :columns="columns"
          :rows="paginatedRows"
          :loading="loading"
          class="w-full table-fixed"
        >
        <template #no-data="{ row, index }">
            <div class="items-center justify-start max-w-md gap-2">
              <div class="font-medium">{{ startIndex +  1 + index }}</div>
            </div>
          </template>
          <template #NamaPemohon-data="{ row }">
            <div class="flex items-center gap-2">
              <UAvatar
                :alt="row.NamaPemohon"
                size="sm"
                :text="row.NamaPemohon.charAt(0).toUpperCase()"
                color="blue"
              />
              <div class="flex flex-col">
                <span class="font-medium">{{ row.NamaPemohon }}</span>
                <UButton
                  size="xs"
                  variant="link"
                  color="blue"
                  class="h-auto p-0 -mt-1"
                  @click="openUserDetailsModal(row)"
                >
                  Lihat Identitas
                </UButton>
              </div>
            </div>
          </template>

          <template #NoPermohonan-data="{ row }">
            <div class="w-full">
              <span class="break-words whitespace-normal">{{
                row.NoPermohonan
              }}</span>
            </div>
          </template>

          <template #Status-data="{ row }">
            <UBadge
              :color="getStatusColor(row.Status)"
              variant="subtle"
              size="sm"
              class="capitalize"
            >
              {{ row.Status }}
            </UBadge>
          </template>

          <template #created_at-data="{ row }">
            <span>{{ formatDate(row.created_at) }}</span>
          </template>

          <template #action-data="{ row }">
            <div class="flex justify-center">
              <UDropdown
                :items="getActionItems(row)"
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
              <NoData/>
            </div>
          </template>
        </UTable>

        <!-- Pagination -->
        <div class="flex flex-col items-center justify-between px-4 pb-2 mt-6 sm:flex-row">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            Showing {{ filteredRows.length > 0 ? startIndex + 1 : 0 }} to {{ endIndex }} of {{ filteredRows.length }} entries
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

    <ModalAddPermohonan
      v-model="isModalOpen"
      :is-open="isModalOpen"
      :mode="modalMode"
      :detail-data="selectedDetail"
      @close="closeModal"
      @submit="handleSubmit"
    />
    <ModalDetail
      :isOpen="isUserDetailsModalOpen"
      :detail="selectedDetail"
      @close="closeUserDetailsModal"
    />
    <ModalPreviewPermohonan
      v-model="isModalOpenPreview"
      :is-open="isModalOpenPreview"
      :data="selectedDetail"
      @close="closePreviewModal"
    />

    <!-- User Details Modal -->
    <UModal v-model="isUserDetailsModalOpen">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white"
            >
              <UAvatar
                :alt="selectedDetail.NamaPemohon || ''"
                size="sm"
                :text="
                  selectedDetail.NamaPemohon
                    ? selectedDetail.NamaPemohon.charAt(0).toUpperCase()
                    : ''
                "
                color="blue"
              />
              Detail Pemohon
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark"
              class="-my-1"
              @click="closeUserDetailsModal"
            />
          </div>
        </template>

        <div class="space-y-4">
          <div class="grid grid-cols-1 gap-4">
            <div>
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Nama
              </h4>
              <p class="mt-1 text-base font-medium">
                {{ selectedDetail.NamaPemohon || "-" }}
              </p>
            </div>

            <div>
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Identitas
              </h4>
              <p class="mt-1">{{ selectedDetail.no_an || "-" }}</p>
            </div>

            <div>
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Email
              </h4>
              <p class="mt-1">{{ selectedDetail.email || "-" }}</p>
            </div>

            <div>
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                No Telp/HP
              </h4>
              <p class="mt-1">{{ selectedDetail.telp || "-" }}</p>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end">
            <UButton color="gray" variant="soft" @click="closeUserDetailsModal">
              Tutup
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useAdminStore } from "~/store/admin/admin";
import { usePermohonanStore } from "~/store/permohonan/permohonan";
import { useLayout } from "~/store/layouts/layouts";
import Loading from "@/components/global/loading/index.vue";
import ModalDetail from "./ModalDetail.vue";
import ModalAddPermohonan from "./ModalAddPermohonan.vue";
import ModalPreviewPermohonan from "./ModalPreviewPermohonan.vue";
import NoData from '~/components/global/loading/nodata.vue';

const searchQuery = ref("");
const adminStore = useAdminStore();
const permohonanStore = usePermohonanStore();
const layoutStore = useLayout();
const formatDate = (dateString) => {
  if (!dateString) return "-";
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};
const loading = ref(true);
const isModalOpen = ref(false);
const selectedDetail = ref({});
const isModalOpenPreview = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(10); // Changed from constant to ref
const pageInput = ref("1"); // Added missing ref
const modalMode = ref("add");
const toast = useToast();
const isUserDetailsModalOpen = ref(false);

const getStatusColor = (status) => {
  switch (status) {
    case "selesai":
      return "emerald";
    case "proses":
      return "yellow";
    case "ditolak":
      return "red";
    case "diterima":
    case "verifikasi":
      return "blue";
    default:
      return "gray";
  }
};

const getActionItems = (row) => {
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
        label: "Hapus",
        icon: "i-heroicons-trash",
        color: "red",
        click: () => handleDelete(row.ID),
      },
    ],
  ];
};

const openUserDetailsModal = (row) => {
  selectedDetail.value = row;
  isUserDetailsModalOpen.value = true;
};

const closeUserDetailsModal = () => {
  isUserDetailsModalOpen.value = false;
};

const openPreviewModal = (row) => {
  selectedDetail.value = row;
  isModalOpenPreview.value = true;
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

const handleSearch = () => {
  currentPage.value = 1;
};

const clearSearch = () => {
  searchQuery.value = "";
  currentPage.value = 1;
};

// Pagination functions
const goToFirstPage = () => {
  currentPage.value = 1;
  pageInput.value = '1';
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

// Added missing goToPage function
const goToPage = () => {
  const page = parseInt(pageInput.value);
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  } else if (page < 1) {
    currentPage.value = 1;
    pageInput.value = '1';
  } else {
    currentPage.value = totalPages.value;
    pageInput.value = totalPages.value.toString();
  }
};

// Added missing handlePerPageChange function
const handlePerPageChange = (value) => {
  itemsPerPage.value = value;
  currentPage.value = 1;
  pageInput.value = '1';
};

// Definisi Kolom Tabel - Simplified
const columns = [
{ key: 'no', label: 'No'},
  {
    key: "NoPermohonan",
    label: "No Permohonan",
    sortable: true,
    class: "w-[25%]",
  },
  { key: "NamaPemohon", label: "Nama", sortable: true, class: "w-[30%]" },
  { key: "Status", label: "Status", sortable: true, class: "w-[15%]" },
  {
    key: "created_at",
    label: "Tanggal",
    sortable: true,
    direction: "desc",
    class: "w-[20%]",
  },
  { key: "action", label: "Aksi", class: "w-[10%]" },
];

// Akses array data dari objek
const rows_table = computed(() => {
  return Array.isArray(adminStore.allPermohonanData?.data)
    ? adminStore.allPermohonanData.data.map((item) => ({
        ...item,
        Status: item.Status || "proses", // Default to 'proses' if Status is undefined
      }))
    : [];
});

// Filtered Rows
const filteredRows = computed(() => {
  if (!searchQuery.value) return rows_table.value;

  return rows_table.value.filter((row) => {
    const matchesSearch =
      row.NoPermohonan?.toLowerCase().includes(
        searchQuery.value.toLowerCase()
      ) ||
      false ||
      row.NamaPemohon?.toLowerCase().includes(
        searchQuery.value.toLowerCase()
      ) ||
      false ||
      row.email?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      false;
    return matchesSearch;
  });
});

// Paginated Rows
const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredRows.value.slice(start, end);
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredRows.value.length / itemsPerPage.value))
);

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() =>
  Math.min(startIndex.value + itemsPerPage.value, filteredRows.value.length)
);

onMounted(async () => {
  loading.value = true;
  try {
    await adminStore.getAllPermohonan();
  } catch (error) {
    console.error("Error loading data:", error);
    toast.add({ title: "Gagal memuat data permohonan", color: "red" });
  } finally {
    loading.value = false;
  }
});

// Add new handlers for modal operations
const closePreviewModal = () => {
  selectedDetail.value = {};
  isModalOpenPreview.value = false;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedDetail.value = {};
};

const handleSubmit = async () => {
  await adminStore.getAllPermohonan();
  closeModal();
};

// Updated handleDelete function using the new permohonanStore
const handleDelete = async (id) => {
  try {
    await permohonanStore.deletePermohonan(id);
    await adminStore.getAllPermohonan();
    toast.add({ title: "Permohonan berhasil dihapus", color: "green" });
  } catch (err) {
    console.error("Gagal menghapus permohonan:", err);
    toast.add({ title: "Gagal menghapus permohonan", color: "red" });
  }
};

// Add watch for pagination and search
watch([totalPages, currentPage], ([total, current]) => {
  if (current > total && total > 0) {
    currentPage.value = total;
    pageInput.value = total.toString();
  }
  if (current < 1) {
    currentPage.value = 1;
    pageInput.value = '1';
  }
});

// Reset currentPage when search query changes
watch(searchQuery, () => {
  currentPage.value = 1;
  pageInput.value = '1';
});

// Initialize pageInput when currentPage changes
watch(currentPage, (newPage) => {
  pageInput.value = newPage.toString();
});
</script>

<style scoped>
.table-fixed {
  table-layout: fixed;
}
</style>

