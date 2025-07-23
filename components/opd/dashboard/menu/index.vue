<template>
  <div class="p-4 dark:text-slate-100">
    <!-- Fixed notification with working close button -->
    <UNotification
      v-model="showReminder"
      icon="material-symbols:notifications-active-outline-rounded"
      color="blue"
      variant="solid"
      title="Reminder!"
      description="Setiap kali melakukan perubahan, wajib klik Simpan!."
      :timeout="0"
      close-button
    />
    <UCard>
      <div class="pt-2 space-y-1">
        <!-- Using the DraggableMenus component with sorted items -->
        <DraggableMenus 
          :items="sortedMenuItems" 
          :visibleSubmenus="visibleSubmenus" 
          :submenuCache="submenuCache"
          @update-menu="handleMenuUpdate"
          @drag-end="handleDragEnd"
          @submenu-drag-end="handleSubmenuDragEnd"
          @submenu2-drag-end="handleSubmenu2DragEnd"
          @submenu3-drag-end="handleSubmenu3DragEnd"
          @toggle-submenu="toggleSubmenu"
          @edit-menu="openEditModal"
          @edit-submenu="openEditSubmenuModal"
          @edit-submenu2="openEditSubmenu2Modal"
          @edit-submenu3="openEditSubmenu3Modal"
          @add-submenu="openAddSubmenuModal"
          @add-submenu2="openAddSubmenu2Modal"
          @add-submenu3="openAddSubmenu3Modal"
          @delete-menu="handleDelete"
          @delete-submenu="handleDeleteSubmenu"
          @delete-submenu2="handleDeleteSubmenu2"
          @delete-submenu3="handleDeleteSubmenu3"
        />
      </div>
      <UButton class="flex items-center justify-center w-full" size="md" variant="outline" @click="openAddModal" color="blue" icon="material-symbols:add-2-rounded">Tambah Menu</UButton>
      <div class="flex justify-between mt-4">
        <ModalHowTo/>
        <div class="flex gap-2">
          <UButton 
            class="flex items-end justify-end" 
            size="md" 
            variant="outline" 
            color="gray" 
            icon="heroicons:arrow-path" 
            @click="resetMenuChanges"
            :disabled="!hasChanges"
          >
            Reset
          </UButton>
          <UButton 
            class="flex items-end justify-end" 
            size="md" 
            variant="solid" 
            color="blue" 
            icon="material-symbols:save-outline" 
            @click="handleSaveMenuButton"
            :loading="isSaving"
          >
            Simpan
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
  
  <!-- Modals -->
  <ModalAddEditMenu 
    :isOpen="isModalOpen" 
    :mode="modalMode" 
    :detailData="selectedDetail" 
    :isSubmenu="isSubmenu" 
    :parentMenuId="parentMenuId" 
    @close="isModalOpen = false" 
    @submit="handleMenuSubmit"
  />
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { useMenuStore } from '~/store/menu/menu';
import ModalAddEditMenu from './ModalAddEditMenu.vue';
import ModalDelete from '~/components/global/modal/delete.vue';
import { useLayout } from '~/store/layouts/layouts';
import DraggableMenus from './DraggableMenus.vue';
import ModalHowTo from './ModalHowTo.vue';

const menuStore = useMenuStore();
const visibleSubmenus = ref({});
const isModalOpen = ref(false);
const selectedDetail = ref({});
const layoutStore = useLayout();
const modalMode = ref('add');
const isSubmenu = ref(false);
const parentMenuId = ref(null);
const toast = useToast();
const showDragTip = ref(false);
const showReminder = ref(true); // For the notification control
const isSaving = ref(false);
const hasChanges = ref(false);

// Store the original menu data for reset functionality
const originalMenuData = ref([]);
const originalSubmenuCache = ref({});

// Cache for submenu arrays to avoid repeated parsing
const submenuCache = ref({});

// Function to check if a menu has submenu items
const hasSubmenu = (element) => {
  if (!element || !element.id) return false;
  const submenus = getSubmenuArray(element);
  return submenus.length > 0;
};

// Function to create a deep copy of an object
const deepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Function to save the original state of the menu
const saveOriginalState = () => {
  // Deep copy the menu data
  originalMenuData.value = deepCopy(menuStore.dataAllMenu);
  
  // Deep copy the submenu cache for all levels
  originalSubmenuCache.value = {};
  for (const key in submenuCache.value) {
    originalSubmenuCache.value[key] = deepCopy(submenuCache.value[key]);
  }
  
  console.log("Original state saved:", originalMenuData.value.length, "menu items");
  
  // Reset the hasChanges flag
  hasChanges.value = false;
};

