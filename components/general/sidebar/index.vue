<template>
  <div
    class="flex flex-col h-full transition-all duration-300 bg-gradient-to-br from-blue-600 to-blue-800 dark:from-green-900 dark:to-blue-950"
  >
    <!-- Header -->
    <div
      class="flex items-center justify-between p-4 border-b border-blue-400/30 dark:border-blue-700/30"
    >
      <div class="flex items-center justify-center">
        <UIcon
          :name="`noto-v1:letter-${akronimInitial}`"
          class="text-white w-7 h-7"
          :class="{ 'mx-auto': isCollapsed }"
          v-if="isCollapsed"
        />
        <UTooltip :text="akronim">
          <h1
            class="ml-2 text-xl font-bold text-white transition-all duration-300 origin-left"
            :class="{ 'opacity-0 scale-0 w-0': isCollapsed }"
          >
            {{ akronim.length >= 14 ? akronim.slice(0, 14) + "..." : akronim }}
          </h1>
        </UTooltip>
      </div>

      <UButton
        color="white"
        variant="ghost"
        :icon="
          isCollapsed
            ? 'i-heroicons-chevron-right-20-solid'
            : 'i-heroicons-chevron-left-20-solid'
        "
        class="text-white lg:flex hover:bg-blue-500/20"
        @click="$emit('toggleCollapse')"
      />
    </div>

    <!-- Menu -->
    <div class="flex-1 px-3 py-4 overflow-y-auto">
      <ul class="space-y-2">
        <li
          v-for="(menu, index) in filteredMenus"
          :key="menu.name"
          class="group"
        >
          <!-- Menu with submenu -->
          <template v-if="menu.sub">
            <div class="relative">
              <!-- Main menu button with tooltip when collapsed -->
              <UTooltip text="" :disabled="!isCollapsed">
                <div>
                  <UButton
                    block
                    :color="
                      isActive(menu.path) || isSubMenuActive(menu) ? 'blue' : 'white'
                    "
                    :variant="
                      isActive(menu.path) || isSubMenuActive(menu) ? 'ghost' : 'ghost'
                    "
                    class="justify-between transition-all duration-300 hover:bg-blue-400/30 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
                    :class="[
                      { 'justify-center': isCollapsed },
                      isActive(menu.path) || isSubMenuActive(menu)
                        ? 'bg-blue-400/30 text-white font-medium shadow-md'
                        : 'text-white',
                    ]"
                    @click="selectMenu(menu)"
                  >
                    <div
                      class="flex items-center"
                      :class="{ 'justify-center': isCollapsed }"
                    >
                      <UIcon
                        :name="getIconName(menu.icon)"
                        class="w-5 h-5 transition-all duration-300"
                        :class="
                          isActive(menu.path) || isSubMenuActive(menu) ? 'text-white' : ''
                        "
                      />
                      <span
                        class="transition-all duration-300 origin-left ms-3 whitespace-nowrap"
                        :class="{
                          'opacity-0 scale-0 w-0 absolute': isCollapsed,
                        }"
                      >
                        {{ menu.name }}
                      </span>
                    </div>
                    <UIcon
                      v-if="!isCollapsed"
                      name="i-heroicons-chevron-down-20-solid"
                      class="w-4 h-4 transition-transform duration-300"
                      :class="{ 'rotate-180': menu.open }"
                    />
                  </UButton>
                </div>
              </UTooltip>
            </div>

            <!-- Submenu - Regular view when not collapsed -->
            <transition
              enter-active-class="transition duration-300 ease-out"
              enter-from-class="transform -translate-y-2 opacity-0"
              enter-to-class="transform translate-y-0 opacity-100"
              leave-active-class="transition duration-200 ease-in"
              leave-from-class="transform translate-y-0 opacity-100"
              leave-to-class="transform -translate-y-2 opacity-0"
            >
              <div
                v-show="menu.open && !isCollapsed"
                class="justify-start pt-2 pr-16 space-y-1"
              >
                <UButton
                  v-for="sub in menu.sub"
                  :key="sub.name"
                  block
                  :to="sub.path"
                  :color="isActive(sub.path) ? 'blue' : 'white'"
                  :variant="isActive(sub.path) ? 'ghost' : 'ghost'"
                  class="transition-all duration-300 hover:bg-blue-400/30 hover:translate-x-1 hover:shadow-md"
                  :class="
                    isActive(sub.path)
                      ? 'bg-blue-400/30 text-white font-medium shadow-md'
                      : 'text-white/90 hover:text-white'
                  "
                  @click="selectSubmenu(menu, sub)"
                >
                  <div class="flex items-center">
                    <UIcon
                      :name="getIconName(sub.icon)"
                      class="w-4 h-4 mr-2 transition-all duration-300"
                      :class="isActive(sub.path) ? 'text-white' : ''"
                    />
                    <span>{{ sub.name }}</span>
                  </div>
                </UButton>
              </div>
            </transition>

            <!-- Submenu - Icon-only view when collapsed -->
            <transition
              enter-active-class="transition duration-300 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-200 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <div
                v-show="isCollapsed && menu.open"
                class="flex flex-col items-center mt-2 space-y-2"
              >
                <UTooltip v-for="sub in menu.sub" :key="sub.name" text="">
                  <UButton
                    size="sm"
                    :to="sub.path"
                    :color="isActive(sub.path) ? 'blue' : 'white'"
                    :variant="isActive(sub.path) ? 'ghost' : 'ghost'"
                    class="flex items-center justify-center w-10 h-10 transition-all duration-300 rounded-full hover:bg-blue-400/30 hover:scale-110 hover:shadow-md"
                    :class="
                      isActive(sub.path)
                        ? 'bg-blue-400/30 text-white shadow-md'
                        : 'text-white'
                    "
                    @click="selectSubmenu(menu, sub)"
                  >
                    <UIcon
                      :name="getIconName(sub.icon)"
                      class="w-4 h-4 transition-all duration-300"
                      :class="isActive(sub.path) ? 'text-white' : ''"
                    />
                  </UButton>
                </UTooltip>
              </div>
            </transition>
          </template>

          <!-- Regular menu item -->
          <UTooltip v-else text="" :disabled="!isCollapsed">
            <UButton
              block
              :to="menu.path"
              :color="isActive(menu.path) ? 'blue' : 'white'"
              :variant="isActive(menu.path) ? 'ghost' : 'ghost'"
              class="transition-all duration-300 hover:bg-blue-400/30 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
              :class="[
                { 'justify-center': isCollapsed },
                isActive(menu.path)
                  ? 'bg-blue-400/30 text-white font-medium shadow-md'
                  : 'text-white',
              ]"
              @click="selectMenu(menu)"
            >
              <div class="flex items-center" :class="{ 'justify-center': isCollapsed }">
                <UIcon
                  :name="getIconName(menu.icon)"
                  class="w-5 h-5 transition-all duration-300"
                  :class="isActive(menu.path) ? 'text-white' : ''"
                />
                <span
                  class="transition-all duration-300 origin-left ms-3 whitespace-nowrap"
                  :class="{ 'opacity-0 scale-0 w-0 absolute': isCollapsed }"
                >
                  {{ menu.name }}
                </span>
              </div>
            </UButton>
          </UTooltip>
        </li>

        <!-- External link -->
        <li class="group">
          <UTooltip text="" :disabled="!isCollapsed">
            <UButton
              block
              color="white"
              variant="ghost"
              class="text-white transition-all duration-300 hover:bg-blue-400/30 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
              :class="{ 'justify-center': isCollapsed }"
              @click="openGuide"
            >
              <div class="flex items-center" :class="{ 'justify-center': isCollapsed }">
                <UIcon
                  name="i-heroicons-book-open-20-solid"
                  class="w-5 h-5 transition-all duration-300"
                />
                <span
                  class="transition-all duration-300 origin-left ms-3 whitespace-nowrap"
                  :class="{ 'opacity-0 scale-0 w-0 absolute': isCollapsed }"
                >
                  Buku Panduan
                </span>
              </div>
            </UButton>
          </UTooltip>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { useLoginStore } from "~/store/auth/login";

