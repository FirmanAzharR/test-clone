<template>
  <!-- Main layout container with h-screen to prevent page scrolling -->
  <div class="h-screen overflow-hidden bg-slate-100" :class="isDarkMode ? 'dark:bg-slate-900' : ''">
    <!-- Header with blue gradient -->
    <div class="relative z-10 px-6 h-[100px] lg:h-[150px] text-white bg-gradient-to-r from-blue-600 to-blue-500 flex items-end pb-8">
      <div class="container mx-auto max-w-7xl">
        <div class="flex flex-col items-start space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div class="flex items-center space-x-4">
            <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm">
              <UIcon name="i-heroicons-calendar" class="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
                {{ footerData?.nama_opd || 'Dinas Komunikasi dan Informatika' }}
              </h1>
              <p class="mt-1 text-sm text-blue-100">
                {{ agendaItems.length }} agenda hari ini
              </p>
            </div>
          </div>                    
        </div>      
      </div>
    </div>

    <!-- Main Content - Using flex-1 to fill remaining height -->
    <div class="container px-4 mx-auto max-w-7xl relative z-20 flex flex-col h-[calc(100vh-100px)] lg:h-[calc(100vh-150px)]">
      <!-- Top section with date card for mobile -->
      <div class="sm:hidden pt-6 mb-4 flex justify-end">
        <div class="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-lg">
          <div class="text-center">
            <div class="text-xs font-medium text-slate-500 dark:text-slate-400">{{ formattedDate }}</div>
            <div class="text-xl font-bold text-slate-800 dark:text-white">{{ formattedTime }}</div>
          </div>
        </div>
      </div>
      
      <!-- Agenda Section - flex-1 to fill remaining space -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 flex flex-col flex-1 mb-6 overflow-hidden">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-slate-800 dark:text-white flex items-center">
            <UIcon name="i-heroicons-calendar" class="w-6 h-6 mr-2 text-blue-500" />
            Agenda Hari Ini
          </h2>
          
          <!-- Date & Time for desktop (fixed position) -->
          <div class="hidden md:block">
            <div class="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-4 shadow-lg text-white">
              <div class="flex items-center space-x-3">
                <div class="bg-white/20 rounded-lg p-2">
                  <UIcon name="i-heroicons-clock" class="w-6 h-6 text-white" />
                </div>
                <div>
                  <div class="text-sm font-medium text-blue-100">{{ formattedDate }}</div>
                  <div class="text-xl font-bold tracking-wide">{{ formattedTime }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Loading state -->
        <div v-if="isLoading" class="flex justify-center py-10">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        
        <!-- Empty state -->
        <div v-else-if="!agendaItems.length" class="text-center py-10">
          <div class="flex flex-col items-center justify-center">
            <UIcon name="i-heroicons-calendar" class="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
            <h3 class="text-lg font-medium text-slate-700 dark:text-slate-300">Tidak ada agenda hari ini</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">Agenda akan ditampilkan di sini saat tersedia</p>
          </div>
        </div>
        
        <!-- Timeline container with auto-scroll - flex-1 to fill remaining space -->
        <div v-else ref="scrollContainer" class="space-y-6 overflow-y-auto flex-1 pt-10">
          <!-- Agenda Items (Dynamic) -->
          <div v-for="(item, index) in sortedAgendaItems" :key="item.id" class="flex">
            <!-- Time indicator -->
            <div class="flex flex-col items-center mr-6">
              <div :class="getTimeClass(index)" class="font-bold rounded-lg px-3 py-1.5 text-center">
                {{ item.created_at_formated ? formatTime(item.created_at_formated) :'-' }} 
              </div>
              <div :class="getLineClass(index)" class="h-full w-0.5 my-2"></div>
            </div>
            
            <!-- Card content -->
            <div :class="getCardClass(index)" class="rounded-lg p-5 flex-1 shadow-md transition-shadow duration-200">
              <div class="flex items-start justify-between">
                <h3 class="font-bold text-slate-800 dark:text-white text-lg">{{ item.kegiatan }}</h3>
                <span :class="getTagClass(index)" class="text-xs px-2 py-1 rounded-full">
                  {{ getTimeLabel(item.created_at_formated) }}
                </span>
              </div>
              
              <!-- Location -->
              <div class="flex items-center mt-2 text-slate-600 dark:text-slate-300">
                <UIcon :name="getLocationIcon(index)" :class="getIconClass(index)" class="w-4 h-4 mr-1.5" />
                <span class="text-sm">{{ item.lokasi }}</span>
              </div>
              
              <!-- Participants -->
              <div class="mt-4 space-y-2">
                <div v-for="(person, personIndex) in getPersonList(item.person)" :key="personIndex" class="flex items-center">
                  <div :class="getAvatarClass(index)" class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                    {{ getInitials(person) }}
                  </div>
                  <span class="text-sm text-slate-700 dark:text-slate-200">{{ person }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import { useBannerStore } from "@/store/banner/banner.js";
import { useLayout } from "@/store/layouts/layouts.js";
import { useAgendaStore } from "@/store/agenda/agenda.js";
import { useFooterStore } from '@/store/footer/footer.js';
import dayjs from 'dayjs';
import 'dayjs/locale/id'; 
import utc from 'dayjs/plugin/utc';

dayjs.locale('id');
dayjs.extend(utc);

const currentDate = ref('');
const currentTime = ref('');
const isLoading = ref(true);
const scrollContainer = ref(null);

const formattedDate = computed(() => currentDate.value);
const formattedTime = computed(() => currentTime.value);

// Stores
const layoutStore = useLayout();
const agendaStore = useAgendaStore();
const footerStore = useFooterStore();

const isDarkMode = computed(() => layoutStore.theme === "dark");

// Add computed property to access footer data
const footerData = computed(() => {
  return footerStore.footerData?.data?.[0] || footerStore.footerData?.[0] || null;
});

const agendaItems = computed(() => {
  if (agendaStore.agendaData && agendaStore.agendaData.data) {
    return agendaStore.agendaData.data;
  }
  return [];
});

const sortedAgendaItems = computed(() => {
  return [...agendaItems.value].sort((a, b) => {
    return new Date(a.created_at_formated) - new Date(b.created_at_formated);
  });
});

let timeInterval;
let dataRefreshInterval;
let autoScrollInterval;

// Auto-scroll variables
const scrollSpeed = 1; // pixels per animation frame
const scrollPauseAtEnd = 2000; // pause for 2 seconds at the end before resetting
let isPaused = false;
let pauseTimeout = null;

// Function to handle auto-scrolling
const handleAutoScroll = () => {
  if (!scrollContainer.value || isPaused) return;
  
  const container = scrollContainer.value;
  const maxScrollTop = container.scrollHeight - container.clientHeight;
  
  // Only scroll down
  if (container.scrollTop < maxScrollTop) {
    container.scrollTop += scrollSpeed;
  } else {
    // Reached the bottom, pause for a moment then reset to top
    isPaused = true;
    pauseTimeout = setTimeout(() => {
      // Smoothly scroll back to top
      container.scrollTop = 0;
      
      // Resume scrolling after a brief pause
      setTimeout(() => {
        isPaused = false;
      }, 1000);
    }, scrollPauseAtEnd);
  }
};

const updateDateTime = () => {
  const now = dayjs();
  currentDate.value = now.format('dddd, D MMMM YYYY');
  currentTime.value = now.format('HH:mm:ss');
};

// Helper function untuk memformat waktu dari ISO string
const formatTime = (isoString) => {
  return dayjs.utc(isoString).format('HH:mm');
};

// Helper function untuk mendapatkan label waktu (Pagi, Siang, Sore, Malam)
const getTimeLabel = (isoString) => {
  const hour = dayjs.utc(isoString).hour();
  
  if (hour >= 5 && hour < 12) return 'Pagi';
  if (hour >= 12 && hour < 15) return 'Siang';
  if (hour >= 15 && hour < 19) return 'Sore';
  return 'Malam';
};

// Helper function untuk mendapatkan inisial dari nama
const getInitials = (name) => {
  if (!name || typeof name !== 'string') return 'NA';
  
  const parts = name.trim().split(' ').filter(part => part.trim() !== '');
  
  if (parts.length === 0) return 'NA';
  
  let initials = parts[0][0];
  
  if (parts.length > 1) {
    for (let i = parts.length - 1; i >= 0; i--) {
      const part = parts[i].trim();
      if (part && !part.startsWith('.') && part.length > 0) {
        initials += part[0];
        break;
      }
    }
    if (initials.length === 1 && parts[parts.length - 1].length > 0) {
      initials += parts[parts.length - 1][0];
    }
  }
  
  return initials.toUpperCase();
};

// Helper function untuk memecah string person menjadi array
const getPersonList = (personString) => {
  if (!personString) return [];
  return personString.split('-').filter(person => person.trim() !== '');
};

// Helper functions untuk styling dinamis berdasarkan index
const getTimeClass = (index) => {
  const classes = index % 2 === 0 
    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
    : 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300';
  return classes;
};

const getLineClass = (index) => {
  return index % 2 === 0 
    ? 'bg-blue-200 dark:bg-blue-700' 
    : 'bg-indigo-200 dark:bg-indigo-700';
};

const getCardClass = (index) => {
  return 'bg-slate-50 dark:bg-slate-700';
};

const getTagClass = (index) => {
  return index % 2 === 0 
    ? 'bg-blue-500 text-white' 
    : 'bg-indigo-500 text-white';
};

const getIconClass = (index) => {
  return index % 2 === 0 
    ? 'text-blue-500' 
    : 'text-indigo-500';
};

const getLocationIcon = (index) => {
  return index % 2 === 0 
    ? 'i-heroicons-map-pin' 
    : 'i-heroicons-building-office-2';
};

const getAvatarClass = (index) => {
  return index % 2 === 0 
    ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300' 
    : 'bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300';
};

// Function to refresh agenda data
const refreshAgendaData = async () => {
  try {
    await agendaStore.getAgendaData();
  } catch (error) {
    console.error('Error refreshing agenda data:', error);
  }
};

onMounted(async () => {
  updateDateTime();
  await footerStore.getFooterData();
  
  try {
    await agendaStore.getAgendaData();
  } catch (error) {
    console.error('Error fetching agenda data:', error);
  } finally {
    isLoading.value = false;
    
    // Start auto-scroll after data is loaded
    nextTick(() => {
      if (scrollContainer.value && agendaItems.value.length > 0) {
        // Start auto-scroll animation
        autoScrollInterval = setInterval(handleAutoScroll, 16); // ~60fps
      }
    });
  }
  
  // Set up intervals
  timeInterval = setInterval(updateDateTime, 1000);
  dataRefreshInterval = setInterval(refreshAgendaData, 5 * 60 * 1000); // 5 minutes
});

onUnmounted(() => {
  // Clear all intervals and timeouts
  if (timeInterval) clearInterval(timeInterval);
  if (dataRefreshInterval) clearInterval(dataRefreshInterval);
  if (autoScrollInterval) clearInterval(autoScrollInterval);
  if (pauseTimeout) clearTimeout(pauseTimeout);
});

definePageMeta({
  layout: 'clean'
});
</script>

<style scoped>
/* Smooth scrolling for the container */
.overflow-y-auto {
  scroll-behavior: smooth;
}
</style>
