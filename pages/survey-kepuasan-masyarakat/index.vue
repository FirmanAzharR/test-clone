<template>
  <div class="relative min-h-screen bg-slate-100 dark:bg-slate-900">
    <!-- Hero section with image -->
    <div class="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden">
      <!-- Main image -->
      <img 
        src="/images/jogja.jpg" 
        alt="Survey Kepuasan Masyarakat" 
        class="object-cover w-full h-full"
      />
      
      <!-- Overlay gradient -->
      <div class="absolute inset-0 bg-gradient-to-b from-blue-600/30 to-blue-900/80"></div>
      
      <!-- Page header info -->
      <div class="absolute bottom-0 left-0 w-full p-6 md:p-8 lg:p-10">
        <div class="container mx-auto max-w-7xl">
          <div class="inline-block px-3 py-1 mb-3 text-sm font-medium text-white rounded-full bg-gradient-to-r from-blue-500 to-blue-400 backdrop-blur-sm">
            Layanan
          </div>
          
          <h1 class="max-w-4xl mb-2 text-2xl font-bold text-white md:text-3xl lg:text-4xl">
            Survei Kepuasan Masyarakat (SKM)
          </h1>
        </div>
      </div>
    </div>

    <!-- Breadcrumb navigation -->
    <div class="container px-4 mx-auto max-w-7xl pt-6 pb-6">
      <div class="py-4">
        <Breadcrumb 
          :items="[
            { text: 'Beranda', to: '/' },
            { text: 'Survei Kepuasan Masyarakat', to: '' }
          ]"
        />
      </div>
    </div>    <!-- Main content area -->
    <div class="container px-4 py-8 mx-auto -mt-10 max-w-7xl">
      <!-- Survey introduction card -->
      <div class="mb-8 overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-xl">
        <div class="relative px-6 py-8 md:p-8 lg:p-10">
          <!-- Decorative elements -->
          <div class="absolute top-0 right-0 w-32 h-32 translate-x-1/2 -translate-y-1/2 bg-blue-400 rounded-full opacity-20 blur-2xl"></div>
          <div class="absolute bottom-0 left-0 w-24 h-24 -translate-x-1/2 translate-y-1/2 bg-blue-300 rounded-full opacity-20 blur-2xl"></div>
          
          <!-- Icon and title -->
          <div class="flex items-center gap-3 mb-6">
            <div class="flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl backdrop-blur-sm">
              <UIcon name="i-heroicons-clipboard-document-check" class="w-6 h-6 text-white" />
            </div>
            <h2 class="text-2xl font-bold text-white">Tentang Survey Kepuasan Masyarakat</h2>
          </div>

          <!-- Introduction text with improved styling -->
          <div class="prose max-w-none prose-invert">
            <div class="grid gap-6 md:grid-cols-2">
              <div class="p-6 bg-white/10 rounded-xl backdrop-blur-sm">
                <h3 class="mb-4 text-lg font-semibold text-white">Apa itu SKM?</h3>
                <p class="text-blue-100">
                  Survei Kepuasan Masyarakat (SKM) adalah data dan informasi
                  tentang tingkat kepuasan masyarakat yang diperoleh dari hasil
                  pengukuran secara kuantitatif dan kualitatif atas pendapat
                  masyarakat dalam memperoleh pelayanan publik.
                </p>
              </div>
              
              <div class="p-6 bg-white/10 rounded-xl backdrop-blur-sm">
                <h3 class="mb-4 text-lg font-semibold text-white">Tujuan Survey</h3>
                <p class="text-blue-100">
                  Survei ini dilakukan sebagai upaya untuk meningkatkan kualitas
                  pelayanan publik dan mengetahui kinerja pelayanan aparatur
                  pemerintah kepada masyarakat.
                </p>
              </div>
            </div>

            <div class="p-6 mt-6 text-center bg-white/10 rounded-xl backdrop-blur-sm">
              <p class="text-lg text-blue-100">
                Kami mohon kepada Bapak/Ibu/Saudara kiranya berkenan mengisi
                Form Kuesioner SKM di bawah ini. Pendapat Anda sangat berarti
                bagi peningkatan mutu pelayanan kami.
              </p>
              <p class="mt-4 text-sm text-blue-200">
                Atas perhatian dan partisipasinya, kami sampaikan terima kasih.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Survey form card -->
      <div class="p-6 bg-white shadow-xl rounded-2xl dark:bg-slate-800 md:p-8">

        <hr class="my-6 border-slate-200 dark:border-slate-700">        <!-- Survey form section -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center gap-3 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full">
            <UIcon name="i-heroicons-pencil-square" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 class="text-xl font-bold text-blue-600 dark:text-blue-400">FORM KUESIONER SKM</h2>
          </div>
        </div>

        <form @submit.prevent="submitForm" class="space-y-8">
          <!-- Survey questions -->
          <div v-for="(item, index) in dataSoal" :key="index" 
               class="p-6 transition-all duration-300 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800">
            <div class="flex items-start gap-4 mb-4">
              <div class="flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-600 bg-blue-100 rounded-full dark:bg-blue-900/50 dark:text-blue-400">
                {{ index + 1 }}
              </div>
              <UFormGroup :label="item.title" class="flex-1" :ui="{ 
                label: 'text-lg font-medium text-slate-800 dark:text-white mb-4'
              }">                <!-- Radio buttons -->
                <template v-if="parseOptions(item.opt)[0]?.type === 'radio'">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div v-for="(optItem, optIndex) in parseOptions(item.opt)" :key="optIndex"
                         class="relative">
                      <label 
                        :for="'opt-' + item.qcode + '-' + optIndex"
                        class="block cursor-pointer"
                      >
                        <div 
                          class="p-4 border rounded-lg transition-all duration-200"
                          :class="[
                            selectedOptions[item.qcode] === optItem.value 
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500' 
                              : 'border-slate-200 hover:border-blue-200 dark:border-slate-700 dark:hover:border-blue-400'
                          ]"
                        >
                          <div class="flex items-start gap-3">
                            <URadio
                              :id="'opt-' + item.qcode + '-' + optIndex"
                              v-model="selectedOptions[item.qcode]"
                              :value="optItem.value"
                              :name="item.qcode"
                              class="mt-0.5"
                            />
                            <span class="text-slate-700 dark:text-slate-200">{{ optItem.title }}</span>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </template>
                
                <!-- Text area -->
                <template v-else-if="parseOptions(item.opt)[0]?.type === 'text'">
                  <UTextarea
                    v-model="selectedOptions[item.qcode]"
                    :placeholder="'Masukkan ' + item.title"
                    rows="3"
                    class="w-full transition-colors border-slate-200 focus:border-blue-500 dark:border-slate-700 dark:focus:border-blue-500"
                  />
                </template>
              </UFormGroup>
            </div>

            <hr v-if="index === 2" class="my-6 border-slate-200 dark:border-slate-700">
          </div>          <!-- Captcha and submit section -->
          <div class="p-6 text-center bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <h3 class="mb-6 text-lg font-medium text-slate-800 dark:text-white">Verifikasi Keamanan</h3>
            
            <!-- Captcha -->
            <div class="flex flex-col items-center justify-center gap-4">
              <div id="captchaForm" class="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm"></div>
              <p v-if="errors.captcha" class="text-red-500 text-sm">{{ errors.captcha }}</p>
            </div>

            <!-- Submit button -->
            <div class="mt-8">
              <UButton
                type="submit"
                color="blue"
                size="xl"
                class="px-12 py-3 font-medium tracking-wide transform transition-transform hover:scale-105"
              >
                <template #leading>
                  <UIcon name="i-heroicons-paper-airplane" class="w-5 h-5" />
                </template>
                KIRIM SURVEY
              </UButton>
              <p class="mt-4 text-sm text-slate-600 dark:text-slate-400">
                Dengan mengirim survey ini, Anda membantu kami meningkatkan kualitas pelayanan
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from '#imports';
import { useSoalStore } from '~/store/survey-masyarakat/soal';