const props = defineProps({
  isCollapsed: {
    type: Boolean,
    default: false,
  },
});

const openGuide = () => {
  const guideUrl =
    "https://drive.google.com/file/d/1s1xN9k3zKs6L8JdyYpT0_vlvBD6ZQdvW/view";
  window.open(guideUrl, "_blank", "noopener,noreferrer");
};

const emit = defineEmits(["toggleCollapse", "menuChanged"]);

const route = useRoute();
const activeMenu = ref("");
const activeSubmenu = ref("");
const loginStore = useLoginStore();

const config = useRuntimeConfig();
const akronim = config.public.akronim || "Aptika";
const akronimInitial = akronim.charAt(0).toLowerCase();

// Menu data
const allMenus = ref([
  {
    name: "Beranda Utama",
    path: "/dashboard",
    icon: "mdi:home-variant",
  },
  {
    name: 'Pusat Informasi',
    icon: 'mdi:view-dashboard',
    path: '/',
    sub: [
      {
        name: 'Artikel',
        path: '/dashboard/article',
        icon: 'mdi:file-document',
      },
      { name: 'Analytic', path: '/dashboard/analytic', icon: 'mdi:chart-line' },
    ],
    open: false,
  },
  { name: "Konten", path: "/dashboard/konten", icon: "mdi:file-document" },
  { name: "Agenda", path: "/dashboard/agenda", icon: "mdi:calendar", excludeRole: "kontributor" },
  {
    name: 'Media',
    icon: 'mdi:folder-multiple',
    path: '/dashboard/media',
    sub: [
      { name: 'Galeri', path: '/dashboard/media/galeri', icon: 'mdi:image' },
      { name: 'Video', path: '/dashboard/media/video', icon: 'mdi:video' },
      {
        name: 'Slider',
        path: '/dashboard/media/slider',
        icon: 'mdi:view-carousel',
      },
    ],
    open: false,
  },
  { name: "Profil", path: "/dashboard/profil", icon: "mdi:account", excludeRole: "kontributor" },
  { name: "Layanan", path: "/dashboard/layanan", icon: "mdi:handshake" },
  { name: "Menu", path: "/dashboard/menu", icon: "material-symbols:checklist-rtl", excludeRole: "kontributor" },
  { name: "Page", path: "/dashboard/page", icon: "mdi:file" },
  { name: "Widget", path: "/dashboard/widget", icon: "mdi:widgets", excludeRole: "kontributor" },
  { name: "Permohonan", path: "/dashboard/permohonan", icon: "mdi:clipboard-text", excludeRole: "kontributor" },
  {
    name: "Survey Masyarakat",
    icon: "material-symbols:assignment",
    path: "/dashboard/survey-masyarakat",
    excludeRole: "kontributor",
    sub: [
      {
        name: "Soal",
        path: "/dashboard/survey-masyarakat/soal",
        icon: "mdi:checkbox-marked-circle",
      },
      {
        name: 'Jawaban',
        path: '/dashboard/survey-masyarakat/jawaban',
        icon: 'material-symbols:edit-square',
      },
    ],
    open: false,
  },
  // These items will be conditionally shown based on user role
  {
    name: 'User',
    path: '/dashboard/user',
    icon: 'material-symbols:account-box',
    requireRole: 'superadmin',
  },
  {
    name: 'Manajemen Role',
    icon: 'material-symbols:assignment',
    path: '/dashboard/manajemen-role',
    requireRole: 'superadmin',
    sub: [
      {
        name: 'Role',
        path: '/dashboard/manajemen-role/role',
        icon: 'material-symbols:stress-management',
      },
      {
        name: 'Apps',
        path: '/dashboard/manajemen-role/apps',
        icon: 'material-symbols:stress-management',
      },
      {
        name: 'User Role',
        path: '/dashboard/manajemen-role/user-role',
        icon: 'material-symbols:person-raised-hand',
      },
      {
        name: 'Token',
        path: '/dashboard/manajemen-role/token',
        icon: 'material-symbols:person-raised-hand',
      },
    ],
    open: false,
  },
]);

