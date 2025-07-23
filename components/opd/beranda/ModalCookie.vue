<template>
  <TransitionRoot appear :show="showModal" as="template">
    <Dialog as="div" @close="preventClose" class="relative z-[9999]">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] pointer-events-auto" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto z-[9999] pointer-events-auto">
        <div class="flex items-end justify-center min-h-full p-4">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-10"
            enter-to="opacity-100 translate-y-0"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0"
            leave-to="opacity-0 translate-y-10"
          >            
            <DialogPanel class="w-full max-w-5xl p-4 overflow-hidden transition-all transform shadow-xl bg-white/80 rounded-3xl dark:bg-slate-800/80 z-[9999]">
              <div class="flex flex-col sm:flex-row sm:items-center">
                <div class="flex flex-col sm:flex-row sm:flex-1 sm:items-center">
                  <div class="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4 flex justify-center">
                    <Icon
                      name="ic:outline-cookie"
                      class="w-8 h-8"
                    />
                  </div>
                  <div class="flex-1">
                    <div class="mb-4">
                      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 text-center sm:text-left">
                        <template v-if="kebijakanExists">
                          Situs kami menggunakan cookie untuk meningkatkan pengalaman Anda. Silakan menyetujui
                          <NuxtLink to="/kebijakan" class="font-bold text-blue-600 dark:text-blue-400 hover:underline">Kebijakan Privasi</NuxtLink>
                          untuk pengalaman terbaik.
                        </template>
                        <template v-else>
                          Situs kami menggunakan cookie untuk meningkatkan pengalaman Anda. Pilih lanjutkan untuk pengalaman terbaik.
                        </template>
                      </h3>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col sm:flex-row items-center gap-3 mt-4 sm:mt-0">
                  <UButton
                    color="blue"
                    variant="outline"
                    size="lg"
                    @click="declineCookies"
                    class="rounded-full w-full sm:w-auto flex items-center justify-center"
                  >
                    Nanti
                  </UButton>
                  <UButton
                    size="lg"
                    color="blue"
                    @click="acceptCookies"
                    class="rounded-full w-full sm:w-auto flex items-center justify-center"
                  >
                    Lanjutkan
                  </UButton>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCookie } from '#app';
import { useRouter } from 'vue-router'
import { useModalState } from '~/composable/useModalState'
import { useAuthToken } from '~/composable/useAuthToken'
import { 
  Dialog, 
  DialogPanel, 
  TransitionChild, 
  TransitionRoot 
} from '@headlessui/vue';

const showModal = ref(false);
const cookieAccepted = useCookie('accept_cookies');
const kebijakanExists = ref(false)
const router = useRouter()
const config = useRuntimeConfig();
const { token } = useAuthToken();
const { acceptCookieModal, declineCookieModal, resetForNewVisit, showCookieModal, hideCookieModal } = useModalState()
const apiBaseUrl = config.public.apiBaseUrl;
onMounted(() => {
  // Reset state untuk kunjungan baru (kecuali jika sudah accept permanent)
  if (!cookieAccepted.value) {
    resetForNewVisit();
    // Show modal after a short delay
    setTimeout(() => {
      showModal.value = true;
      showCookieModal(); // Notify global state
    }, 500);
  }
});

onMounted(async () => {
  try {
    // Check if kebijakan privasi content actually exists by fetching from API
    const response = await $fetch(`${apiBaseUrl}/api/page/page/kebijakan-privasi`, {
      headers: {
        Authorization: token.value,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    
    // Check if response has valid data and content
    kebijakanExists.value = !!(response?.data?.description && response.data.description.trim());
  } catch (error) {
    console.log('Kebijakan privasi content not available:', error);
    kebijakanExists.value = false;
  }
})

const acceptCookies = () => {
  // Set cookie with 30 day expiry
  cookieAccepted.value = 'true';
  // Set cookie options
  cookieAccepted.options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    path: '/'
  };
  showModal.value = false;
  hideCookieModal(); // Hide from global state
  // Notify global state
  acceptCookieModal();
};

const declineCookies = () => {
  showModal.value = false;
  hideCookieModal(); // Hide from global state
  // Notify global state - modal akan muncul lagi setiap kali ke home
  // Tidak menyimpan cookie sehingga modal akan muncul lagi
  declineCookieModal();
};

// Prevent the dialog from closing when clicking outside
const preventClose = (event) => {
  event.preventDefault();
};
</script>

<style scoped>
/* Additional styles for modal positioning */
.modal-container {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 1rem;
}

.modal-base {
  border-radius: 9999px; /* Full rounded corners */
}

/* Ensure modal is completely blocking */
:deep(.fixed.inset-0) {
  pointer-events: auto !important;
  user-select: none;
}

/* Block all interactions behind modal */
:deep(.z-\[9998\]) {
  pointer-events: auto !important;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>