// Configuration & setup
const config = useRuntimeConfig();
const toast = useToast();

// Store
const soalStore = useSoalStore();

// Data
const dataSoal = ref([]);
const selectedOptions = ref({});
const errors = ref({
  getCode: {},
  captcha: ''
});
let widgetId1 = null;

// Methods
const parseOptions = (optionsString) => {
  try {
    return JSON.parse(optionsString);
  } catch (error) {
    console.error('Error parsing options:', error);
    return [];
  }
};

const fetchSoal = async () => {
  try {
    dataSoal.value = await soalStore.getQuestions();
  } catch (error) {
    console.error('Error fetching questions:', error);
  }
};

const submitForm = () => {
  // Check if captcha is loaded
  if (typeof grecaptcha === 'undefined') {
    toast.error('Captcha tidak dapat dimuat. Silakan refresh halaman.', {
      timeout: 3000
    });
    return;
  }

  // Validate captcha
  const captchaValid = grecaptcha.getResponse(widgetId1);
  errors.value.captcha = '';
  
  // Validate all fields
  const isValid = dataSoal.value.every((item) => {
    const selectedOption = selectedOptions.value[item.qcode];
    if (!selectedOption) {      toast.add({ title: item.title + " tidak boleh kosong!", color: 'red' });
      return false;
    }
    return true;
  });

  if (!isValid) {
    return; // Stop form submission if any question is invalid
  }

  if (captchaValid.length === 0) {
    toast.add({ title: "Captcha silakan di isi", color: 'red' });
    errors.value.captcha = "Captcha silahkan di isi";
    return;
  }
  // Process form submission
  const answers = dataSoal.value.map(item => ({
    qid: item.id,
    opt_value: selectedOptions.value[item.qcode]
  }));

  soalStore.submitAnswers(answers)
    .then(() => {      toast.add({
        title: "Terima kasih telah mengisi survei. Masukan Anda sangat berarti bagi peningkatan pelayanan kami.",
        color: 'green',
        timeout: 3000,
        onClose: () => {
          // Reset form and reload or navigate
          selectedOptions.value = {};
          grecaptcha.reset(widgetId1);
        }
      });
    })
    .catch((err) => {
      console.error("Error:", err);
      toast.add({ title: "Kesalahan sistem", color: 'red' });
    });
};

