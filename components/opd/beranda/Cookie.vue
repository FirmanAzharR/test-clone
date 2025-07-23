<script setup>
import { ref, onMounted } from 'vue';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';
import Cookies from 'js-cookie';

const accepted = ref(false);
const showModal = ref(false);

onMounted(() => {
  accepted.value = Cookies.get('accept_cookies') === 'true';
  if (!accepted.value) {
    showModal.value = true;
  }
});

const acceptCookies = () => {
  Cookies.set('accept_cookies', 'true', { expires: 1 });
  showModal.value = false;
  setTimeout(() => {
    accepted.value = true;
  }, 300);
};

const declineCookies = () => {
  showModal.value = false;
  setTimeout(() => {
    accepted.value = true;
  }, 300);
};
</script>

<template>
  <Dialog :open="showModal" v-if="!accepted" v-model="showModal" class="w-full inset-0 absolute z-100 flex items-end justify-center">
    <div class="w-full inset-0 bg-black bg-opacity-50" aria-hidden="true"></div>
    
    <DialogPanel class="w-full max-w-md bg-white rounded-t-lg shadow-lg p-6 transition-all">
      <div class="flex justify-between items-center">
        <DialogTitle class="text-lg font-bold text-gray-900">Kebijakan Cookie</DialogTitle>
        <button @click="declineCookies" class="text-gray-600 hover:text-gray-900">&times;</button>
      </div>
      
      <div class="mt-4 text-gray-700">
        <p>
          Situs kami menggunakan cookie untuk meningkatkan pengalaman Anda. Silakan menyetujui
          <a href="/kebijakan" class="text-blue-600 underline">Kebijakan Privasi</a> serta
          <a href="/kebijakan" class="text-blue-600 underline">Kebijakan Umum SMKI</a> untuk pengalaman terbaik.
        </p>
      </div>
      
      <div class="mt-6 flex justify-end gap-4">
        <button @click="declineCookies" class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100">
          Lanjutkan Nanti
        </button>
        <button @click="acceptCookies" class="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          Setujui
        </button>
      </div>
    </DialogPanel>
  </Dialog>
</template>