// Watch for changes to submenuCache and update the parent menu's submenu property
watch(submenuCache, (newVal, oldVal) => {
  // Process regular menu items (level 1 submenus)
  for (const menuId in newVal) {
    // Skip sub2_ and sub3_ prefixed keys as they're handled differently
    if (menuId.startsWith('sub2_') || menuId.startsWith('sub3_')) continue;
    
    const menu = menuStore.dataAllMenu.find(item => item.id === menuId);
    if (menu) {
      // Update the menu's submenu property with the stringified cache value
      menu.submenu = JSON.stringify(newVal[menuId]);
    }
  }
  
  // Process level 2 submenus
  for (const key in newVal) {
    if (key.startsWith('sub2_')) {
      const parentId = key.replace('sub2_', '');
      
      // Find the parent submenu in any main menu
      menuStore.dataAllMenu.forEach(menu => {
        const submenus = getSubmenuArray(menu);
        const parentSubmenu = submenus.find(sub => sub.id == parentId);
        
        if (parentSubmenu) {
          // Update the submenu property
          parentSubmenu.submenu = JSON.stringify(newVal[key]);
          submenuCache.value[menu.id] = submenus;
        }
      });
    }
  }
  
  // Process level 3 submenus
  for (const key in newVal) {
    if (key.startsWith('sub3_')) {
      const parentId = key.replace('sub3_', '');
      
      // Find the parent submenu in any level 2 submenu
      menuStore.dataAllMenu.forEach(menu => {
        const submenus = getSubmenuArray(menu);
        
        submenus.forEach(submenu => {
          const submenus2 = getSubmenu2Array(submenu);
          const parentSubmenu2 = submenus2.find(sub => sub.id == parentId);
          
          if (parentSubmenu2) {
            // Update the submenu property
            parentSubmenu2.submenu = JSON.stringify(newVal[key]);
            submenuCache.value[`sub2_${submenu.id}`] = submenus2;
          }
        });
      });
    }
  }
  
  // Mark that we have changes to save
  if (Object.keys(originalSubmenuCache.value).length > 0) {
    hasChanges.value = true;
  }
}, { deep: true });

// Handle menu updates from DraggableMenus component
const handleMenuUpdate = (updatedMenus) => {
  console.log('Menu updated:', updatedMenus);
  hasChanges.value = true;
};

// Handle drag end from the main menu
const handleDragEnd = (menuItems) => {
  console.log('Menu drag ended:', menuItems);
  
  // Update each menu's order
  menuItems.forEach((item, index) => {
    item.urutan = index;
  });
  
  // Force a re-render to ensure the UI reflects the new order
  nextTick(() => {
    menuStore.dataAllMenu = [...menuStore.dataAllMenu];
    
    toast.add({
      title: "Urutan menu berhasil diubah",
      color: "blue",
      timeout: 2000
    });
  });
  
  hasChanges.value = true;
};

// Handle submenu drag end (level 1)
const handleSubmenuDragEnd = (parentElement, submenus) => {
  console.log('Submenu drag ended:', submenus, 'Parent:', parentElement.id);
  
  // Update the cache
  submenuCache.value[parentElement.id] = submenus;
  
  // Update the parent's submenu JSON
  parentElement.submenu = JSON.stringify(submenus);
  
  toast.add({
    title: "Urutan submenu berhasil diubah",
    color: "blue",
    timeout: 2000
  });
  
  hasChanges.value = true;
};

// Handle submenu level 2 drag end
const handleSubmenu2DragEnd = (parentSubmenu, submenus, grandparentItem) => {
  console.log('Submenu level 2 drag ended:', submenus, 'Parent:', parentSubmenu.id, 'Grandparent:', grandparentItem.id);
  
  // Update the cache
  submenuCache.value[`sub2_${parentSubmenu.id}`] = submenus;
  
  // Update the parent's submenu JSON
  parentSubmenu.submenu = JSON.stringify(submenus);
  
  // Make sure the grandparent's submenu array is updated to include this change
  const grandparentSubmenus = getSubmenuArray(grandparentItem);
  const parentIndex = grandparentSubmenus.findIndex(item => item.id === parentSubmenu.id);
  if (parentIndex !== -1) {
    grandparentSubmenus[parentIndex] = parentSubmenu;
    submenuCache.value[grandparentItem.id] = grandparentSubmenus;
    grandparentItem.submenu = JSON.stringify(grandparentSubmenus);
  }
  
  toast.add({
    title: "Urutan submenu level 2 berhasil diubah",
    color: "blue",
    timeout: 2000
  });
  
  hasChanges.value = true;
};

// Handle submenu level 3 drag end
const handleSubmenu3DragEnd = (parentSubmenu2, submenus, grandparentSubmenu, greatGrandparentItem) => {
  console.log('Submenu level 3 drag ended:', submenus, 'Parent:', parentSubmenu2.id, 
    'Grandparent:', grandparentSubmenu.id, 'GreatGrandparent:', greatGrandparentItem.id);
  
  // Update the cache
  submenuCache.value[`sub3_${parentSubmenu2.id}`] = submenus;
  
  // Update the parent's submenu JSON
  parentSubmenu2.submenu = JSON.stringify(submenus);
  
  // Update the grandparent's submenu array
  const grandparentSubmenus = getSubmenu2Array(grandparentSubmenu);
  const parentIndex = grandparentSubmenus.findIndex(item => item.id === parentSubmenu2.id);
  if (parentIndex !== -1) {
    grandparentSubmenus[parentIndex] = parentSubmenu2;
    submenuCache.value[`sub2_${grandparentSubmenu.id}`] = grandparentSubmenus;
    grandparentSubmenu.submenu = JSON.stringify(grandparentSubmenus);
  }
  
  // Update the great grandparent's submenu array
  const greatGrandparentSubmenus = getSubmenuArray(greatGrandparentItem);
  const grandparentIndex = greatGrandparentSubmenus.findIndex(item => item.id === grandparentSubmenu.id);
  if (grandparentIndex !== -1) {
    greatGrandparentSubmenus[grandparentIndex] = grandparentSubmenu;
    submenuCache.value[greatGrandparentItem.id] = greatGrandparentSubmenus;
    greatGrandparentItem.submenu = JSON.stringify(greatGrandparentSubmenus);
  }
  
  toast.add({
    title: "Urutan submenu level 3 berhasil diubah",
    color: "blue",
    timeout: 2000
  });
  
  hasChanges.value = true;
};

