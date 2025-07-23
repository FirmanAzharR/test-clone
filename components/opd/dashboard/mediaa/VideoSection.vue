<template>
  <div class="p-4 dark:text-slate-100">
    <div class="flex flex-col pt-4 space-y-8">
      <!-- Search and Add Button -->
      <div class="flex flex-col items-start w-full gap-4 sm:flex-row sm:items-center">
        <div class="flex flex-col items-start flex-grow w-full gap-4 sm:flex-row sm:items-center">
          <!-- Input Search with clear button -->
          <UInputGroup class="flex w-full">
            <UInput 
              v-model="searchQuery" 
              icon="i-heroicons-magnifying-glass-20-solid" 
              size="md" 
              placeholder="Search by title..." 
              class="w-full"
              @update:model-value="handleSearch"
            />
            <UButton 
              v-if="searchQuery" 
              icon="i-heroicons-x-mark" 
              color="gray" 
              variant="ghost" 
              @click="clearSearch"
            />
          </UInputGroup>
          
          <UButton 
            size="sm" 
            variant="solid" 
            color="blue" 
            icon="material-symbols:add-2-rounded" 
            @click="openAddModal"
            class="w-full sm:w-auto"
          >
            Tambah
          </UButton>
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
              <div class="font-medium">{{ startIndex +  1 + index }}</div>
            </div>
          </template>
          <template #title-data="{ row }">
            <div class="items-center justify-start max-w-md gap-2">
              <span class="font-medium break-words whitespace-normal">{{ row.title }}</span>
            </div>
          </template>
          
          <template #video-data="{ row }">
            <div class="w-full max-w-xs">
              <div class="overflow-hidden rounded-lg shadow-md aspect-video">
                <iframe
                  v-if="row?.video"
                  :src="getEmbedUrl(row?.video)"
                  frameborder="0"
                  allowfullscreen
                  class="w-full h-full"
                  loading="lazy"
                ></iframe>
                <div v-else class="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700">
                  <UIcon name="i-heroicons-video-camera" class="text-4xl text-gray-400" />
                </div>
              </div>
              <div class="mt-2 text-xs text-gray-500 truncate dark:text-gray-400">
                {{ row?.video || 'No video URL' }}
              </div>
            </div>
          </template>
          
          <template #publish-data="{ row }">
            <UBadge
              :color="row.publish === '1' ? 'emerald' : 'red'"
              variant="soft"
              class="px-2 py-1"
            >
              {{ row.publish === "1" ? 'Published' : 'Pending' }}
            </UBadge>
          </template>
          
          <template #created_at-data="{ row }">
            <span>{{ formatDate(row.created_at) }}</span>
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
  </div>

  <ModalAddEditVideo 
    :isOpen="isModalOpen" 
    :mode="modalMode" 
    :detailData="selectedDetail" 
    @close="closeModal" 
  />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useFotoStore } from '~/store/foto/foto';
import ModalAddEditVideo from './modal/ModalAddEditVideo.vue';
import { useLayout } from '~/store/layouts/layouts';
import ModalDelete from '~/components/global/modal/delete.vue';
import NoData from '~/components/global/loading/nodata.vue';

const layoutStore = useLayout();
const searchQuery = ref('');
const fotoStore = useFotoStore();
const loading = ref(true);
const isModalOpen = ref(false);
const selectedDetail = ref({});
const currentPage = ref(1);
const pageInput = ref('1');
const itemsPerPage = ref(10);
const modalMode = ref('add');
const toast = useToast();
const sort = ref({ column: 'created_at', direction: 'desc' });

// Format date function
const formatDate = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

// YouTube embed URL converter
const getEmbedUrl = (url) => {
  if (!url) return '';
  
  try {
    // Handle different YouTube URL formats
    if (url.includes('youtube.com/watch')) {
      const videoId = new URL(url).searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    return url;
  } catch (error) {
    console.error('Error parsing YouTube URL:', error);
    return url;
  }
};

// Search handlers
const handleSearch = () => {
  currentPage.value = 1; // Reset to first page when searching
  pageInput.value = '1';
};

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


const clearSearch = () => {
  searchQuery.value = '';
  currentPage.value = 1;
  pageInput.value = '1';
};

const handlePerPageChange = () => {
  currentPage.value = 1; // Reset to first page when changing items per page
  pageInput.value = '1';
};

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

// Modal handlers
const openAddModal = () => {
  selectedDetail.value = {};
  isModalOpen.value = true;
  modalMode.value = 'add';
};

const openEditModal = async (id) => {
  layoutStore.setLoading(true);
  try {
    await fotoStore.detailDataVideosAdmin(id);
    selectedDetail.value = fotoStore.detailVideoData || {};
    modalMode.value = 'edit';
    isModalOpen.value = true;
  } catch (err) {
    console.error('Error loading video details:', err);
    toast.add({ title: 'Gagal memuat detail video', color: 'red' });
  } finally {
    layoutStore.setLoading(false);
  }
};

const closeModal = () => {
  isModalOpen.value = false;
  // Refresh data after modal is closed
  fotoStore.getAllVideo();
};

// Data operations
const handleDelete = async (id) => {
  layoutStore.setLoading(true);
  try {
    await fotoStore.deleteVideoAdmin(id);
    if (fotoStore.dataDeleteVideo !== null) {
      await fotoStore.getAllVideo();
      toast.add({ title: 'Data berhasil dihapus', color: 'green' });
    }
  } catch (err) {
    console.error('Gagal menghapus data:', err);
    toast.add({ title: 'Gagal menghapus data', color: 'red' });
  } finally {
    layoutStore.setLoading(false);
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
  { key: 'video', label: 'Video', sortable: false },
  { key: 'publish', label: 'Status', sortable: true },
  { key: 'created_at', label: 'Tanggal', sortable: true },
  { key: 'action', label: 'Aksi' }
];

// Data access and filtering
const rows_table = computed(() => {
  return Array.isArray(fotoStore.allVideosData?.data) ? fotoStore.allVideosData.data : [];
});

// Improved search
const filteredRows = computed(() => {
  if (!rows_table.value.length) return [];
  
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return rows_table.value;
  
  return rows_table.value.filter(row => {
    return (
      (row.title && row.title.toLowerCase().includes(query)) || 
      (row.excert && row.excert.toLowerCase().includes(query))
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
const totalPages = computed(() => Math.ceil(filteredRows.value.length / itemsPerPage.value));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredRows.value.length));

// Paginated rows
const paginatedRows = computed(() => {
  const start = startIndex.value;
  const end = endIndex.value;
  return sortedRows.value.slice(start, end);
});

// Watch for changes in pagination-related values
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
  try {
    await fotoStore.getAllVideo();
  } catch (error) {
    console.error('Error loading videos:', error);
    toast.add({ title: 'Gagal memuat data video', color: 'red' });
  } finally {
    loading.value = false;
  }
});
</script>
