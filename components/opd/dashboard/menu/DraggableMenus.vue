<template>
  <draggable 
    :list="items" 
    v-bind="menuGroup" 
    :key="itemsKey" 
    handle=".drag-handle" 
    @end="handleDragEnd"
    @change="handleMove"
    class="dragArea"
  >
    <div v-for="item in items" :key="item.id" class="list-group-item">
      <div class="flex items-center justify-between p-3 mb-2 rounded-md bg-slate-50 dark:bg-slate-700 shadow">        <!-- Drag handle -->
        <div class="flex items-center gap-2">
          <UIcon 
            name="heroicons:bars-3-20-solid" 
            class="drag-handle text-gray-500 hover:text-blue-500 cursor-move"
          />          <div class="flex-1">
            {{ item.title }}
            <UBadge v-if="item.publish === 0" color="red" variant="soft" size="xs" class="ml-1">
              Pending
            </UBadge>
          </div>
          
          <!-- Badge for submenu level 1 -->
          <UBadge v-if="hasSubmenu(item)" color="teal" variant="subtle" class="ml-2">
            <UIcon name="lucide:layers" class="mr-1" />
            Level 1
          </UBadge>
        </div>
        
        <!-- Action buttons -->
        <div class="flex items-center gap-2">
          <!-- Add submenu button -->
          <UButton
            size="xs"
            color="gray"
            variant="ghost"
            icon="heroicons:plus"
            @click="$emit('add-submenu', item.id)"
            :title="'Tambah Submenu Level 1'"
          />            <!-- Toggle submenu visibility button (always shown) -->
          <UButton
            size="xs"
            color="gray"
            variant="ghost"
            :icon="isSubmenuVisible(item.id) ? 'heroicons:chevron-up' : 'heroicons:chevron-down'"
            @click="$emit('toggle-submenu', item.id)"
            :title="isSubmenuVisible(item.id) ? 'Tutup Submenu' : 'Buka Submenu'"
          />
          
          <!-- Edit button -->
          <UButton
            size="xs"
            color="blue"
            variant="ghost"
            icon="heroicons:pencil-square"
            @click="$emit('edit-menu', item)"
            :title="'Edit Menu'"
          />
          
          <!-- Delete button -->
          <UButton
            size="xs"
            color="red"
            variant="ghost"
            icon="heroicons:trash"
            @click="$emit('delete-menu', item.id)"
            :title="'Hapus Menu'"
          />
        </div>      </div>      <!-- Submenu container (Level 1) -->
      <div v-if="isSubmenuVisible(item.id)" class="ml-6 submenu level-1">
        <draggable 
          :list="getSubmenuArray(item)" 
          v-bind="submenuGroup" 
          handle=".submenu-handle"
          @end="submenuDragEnd(item)"
          @change="(e) => handleSubmenuMove(e, item)"
          class="submenu-list"
        >
          <div v-for="submenu in getSubmenuArray(item)" :key="submenu.id" class="submenu-item mb-2">
            <div class="flex items-center justify-between p-3 rounded-md bg-slate-50 dark:bg-slate-700 shadow">
              <!-- Drag handle -->
              <div class="flex items-center gap-2">
                <UIcon 
                  name="heroicons:bars-3-20-solid" 
                  class="submenu-handle text-gray-500 hover:text-teal-500 cursor-move"
                />                <div class="flex-1">
                  {{ submenu.title }}
                  <UBadge v-if="submenu.publish === 0" color="red" variant="soft" size="xs" class="ml-1">
                    Pending
                  </UBadge>
                </div>
                
                <!-- Badge for submenu level 2 -->
                <UBadge v-if="hasSubmenu2(submenu)" color="indigo" variant="subtle" class="ml-2">
                  <UIcon name="lucide:layers" class="mr-1" />
                  Level 2
                </UBadge>
              </div>
              
              <!-- Action buttons -->
              <div class="flex items-center gap-2">
                <!-- Add submenu level 2 button -->
                <UButton
                  size="xs"
                  color="teal"
                  variant="ghost"
                  icon="heroicons:plus-circle"
                  @click="$emit('add-submenu2', submenu.id, item.id)"
                  :title="'Tambah Submenu Level 2'"
                />                <!-- Toggle submenu visibility button for level 2 (always shown) -->
                <UButton
                  size="xs"
                  color="teal"
                  variant="ghost"
                  :icon="isSubmenuVisible(submenu.id) ? 'heroicons:chevron-up' : 'heroicons:chevron-down'"
                  @click="$emit('toggle-submenu', submenu.id)"
                  :title="isSubmenuVisible(submenu.id) ? 'Tutup Submenu Level 2' : 'Buka Submenu Level 2'"
                />
                
                <!-- Edit button -->
                <UButton
                  size="xs"
                  color="blue"
                  variant="ghost"
                  icon="heroicons:pencil-square"
                  @click="$emit('edit-submenu', submenu, item.id)"
                  :title="'Edit Submenu Level 1'"
                />
                
                <!-- Delete button -->
                <UButton
                  size="xs"
                  color="red"
                  variant="ghost"
                  icon="heroicons:trash"
                  @click="$emit('delete-submenu', submenu.id, item.id)"
                  :title="'Hapus Submenu Level 1'"
                />
              </div>
            </div>

            <!-- Submenu Level 2 Container -->            <div v-if="isSubmenuVisible(submenu.id)" class="ml-6 mt-2 submenu level-2">
              <draggable 
                :list="getSubmenu2Array(submenu)" 
                v-bind="submenu2Group" 
                handle=".submenu2-handle"
                @end="submenu2DragEnd(submenu, item)"
                @change="(e) => handleSubmenu2Move(e, submenu, item)"
                class="submenu2-list"
              >
                <div v-for="submenu2 in getSubmenu2Array(submenu)" :key="submenu2.id" class="submenu2-item mb-2">
                  <div class="flex items-center justify-between p-3 rounded-md bg-slate-50 dark:bg-slate-700 shadow">
                    <!-- Drag handle -->
                    <div class="flex items-center gap-2">
                      <UIcon 
                        name="heroicons:bars-3-20-solid" 
                        class="submenu2-handle text-gray-500 hover:text-indigo-500 cursor-move"
                      />                      <div class="flex-1">
                        {{ submenu2.title }}
                        <UBadge v-if="submenu2.publish === 0" color="red" variant="soft" size="xs" class="ml-1">
                          Pending
                        </UBadge>
                      </div>
                      
                      <!-- Badge for submenu level 3 -->
                      <UBadge v-if="hasSubmenu3(submenu2)" color="purple" variant="subtle" class="ml-2">
                        <UIcon name="lucide:layers" class="mr-1" />
                        Level 3
                      </UBadge>
                    </div>
                    
                    <!-- Action buttons -->
                    <div class="flex items-center gap-2">
                      <!-- Add submenu level 3 button -->
                      <UButton
                        size="xs"
                        color="indigo"
                        variant="ghost"
                        icon="heroicons:plus-circle"
                        @click="$emit('add-submenu3', submenu2.id, submenu.id, item.id)"
                        :title="'Tambah Submenu Level 3'"
                      />                      <!-- Toggle submenu visibility button for level 3 (always shown) -->
                      <UButton
                        size="xs"
                        color="indigo"
                        variant="ghost"
                        :icon="isSubmenuVisible(submenu2.id) ? 'heroicons:chevron-up' : 'heroicons:chevron-down'"
                        @click="$emit('toggle-submenu', submenu2.id)"
                        :title="isSubmenuVisible(submenu2.id) ? 'Tutup Submenu Level 3' : 'Buka Submenu Level 3'"
                      />
                      
                      <!-- Edit button -->
                      <UButton
                        size="xs"
                        color="blue"
                        variant="ghost"
                        icon="heroicons:pencil-square"
                        @click="$emit('edit-submenu2', submenu2, submenu.id, item.id)"
                        :title="'Edit Submenu Level 2'"
                      />
                      
                      <!-- Delete button -->
                      <UButton
                        size="xs"
                        color="red"
                        variant="ghost"
                        icon="heroicons:trash"
                        @click="$emit('delete-submenu2', submenu2.id, submenu.id, item.id)"
                        :title="'Hapus Submenu Level 2'"
                      />
                    </div>
                  </div>                  <!-- Submenu Level 3 Container -->
                  <div v-if="isSubmenuVisible(submenu2.id)" class="ml-6 mt-2 submenu level-3">
                    <draggable 
                      :list="getSubmenu3Array(submenu2)" 
                      v-bind="submenu3Group" 
                      handle=".submenu3-handle"
                      @end="submenu3DragEnd(submenu2, submenu, item)"
                      @change="(e) => handleSubmenu3Move(e, submenu2, submenu, item)"
                      class="submenu3-list"
                    >
                      <div v-for="submenu3 in getSubmenu3Array(submenu2)" :key="submenu3.id" class="submenu3-item mb-2">
                        <div class="flex items-center justify-between p-3 rounded-md bg-slate-50 dark:bg-slate-700 shadow">
                          <!-- Drag handle -->
                          <div class="flex items-center gap-2">
                            <UIcon 
                              name="heroicons:bars-3-20-solid" 
                              class="submenu3-handle text-gray-500 hover:text-purple-500 cursor-move"
                            />
                            <div class="flex-1">
                              {{ submenu3.title }}
                              <UBadge v-if="submenu3.publish === 0" color="red" variant="soft" size="xs" class="ml-1">
                                Pending
                              </UBadge>
                            </div>
                          </div>
                          
                          <!-- Action buttons -->
                          <div class="flex items-center gap-2">
                            <!-- Edit button -->
                            <UButton
                              size="xs"
                              color="blue"
                              variant="ghost"
                              icon="heroicons:pencil-square"
                              @click="$emit('edit-submenu3', submenu3, submenu2.id, submenu.id, item.id)"
                              :title="'Edit Submenu Level 3'"
                            />
                            
                            <!-- Delete button -->
                            <UButton
                              size="xs"
                              color="red"
                              variant="ghost"
                              icon="heroicons:trash"
                              @click="$emit('delete-submenu3', submenu3.id, submenu2.id, submenu.id, item.id)"
                              :title="'Hapus Submenu Level 3'"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div v-if="getSubmenu3Array(submenu2).length === 0" class="p-4 text-center text-gray-500 dark:text-gray-400">
                        Tidak ada submenu level 3. Klik tombol "+" atau seret submenu setingkat untuk menambahkan.
                      </div>
                    </draggable>
                  </div>
                </div>
                
                <div v-if="getSubmenu2Array(submenu).length === 0" class="p-4 text-center text-gray-500 dark:text-gray-400">
                  Tidak ada submenu level 2. Klik tombol "+" atau seret submenu setingkat untuk menambahkan.
                </div>
              </draggable>
            </div>
          </div>
          
          <div v-if="getSubmenuArray(item).length === 0" class="p-4 text-center text-gray-500 dark:text-gray-400">
            Tidak ada submenu level 1. Klik tombol "+" atau seret submenu setingkat untuk menambahkan.
          </div>
        </draggable>
      </div>
    </div>
  </draggable>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue';
