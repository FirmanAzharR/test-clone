<script setup>
import { onMounted, ref } from 'vue';

const selectedLang = ref(''); // default kosong
const options = ref([]); // menyimpan semua bahasa dari Google

const initGoogleTranslate = () => {
  // @ts-ignore
  new window.google.translate.TranslateElement(
    {
      pageLanguage: 'id',
      autoDisplay: false,
      layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
    },
    'google_translate_placeholder'
  );
};

const loadGoogleTranslateOptions = () => {
  const interval = setInterval(() => {
    const googleSelect = document.querySelector('.goog-te-combo');
    if (googleSelect && googleSelect.options.length > 1) {
      options.value = Array.from(googleSelect.options).map((opt) => ({
        text: opt.text,
        value: opt.value,
      }));
      clearInterval(interval);
    }
  }, 500);
};

const changeLanguage = (lang) => {
  const googleSelect = document.querySelector('.goog-te-combo');
  if (googleSelect) {
    googleSelect.value = lang;
    googleSelect.dispatchEvent(new Event('change'));
  }
};

onMounted(() => {
  // Inject script Google Translate
  window.googleTranslateElementInit = initGoogleTranslate;
  const script = document.createElement('script');
  script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  document.head.appendChild(script);

  // Ambil list bahasa setelah Google render dropdown-nya
  loadGoogleTranslateOptions();
});
</script>

<template>
  <div class="flex justify-end mr-5 items-center gap-2">
    <select
      id="lang"
      v-model="selectedLang"
      @change="changeLanguage(selectedLang)"
      class="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-sm text-gray-800 dark:text-white px-4 py-2 shadow-sm focus:outline-none transition-all duration-300"
    >
      <option disabled value="">Pilih Bahasa</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.text }}
      </option>
    </select>

    <!-- Hidden placeholder untuk Google Translate -->
    <div id="google_translate_placeholder" class="hidden"></div>
  </div>
</template>
