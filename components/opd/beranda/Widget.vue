<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="showPopup" 
        class="fixed inset-0 z-[200] flex items-center justify-center p-4"
        @click.self="closePopup"
      >
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
        <!-- Modal Content -->
        <div 
          v-if="popupData" 
          class="relative overflow-hidden shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl max-w-md w-full z-[201] border border-gray-200 dark:border-slate-600"
        >
          <div class="relative">
            <button
              @click="closePopup"
              class="absolute z-10 top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/80 hover:bg-blue-100 border border-gray-200 shadow-sm rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Tutup"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <NuxtImg
              :src="popupData.iconfab"
              alt="Popup Image"
              class="w-full max-h-[40vh] object-cover rounded-t-2xl"
            />
          </div>
          <div class="px-6 py-4 border-t border-gray-100 dark:border-slate-600 bg-white/80 dark:bg-slate-800/80 flex flex-col items-center gap-3">
            <a
              :href="popupData.message"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-block bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-base font-medium shadow transition-colors min-w-[140px] text-center"
            >
              Selengkapnya
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useAdminStore } from '~/store/admin/admin';
import { useModalState } from '~/composable/useModalState';

const adminStore = useAdminStore();
const { canShowWidgetModal } = useModalState();

const showPopup = ref(false);
const popupData = ref(null);
const fabData = ref(null);
const runningTextData = ref([]);
const widgetShownThisSession = ref(false);

let widgetDataLoaded = false;

onMounted(async () => {
  try {
    await adminStore.getAllWidgetHome();

    if (adminStore.allDataWidgetHome.fab?.length > 0) {
      fabData.value = adminStore.allDataWidgetHome.fab[0];
    }

    if (adminStore.allDataWidgetHome.popup?.length > 0) {
      popupData.value = adminStore.allDataWidgetHome.popup[0];
      widgetDataLoaded = true;
      
      // Widget akan muncul selama cookie modal tidak aktif
      if (canShowWidgetModal.value && !widgetShownThisSession.value) {
        setTimeout(() => {
          showPopup.value = true;
          widgetShownThisSession.value = true;
        }, 500);
      }
    }

    if (adminStore.allDataWidgetHome.runningtext?.length > 0) {
      runningTextData.value = adminStore.allDataWidgetHome.runningtext;
    }
  } catch (error) {
    console.error("Failed to load widget data:", error);
  }
});

// Watch untuk menampilkan widget ketika cookie modal ditutup
watch(canShowWidgetModal, (canShow) => {
  if (canShow && widgetDataLoaded && popupData.value && !showPopup.value && !widgetShownThisSession.value) {
    // Delay untuk memastikan cookie modal benar-benar tertutup dan DOM sudah updated
    setTimeout(() => {
      showPopup.value = true;
      widgetShownThisSession.value = true;
    }, 1000);
  }
}, { immediate: true }); // immediate untuk cek kondisi saat mount

const closePopup = () => {
  showPopup.value = false;
};
</script>

<style scoped>
/* Modal transition */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4,0,0.2,1);
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
.modal-enter-active .relative, .modal-leave-active .relative {
  transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
}
.modal-enter-from .relative, .modal-leave-to .relative {
  transform: scale(0.96) translateY(12px);
}

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
</style>