import { VueDraggableNext as draggable } from 'vue-draggable-next';

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  visibleSubmenus: {
    type: Object,
    required: true
  },
  submenuCache: {
    type: Object,
    required: true
  }
});

const emit = defineEmits([
  'update-menu', 
  'drag-end', 
  'submenu-drag-end', 
  'submenu2-drag-end',
  'submenu3-drag-end',
  'toggle-submenu', 
  'edit-menu', 
  'edit-submenu',
  'edit-submenu2',
  'edit-submenu3', 
  'add-submenu',
  'add-submenu2',
  'add-submenu3',
  'delete-menu', 
  'delete-submenu',
  'delete-submenu2',
  'delete-submenu3'
]);

const itemsKey = ref(0);

// Menu group configuration for draggable
const menuGroup = {
  animation: 200,
  group: "menu",
  ghostClass: "ghost-card",
  chosenClass: "chosen-card",
  dragClass: "drag-card",
};

// Submenu group configuration for draggable
const submenuGroup = {
  animation: 200,
  group: "submenu",
  ghostClass: "ghost-submenu",
  chosenClass: "chosen-submenu",
  dragClass: "drag-submenu",
};

// Submenu level 2 group configuration
const submenu2Group = {
  animation: 200,
  group: "submenu2",
  ghostClass: "ghost-submenu2",
  chosenClass: "chosen-submenu2",
  dragClass: "drag-submenu2",
};

