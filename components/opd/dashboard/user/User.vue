<template>
  <div class="p-4 dark:text-slate-100">
    <div class="flex flex-col pt-4 space-y-8">
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
        </div>
      </div>

      <!-- Table -->
      <UCard class="w-full">
        <UTable 
          :columns="columns" 
          :rows="paginatedRows" 
          :loading="loading" 
          class="w-full max-w-screen-lg" 
          :sort="sort"
          @sort="sort = $event"
        >
        <template #no-data="{ row, index }">
            <div class="items-center justify-start max-w-md gap-2">
              <div class="font-medium">{{ startIndex +  1 + index }}</div>
            </div>
          </template>
          <template #nickname-data="{ row }">
            <div class="items-center justify-start max-w-xs gap-2">
              <UAvatar
                :alt="row.nickname"
                size="sm"
                :text="row.nickname.charAt(0).toUpperCase()"
                class="mr-1"
              />
              <span class="uppercase">{{ row.nickname }}</span>
            </div>
          </template>
          <template #email-data="{ row }">
            <div class="flex items-center justify-start max-w-xs gap-2">
              <Icon name="material-symbols:mail-outline-rounded"
              class="items-center mr-1"/>
              <span>{{ row.email }}</span>
            </div>
          </template>
          <template #empty-state>
            <div class="flex flex-col items-center justify-center py-6">
              <UIcon name="i-heroicons-document-magnifying-glass" class="mb-2 text-4xl text-gray-400" />
              <p>{{ loading ? 'Loading data...' : searchQuery ? 'No matching profiles found' : 'No profiles available' }}</p>
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
              <template #selected>{{ itemsPerPage }} per page</template>
            </USelect>
            
            <div class="flex items-center gap-1">
              <UButton
                size="sm"
                variant="ghost"
                color="gray"
                icon="i-heroicons-chevron-double-left"
                :disabled="currentPage === 1 || totalPages === 0"
                @click="goToFirstPage"
                aria-label="First page"
              />
              <UButton
                size="sm"
                variant="ghost"
                color="gray"
                icon="i-heroicons-chevron-left"
                :disabled="currentPage === 1 || totalPages === 0"
                @click="goToPrevPage"
                aria-label="Previous page"
              />
              
              <div class="flex items-center gap-1 mx-2">
                <UInput
                  v-model="pageInput"
                  type="number"
                  size="sm"
                  class="text-center w-14"
                  min="1"
                  :max="totalPages"
                  :disabled="totalPages === 0"
                  @keyup.enter="goToPage"
                  aria-label="Page number"
                />
                <span class="text-sm whitespace-nowrap">of {{ totalPages || 1 }}</span>
              </div>
              
              <UButton
                size="sm"
                variant="ghost"
                color="gray"
                icon="i-heroicons-chevron-right"
                :disabled="currentPage === totalPages || totalPages === 0"
                @click="goToNextPage"
                aria-label="Next page"
              />
              <UButton
                size="sm"
                variant="ghost"
                color="gray"
                icon="i-heroicons-chevron-double-right"
                :disabled="currentPage === totalPages || totalPages === 0"
                @click="goToLastPage"
                aria-label="Last page"
              />
            </div>
          </div>  
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useLayout } from '~/store/layouts/layouts';
import { useSuperAdminStore } from '~/store/admin/superadmin';

const layoutStore = useLayout();
const searchQuery = ref('');
const superAdminStore = useSuperAdminStore();
const loading = ref(true);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const pageInput = ref('1');
const toast = useToast();
const sort = ref({ column: 'nickname', direction: 'asc' });
const perPageOptions = [5, 10, 25, 50, 100];

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
      color: 'yellow' 
    });
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

const handlePerPageChange = () => {
  currentPage.value = 1; // Reset to first page when changing items per page
  pageInput.value = '1';
};

// Clipboard function
const copyToClipboard = async (id) => {
  try {
    await navigator.clipboard.writeText(id);
    toast.add({ title: `ID ${id} Berhasil Disalin!`, color: 'green' });
  } catch (err) {
    console.error('Gagal menyalin ke clipboard:', err);
    toast.add({ title: 'Gagal menyalin ID', color: 'red' });
  }
};

// Search function
const handleSearch = () => {
  currentPage.value = 1; // Reset to first page when searching
  pageInput.value = '1';
};

const clearSearch = () => {
  searchQuery.value = '';
  currentPage.value = 1;
  pageInput.value = '1';
};

// Table columns
const columns = [
{ key: 'no', label: 'No'},
  { key: 'nickname', label: 'Nama', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
];


// Data access and filtering
const rows_table = computed(() => {
  return Array.isArray(superAdminStore.allDataUser?.data) ? superAdminStore.allDataUser.data : [];
});

const debouncedSearchQuery = ref('');
let debounceTimeout = null;

watch(searchQuery, (newValue) => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    debouncedSearchQuery.value = newValue;
  }, 300); 
});

const filteredRows = computed(() => {
  if (!rows_table.value.length) return [];
  
  const query = debouncedSearchQuery.value.toLowerCase().trim();
  if (!query) return rows_table.value;
  
  return rows_table.value.filter(row => {
    return (
      (row.nickname && row.nickname.toLowerCase().includes(query)) ||
      (row.email && row.email.toLowerCase().includes(query)) 
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
    
    const direction = sort.value.direction === 'asc' ? 1 : -1;
    
    if (aValue === null || aValue === undefined) return direction;
    if (bValue === null || bValue === undefined) return -direction;
    
    // Special handling for dates
    if (sort.value.column === 'created_at') {
      return (new Date(aValue) - new Date(bValue)) * direction;
    }
    
    return aValue.toString().localeCompare(bValue.toString()) * direction;
  });
});

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
  return sortedRows.value.slice(start, end);
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

// Load data on component mount
onMounted(async () => {
  loading.value = true;
  pageInput.value = currentPage.value.toString();
  
  try {
    await superAdminStore.getAllUsers();
  } catch (error) {
    console.error('Error loading profiles:', error);
    toast.add({ title: 'Gagal memuat data profil', color: 'red' });
  } finally {
    loading.value = false;
  }
});
</script>