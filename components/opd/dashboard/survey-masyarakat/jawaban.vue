<template>
  <div class="dark:text-slate-100 p-4">
    <div class="flex flex-col space-y-8 pt-4">
      <div class="flex items-center justify-between w-full gap-4">
        <div class="flex items-center space-x-2 flex-grow">
          <UInput v-model="searchQuery" icon="i-heroicons-magnifying-glass-20-solid" size="md" :trailing="false" placeholder="Search..."
            class="w-full" />
        </div>
        <UButton
          color="green"
          variant="solid"
          icon="i-heroicons-document-arrow-down"
          :loading="exporting"
          @click="exportToExcel"
        >
          Export ke Excel
        </UButton>
      </div>
      
      <!-- Dynamic Questions Table -->
      <div class="overflow-x-auto">
        <UTable :columns="dynamicColumns" :rows="paginatedRows" :loading="loading" class="w-full">
          <template #cell="{ column, row }">
            <div class="whitespace-normal break-words">
              {{ row[column.key] }}
            </div>
          </template>
        </UTable>
      </div>

      <div class="flex justify-between mt-8">
        <div>
          Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredRows.length }} entries
        </div>
        <UPagination 
          :prev-button="{ icon: 'i-heroicons-arrow-small-left-20-solid', label: 'Prev', color: 'gray' }"
          :next-button="{ icon: 'i-heroicons-arrow-small-right-20-solid', trailing: true, label: 'Next', color: 'gray' }"
          v-model="currentPage"
          :total="filteredRows.length"
          :page-size="itemsPerPage"
          :max="5"
          :default-page="1"
          @update:model-value="currentPage = $event"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useToast, useFetch, useRuntimeConfig, useRouter } from '#imports';
import { useSoalStore } from '~/store/survey-masyarakat/soal';
import * as XLSX from 'xlsx';

const toast = useToast();
const soalStore = useSoalStore();
const questionData = ref([]);
const answersData = ref([]);
const loading = ref(true);
const exporting = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;

// Export to Excel function
const exportToExcel = async () => {
  try {
    exporting.value = true;

    // Get the column order from dynamicColumns to maintain the same order as the table
    const columnOrder = dynamicColumns.value.map(col => col.key);

    // Prepare data rows maintaining column order
    const rows = dynamicRows.value.map(row => {
      const orderedRow = {};
      // Use the same column order as the table
      columnOrder.forEach(qcode => {
        orderedRow[qcode] = String(row[qcode] || '').replace(/<[^>]*>/g, '');
      });
      return orderedRow;
    });

    // Create worksheet with ordered columns
    const worksheet = XLSX.utils.json_to_sheet(rows, {
      header: columnOrder // Use the same order as the table
    });

    // Adjust column widths
    const columnWidths = columnOrder.map(() => ({ wch: 30 }));
    worksheet['!cols'] = columnWidths;

    // Create workbook and append worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Jawaban Survey');

    // Generate Excel file with current date
    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `jawaban_survey_${date}.xlsx`);

    toast.add({ title: 'Berhasil export ke Excel', color: 'green' });
  } catch (error) {
    toast.add({ title: 'Gagal export ke Excel', color: 'red' });
  } finally {
    exporting.value = false;
  }
};

// Computed property for dynamic columns based on questions
const dynamicColumns = computed(() => {
  return questionData.value.map(question => ({
    key: question.qcode,
    label: question.qcode,
    sortable: true
  }));
});

// Computed property for answers organized by rows
const dynamicRows = computed(() => {
  const maxAnswers = Math.max(...Object.values(answersByQuestion.value).map(arr => arr.length));
  const rows = [];
  
  for (let i = 0; i < maxAnswers; i++) {
    const row = {};
    questionData.value.forEach(question => {
      row[question.qcode] = answersByQuestion.value[question.id]?.[i] || '';
    });
    rows.push(row);
  }
  
  return rows;
});

// Group answers by question
const answersByQuestion = computed(() => {
  const grouped = {};
  questionData.value.forEach(questionItem => {
    const answers = answersData.value
      .filter(answer => answer.question && answer.question.id === questionItem.id)
      .map(answer => {
        if (answer.question && answer.question.answer && answer.question.answer.opt_value) {
          return answer.question.answer.opt_value;
        }
        return '';
      });
    grouped[questionItem.id] = answers;
  });
  return grouped;
});

// Paginated Rows
const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredRows.value.slice(start, end);
});

// Pagination computed properties
const filteredRows = computed(() => {
  const filtered = dynamicRows.value.filter(row => {
    if (!searchQuery.value) return true;
    const searchLower = searchQuery.value.toLowerCase();
    return Object.values(row).some(value => 
      String(value).toLowerCase().includes(searchLower)
    );
  });
  return filtered;
});

const totalPages = computed(() => {
  const total = Math.ceil(filteredRows.value.length / itemsPerPage);
  return total > 0 ? total : 1;
});

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, filteredRows.value.length));

// Watch for changes in search and total pages
watch([totalPages, currentPage], ([total, current]) => {
  if (current > total) {
    currentPage.value = total;
  }
  if (current < 1) {
    currentPage.value = 1;
  }
});

// Reset currentPage when search query changes
watch(searchQuery, () => {
  currentPage.value = 1;
});

// Data fetching
const fetchQuestionData = async () => {
  try {
    const questions = await soalStore.getQuestions();
    if (questions && questions.length > 0) {
      questionData.value = questions;
    } else {
      toast.add({ title: 'Tidak ada data pertanyaan untuk ditampilkan', color: 'yellow' });
      questionData.value = [];
    }
  } catch (error) {
    toast.add({ title: 'Gagal mengambil data pertanyaan', color: 'red' });
    questionData.value = [];
  }
};

const fetchAnswerData = async () => {
  try {
    const answers = await soalStore.getAnswerData();
    if (answers && answers.length > 0) {
      answersData.value = answers;
    } else {
      toast.add({ title: 'Tidak ada data jawaban untuk ditampilkan', color: 'yellow' });
      answersData.value = [];
    }
  } catch (error) {
    toast.add({ title: 'Gagal mengambil data jawaban', color: 'red' });
    answersData.value = [];
  }
};

onMounted(async () => {
  loading.value = true;
  await Promise.all([fetchQuestionData(), fetchAnswerData()]);
  loading.value = false;
});
</script>

<style scoped>
.overflow-x-auto {
  overflow-x: auto;
  overflow-y: hidden;
}
</style>