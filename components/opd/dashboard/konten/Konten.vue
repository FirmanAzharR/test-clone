<template>
  <div class="p-4 dark:text-slate-100">
    <Loading v-if="layoutStore.isLoading" />
    <div class="flex flex-col pt-4 space-y-8">
      <!-- Search, Category Filter, and Add Button -->
      <div class="flex flex-col items-start w-full gap-4 sm:flex-row sm:items-center">
        <div
          class="flex flex-col items-start flex-grow w-full gap-4 sm:flex-row sm:items-center"
        >
          <!-- Input Search with clear button -->
          <UInputGroup class="flex w-full">
            <UInput
              v-model="searchQuery"
              icon="i-heroicons-magnifying-glass-20-solid"
              size="md"
              placeholder="Search by title or excerpt..."
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

          <!-- Kategori Filter -->
          <USelect
            v-model="selectedCategory"
            :options="categories"
            placeholder="Select category"
            size="md"
            class="w-full sm:w-auto"
            @update:model-value="handleCategoryChange"
          />

          <UButton
            size="sm"
            variant="solid"
            color="blue"
            icon="material-symbols:add-2-rounded"
            @click="openAddModal"
            class="w-full mt-4 sm:w-auto sm:mt-0"
          >
            Tambah Konten
          </UButton>
        </div>
      </div>

      <!-- Table -->
      <UCard class="w-full">
        <UTable
          :columns="tableColumns"
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
          <template #excert-data="{ row }">
            <div class="items-center justify-start max-w-md gap-2">
              <div class="font-medium">{{ row.title }}</div>
              <span
                class="text-sm text-gray-500 break-words whitespace-normal dark:text-gray-400"
              >
                {{ truncateText(row.excert, 100) }}
              </span>
            </div>
          </template>

          <template #tag-data="{ row }">
            <div class="flex flex-wrap items-center max-w-xs gap-1">
              <template v-if="row.tag">
                <UBadge
                  v-for="(tag, index) in row.tag.split(',')"
                  :key="index"
                  color="sky"
                  variant="outline"
                  class="px-2 py-1"
                >
                  {{ tag.trim() }}
                </UBadge>
              </template>
              <span v-else>-</span>
            </div>
          </template>

          <template #publish-data="{ row }">
            <UBadge
              :color="row.publish === '1' ? 'emerald' : 'red'"
              variant="soft"
              class="px-2 py-1"
            >
              {{ row.publish === "1" ? "Published" : "Pending" }}
            </UBadge>
          </template>

          <template #created_at-data="{ row }">
            <span>{{ formatDate(row.created_at) }}</span>
          </template>

          <template #action-data="{ row }">
            <div class="flex flex-col items-center gap-2">
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

    <ModalAddKonten
      :isOpen="isModalOpen"
      :mode="modalMode"
      :detailData="selectedDetail"
      @close="closeModal"
    />
    <ModalPreview
      :isOpen="isModalOpenPreview"
      :articleId="selectedArticleId"
      @close="isModalOpenPreview = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import ModalAddKonten from "./modal/ModalAddKonten";
import { useBeritaStore } from "~/store/berita/berita";
import ModalPreview from "./modal/ModalPreview";
import { useLayout } from "~/store/layouts/layouts";
import Loading from "@/components/global/loading/index.vue";
import { useRouter } from "vue-router";
import NoData from "~/components/global/loading/nodata.vue";

const categories = [
  "Berita",
  "Artikel",
  "Kegiatan",
  "Renstra",
  "Informasi",
  "Aset",
  "General",
];
const selectedCategory = ref("Berita");
const searchQuery = ref("");
const beritaStore = useBeritaStore();
const loading = ref(true);
const isModalOpen = ref(false);
const selectedDetail = ref({});
const isModalOpenPreview = ref(false);
const selectedArticleId = ref(null);
const currentPage = ref(1);
const pageInput = ref("1");
const itemsPerPage = ref(10);
const modalMode = ref("add");
const toast = useToast();
const layoutStore = useLayout();
const router = useRouter();
const sort = ref({ column: "created_at", direction: "desc" });

