<template>
  <div :class="{ dark: isDarkMode }" class="flex flex-col">
    <UCard
      class="transition-all duration-300 border-0 rounded-none shadow-sm"
      :ui="{
        base: 'bg-white dark:bg-slate-800',
        body: {
          base: 'p-0'
        }
      }"
    >
      <div class="flex items-center justify-between p-3">
        <div class="flex items-center space-x-4 overflow-hidden">
          <!-- Hamburger Menu - Only visible on mobile (md and below) -->
          <UButton
            @click="toggleSidebar"
            color="gray"
            variant="ghost"
            class="block shrink-0 md:hidden"
          >
            <UIcon 
              name="i-heroicons-bars-3" 
              class="w-6 h-6 transition-all duration-300" 
            />
          </UButton>

          <!-- Dynamic Page Title with text truncation -->
          <div class="flex items-center min-w-0">
            <h1 class="text-base font-bold truncate text-slate-800 dark:text-white">
              <span class="hidden md:inline">Dashboard</span>
              <span class="inline md:hidden">...</span>
            </h1>
            <UIcon 
              name="i-heroicons-chevron-right" 
              class="flex-shrink-0 w-4 h-4 mx-1 text-slate-400 dark:text-slate-500"
              v-if="activeMenuName"
            />
            <h1 
              v-if="activeMenuName"
              class="text-base font-medium text-blue-600 truncate transition-all duration-300 dark:text-blue-500"
            >
              {{ activeMenuName }}
            </h1>
          </div>
        </div>

        <!-- Right Side Icons with flex-shrink-0 to prevent compression -->
        <div class="flex items-center flex-shrink-0 space-x-2 sm:space-x-4">

          <!-- Simple Toggle Dark Mode Button -->
          <UButton
            @click="toggleDarkMode"
            color="gray"
            variant="ghost"
            class="relative"
          >
            <div class="relative">
              <UIcon 
                name="i-heroicons-sun" 
                class="w-5 h-5 transition-all duration-500"
                v-if="layoutStore.theme == 'dark'"
              />
              <UIcon 
                name="i-heroicons-moon" 
                class="w-5 h-5 transition-all duration-500"
                v-else
              />
            </div>
          </UButton>

          <!-- Profile Dropdown -->
          <UDropdown :items="profileItems" :popper="{ placement: 'bottom-end' }">
            <UButton
              color="gray"
              variant="ghost"
              class="flex items-center space-x-2"
            >
              <UAvatar
                :alt="loginStore.getUsersData?.role"
                size="xs"
                class="uppercase"
              />
              <span class="hidden text-sm font-medium uppercase sm:inline"> {{ loginStore.getUsersData?.role }}</span>
              <UIcon name="i-heroicons-chevron-down" class="w-4 h-4 transition-transform duration-200" />
            </UButton>
          </UDropdown>
        </div>
      </div>
    </UCard>
  <ModalLogout v-model="showLogoutModal" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useLoginStore } from '~/store/auth/login';
import ModalLogout from './modalLogout.vue';
import { useLayout } from '~/store/layouts/layouts';


const props = defineProps({
  isSidebarCollapsed: {
    type: Boolean,
    default: false
  },
  // Prop untuk menerima nama menu aktif
  activeMenuName: {
    type: String,
    default: ''
  }
});

const loginStore = useLoginStore()
const emit = defineEmits(['toggleSidebar']);
const layoutStore = useLayout();
const isDarkMode = ref(false);
const unreadNotifications = ref(3);
const showLogoutModal = ref(false);

// Toggle sidebar with animation
const toggleSidebar = () => {
  emit('toggleSidebar');
};

// Toggle dark mode with animation
const toggleDarkMode = () => {
  layoutStore.themeSwitch();
};

// Profile dropdown items
const profileItems = [
  [
    {
      label: 'Keluar',
      icon: 'i-heroicons-arrow-right-on-rectangle',
      click: () => {
        showLogoutModal.value = true;
      }
    }
  ]
];
</script>

<style scoped>
/* Add a subtle pulse animation for notifications */
@keyframes subtle-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.animate-pulse {
  animation: subtle-pulse 2s infinite;
}
</style>