// Reset menu changes by refreshing from the API
const resetMenuChanges = async () => {
  layoutStore.setLoading(true);
  
  try {
    // Refresh data from API
    await menuStore.getAllMenuDataAdmin();
    
    // Clear and rebuild submenu cache
    submenuCache.value = {};
    
    // Process submenu cache for all levels
    menuStore.dataAllMenu.forEach(menu => {
      // Level 1 submenus
      const submenus = parseSubmenu(menu.submenu);
      submenuCache.value[menu.id] = submenus;
      
      // Process level 2 submenus
      submenus.forEach(submenu => {
        const submenus2 = parseSubmenu(submenu.submenu);
        submenuCache.value[`sub2_${submenu.id}`] = submenus2;
        
        // Process level 3 submenus
        submenus2.forEach(submenu2 => {
          const submenus3 = parseSubmenu(submenu2.submenu);
          submenuCache.value[`sub3_${submenu2.id}`] = submenus3;
        });
      });
    });
    
    // Reset submenus visibility
    visibleSubmenus.value = {};
    menuStore.dataAllMenu.forEach(menu => {
      visibleSubmenus.value[menu.id] = false;
    });
    
    // Update original state for comparison purposes
    saveOriginalState();
    
    toast.add({
      title: "Data menu diambil ulang dari server",
      color: "blue",
      timeout: 2000
    });
    
    hasChanges.value = false;
  } catch (error) {
    console.error("Failed to reset menu data:", error);
    toast.add({
      title: "Gagal mengambil ulang data menu",
      color: "red",
      timeout: 2000
    });
  } finally {
    layoutStore.setLoading(false);
  }
};

// Convert a submenu item to a main menu item
const convertSubmenuToMenu = (submenuItem) => {
  // First, remove the submenu from its parent to prevent duplication
  removeSubmenuFromParent(submenuItem.id);
  
  // Create a new menu item from the submenu
  const newMenuItem = {
    ...submenuItem,
    isSubmenu: false,
    submenu: JSON.stringify([]) // Initialize with empty submenu array
  };
  
  // Update the item in the main menu array
  const index = menuStore.dataAllMenu.findIndex(item => item.id === submenuItem.id);
  if (index !== -1) {
    menuStore.dataAllMenu[index] = newMenuItem;
  } else {
    // If not found, add it as a new menu item
    menuStore.dataAllMenu.push(newMenuItem);
  }
  
  // Force a re-render to ensure the UI reflects the change
  nextTick(() => {
    menuStore.dataAllMenu = [...menuStore.dataAllMenu];
  });
  
  toast.add({
    title: `"${submenuItem.title}" diubah menjadi menu utama`,
    color: "blue"
  });
  
  hasChanges.value = true;
};

// Remove a submenu from its parent
const removeSubmenuFromParent = (submenuId) => {
  let removed = false;
  
  menuStore.dataAllMenu.forEach(menu => {
    const submenus = getSubmenuArray(menu);
    const index = submenus.findIndex(sub => sub.id === submenuId);
    if (index !== -1) {
      submenus.splice(index, 1);
      submenuCache.value[menu.id] = submenus;
      menu.submenu = JSON.stringify(submenus);
      removed = true;
    }
  });
  
  return removed;
};

// Handle deletion of a submenu item (level 1)
const handleDeleteSubmenu = (submenuId, parentId) => {
  const parentMenu = menuStore.dataAllMenu.find(item => item.id === parentId);
  if (parentMenu) {
    // Get the current submenu array
    const submenus = getSubmenuArray(parentMenu);
    
    // Find and remove the item
    const index = submenus.findIndex(sub => sub.id === submenuId);
    if (index !== -1) {
      // Store the name for the toast message
      const itemTitle = submenus[index].title;
      
      // Remove the item
      submenus.splice(index, 1);
      
      // Update the cache
      submenuCache.value[parentMenu.id] = submenus;
      
      // Update the parent menu's submenu property
      parentMenu.submenu = JSON.stringify(submenus);
      
      // Show toast
      toast.add({
        title: `"${itemTitle}" telah dihapus`,
        color: "blue",
        timeout: 2000
      });
      
      hasChanges.value = true;
    }
  }
};

