<template>
  <div>
    <!-- Running Text Banner -->
    <Transition name="slide-up">
      <div
        v-if="runningTextData.length > 0"
        class="fixed bottom-0 w-full py-2.5 bg-blue-500/80 dark:bg-slate-900/80 text-white z-40 shadow-lg"
      >
        <div class="overflow-hidden running-text-container">
          <div class="font-medium running-text-content whitespace-nowrap">
            <span v-for="(text, index) in runningTextData" :key="index" v-html="text.message">
            </span>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Floating Action Button -->
    <Transition name="scale">
      <div v-if="fabData" class="fixed z-50 bottom-5 md:bottom-5 md:left-6 bottom-5">
          <UButton
            :to="fabData.message"
            target="_blank"
            variant="ghost"
            size="xl"
            rel="noopener noreferrer"
            class="flex items-center justify-center transition-all duration-300 transform rounded-full hover:bg-blue-600/20 dark:hover:bg-slate-600/20 hover:scale-105"
            aria-label="Floating action button"
          >
            <NuxtImg
              :src="fabData.iconfab"
              alt="FAB Icon"
              class="object-cover w-24 h-24 rounded-full md:w-36 md:h-36"
            />
          </UButton>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAdminStore } from '~/store/admin/admin';

const adminStore = useAdminStore();

const showPopup = ref(false);
const popupData = ref(null);
const fabData = ref(null);
const runningTextData = ref([]);

onMounted(async () => {
  try {
    await adminStore.getAllWidgetHome();

    if (adminStore.allDataWidgetHome.fab?.length > 0) {
      fabData.value = adminStore.allDataWidgetHome.fab[0];
    }

    if (adminStore.allDataWidgetHome.popup?.length > 0) {
      popupData.value = adminStore.allDataWidgetHome.popup[0];
      // Add a small delay for better UX
      setTimeout(() => {
        showPopup.value = true;
      }, 500);
    }

    if (adminStore.allDataWidgetHome.runningtext?.length > 0) {
      runningTextData.value = adminStore.allDataWidgetHome.runningtext;
    }
  } catch (error) {
    console.error('Failed to load widget data:', error);
  }
});

const closePopup = () => {
  showPopup.value = false;
};
</script>

<style scoped>
/* Running text animation */
.running-text-container {
  width: 100%;
}

.running-text-content {
  display: inline-block;
  animation: runningText 25s linear infinite;
}

@keyframes runningText {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

/* Transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0);
  opacity: 0;
}
</style>