<template>
  <div class="p-4 dark:text-slate-100">
    <div class="flex flex-col pt-4 space-y-8">
      <!-- Search and Add Button -->
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center flex-grow space-x-2">
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
            icon="i-heroicons-plus" 
            @click="openAddModal"
          >
            Tambah Page
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
              <span class="break-words whitespace-normal">{{ row.title }}</span>
            </div>
          </template>
          <template #image-data="{ row }">
            <div class="w-40 h-28 overflow-hidden rounded">
              <template v-if="row.image">
                <NuxtImg 
                  :src="row.image" 
                  alt="Page image" 
                  class="object-cover w-full h-full" 
                  loading="lazy"
                  placeholder
                />
              </template>
              <template v-else>
                <div class="flex flex-col items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-800">
                  <UIcon name="i-heroicons:photo" class="w-8 h-8 text-gray-400" />
                  <span class="mt-2 text-xs text-gray-500">No Image</span>
                </div>
              </template>
            </div>
          </template>
          <template #publish-data="{ row }">
            <UBadge :color="row.publish === '1' ? 'emerald' : 'red'" variant="soft" class="px-2 py-1">
              {{ row.publish === "1" ? 'Published' : 'Pending' }}
            </UBadge>
          </template>
          <template #created_at-data="{ row }">
            <span>{{ formatDate(row.created_at) }}</span>
          </template>
          <template #action-data="{ row }">
            <div class="flex items-center space-x-2">
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
        <div class="flex flex-col items-center justify-between px-4 pb-2 mt-6 sm:flex-row">
          <div class="mb-4 text-sm text-gray-500 dark:text-gray-400 sm:mb-0">
            {{ paginationInfoText }}
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <USelect
              v-model="itemsPerPage"
              :options="perPageOptions"
              size="sm"
              class="w-24"
              @update:model-value="handlePerPageChange"
            >
              <template #option="{ option }">{{ option }} per page</template>
            </USelect>
            
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
                  class="w-16"
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
  </div>
  <ModalAddEditPages :isOpen="isModalOpen" :mode="modalMode" :detailData="selectedDetail" @close="closeModal" />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAdminStore } from '~/store/admin/admin';
import ModalAddEditPages from './modal/ModalAddEditPages.vue';
import { useLayout } from '~/store/layouts/layouts';
import NoData from '~/components/global/loading/nodata.vue';

const layoutStore = useLayout();
const searchQuery = ref('');
const adminStore = useAdminStore();
const loading = ref(true);
const isModalOpen = ref(false);
const selectedDetail = ref({});
const currentPage = ref(1);
const itemsPerPage = ref(10);
const pageInput = ref('1');
const modalMode = ref('add');
const toast = useToast();
const perPageOptions = [5, 10, 25, 50, 100];

// Format date function
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Modal functions
const openAddModal = () => {
  selectedDetail.value = {};
  isModalOpen.value = true;
  modalMode.value = 'add';
};

const openEditModal = async (id) => {
  layoutStore.setLoading(true);
  try {
    await adminStore.detailPagesAdmin(id);
    selectedDetail.value = adminStore.detailPagesData || {};
    modalMode.value = 'edit';
    isModalOpen.value = true;
  } catch (err) {
    console.error('Error fetching page details:', err);
    toast.add({ title: 'Gagal mengambil data halaman', color: 'red' });
  } finally {
    layoutStore.setLoading(false);
  }
};

const closeModal = () => {
  isModalOpen.value = false;
  // Refresh data after modal is closed
  adminStore.getAllPages();
};

const handleDelete = async (id) => {
  try {
    await adminStore.deletePagesAdmin(id);
    await adminStore.getAllPages();
    toast.add({ title: 'Data berhasil dihapus', color: 'green' });
  } catch (err) {
    console.error('Gagal menghapus data:', err);
    toast.add({ title: 'Gagal menghapus data', color: 'red' });
  }
};

const copyToClipboard = async (id) => {
  try {
    await navigator.clipboard.writeText(id);
    toast.add({ title: `ID ${id} Berhasil Disalin!`, color: 'green' });
  } catch (err) {
    console.error('Gagal menyalin ke clipboard:', err);
    toast.add({ title: 'Gagal menyalin ID', color: 'red' });
  }
};