// Submenu level 3 group configuration
const submenu3Group = {
  animation: 200,
  group: "submenu3",
  ghostClass: "ghost-submenu3",
  chosenClass: "chosen-submenu3",
  dragClass: "drag-submenu3",
};

// Function to check if a menu has level 1 submenu items
const hasSubmenu = (element) => {
  if (!element || !element.id) return false;
  const submenus = getSubmenuArray(element);
  return submenus.length > 0;
};

// Function to check if a menu has level 2 submenu items
const hasSubmenu2 = (element) => {
  if (!element || !element.id) return false;
  const submenus = getSubmenu2Array(element);
  return submenus.length > 0;
};

// Function to check if a menu has level 3 submenu items
const hasSubmenu3 = (element) => {
  if (!element || !element.id) return false;
  const submenus = getSubmenu3Array(element);
  return submenus.length > 0;
};

// Parse the submenu JSON string to array
const parseSubmenu = (submenu) => {
  try {
    return JSON.parse(submenu);
  } catch (e) {
    return [];
  }
};

// Get level 1 submenu array for a menu element
const getSubmenuArray = (element) => {
  if (!element || !element.id) return [];
  
  // Check if we have a cached version
  if (props.submenuCache[element.id]) {
    return props.submenuCache[element.id];
  }
  
  // Parse and return the submenu
  return parseSubmenu(element.submenu);
};