// Filter menus based on user role
const filteredMenus = computed(() => {
  const userRole = loginStore.getUsersData?.role;

  return allMenus.value.filter((menu) => {
    // If menu has excludeRole and user has that role, hide it
    if (menu.excludeRole && userRole === menu.excludeRole) return false;

    // If menu has no role requirement, show it to everyone
    if (!menu.requireRole) return true;

    // If menu requires superadmin role, only show it to superadmin
    if (menu.requireRole === "superadmin") {
      return userRole === "superadmin";
    }

    return true;
  });
});

// Convert Iconify icon names to Heroicons format for UIcon
const getIconName = (iconName) => {
  // Map common icons to Heroicons filled equivalents
  const iconMap = {
    "mdi:view-dashboard": "i-heroicons-squares-2x2-20-solid",
    "mdi:view-dashboard-outline": "i-heroicons-squares-2x2-20-solid",
    "mdi:file-document": "i-heroicons-document-text-20-solid",
    "mdi:file-document-outline": "i-heroicons-document-text-20-solid",
    "mdi:calendar": "i-heroicons-calendar-20-solid",
    "mdi:calendar-outline": "i-heroicons-calendar-20-solid",
    "mdi:folder-multiple": "i-heroicons-folder-20-solid",
    "mdi:folder-multiple-outline": "i-heroicons-folder-20-solid",
    "mdi:image": "i-heroicons-photo-20-solid",
    "mdi:image-outline": "i-heroicons-photo-20-solid",
    "mdi:video": "i-heroicons-film-20-solid",
    "mdi:video-outline": "i-heroicons-film-20-solid",
    "mdi:view-carousel": "i-heroicons-view-columns-20-solid",
    "mdi:view-carousel-outline": "i-heroicons-view-columns-20-solid",
    "mdi:account": "i-heroicons-user-20-solid",
    "mdi:account-outline": "i-heroicons-user-20-solid",
    "mdi:handshake": "i-heroicons-hand-raised-20-solid",
    "mdi:handshake-outline": "i-heroicons-hand-raised-20-solid",
    "material-symbols:checklist-rtl": "i-heroicons-clipboard-document-check-20-solid",
    "material-symbols:checklist-rtl-rounded":
      "i-heroicons-clipboard-document-check-20-solid",
    "mdi:file": "i-heroicons-document-20-solid",
    "mdi:file-outline": "i-heroicons-document-20-solid",
    "mdi:widgets": "i-heroicons-squares-plus-20-solid",
    "mdi:widgets-outline": "i-heroicons-squares-plus-20-solid",
    "mdi:clipboard-text": "i-heroicons-clipboard-document-list-20-solid",
    "mdi:clipboard-text-outline": "i-heroicons-clipboard-document-list-20-solid",
    "material-symbols:assignment": "i-heroicons-clipboard-20-solid",
    "material-symbols:assignment-outline-rounded": "i-heroicons-clipboard-20-solid",
    "mdi:chart-line": "i-heroicons-chart-bar-20-solid",
    "mdi:checkbox-marked-circle": "i-heroicons-check-circle-20-solid",
    "mdi:checkbox-marked-circle-outline": "i-heroicons-check-circle-20-solid",
    "material-symbols:edit-square": "i-heroicons-pencil-square-20-solid",
    "material-symbols:edit-square-outline-rounded": "i-heroicons-pencil-square-20-solid",
    "material-symbols:account-box": "i-heroicons-user-circle-20-solid",
    "material-symbols-light:account-box-outline": "i-heroicons-user-circle-20-solid",
    "material-symbols:stress-management": "i-heroicons-key-20-solid",
    "material-symbols-light:stress-management-outline": "i-heroicons-key-20-solid",
    "material-symbols:person-raised-hand": "i-heroicons-user-group-20-solid",
    "material-symbols-light:person-raised-hand-outline-rounded":
      "i-heroicons-user-group-20-solid",
  };

  return iconMap[iconName] || "i-heroicons-square-2-stack-20-solid";
};

