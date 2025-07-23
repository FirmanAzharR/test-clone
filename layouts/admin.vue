<template>
  <div class="h-screen overflow-hidden">
    <div class="flex h-full">
      <!-- Sidebar -->
      <div class="relative">
        <!-- Invisible overlay for click handling in mobile -->
        <div 
          v-if="!isSidebarCollapsed && isMobile"
          class="fixed inset-0 z-10"
          @click="handleMainContentClick"
        ></div>
        
        <!-- Sidebar component -->
        <aside
          class="fixed top-0 left-0 z-30 h-full transition-all duration-300 shadow-lg"
          :class="{
            'w-64': !isSidebarCollapsed,
            'w-20': isSidebarCollapsed,
            '-translate-x-full': isSidebarCollapsed && isMobile,
            'translate-x-0': !isSidebarCollapsed || !isMobile
          }"
        >
          <Sidebar 
            :is-collapsed="isSidebarCollapsed"
            @toggle-collapse="toggleSidebar"
            @menu-changed="handleMenuChange"
          />
        </aside>
      </div>

      <!-- Main Content Area -->
      <div 
        class="flex-1 flex flex-col w-full h-screen max-h-screen transition-all duration-300"
        :class="{
          'ml-64': !isSidebarCollapsed && !isMobile,
          'ml-20': isSidebarCollapsed && !isMobile,
          'ml-0': isMobile
        }"
      >
        <!-- Fixed Header Area -->
        <div class="flex-shrink-0">
          <div 
            class="sticky top-0 z-20 w-full border-b"
          >
            <Navbar 
              :is-sidebar-collapsed="isSidebarCollapsed"
              :active-menu-name="activeMenuName"
              @toggle-sidebar="toggleSidebar"
            />
          </div>
        </div>

        <!-- Scrollable Content Area -->
        <div class="flex-1 min-h-0 relative overflow-hidden">
          <div class="absolute inset-0 overflow-y-auto overflow-x-hidden">
            <!-- Content Wrapper -->
            <div class="p-4">
              <NuxtPage />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, provide, onMounted, onUnmounted } from 'vue';
import Sidebar from '@/components/general/sidebar/index.vue';
import Navbar from '@/components/general/sidebar/navbar.vue';
import { useLoginStore } from '~/store/auth/login';

const loginStore = useLoginStore();
const isSidebarCollapsed = ref(false);
const isMobile = ref(false);
const activeMenuName = ref('');

// Handle menu change from sidebar
const handleMenuChange = (menuName) => {
  activeMenuName.value = menuName;
};

// Toggle sidebar
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

// Check screen size and update isMobile
const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768; // md breakpoint in Tailwind (768px)
  // Auto-collapse sidebar on mobile
  if (isMobile.value) {
    isSidebarCollapsed.value = true;
  }
};

// Handle click on main content to close sidebar in mobile view
const handleMainContentClick = () => {
  if (isMobile.value && !isSidebarCollapsed.value) {
    isSidebarCollapsed.value = true;
  }
};

// Set up resize listener
onMounted(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
  loginStore.getUsers();
});

// Clean up
onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize);
});

provide('sidebarCollapsed', isSidebarCollapsed);

provide('activeMenuName', activeMenuName);

onMounted(async()=> {
  loginStore.getUsers()
})
</script>

<style>
/* Custom scrollbar styling */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  @apply bg-slate-100 dark:bg-slate-800;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  @apply bg-slate-300 dark:bg-slate-600 rounded-full;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  @apply bg-slate-400 dark:bg-slate-500;
}

/* Ensure smooth scrolling */
html {
  scroll-behavior: smooth;
}
</style>