const formatDate = (dateString) => {
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

const truncateText = (text, maxLength) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const handleSearch = () => {
  currentPage.value = 1;
  pageInput.value = "1";
};

const clearSearch = () => {
  searchQuery.value = "";
  currentPage.value = 1;
  pageInput.value = "1";
};

// Modified handleCategoryChange to fetch data based on selected category
const handleCategoryChange = () => {
  currentPage.value = 1; // Reset to first page when changing category
  pageInput.value = "1";
  const category = selectedCategory.value === "All" ? "Berita" : selectedCategory.value;
  beritaStore.getAllBeritaDataAdmin(category);
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
const openPreviewModal = async (id) => {
  layoutStore.setLoading(true);
  try {
    await beritaStore.editArtikelData(id);
    selectedArticleId.value = id;
    isModalOpenPreview.value = true;
  } catch (err) {
    console.error("Error loading article for preview:", err);
    toast.add({ title: "Gagal memuat artikel untuk preview", color: "red" });
  } finally {
    layoutStore.setLoading(false);
  }
};

const openEditModal = async (id) => {
  layoutStore.setLoading(true);
  try {
    await beritaStore.editArtikelData(id);
    modalMode.value = "edit";
    selectedDetail.value = beritaStore.detailArtikelData || {};
    isModalOpen.value = true;
  } catch (err) {
    console.error("Error loading article for edit:", err);
    toast.add({ title: "Gagal memuat artikel untuk edit", color: "red" });
  } finally {
    layoutStore.setLoading(false);
  }
};

const openAddModal = () => {
  selectedDetail.value = {};
  isModalOpen.value = true;
  modalMode.value = "add";
};

const closeModal = () => {
  isModalOpen.value = false;
  // Refresh data after modal is closed with current category
  const category = selectedCategory.value === "All" ? "Berita" : selectedCategory.value;
  beritaStore.getAllBeritaDataAdmin(category);
};

const handleDelete = async (id) => {
  layoutStore.setLoading(true);
  try {
    if (typeof beritaStore.deleteBeritaDataAdmin !== "function") {
      throw new Error("Delete function is not available");
    }
    await beritaStore.deleteBeritaDataAdmin(id);

    // Refresh with current category
    const category = selectedCategory.value === "All" ? "Berita" : selectedCategory.value;
    await beritaStore.getAllBeritaDataAdmin(category);

    toast.add({ title: "Data berhasil dihapus", color: "green" });
  } catch (err) {
    console.error("Error deleting content:", err);
    toast.add({ title: "Gagal menghapus data", color: "red" });
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

//old handleToSlider
// const handleToSlider = async (row) => {
//   layoutStore.setLoading(true);
//   try {
//     const sliderData = {
//       title: row.title,
//       image: row.image,
//       descript: row.excert,
//       link: `/berita/detail/${row.slug}`,
//       publish: row.publish,
//     };

//     console.log("Adding to slider payload on konten.vue:", sliderData);

//     await beritaStore.toSlider(sliderData);

//     if (beritaStore.dataSlider?.status == 201) {
//       toast.add({ title: "Berhasil memasukkan data ke slider", color: "green" });
//       router.push("/dashboard/media/slider");
//     } else {
//       toast.add({ title: "Gagal memasukkan data ke slider", color: "yellow" });
//     }
//   } catch (err) {
//     console.error("Error adding to slider:", err);
//     toast.add({ title: "Gagal memasukkan data ke slider", color: "red" });
//   } finally {
//     layoutStore.setLoading(false);
//   }
// };

//new handleToSlider with image fetching
const handleToSlider = async (row) => {
  layoutStore.setLoading(true);
  try {
    // 1. Fetch image from URL and convert to File
    let imageFile = null;
    if (row.image && typeof row.image === "string" && row.image.startsWith("http")) {
      const response = await fetch(row.image);
      const blob = await response.blob();
      // Extract filename from URL or use default
      const filename = row.image.split("/").pop() || "image.jpg";
      imageFile = new File([blob], filename, { type: blob.type });
    }

    const sliderData = {
      title: row.title,
      image: imageFile, // File object, not URL
      descript: row.excert,
      link: `/berita/detail/${row.slug}`,
      publish: row.publish,
    };

    console.log("Adding to slider payload on konten.vue:", sliderData);

    await beritaStore.toSlider(sliderData);

    if (beritaStore.dataSlider?.status == 201) {
      toast.add({ title: "Berhasil memasukkan data ke slider", color: "green" });
      router.push("/dashboard/media/slider");
    } else {
      toast.add({ title: "Gagal memasukkan data ke slider", color: "yellow" });
    }
  } catch (err) {
    console.error("Error adding to slider:", err);
    toast.add({ title: "Gagal memasukkan data ke slider", color: "red" });
  } finally {
    layoutStore.setLoading(false);
  }
};

const getActionItems = (row) => {
  return [
    [
      {
        label: "Preview",
        icon: "i-heroicons-eye",
        click: () => openPreviewModal(row.id),
      },
      {
        label: "Edit",
        icon: "i-heroicons-pencil",
        click: () => openEditModal(row.id),
      },
      {
        label: "To Slider",
        icon: "material-symbols:add-to-queue-outline-rounded",
        click: () => handleToSlider(row),
      },
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

// Dynamic table columns based on selected category
const tableColumns = computed(() => {
  const baseColumns = [
    { key: "no", label: "No" },
    { key: "excert", label: "Konten", sortable: true },
  ];

  // Add tag column only for General category
  if (selectedCategory.value === "General") {
    baseColumns.push({ key: "tag", label: "Tag", sortable: true });
  }

  // Add remaining columns
  baseColumns.push(
    { key: "publish", label: "Status", sortable: true },
    { key: "created_at", label: "Tanggal", sortable: true },
    { key: "action", label: "Aksi" }
  );

  return baseColumns;
});

// Data access and filtering
const rows_table = computed(() => {
  return Array.isArray(beritaStore.allBeritaData?.data)
    ? beritaStore.allBeritaData.data
    : [];
});

// Improved search and filtering
const filteredRows = computed(() => {
  if (!rows_table.value.length) return [];

  return rows_table.value.filter((row) => {
    // Search filter only (category filtering is now done via API)
    const query = searchQuery.value.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (row.title && row.title.toLowerCase().includes(query)) ||
      (row.excert && row.excert.toLowerCase().includes(query));

    return matchesSearch;
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
    if (sort.value.column === "created_at") {
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

watch(currentPage, (newPage) => {
  pageInput.value = newPage.toString();
});

onMounted(async () => {
  loading.value = true;
  try {
    // Default to 'Berita' category on initial load
    await beritaStore.getAllBeritaDataAdmin("Berita");
  } catch (error) {
    console.error("Error loading content:", error);
    toast.add({ title: "Gagal memuat data konten", color: "red" });
  } finally {
    loading.value = false;
  }
});
</script>
