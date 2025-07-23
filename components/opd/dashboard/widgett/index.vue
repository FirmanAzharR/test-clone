<template>
  <div class="p-4 dark:text-slate-100">
    <Loading v-if="layoutStore.isLoading" />
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
            Tambah Widget
          </UButton>
        </div>
      </div>

      <!-- Table wrapped in UCard -->
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
          <template #message-data="{ row }">
            <div class="items-center justify-start max-w-xs gap-2">
              <span class="block max-w-xs break-words truncate whitespace-normal">{{ row.message }}</span>
            </div>
          </template>
          <template #iconfab-data="{ row }">
            <div class="w-24 h-24 overflow-hidden rounded-lg">
              <template v-if="row.iconfab">
                <NuxtImg 
                  :src="row.iconfab"
                  alt="Widget image" 
                  class="object-cover w-full h-full" 
                  loading="lazy"
                  placeholder
                />
              </template>
              <template v-else>
                <div class="flex flex-col items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-800">
                  <UIcon name="i-heroicons:photo" class="w-8 h-8 text-gray-400" />
                  <span class="text-sm text-gray-500">No Image</span>
                </div>
              </template>
            </div>
          </template>
          <template #opt-data="{ row }">
            <UBadge :color="getOptColor(row.opt)" variant="subtle">
              {{ getOptLabel(row.opt) }}
            </UBadge>
          </template>
          <template #publish-data="{ row }">
            <UBadge :color="row.publish === '1' || row.publish === 1 ? 'emerald' : 'red'" variant="soft">
              {{ row.publish === "1" || row.publish === 1 ? 'Published' : 'Pending' }}
            </UBadge>
          </template>
          <template #action-data="{ row }">
  <div class="flex flex-col space-y-2">
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
              <UIcon name="i-heroicons-document-magnifying-glass" class="mb-2 text-4xl text-gray-400" />
              <p>{{ loading ? 'Loading data...' : searchQuery ? 'No matching widgets found' : 'No widgets available' }}</p>
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
    
    <!-- Add/Edit Modal -->
    <WidgetModal 
      v-model="isModalOpen"
      :is-open="isModalOpen"
      :mode="modalMode"
      :detail-data="selectedDetail"
      @close="closeModal"
      @submit="handleSubmit"
    />
    
    <!-- Preview Modal Component -->
    <ModalPreviewWidget
      v-model="isModalOpenPreview"
      :is-open="isModalOpenPreview"
      :data="selectedDetail"
      @close="closePreviewModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useWidgetStore } from '~/store/widgett/widget';
import ModalDelete from '~/components/global/modal/delete.vue';
import ModalPreviewWidget from './modal/ModalPreviewWidget.vue';
import WidgetModal from './modal/WidgetModal.vue';
import { useLayout } from '~/store/layouts/layouts';
import Loading from '@/components/global/loading/index.vue';

const widgetStore = useWidgetStore();
const toast = useToast();
const layoutStore = useLayout();

const searchQuery = ref('');
const loading = ref(true);
const isModalOpen = ref(false);
const isModalOpenPreview = ref(false);
const selectedDetail = ref({});
const currentPage = ref(1);
const itemsPerPage = ref(10);
const pageInput = ref('1');
const modalMode = ref('add');
const perPageOptions = [5, 10, 25, 50, 100];

const getActionItems = (row) => {
  return [
    [
      {
        label: "Preview",
        icon: "i-heroicons-eye",
        click: () => openPreviewWidget(row),
      },
      {
        label: "Edit",
        icon: "i-heroicons-pencil",
        click: () => openEditModal(row),
      }
    ],
    [
      {
        label: "Copy UUID",
        icon: "i-heroicons-clipboard-document",
        click: () => copyToClipboard(row.id),
      },
      {
        label: "Hapus",
        icon: "i-heroicons-trash",
        color: "red",
        click: () => handleDelete(row.id),
      },
    ],
  ];
};

const columns = [
{ key: 'no', label: 'No'},
  { key: 'title', label: 'Nama', sortable: true },
  { key: 'message', label: 'Pesan', sortable: true },
  { key: 'iconfab', label: 'Icon', sortable: false },
  { key: 'opt', label: 'Kategori', sortable: true },
  { key: 'publish', label: 'Status', sortable: true },
  { key: 'action', label: 'Aksi' }
];