// Fungsi untuk memilih menu
const selectMenu = (menu) => {
  // Jika menu tidak memiliki submenu, atur sebagai menu aktif
  if (!menu.sub) {
    activeMenu.value = menu.name;
    activeSubmenu.value = "";

    // Kirim nama menu ke parent component
    emit("menuChanged", menu.name);
  } else {
    // Jika menu memiliki submenu, toggle submenu
    menu.open = !menu.open;

    // Jika submenu dibuka, atur menu sebagai aktif
    if (menu.open) {
      activeMenu.value = menu.name;
      // Kirim nama menu ke parent component
      emit("menuChanged", menu.name);
    }
  }
};

// Fungsi untuk memilih submenu
const selectSubmenu = (menu, sub) => {
  activeMenu.value = menu.name;
  activeSubmenu.value = sub.name;

  // Kirim nama submenu ke parent component
  emit("menuChanged", sub.name);
};

// Cek apakah path aktif
const isActive = (path) => {
  if (!path) return false;
  return route.path === path;
};

// Cek apakah submenu aktif
const isSubMenuActive = (menu) => {
  if (!menu.sub) return false;
  return menu.sub.some((sub) => isActive(sub.path));
};

const currentPath = ref(route.path);

// Watch route changes untuk update menu aktif
watch(
  () => route.path,
  (newPath) => {
    currentPath.value = newPath;
  }
);