// Handle deletion of a submenu level 2 item
const handleDeleteSubmenu2 = (submenu2Id, parentId, grandparentId) => {
  const grandparentMenu = menuStore.dataAllMenu.find(item => item.id === grandparentId);
  if (grandparentMenu) {
    const parentSubmenus = getSubmenuArray(grandparentMenu);
    const parentSubmenu = parentSubmenus.find(sub => sub.id === parentId);
    
    if (parentSubmenu) {
      // Get the current level 2 submenu array
      const submenus2 = getSubmenu2Array(parentSubmenu);
      
      // Find and remove the item
      const index = submenus2.findIndex(sub => sub.id === submenu2Id);
      if (index !== -1) {
        // Store the name for the toast message
        const itemTitle = submenus2[index].title;
        
        // Remove the item
        submenus2.splice(index, 1);
        
        // Update the cache
        submenuCache.value[`sub2_${parentId}`] = submenus2;
        
        // Update the parent submenu's submenu property
        parentSubmenu.submenu = JSON.stringify(submenus2);
        
        // Update the grandparent's submenu array
        submenuCache.value[grandparentId] = parentSubmenus;
        grandparentMenu.submenu = JSON.stringify(parentSubmenus);
        
        // Show toast
        toast.add({
          title: `"${itemTitle}" level 2 telah dihapus`,
          color: "blue",
          timeout: 2000
        });
        
        hasChanges.value = true;
      }
    }
  }
};

// Handle deletion of a submenu level 3 item
const handleDeleteSubmenu3 = (submenu3Id, parentId, grandparentId, greatGrandparentId) => {
  const greatGrandparentMenu = menuStore.dataAllMenu.find(item => item.id === greatGrandparentId);
  if (greatGrandparentMenu) {
    const grandparentSubmenus = getSubmenuArray(greatGrandparentMenu);
    const grandparentSubmenu = grandparentSubmenus.find(sub => sub.id === grandparentId);
    
    if (grandparentSubmenu) {
      const parentSubmenus2 = getSubmenu2Array(grandparentSubmenu);
      const parentSubmenu2 = parentSubmenus2.find(sub => sub.id === parentId);
      
      if (parentSubmenu2) {
        // Get the current level 3 submenu array
        const submenus3 = getSubmenu3Array(parentSubmenu2);
        
        // Find and remove the item
        const index = submenus3.findIndex(sub => sub.id === submenu3Id);
        if (index !== -1) {
          // Store the name for the toast message
          const itemTitle = submenus3[index].title;
          
          // Remove the item
          submenus3.splice(index, 1);
          
          // Update the cache
          submenuCache.value[`sub3_${parentId}`] = submenus3;
          
          // Update the parent submenu's submenu property
          parentSubmenu2.submenu = JSON.stringify(submenus3);
          
          // Update the grandparent's submenu array
          submenuCache.value[`sub2_${grandparentId}`] = parentSubmenus2;
          grandparentSubmenu.submenu = JSON.stringify(parentSubmenus2);
          
          // Update the great grandparent's submenu array
          submenuCache.value[greatGrandparentId] = grandparentSubmenus;
          greatGrandparentMenu.submenu = JSON.stringify(grandparentSubmenus);
          
          // Show toast
          toast.add({
            title: `"${itemTitle}" level 3 telah dihapus`,
            color: "blue",
            timeout: 2000
          });
          
          hasChanges.value = true;
        }
      }
    }
  }
};

const openAddModal = () => {
  isModalOpen.value = true;
  modalMode.value = 'add';
  isSubmenu.value = false;
  parentMenuId.value = null;
  selectedDetail.value = {};
};

// Add level 1 submenu
const openAddSubmenuModal = (parentId) => {
  isModalOpen.value = true;
  modalMode.value = 'add';
  isSubmenu.value = true;
  parentMenuId.value = parentId;
  selectedDetail.value = {};
};

// Add level 2 submenu
const openAddSubmenu2Modal = (parentId, grandparentId) => {
  isModalOpen.value = true;
  modalMode.value = 'add';
  isSubmenu.value = true;
  // Store both parent and grandparent IDs in a structured format
  parentMenuId.value = { 
    parentId: parentId,
    grandparentId: grandparentId,
    level: 2 
  };
  selectedDetail.value = {};
};

// Add level 3 submenu
const openAddSubmenu3Modal = (parentId, grandparentId, greatGrandparentId) => {
  isModalOpen.value = true;
  modalMode.value = 'add';
  isSubmenu.value = true;
  // Store all ancestor IDs in a structured format
  parentMenuId.value = { 
    parentId: parentId,
    grandparentId: grandparentId,
    greatGrandparentId: greatGrandparentId,
    level: 3 
  };
  selectedDetail.value = {};
};

// Edit level 1 submenu
const openEditSubmenuModal = (element, parentId) => {
  selectedDetail.value = element;
  modalMode.value = 'edit';
  isModalOpen.value = true;
  isSubmenu.value = true;
  parentMenuId.value = parentId;
};