// Get level 2 submenu array
const getSubmenu2Array = (element) => {
  if (!element || !element.id) return [];
  
  // Check if we have a cached version
  if (props.submenuCache[`sub2_${element.id}`]) {
    return props.submenuCache[`sub2_${element.id}`];
  }
  
  // Parse and return the level 2 submenu
  return parseSubmenu(element.submenu);
};

// Get level 3 submenu array
const getSubmenu3Array = (element) => {
  if (!element || !element.id) return [];
  
  // Check if we have a cached version
  if (props.submenuCache[`sub3_${element.id}`]) {
    return props.submenuCache[`sub3_${element.id}`];
  }
  
  // Parse and return the level 3 submenu
  return parseSubmenu(element.submenu);
};

// Check if submenu is visible
const isSubmenuVisible = (id) => {
  return !!props.visibleSubmenus[id];
};

// Handle menu drag end
const handleDragEnd = (event) => {
  // Update ordering
  props.items.forEach((item, index) => {
    item.urutan = index;
  });
  
  itemsKey.value++;
  emit('drag-end', props.items);
};

// Handle level 1 submenu drag end
const submenuDragEnd = (parentItem) => {
  if (!parentItem || !parentItem.id) return;
  
  const submenus = getSubmenuArray(parentItem);
  submenus.forEach((item, index) => {
    item.urutan = index;
  });
  
  emit('submenu-drag-end', parentItem, submenus);
};

// Handle level 2 submenu drag end
const submenu2DragEnd = (parentSubmenu, grandparentItem) => {
  if (!parentSubmenu || !parentSubmenu.id) return;
  
  const submenus = getSubmenu2Array(parentSubmenu);
  submenus.forEach((item, index) => {
    item.urutan = index;
  });
  
  emit('submenu2-drag-end', parentSubmenu, submenus, grandparentItem);
};

// Handle level 3 submenu drag end
const submenu3DragEnd = (parentSubmenu2, grandparentSubmenu, greatGrandparentItem) => {
  if (!parentSubmenu2 || !parentSubmenu2.id) return;
  
  const submenus = getSubmenu3Array(parentSubmenu2);
  submenus.forEach((item, index) => {
    item.urutan = index;
  });
  
  emit('submenu3-drag-end', parentSubmenu2, submenus, grandparentSubmenu, greatGrandparentItem);
};

// Handle menu item movement
const handleMove = (event) => {
  if (event.added) {
    console.log("Item added:", event.added.element);
  }
  if (event.removed) {
    console.log("Item removed:", event.removed.element);
  }
  if (event.moved) {
    console.log("Item moved:", event.moved.element);
  }

  emit('update-menu', props.items);
};