// Inisialisasi menu aktif berdasarkan route saat komponen dimuat
onMounted(() => {
  updateActiveMenuFromRoute(currentPath.value);
});

// Watch route changes untuk update menu aktif
watch(currentPath, (newPath) => {
  updateActiveMenuFromRoute(newPath);
});

// Fungsi untuk update menu aktif berdasarkan route
const updateActiveMenuFromRoute = (currentPath) => {
  // Reset semua menu open state
  allMenus.value.forEach((menu) => {
    if (menu.sub) {
      // Jika menu memiliki submenu, cek apakah salah satu submenu aktif
      const hasActiveSubmenu = menu.sub.some((sub) => sub.path === currentPath);

      if (hasActiveSubmenu) {
        // Jika submenu aktif, buka menu dan atur sebagai aktif
        menu.open = true;
        activeMenu.value = menu.name;

        // Cari submenu yang aktif
        const activeSub = menu.sub.find((sub) => sub.path === currentPath);
        if (activeSub) {
          activeSubmenu.value = activeSub.name;
          emit("menuChanged", activeSub.name);
        }
      } else if (menu.path === currentPath) {
        // Jika menu utama aktif
        menu.open = true;
        activeMenu.value = menu.name;
        activeSubmenu.value = "";
        emit("menuChanged", menu.name);
      } else {
        // Jika tidak aktif, tutup menu
        menu.open = false;
      }
    } else if (menu.path === currentPath) {
      // Menu tanpa submenu yang aktif
      activeMenu.value = menu.name;
      activeSubmenu.value = "";
      emit("menuChanged", menu.name);
    }
  });
};
</script>

<style scoped>
/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  @apply bg-blue-700/20;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  @apply bg-white/30 rounded-full;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  @apply bg-white/50;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

li {
  animation: fadeIn 0.4s ease-out;
}

li:nth-child(1) {
  animation-delay: 0.05s;
}
li:nth-child(2) {
  animation-delay: 0.1s;
}
li:nth-child(3) {
  animation-delay: 0.15s;
}
li:nth-child(4) {
  animation-delay: 0.2s;
}
li:nth-child(5) {
  animation-delay: 0.25s;
}
li:nth-child(6) {
  animation-delay: 0.3s;
}
li:nth-child(7) {
  animation-delay: 0.35s;
}
li:nth-child(8) {
  animation-delay: 0.4s;
}
li:nth-child(9) {
  animation-delay: 0.45s;
}
li:nth-child(10) {
  animation-delay: 0.5s;
}
li:nth-child(11) {
  animation-delay: 0.55s;
}
li:nth-child(12) {
  animation-delay: 0.6s;
}

/* Active item glow effect */
button[data-active='true'] {
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
}

/* Button hover effects */
button:hover {
  transform: translateY(-2px);
  transition: all 0.3s ease;
}

/* Submenu hover effect */
.submenu-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}

/* Pulse animation for active items */
@keyframes subtle-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.2);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(255, 255, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}

/* Apply pulse animation to active menu items */
.bg-blue-400\/30 {
  animation: subtle-pulse 2s infinite;
}
</style>