// Edit level 2 submenu
const openEditSubmenu2Modal = (element, parentId, grandparentId) => {
  selectedDetail.value = element;
  modalMode.value = 'edit';
  isModalOpen.value = true;
  isSubmenu.value = true;
  // Store both parent and grandparent IDs in a structured format
  parentMenuId.value = { 
    parentId: parentId,
    grandparentId: grandparentId,
    level: 2 
  };
};

// Edit level 3 submenu
const openEditSubmenu3Modal = (element, parentId, grandparentId, greatGrandparentId) => {
  selectedDetail.value = element;
  modalMode.value = 'edit';
  isModalOpen.value = true;
  isSubmenu.value = true;
  // Store all ancestor IDs in a structured format
  parentMenuId.value = { 
    parentId: parentId,
    grandparentId: grandparentId,
    greatGrandparentId: greatGrandparentId,
    level: 3 
  };
};

const openEditModal = (element) => {
  selectedDetail.value = element;
  modalMode.value = 'edit';
  isModalOpen.value = true;
  isSubmenu.value = false;
  parentMenuId.value = null;
};

const parseSubmenu = (submenu) => {
  try {
    if (Array.isArray(submenu)) {
      return submenu;
    }
    return JSON.parse(submenu);
  } catch (e) {
    console.error("Failed to parse submenu JSON:", e);
    return [];
  }
};

// Get submenu array for a menu element
const getSubmenuArray = (element) => {
  if (!element || !element.id) return [];
  
  // Check if we have a cached version
  if (submenuCache.value[element.id]) {
    return submenuCache.value[element.id];
  }
  
  // Parse and cache the submenu
  const parsedSubmenu = parseSubmenu(element.submenu);
  submenuCache.value[element.id] = parsedSubmenu;
  return parsedSubmenu;
};

// Get level 2 submenu array
const getSubmenu2Array = (element) => {
  if (!element || !element.id) return [];
  
  // Check if we have a cached version
  if (submenuCache.value[`sub2_${element.id}`]) {
    return submenuCache.value[`sub2_${element.id}`];
  }
  
  // Parse and cache the submenu
  const parsedSubmenu = parseSubmenu(element.submenu);
  submenuCache.value[`sub2_${element.id}`] = parsedSubmenu;
  return parsedSubmenu;
};

// Get level 3 submenu array
const getSubmenu3Array = (element) => {
  if (!element || !element.id) return [];
  
  // Check if we have a cached version
  if (submenuCache.value[`sub3_${element.id}`]) {
    return submenuCache.value[`sub3_${element.id}`];
  }
  
  // Parse and cache the submenu
  const parsedSubmenu = parseSubmenu(element.submenu);
  submenuCache.value[`sub3_${element.id}`] = parsedSubmenu;
  return parsedSubmenu;
};

const toggleSubmenu = (id) => {
  visibleSubmenus.value[id] = !visibleSubmenus.value[id];
};

const handleSaveMenuButton = async () => {
  layoutStore.setLoading(true);
  isSaving.value = true;
  try {
    // Get the current menu data to save
    const menuDataToSave = deepCopy(menuStore.dataAllMenu);

    // Compare original menu IDs with current menu IDs to identify deleted items
    const originalMenuIds = originalMenuData.value.map(menu => menu.id);
    const currentMenuIds = menuDataToSave.map(menu => menu.id);
    const deletedMenuIds = originalMenuIds.filter(id => !currentMenuIds.includes(id));
    
    // Process each menu item and update its submenu JSON
    menuDataToSave.forEach(menu => {
      // Level 1 submenus
      if (submenuCache.value[menu.id]) {
        const submenus = deepCopy(submenuCache.value[menu.id]);
        
        // Process each level 1 submenu
        submenus.forEach(submenu => {
          // Level 2 submenus
          if (submenuCache.value[`sub2_${submenu.id}`]) {
            const submenus2 = deepCopy(submenuCache.value[`sub2_${submenu.id}`]);
            
            // Process each level 2 submenu
            submenus2.forEach(submenu2 => {
              // Level 3 submenus
              if (submenuCache.value[`sub3_${submenu2.id}`]) {
                const submenus3 = deepCopy(submenuCache.value[`sub3_${submenu2.id}`]);
                submenu2.submenu = JSON.stringify(submenus3);
              }
            });
            
            submenu.submenu = JSON.stringify(submenus2);
          }
        });
        
        // Update the menu's submenu property
        menu.submenu = JSON.stringify(submenus);
      }
    });

    // First, delete only the menus that were actually removed
    for (const id of deletedMenuIds) {
      await menuStore.deleteMenuAdmin(id);
    }

    // Find new menu items (ones not in original state)
    const newMenuIds = currentMenuIds.filter(id => !originalMenuIds.includes(id));
    
    // Update or add menu items
    for (const menu of menuDataToSave) {
      if (newMenuIds.includes(menu.id)) {
        // This is a new menu, add it
        await menuStore.addMenuAdmin(menu);
      } else if (originalMenuIds.includes(menu.id)) {
        // This is an existing menu that might have changes, update it
        await menuStore.deleteMenuAdmin(menu.id); // Delete old version
        await menuStore.addMenuAdmin(menu); // Add updated version
      }
    }
    
    // Refresh data from API
    await menuStore.getAllMenuDataAdmin();
    
    // Process submenu cache for all levels
    submenuCache.value = {};
    menuStore.dataAllMenu.forEach(menu => {
      // Level 1 submenus
      const submenus = parseSubmenu(menu.submenu);
      submenuCache.value[menu.id] = submenus;
      
      // Process level 2 submenus
      submenus.forEach(submenu => {
        const submenus2 = parseSubmenu(submenu.submenu);
        submenuCache.value[`sub2_${submenu.id}`] = submenus2;
        
        // Process level 3 submenus
        submenus2.forEach(submenu2 => {
          const submenus3 = parseSubmenu(submenu2.submenu);
          submenuCache.value[`sub3_${submenu2.id}`] = submenus3;
        });
      });
    });

    toast.add({ 
      title: "Menu berhasil disimpan!",
      color: "green" 
    });
    
    // After successful save, update the original state
    saveOriginalState();
    
    // Log the state for debugging
    console.log("Menu items saved. Current count:", menuStore.dataAllMenu.length);
  } catch (e) {
    toast.add({ 
      title: "Gagal menyimpan menu!", 
      color: "red"
    });
    console.error("Failed to save menu data:", e);
  } finally {
    layoutStore.setLoading(false);
    isSaving.value = false;
  }
};

