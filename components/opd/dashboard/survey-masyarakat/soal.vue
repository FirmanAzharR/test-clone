<template>
  <div class="p-4 dark:text-slate-100">
    <div class="flex flex-col pt-4 space-y-8">
      <!-- Kategori, Search, dan Button dalam satu baris -->
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center flex-grow space-x-2">
          <!-- Input Search with clear button -->
          <UInputGroup class="flex w-full">
            <UInput 
              v-model="searchQuery" 
              icon="i-heroicons-magnifying-glass-20-solid" 
              size="md" 
              placeholder="Search..." 
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
            Tambah Soal
          </UButton>
        </div>
      </div>
      
      <!-- Table -->
      <UCard>
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
          <template #title-data="{ row }">
            <div class="items-center justify-start max-w-md gap-2">
              <span class="font-medium break-words whitespace-normal">{{ row.title }}</span>
            </div>
          </template>
          
          <template #qcode-data="{ row }">
            <span class="font-mono">{{ row.qcode }}</span>
          </template>
          
          <template #urutan-data="{ row }">
            <span class="font-medium">{{ row.urutan }}</span>
          </template>
          
          <template #publish-data="{ row }">
            <UBadge
              :color="row.publish === '1' ? 'green' : 'red'"
              variant="subtle"
              size="sm"
              class="capitalize"
            >
              {{ row.publish === "1" ? 'Published' : 'Pending' }}
            </UBadge>
          </template>
          
          <template #created_at-data="{ row }">
            <span>{{ formatDate(row.created_at) }}</span>
          </template>
          
          <template #action-data="{ row }">
            <div class="flex flex-col items-center">
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
              <NoData/>
            </div>
          </template>
        </UTable>

        <!-- Pagination -->
        <div class="flex flex-col items-center justify-between px-4 pb-2 mt-6 sm:flex-row">
          <div class="mb-4 text-sm text-gray-500 dark:text-gray-400 sm:mb-0">
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

    <!-- Modal Component -->
    <SurveyModal
      v-model="isModalOpen"
      :is-open="isModalOpen"
      :mode="modalMode"
      :detail-data="selectedDetail"
      @close="closeModal"
      @submit="handleSubmit"
    />

    <!-- Preview Modal -->
    <ModalPreviewSurvey
      v-model="isModalOpenPreview"
      :is-open="isModalOpenPreview"
      :detail-data="selectedDetail"
      @close="closePreviewModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useSoalStore } from '~/store/survey-masyarakat/soal';
import SurveyModal from './SurveyModal.vue';
import ModalPreviewSurvey from './ModalPreviewSurvey.vue';
import ModalDelete from '~/components/global/modal/delete.vue';
import NoData from '~/components/global/loading/nodata.vue';

const searchQuery = ref('');
const soalStore = useSoalStore();
const formatDate = (dateString) => {
  if (!dateString) return "-";
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};
const loading = ref(true);
const isModalOpen = ref(false);
const selectedDetail = ref({});
const isModalOpenPreview = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const pageInput = ref('1');
const modalMode = ref('add');
const toast = useToast();

// Pagination functions
const goToFirstPage = () => {
  currentPage.value = 1;
  pageInput.value = '1';
};

const getActionItems = (id) => {
  return [
    [
      {
        label: "Preview",
        icon: "i-heroicons-eye",
        click: () => openPreviewModal(rows_table.value.find(row => row.id === id)),
      },
      {
        label: "Edit",
        icon: "i-heroicons-pencil",
        click: () => openEditModal(id),
      },
    ],
    [
      {
        label: "Hapus",
        icon: "i-heroicons-trash",
        color: "red",
        click: () => handleDelete(id),
      },
    ],
  ];
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

const handlePerPageChange = (value) => {
  itemsPerPage.value = value;
  currentPage.value = 1;
  pageInput.value = '1';
};

const handleSearch = () => {
  currentPage.value = 1;
  pageInput.value = '1';
};

const clearSearch = () => {
  searchQuery.value = '';
  currentPage.value = 1;
  pageInput.value = '1';
};

const openPreviewModal = (row) => {
  selectedDetail.value = row;
  isModalOpenPreview.value = true;
};

const closePreviewModal = () => {
  isModalOpenPreview.value = false;
  selectedDetail.value = {};
};

const openAddModal = () => {
  selectedDetail.value = {};
  isModalOpen.value = true;
  modalMode.value = 'add';
};

const openEditModal = (id) => {
  // Find the row data by id
  const rowData = rows_table.value.find(row => row.id === id);
  if (rowData) {
    // Deep clone data untuk menghindari referensi langsung
    selectedDetail.value = JSON.parse(JSON.stringify(rowData));
    isModalOpen.value = true;
    modalMode.value = 'edit';
  }
};

const handleSubmit = async () => {
  await soalStore.getAllSoal();
  closeModal();
};

const closeModal = () => {
  isModalOpen.value = false;
  modalMode.value = 'add'; // Reset mode ke default
  selectedDetail.value = {}; // Reset selected data
};

const handleDelete = async (id) => {
  try {
    loading.value = true;
    await soalStore.deleteSoal(id);
    await soalStore.getAllSoal(); // Refresh data setelah delete
    toast.add({ 
      title: 'Soal berhasil dihapus',
      color: 'green'
    });
  } catch (error) {
    console.error('Error deleting soal:', error);
    toast.add({ 
      title: error.response?.data?.message || 'Gagal menghapus soal',
      color: 'red'
    });
  } finally {
    loading.value = false;
  }
};

// Definisi Kolom Tabel
const columns = [
{ key: 'no', label: 'No'},
  { key: 'title', label: 'Nama', sortable: true, class: 'w-[30%]' },
  { key: 'qcode', label: 'Code', sortable: true, class: 'w-[15%]' },
  { key: 'urutan', label: 'Urutan', sortable: true, class: 'w-[10%]' },
  { key: 'publish', label: 'Status', sortable: true, class: 'w-[15%]' },
  { key: 'created_at', label: 'Tanggal', sortable: true, direction: 'desc', class: 'w-[15%]' },
  { key: 'action', label: 'Aksi', class: 'w-[15%]' }
];

// Akses array data dari objek
const rows_table = computed(() => {
  return Array.isArray(soalStore.questions) ? soalStore.questions : [];
});

// Filtered Rows
const filteredRows = computed(() => {
  if (!searchQuery.value) return rows_table.value;
  
  const searchLower = searchQuery.value.toLowerCase();
  return rows_table.value.filter(row => {
    return (
      (row.title?.toLowerCase().includes(searchLower) || false) ||
      (row.qcode?.toLowerCase().includes(searchLower) || false) ||
      (String(row.urutan)?.toLowerCase().includes(searchLower) || false)
    );
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

// Watcher untuk memastikan currentPage valid
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

// Reset currentPage saat search query berubah
watch(searchQuery, () => {
  currentPage.value = 1;
  pageInput.value = '1';
});

// Initialize pageInput when currentPage changes
watch(currentPage, (newPage) => {
  pageInput.value = newPage.toString();
});

onMounted(async () => {
  loading.value = true;
  try {
    await soalStore.getAllSoal();
  } catch (error) {
    console.error('Error loading data:', error);
    toast.add({ title: 'Gagal memuat data soal', color: 'red' });
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.table-fixed {
  table-layout: fixed;
}
</style>