// Table columns
const columns = [
{ key: 'no', label: 'No'},
  { key: 'title', label: 'Nama', sortable: true },
  { key: 'image', label: 'Gambar', sortable: true },
  { key: 'publish', label: 'Status', sortable: true },
  { key: 'created_at', label: 'Tanggal', sortable: true, direction: 'desc' },
  { key: 'action', label: 'Aksi' }
];

// Data access and filtering
const rows_table = computed(() => {
  return Array.isArray(adminStore.allPagesData?.data) ? adminStore.allPagesData.data : [];
});

// Improved search with debounce
const debouncedSearchQuery = ref('');
let debounceTimeout = null;

watch(searchQuery, (newValue) => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    debouncedSearchQuery.value = newValue;
    currentPage.value = 1; // Reset to first page when searching
    pageInput.value = '1';
  }, 300); // 300ms debounce
});

const filteredRows = computed(() => {
  if (!rows_table.value.length) return [];
  
  const query = debouncedSearchQuery.value.toLowerCase().trim();
  if (!query) return rows_table.value;
  
  return rows_table.value.filter(row => {
    return (
      (row.title && row.title.toLowerCase().includes(query)) ||
      (row.excert && row.excert.toLowerCase().includes(query))
    );
  });
});

const getActionItems = (id) => {
  return [
    [
      {
        label: "Edit",
        icon: "i-heroicons-pencil",
        click: () => openEditModal(id),
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


// Pagination calculations
const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / itemsPerPage.value)));

const startIndex = computed(() => {
  if (filteredRows.value.length === 0) return 0;
  return (currentPage.value - 1) * itemsPerPage.value;
});

const endIndex = computed(() => {
  return Math.min(startIndex.value + itemsPerPage.value, filteredRows.value.length);
});

// Paginated rows
const paginatedRows = computed(() => {
  if (filteredRows.value.length === 0) return [];
  
  const start = startIndex.value;
  const end = endIndex.value;
  return filteredRows.value.slice(start, end);
});

// Pagination info text
const paginationInfoText = computed(() => {
  if (filteredRows.value.length === 0) {
    return 'No entries to show';
  }
  
  return `Showing ${startIndex.value + 1} to ${endIndex.value} of ${filteredRows.value.length} entries${
    debouncedSearchQuery.value ? ` (filtered from ${rows_table.value.length} total entries)` : ''
  }`;
});

// Pagination navigation functions
const goToPage = () => {
  const page = parseInt(pageInput.value);
  if (page && page > 0 && page <= totalPages.value) {
    currentPage.value = page;
  } else {
    // Reset to valid value if input is invalid
    pageInput.value = currentPage.value.toString();
    toast.add({ title: `Page must be between 1 and ${totalPages.value}`, color: 'yellow' });
  }
};

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

// Search functions
const handleSearch = () => {
  currentPage.value = 1; // Reset to first page when searching
  pageInput.value = '1';
};

const clearSearch = () => {
  searchQuery.value = '';
  currentPage.value = 1;
  pageInput.value = '1';
};

// Handle per page change
const handlePerPageChange = () => {
  currentPage.value = 1; // Reset to first page when changing items per page
  pageInput.value = '1';
};

// Watch for changes that would affect pagination
watch([filteredRows, itemsPerPage], () => {
  if (currentPage.value > totalPages.value && totalPages.value > 0) {
    currentPage.value = 1;
    pageInput.value = '1';
  }
}, { deep: true });

// Update pageInput when currentPage changes
watch(currentPage, (newPage) => {
  pageInput.value = newPage.toString();
});

onMounted(async () => {
  loading.value = true;
  pageInput.value = currentPage.value.toString();
  try {
    await adminStore.getAllPages();
  } catch (error) {
    console.error('Error loading pages:', error);
    toast.add({ title: 'Gagal memuat data halaman', color: 'red' });
  } finally {
    loading.value = false;
  }
});
</script>