const rows_table = computed(() => {
  return Array.isArray(widgetStore.widgets?.data) ? widgetStore.widgets.data : [];
});

const filteredRows = computed(() => {
  if (!searchQuery.value) return rows_table.value;
  
  return rows_table.value.filter(row => {
    const matchesSearch = 
      (row.title?.toLowerCase().includes(searchQuery.value.toLowerCase())) || 
      (row.message?.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (row.opt?.toLowerCase().includes(searchQuery.value.toLowerCase()));
    return matchesSearch;
  });
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / itemsPerPage.value)));

const startIndex = computed(() => {
  if (filteredRows.value.length === 0) return 0;
  return (currentPage.value - 1) * itemsPerPage.value;
});

const endIndex = computed(() => {
  return Math.min(startIndex.value + itemsPerPage.value, filteredRows.value.length);
});

const paginatedRows = computed(() => {
  if (filteredRows.value.length === 0) return [];
  
  const start = startIndex.value;
  const end = endIndex.value;
  return filteredRows.value.slice(start, end);
});

const paginationInfoText = computed(() => {
  if (filteredRows.value.length === 0) {
    return 'No entries to show';
  }
  
  return `Showing ${startIndex.value + 1} to ${endIndex.value} of ${filteredRows.value.length} entries${
    searchQuery.value ? ` (filtered from ${rows_table.value.length} total entries)` : ''
  }`;
});

watch([filteredRows, itemsPerPage], () => {
  if (currentPage.value > totalPages.value && totalPages.value > 0) {
    currentPage.value = 1;
    pageInput.value = '1';
  }
}, { deep: true });

watch(currentPage, (newPage) => {
  pageInput.value = newPage.toString();
});

const handleSearch = () => {
  currentPage.value = 1;
  pageInput.value = '1';
};

const clearSearch = () => {
  searchQuery.value = '';
  currentPage.value = 1;
  pageInput.value = '1';
};

const handlePerPageChange = () => {
  currentPage.value = 1;
  pageInput.value = '1';
};

const goToPage = () => {
  const page = parseInt(pageInput.value);
  if (page && page > 0 && page <= totalPages.value) {
    currentPage.value = page;
  } else {
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

const openPreviewWidget = (row) => {
  selectedDetail.value = row;
  isModalOpenPreview.value = true;
};

const openAddModal = () => {
  selectedDetail.value = {};
  modalMode.value = 'add';
  isModalOpen.value = true;
};

const openEditModal = (row) => {
  selectedDetail.value = row;
  modalMode.value = 'edit';
  isModalOpen.value = true;
};

const closePreviewModal = () => {
  isModalOpenPreview.value = false;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const copyToClipboard = async (id) => {
  try {
    await navigator.clipboard.writeText(id);
    toast.add({ title: `ID ${id} berhasil disalin!`, color: 'green' });
  } catch (err) {
    console.error('Gagal menyalin ke clipboard:', err);
    toast.add({ title: 'Gagal menyalin ID', color: 'red' });
  }
};

const handleDelete = async (id) => {
  try {
    await widgetStore.destroyWidgetData(id);
    await widgetStore.selectWidget();
    toast.add({ title: 'Widget berhasil dihapus', color: 'green' });
  } catch (error) {
    toast.add({ 
      title: 'Gagal menghapus widget',
      description: error.message || 'Terjadi kesalahan saat menghapus',
      color: 'red'
    });
  }
};

const handleSubmit = () => {
  widgetStore.selectWidget();
  closeModal();
};

const getOptColor = (opt) => {
  switch (opt) {
    case 'runningtext':
      return 'blue';
    case 'popup':
      return 'green';
    case 'fab':
      return 'red';
    default:
      return 'gray';
  }
};

const getOptLabel = (opt) => {
  switch (opt) {
    case 'runningtext':
      return 'Running Text';
    case 'popup':
      return 'Popup';
    case 'fab':
      return 'FAB';
    default:
      return 'Lainnya';
  }
};

onMounted(async () => {
  loading.value = true;
  try {
    await widgetStore.selectWidget();
  } catch (error) {
    console.error('Error loading widgets:', error);
    toast.add({ title: 'Gagal memuat data widget', color: 'red' });
  } finally {
    loading.value = false;
  }
});
</script>