const handleMenuSubmit = (menu, isSubmenuItem, parentMenuId) => {
  if (modalMode.value === 'add') {
    if (isSubmenuItem) {
      // Handle submenu operations based on level
      if (typeof parentMenuId === 'object') {
        // Level 2 or 3 submenu
        if (parentMenuId.level === 2) {
          // Level 2 submenu - Add to a level 1 submenu
          const grandparentMenu = menuStore.dataAllMenu.find(item => item.id === parentMenuId.grandparentId);
          if (grandparentMenu) {
            const parentSubmenus = getSubmenuArray(grandparentMenu);
            const parentSubmenu = parentSubmenus.find(sub => sub.id === parentMenuId.parentId);
            
            if (parentSubmenu) {
              // Get the current level 2 submenu array
              const submenus2 = getSubmenu2Array(parentSubmenu);
              
              // Initialize new submenu with empty submenu array
              menu.submenu = JSON.stringify([]);
              
              // Add the new item
              submenus2.push(menu);
              
              // Update the cache
              submenuCache.value[`sub2_${parentSubmenu.id}`] = submenus2;
              
              // Update the parent submenu's submenu property
              parentSubmenu.submenu = JSON.stringify(submenus2);
              
              // Update the grandparent's submenu array
              submenuCache.value[grandparentMenu.id] = parentSubmenus;
              grandparentMenu.submenu = JSON.stringify(parentSubmenus);
              
              toast.add({
                title: `Submenu level 2 "${menu.title}" berhasil ditambahkan`,
                color: "green",
                timeout: 2000
              });
            }
          }
        } else if (parentMenuId.level === 3) {
          // Level 3 submenu - Add to a level 2 submenu
          const greatGrandparentMenu = menuStore.dataAllMenu.find(item => item.id === parentMenuId.greatGrandparentId);
          if (greatGrandparentMenu) {
            const grandparentSubmenus = getSubmenuArray(greatGrandparentMenu);
            const grandparentSubmenu = grandparentSubmenus.find(sub => sub.id === parentMenuId.grandparentId);
            
            if (grandparentSubmenu) {
              const parentSubmenus2 = getSubmenu2Array(grandparentSubmenu);
              const parentSubmenu2 = parentSubmenus2.find(sub => sub.id === parentMenuId.parentId);
              
              if (parentSubmenu2) {
                // Get the current level 3 submenu array
                const submenus3 = getSubmenu3Array(parentSubmenu2);
                
                // Initialize new submenu with empty submenu array
                menu.submenu = JSON.stringify([]);
                
                // Add the new item
                submenus3.push(menu);
                
                // Update the cache
                submenuCache.value[`sub3_${parentSubmenu2.id}`] = submenus3;
                
                // Update the parent submenu's submenu property
                parentSubmenu2.submenu = JSON.stringify(submenus3);
                
                // Update the grandparent's submenu array
                submenuCache.value[`sub2_${grandparentSubmenu.id}`] = parentSubmenus2;
                grandparentSubmenu.submenu = JSON.stringify(parentSubmenus2);
                
                // Update the great grandparent's submenu array
                submenuCache.value[greatGrandparentMenu.id] = grandparentSubmenus;
                greatGrandparentMenu.submenu = JSON.stringify(grandparentSubmenus);
                
                toast.add({
                  title: `Submenu level 3 "${menu.title}" berhasil ditambahkan`,
                  color: "green",
                  timeout: 2000
                });
              }
            }
          }
        }
      } else {
        // Level 1 submenu - Add to a main menu
        const parentMenu = menuStore.dataAllMenu.find(item => item.id === parentMenuId);
        if (parentMenu) {
          // Get the current submenu array
          const submenus = getSubmenuArray(parentMenu);
          
          // Initialize new submenu with empty submenu array
          menu.submenu = JSON.stringify([]);
          
          // Add the new item
          submenus.push(menu);
          
          // Update the cache
          submenuCache.value[parentMenu.id] = submenus;
          
          // Update the parent menu's submenu property
          parentMenu.submenu = JSON.stringify(submenus);
          
          toast.add({
            title: `Submenu "${menu.title}" berhasil ditambahkan`,
            color: "green",
            timeout: 2000
          });
        }
      }
    } else {
      // Initialize new menu with empty submenu array
      menu.submenu = JSON.stringify([]);
      // Set urutan to the largest value + 1
      const maxUrutan = menuStore.dataAllMenu.length > 0 ? Math.max(...menuStore.dataAllMenu.map(m => m.urutan ?? 0)) : 0;
      menu.urutan = maxUrutan + 1;
      // Add new menu to the start of the array for display purposes
      menuStore.dataAllMenu.unshift(menu);
      
      toast.add({
        title: `Menu "${menu.title}" berhasil ditambahkan`,
        color: "green",
        timeout: 2000
      });
    }
  } else {
    // Edit mode
    if (isSubmenuItem) {
      if (typeof parentMenuId === 'object') {
        // Level 2 or 3 submenu
        if (parentMenuId.level === 2) {
          // Level 2 submenu - Edit a level 1 submenu item
          const grandparentMenu = menuStore.dataAllMenu.find(item => item.id === parentMenuId.grandparentId);
          if (grandparentMenu) {
            const parentSubmenus = getSubmenuArray(grandparentMenu);
            const parentSubmenu = parentSubmenus.find(sub => sub.id === parentMenuId.parentId);
            
            if (parentSubmenu) {
              // Get the current level 2 submenu array
              const submenus2 = getSubmenu2Array(parentSubmenu);
              
              // Find and update the item
              const index = submenus2.findIndex(sub => sub.id === menu.id);
              if (index !== -1) {
                // Preserve the submenu when updating
                const existingSubmenu = submenus2[index].submenu;
                menu.submenu = existingSubmenu;
                
                submenus2[index] = menu;
                
                // Update the cache
                submenuCache.value[`sub2_${parentSubmenu.id}`] = submenus2;
                
                // Update the parent submenu's submenu property
                parentSubmenu.submenu = JSON.stringify(submenus2);
                
                // Update the grandparent's submenu array
                submenuCache.value[grandparentMenu.id] = parentSubmenus;
                grandparentMenu.submenu = JSON.stringify(parentSubmenus);
                
                toast.add({
                  title: `Submenu level 2 "${menu.title}" berhasil diperbarui`,
                  color: "green",
                  timeout: 2000
                });
              }
            }
          }
        } else if (parentMenuId.level === 3) {
          // Level 3 submenu - Edit a level 2 submenu item
          const greatGrandparentMenu = menuStore.dataAllMenu.find(item => item.id === parentMenuId.greatGrandparentId);
          if (greatGrandparentMenu) {
            const grandparentSubmenus = getSubmenuArray(greatGrandparentMenu);
            const grandparentSubmenu = grandparentSubmenus.find(sub => sub.id === parentMenuId.grandparentId);
            
            if (grandparentSubmenu) {
              const parentSubmenus2 = getSubmenu2Array(grandparentSubmenu);
              const parentSubmenu2 = parentSubmenus2.find(sub => sub.id === parentMenuId.parentId);
              
              if (parentSubmenu2) {
                // Get the current level 3 submenu array
                const submenus3 = getSubmenu3Array(parentSubmenu2);
                
                // Find and update the item
                const index = submenus3.findIndex(sub => sub.id === menu.id);
                if (index !== -1) {
                  submenus3[index] = menu;
                  
                  // Update the cache
                  submenuCache.value[`sub3_${parentSubmenu2.id}`] = submenus3;
                  
                  // Update the parent submenu's submenu property
                  parentSubmenu2.submenu = JSON.stringify(submenus3);
                  
                  // Update the grandparent's submenu array
                  submenuCache.value[`sub2_${grandparentSubmenu.id}`] = parentSubmenus2;
                  grandparentSubmenu.submenu = JSON.stringify(parentSubmenus2);
                  
                  // Update the great grandparent's submenu array
                  submenuCache.value[greatGrandparentMenu.id] = grandparentSubmenus;
                  greatGrandparentMenu.submenu = JSON.stringify(grandparentSubmenus);
                  
                  toast.add({
                    title: `Submenu level 3 "${menu.title}" berhasil diperbarui`,
                    color: "green",
                    timeout: 2000
                  });
                }
              }
            }
          }
        }
      } else {
        // Level 1 submenu - Edit a main menu's submenu
        const parentMenu = menuStore.dataAllMenu.find(item => item.id === parentMenuId);
        if (parentMenu) {
          // Get the current submenu array
          const submenus = getSubmenuArray(parentMenu);
          
          // Find and update the item
          const index = submenus.findIndex(sub => sub.id === menu.id);
          if (index !== -1) {
            // Preserve the submenu when updating
            const existingSubmenu = submenus[index].submenu;
            menu.submenu = existingSubmenu;
            
            submenus[index] = menu;
            
            // Update the cache
            submenuCache.value[parentMenu.id] = submenus;
            
            // Update the parent menu's submenu property
            parentMenu.submenu = JSON.stringify(submenus);
            
            toast.add({
              title: `Submenu "${menu.title}" berhasil diperbarui`,
              color: "green",
              timeout: 2000
            });
          }
        }
      }
    } else {
      // Main menu item edit
      const index = menuStore.dataAllMenu.findIndex(item => item.id === menu.id);
      if (index !== -1) {
        // Preserve the submenu when updating a main menu item
        const existingSubmenu = menuStore.dataAllMenu[index].submenu;
        menu.submenu = existingSubmenu;
        menuStore.dataAllMenu[index] = menu;
        
        toast.add({
          title: `Menu "${menu.title}" berhasil diperbarui`,
          color: "green",
          timeout: 2000
        });
      }
    }
  }
  
  // Force a re-render to ensure the UI reflects the change
  nextTick(() => {
    menuStore.dataAllMenu = [...menuStore.dataAllMenu];
  });
  
  hasChanges.value = true;
};