// Initialize reCAPTCHA when component is mounted
const initializeCaptcha = () => {
  // Check if reCAPTCHA script is already loaded
  if (typeof grecaptcha === 'undefined') {
    // If not loaded, add the script
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit';
    script.async = true;
    script.defer = true;
    
    // Define callback function in the global scope
    window.onloadCallback = () => {
      if (document.getElementById('captchaForm')) {
        widgetId1 = grecaptcha.render('captchaForm', {
          sitekey: '6LdGqYIpAAAAAHEnk8JmV8X-P0SSTmRq1UPcHG_k',
          theme: 'light'
        });
      }
    };
    
    document.head.appendChild(script);
  } else {
    // If already loaded, render the captcha directly
    if (document.getElementById('captchaForm')) {
      widgetId1 = grecaptcha.render('captchaForm', {
        sitekey: '6LdGqYIpAAAAAHEnk8JmV8X-P0SSTmRq1UPcHG_k',
        theme: 'light'
      });
    }
  }
};

// Lifecycle hooks
onMounted(() => {
  fetchSoal();
  initializeCaptcha();
});
</script>

<style scoped>
/* Add custom styles for survey form */
:deep(.prose) img {
  border-radius: 0.75rem;
  margin: 2rem 0;
}

:deep(.prose) h2 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: theme('colors.slate.800');
}

:deep(.dark .prose) h2 {
  color: theme('colors.white');
}

:deep(.prose) p {
  margin-bottom: 1.25rem;
  line-height: 1.7;
}
</style>