// Handle level 1 submenu movement
const handleSubmenuMove = (event, parentItem) => {
  if (!parentItem || !parentItem.id) return;

  emit('update-menu', props.items);
};

// Handle level 2 submenu movement
const handleSubmenu2Move = (event, parentSubmenu, grandparentItem) => {
  if (!parentSubmenu || !parentSubmenu.id) return;
  
  emit('update-menu', props.items);
};

// Handle level 3 submenu movement
const handleSubmenu3Move = (event, parentSubmenu2, grandparentSubmenu, greatGrandparentItem) => {
  if (!parentSubmenu2 || !parentSubmenu2.id) return;
  
  emit('update-menu', props.items);
};
</script>

<style scoped>
.dragArea {
  display: flex;
  flex-direction: column;
}

.list-group-item {
  cursor: default;
  margin-bottom: 0.75rem;
}

.submenu {
  margin-top: 0.5rem;
  border: 2px dashed #99f6e4;
  padding: 0.5rem;
  border-radius: 0.375rem;
}

.dark .submenu {
  border-color: #115e59;
}

.submenu.level-2 {
  border: 2px dashed #a5b4fc; /* indigo-200 */
}

.dark .submenu.level-2 {
  border-color: #3730a3; /* indigo-800 */
}

.submenu.level-3 {
  border: 2px dashed #d8b4fe; /* purple-200 */
}

.dark .submenu.level-3 {
  border-color: #6b21a8; /* purple-800 */
}

.submenu-item {
  cursor: default;
}

.submenu2-item {
  cursor: default;
}

.submenu3-item {
  cursor: default;
}

.drag-handle, .submenu-handle, .submenu2-handle, .submenu3-handle {
  cursor: move;
}

/* Ghost card styling - shows where the item will be placed */
.ghost-card {
  opacity: 0.5;
  background-color: #dbeafe; /* blue-100 */
  border: 2px dashed #3b82f6; /* blue-500 */
  transform: scale(0.95);
}

.dark .ghost-card {
  background-color: #1e3a8a; /* dark:blue-900 */
}

.ghost-submenu {
  opacity: 0.5;
  background-color: #ccfbf1; /* teal-100 */
  border: 2px dashed #14b8a6; /* teal-500 */
  transform: scale(0.95);
}

.dark .ghost-submenu {
  background-color: #134e4a; /* dark:teal-900 */
}

.ghost-submenu2 {
  opacity: 0.5;
  background-color: #e0e7ff; /* indigo-100 */
  border: 2px dashed #6366f1; /* indigo-500 */
  transform: scale(0.95);
}

.dark .ghost-submenu2 {
  background-color: #1e1b4b; /* dark:indigo-950 */
}

.ghost-submenu3 {
  opacity: 0.5;
  background-color: #f3e8ff; /* purple-100 */
  border: 2px dashed #a855f7; /* purple-500 */
  transform: scale(0.95);
}

.dark .ghost-submenu3 {
  background-color: #3b0764; /* dark:purple-950 */
}

/* Styling for the item being dragged */
.drag-card, .drag-submenu, .drag-submenu2, .drag-submenu3 {
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
  transform: rotate(1deg);
  z-index: 50;
}

/* Styling for the chosen item */
.chosen-card {
  background-color: #e2e8f0; /* slate-200 */
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
}

.dark .chosen-card {
  background-color: #475569; /* dark:slate-600 */
}

.chosen-submenu {
  background-color: #cbd5e1; /* slate-300 */
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
}

.dark .chosen-submenu {
  background-color: #64748b; /* dark:slate-500 */
}

.chosen-submenu2 {
  background-color: #c7d2fe; /* indigo-200 */
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
}

.dark .chosen-submenu2 {
  background-color: #4f46e5; /* dark:indigo-600 */
}

.chosen-submenu3 {
  background-color: #ddd6fe; /* purple-200 */
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
}

.dark .chosen-submenu3 {
  background-color: #9333ea; /* dark:purple-600 */
}
</style>