const handleDelete = (id) => {
  const index = menuStore.dataAllMenu.findIndex(item => item.id === id);
  if (index !== -1) {
    // Get the title for the toast message
    const menuTitle = menuStore.dataAllMenu[index].title;
    
    // Clear the cache for this menu
    delete submenuCache.value[id];
    
    // Remove the item from local store
    menuStore.dataAllMenu.splice(index, 1);
    
    // Force a re-render to ensure the UI reflects the change
    nextTick(() => {
      menuStore.dataAllMenu = [...menuStore.dataAllMenu];
    });
    
    toast.add({
      title: `Menu "${menuTitle}" telah dihapus`,
      color: "blue",
      timeout: 2000
    });
    
    hasChanges.value = true;
  }
};
const showDragTipOnce = () => {
  const dragTipShown = localStorage.getItem('dragTipShown');
  if (!dragTipShown) {
    showDragTip.value = true;
    setTimeout(() => {
      showDragTip.value = false;
      localStorage.setItem('dragTipShown', 'true');
    }, 5000);
  }
};

onMounted(() => {
  layoutStore.setLoading(true);
  
  try {
    // Always fetch from API to get the latest data
    menuStore.getAllMenuDataAdmin().then(() => {
      if (menuStore.dataAllMenu && Array.isArray(menuStore.dataAllMenu)) {
        // Clear existing cache
        submenuCache.value = {};
        
        // Process submenu cache for all levels
        menuStore.dataAllMenu.forEach(menu => {
          // Level 1 submenus
          const submenus = parseSubmenu(menu.submenu);
          submenuCache.value[menu.id] = submenus;
          
          // Process level 2 submenus
          submenus.forEach(submenu => {
            const submenus2 = parseSubmenu(submenu.submenu);
            submenuCache.value[`sub2_${submenu.id}`] = submenus2;
            
            // Process level 3 submenus
            submenus2.forEach(submenu2 => {
              const submenus3 = parseSubmenu(submenu2.submenu);
              submenuCache.value[`sub3_${submenu2.id}`] = submenus3;
            });
          });
        });
        
        // Store original state for reset functionality
        saveOriginalState();
        showDragTipOnce();
        
        toast.add({
          title: "Menu data berhasil diambil dari server",
          color: "green",
          timeout: 3000
        });
      }
      layoutStore.setLoading(false);    }).catch(error => {
      console.error("Failed to fetch menu data:", error);
      layoutStore.setLoading(false);
      toast.add({
        title: "Gagal mengambil data menu dari server",
        color: "red",
        timeout: 3000
      });
    });
    
    // Initially keep all submenus closed
    setTimeout(() => {
      menuStore.dataAllMenu.forEach(menu => {
        visibleSubmenus.value[menu.id] = false;
      });
    }, 500);
    
  } catch (e) {
    console.error("Error initializing menu data:", e);
    layoutStore.setLoading(false);
    toast.add({
      title: "Terjadi kesalahan saat memuat data menu",
      color: "red",
      timeout: 3000
    });
  }
});

const sortedMenuItems = computed(() => {
  return menuStore.dataAllMenu.slice().sort((a, b) => a.urutan - b.urutan);
});
</script>

<style scoped>
/* These styles are now in the DraggableMenus.vue component */

/* Transition animations for the list */
.flip-list-move {
  transition: transform 0.5s;
}

.flip-list-enter-active,
.flip-list-leave-active {
  transition: all 0.5s;
}

.flip-list-enter-from,
.flip-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Fade transition for submenu items */
.fade-list-move {
  transition: transform 0.3s;
}

.fade-list-enter-active,
.fade-list-leave-active {
  transition: all 0.3s;
}

.fade-list-enter-from,
.fade-list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Add a visual indicator for drop zones */
.submenu.list-group {
  min-height: 50px;
}
</style>