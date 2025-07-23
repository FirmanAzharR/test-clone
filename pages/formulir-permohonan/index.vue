<template>
  <div class="relative min-h-screen bg-slate-100 dark:bg-slate-900">
    <!-- Hero section with image -->
    <div class="relative w-full h-[40vh] overflow-hidden">
      
      <!-- Overlay gradient -->
      <div class="absolute inset-0 bg-gradient-to-b from-blue-600 to-blue-900/90"></div>
      
      <!-- Page header info -->
      <div class="absolute bottom-0 left-0 w-full p-6 md:p-8 lg:p-10">
        <div class="container mx-auto max-w-7xl">
          <div class="inline-block px-3 py-1 mb-3 text-sm font-medium text-white rounded-full bg-gradient-to-r from-blue-500 to-blue-400 backdrop-blur-sm">
            Layanan Publik
          </div>
          
          <h1 class="max-w-4xl mb-2 text-2xl font-bold text-white md:text-3xl lg:text-4xl">
            Formulir Permohonan Informasi Publik
          </h1>
          
          <div class="flex flex-wrap items-center gap-4 mt-4">
            <div class="flex items-center text-blue-100">
              <UIcon name="i-heroicons-information-circle" class="w-4 h-4 mr-2" />
              <span class="text-sm">Isi formulir untuk mendapatkan informasi publik</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Main content area -->
    <div class="container px-4 py-28 mx-auto -mt-20 max-w-7xl space-y-8">
      <!-- Breadcrumb navigation -->
      <div class="container px-2 mx-auto max-w-7xl pt-2 pb-6">
          <div class="py-2">
            <Breadcrumb 
              :items="[
                { text: detailTitle || 'Formulir Permohonan Informasi Publik', to: '' }
              ]"
              :loading="isDetailBeritaLoading"
            />
          </div>
        </div>
      <div class="p-8 bg-white shadow-xl rounded-2xl dark:bg-slate-800 md:p-10 space-y-6">
        <!-- Tabs for Permohonan and Tracking -->
        <UTabs :ui="{
          base: 'focus:outline-none',
          list: {
            base: 'relative mb-6',
            background: 'bg-white dark:bg-slate-800',
            rounded: 'rounded-lg',
            marker: {
              wrapper: 'hidden',
            },
            tab: {
              base: 'relative inline-flex items-center justify-center px-4 py-2 transition-colors duration-200 ease-out',
              active: 'text-white bg-blue-600 dark:bg-blue-600 dark:text-white font-medium rounded-lg',
              inactive: 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400',
            }
          }
        }" 
        :items="tabs" 
        v-model="activeTab">
          <template #item="{ item }">
            <div class="p-4">
              <!-- Permohonan Form Tab -->
              <div v-if="item.key === 'permohonan'">
                <form @submit.prevent="submitForm">
                  <div class="space-y-6">
                    <!-- Select for Kategori -->
                    <UFormGroup label="Kategori Permohonan">
                      <USelect v-model="kategori" :options="[
                        { label: 'Perorangan', value: 'perorangan' },
                        { label: 'Lembaga', value: 'lembaga' }
                      ]" placeholder="Pilih kategori" />
                      <p v-if="errors.kategori" class="text-red-500 text-sm">{{ errors.kategori }}</p>
                    </UFormGroup>

                    <!-- Nama Input -->
                    <UFormGroup label="Nama Permohonan">
                      <UInput v-model="nama" placeholder="Masukkan nama permohonan" />
                      <p v-if="errors.nama" class="text-red-500 text-sm">{{ errors.nama }}</p>
                    </UFormGroup>

                    <!-- Two Column Layout -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <UFormGroup label="No Identitas (KTP/SIM/PASPOR)">
                        <UInput v-model="no_an" placeholder="Masukkan no identitas" />
                        <p v-if="errors.no_an" class="text-red-500 text-sm">{{ errors.no_an }}</p>
                      </UFormGroup>

                      <UFormGroup label="Email">
                        <UInput v-model="email" type="email" placeholder="Masukkan email" />
                        <p v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</p>
                      </UFormGroup>
                    </div>

                    <!-- Alamat Textarea -->
                    <UFormGroup label="Alamat">
                      <UTextarea v-model="alamat" placeholder="Masukkan alamat" :rows="3" />
                      <p v-if="errors.alamat" class="text-red-500 text-sm">{{ errors.alamat }}</p>
                    </UFormGroup>

                    <!-- Pekerjaan Input -->
                    <UFormGroup label="Pekerjaan">
                      <UInput v-model="pekerjaan" placeholder="Masukkan pekerjaan" />
                      <p v-if="errors.pekerjaan" class="text-red-500 text-sm">{{ errors.pekerjaan }}</p>
                    </UFormGroup>

                    <!-- No Telepon Input -->
                    <UFormGroup label="No. Telepon">
                      <UInput v-model="no_telp" placeholder="Masukkan no telepon" />
                      <p v-if="errors.no_telp" class="text-red-500 text-sm">{{ errors.no_telp }}</p>
                    </UFormGroup>

                    <!-- Rincian Informasi Textarea -->
                    <UFormGroup label="Rincian Informasi yang Dibutuhkan">
                      <UTextarea v-model="rincian" placeholder="Masukkan rincian informasi" :rows="3" />
                      <p v-if="errors.rincian" class="text-red-500 text-sm">{{ errors.rincian }}</p>
                    </UFormGroup>

                    <!-- Tujuan Input -->
                    <UFormGroup label="Tujuan Penggunaan Informasi">
                      <UInput v-model="tujuan" placeholder="Masukkan tujuan penggunaan informasi" />
                      <p v-if="errors.tujuan" class="text-red-500 text-sm">{{ errors.tujuan }}</p>
                    </UFormGroup>

                    <!-- Cara Memperoleh Select -->
                    <UFormGroup label="Cara Memperoleh Informasi">
                      <USelect v-model="cara_memperoleh" :options="[
                        { label: 'Melihat', value: 'Melihat' },
                        { label: 'Membaca', value: 'Membaca' },
                        { label: 'Mendengarkan', value: 'Mendengarkan' },
                        { label: 'Mencatat', value: 'Mencatat' },
                        { label: 'Mendapatkan salinan informasi (hardcopy/softcopy)', value: 'Mendapatkan salinan informasi (hardcopy/softcopy)' }
                      ]" placeholder="Pilih cara memperoleh" />
                      <p v-if="errors.cara_memperoleh" class="text-red-500 text-sm">{{ errors.cara_memperoleh }}</p>
                    </UFormGroup>
                    
                    <!-- Mendapatkan Salinan Informasi -->
                    <UFormGroup label="Mendapatkan Salinan Informasi">
                      <USelect v-model="salinan_informasi" :options="[
                        { label: 'hardcopy', value: 'hardcopy' },
                        { label: 'softcopy', value: 'softcopy' },
                      ]" placeholder="Pilih cara Mendapatkan Salinan Informasi" />
                      <p v-if="errors.salinan_informasi" class="text-red-500 text-sm">{{ errors.salinan_informasi }}</p>
                    </UFormGroup>

                    <!-- Cara Mendapatkan Select -->
                    <UFormGroup label="Cara Mendapatkan Salinan Informasi">
                      <USelect v-model="cara_mendapatkan" :options="[
                        { label: 'Mengambil Langsung', value: 'Mengambil Langsung' },
                        { label: 'Kurir', value: 'Kurir' },
                        { label: 'Pos', value: 'Pos' },
                        { label: 'Faksimili', value: 'Faksimili' },
                        { label: 'Email', value: 'Email' }
                      ]" placeholder="Pilih cara mendapatkan" />
                      <p v-if="errors.cara_mendapatkan" class="text-red-500 text-sm">{{ errors.cara_mendapatkan }}</p>
                    </UFormGroup>                    <!-- Captcha -->
                    <div class="p-6 text-center bg-slate-50 dark:bg-slate-800/50 rounded-xl mb-6">
                      <h3 class="mb-6 text-lg font-medium text-slate-800 dark:text-white">Verifikasi Keamanan</h3>
                      
                      <!-- Captcha -->
                      <div class="flex flex-col items-center justify-center gap-4">
                        <div id="captchaForm" class="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm"></div>
                        <p v-if="errors.captcha" class="text-red-500 text-sm">{{ errors.captcha }}</p>
                      </div>
                    </div>

                    <!-- Submit Button -->
                    <div class="mt-6">
                      <UButton 
                        type="submit" 
                        color="blue"
                        variant="solid"
                        block 
                        :loading="isSubmitting"
                      >
                        {{ isSubmitting ? 'Menyimpan...' : 'Kirim Permohonan' }}
                      </UButton>
                    </div>
                  </div>
                </form>
              </div>

              <!-- Tracking Tab -->
              <div v-if="item.key === 'tracking'">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 class="text-lg font-semibold mb-4 text-slate-800 dark:text-white">Lacak Status Permohonan</h3>
                    <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      Masukkan nomor permohonan dan alamat email yang Anda gunakan untuk melacak status permohonan informasi.
                    </p>

                    <form @submit.prevent="onSubmit" class="space-y-6">
                      <UFormGroup label="Nomor Permohonan">
                        <UInput v-model="form.no_permohonan" placeholder="Masukkan nomor permohonan" required />
                      </UFormGroup>

                      <UFormGroup label="Alamat Email">
                        <UInput v-model="form.email" type="email" placeholder="Masukkan alamat email" required />
                      </UFormGroup>

                      <UButton 
                        type="submit" 
                        color="blue"
                        variant="solid"
                        block 
                        :loading="isTracking"
                      >
                        {{ isTracking ? 'Mencari...' : 'Lacak Permohonan' }}
                      </UButton>
                    </form>
                  </div>

                  <!-- Tracking Results -->
                  <div v-if="showLacak" class="bg-slate-50 p-6 rounded-xl dark:bg-slate-700/30">
                    <h4 class="text-lg font-medium mb-4 text-slate-800 dark:text-white">
                      <UIcon name="i-heroicons-document-text" class="w-5 h-5 mr-2 inline-block" />
                      Status Permohonan
                    </h4>
                    
                    <div class="space-y-4">
                      <div class="grid grid-cols-12 gap-2">
                        <span class="text-sm font-semibold col-span-5 text-slate-700 dark:text-slate-300">Kategori Permohonan:</span>
                        <span class="col-span-7 text-slate-800 dark:text-white">{{ lacak.kategori }}</span>
                      </div>
                      
                      <div class="grid grid-cols-12 gap-2">
                        <span class="text-sm font-semibold col-span-5 text-slate-700 dark:text-slate-300">Nama Pemohon:</span>
                        <span class="col-span-7 text-slate-800 dark:text-white">{{ lacak.nama }}</span>
                      </div>

                      <div class="grid grid-cols-12 gap-2">
                        <span class="text-sm font-semibold col-span-5 text-slate-700 dark:text-slate-300">No. Identitas:</span>
                        <span class="col-span-7 text-slate-800 dark:text-white">{{ lacak.no_an }}</span>
                      </div>

                      <div class="grid grid-cols-12 gap-2">
                        <span class="text-sm font-semibold col-span-5 text-slate-700 dark:text-slate-300">Alamat:</span>
                        <span class="col-span-7 text-slate-800 dark:text-white">{{ lacak.alamat }}</span>
                      </div>

                      <div class="grid grid-cols-12 gap-2">
                        <span class="text-sm font-semibold col-span-5 text-slate-700 dark:text-slate-300">Email:</span>
                        <span class="col-span-7 text-slate-800 dark:text-white">{{ lacak.email }}</span>
                      </div>

                      <div class="grid grid-cols-12 gap-2">
                        <span class="text-sm font-semibold col-span-5 text-slate-700 dark:text-slate-300">No. Telp:</span>
                        <span class="col-span-7 text-slate-800 dark:text-white">{{ lacak.telp }}</span>
                      </div>

                      <div class="grid grid-cols-12 gap-2">
                        <span class="text-sm font-semibold col-span-5 text-slate-700 dark:text-slate-300">Pekerjaan:</span>
                        <span class="col-span-7 text-slate-800 dark:text-white">{{ lacak.pekerjaan }}</span>
                      </div>

                      <div class="grid grid-cols-12 gap-2">
                        <span class="text-sm font-semibold col-span-5 text-slate-700 dark:text-slate-300">Status Permohonan:</span>
                        <span class="col-span-7">
                          <UBadge :color="getStatusColor(lacak.status)" class="w-fit">
                            {{ lacak.status }}
                          </UBadge>
                        </span>
                      </div>

                      <div class="grid grid-cols-12 gap-2">
                        <span class="text-sm font-semibold col-span-5 text-slate-700 dark:text-slate-300">Tanggal Dibuat:</span>
                        <span class="col-span-7 text-slate-800 dark:text-white">{{ formatDate(lacak.created_at) }}</span>
                      </div>

                      <div v-if="alasanShow" class="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg mt-3">
                        <h5 class="text-sm font-semibold mb-1 text-red-700 dark:text-red-300">Alasan Penolakan:</h5>
                        <p class="text-sm text-red-600 dark:text-red-400">{{ lacak.alasan }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </UTabs>
      </div>
    </div>
      </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from '#imports';
import { usePermohonanStore } from '~/store/permohonan/permohonan';

// Configuration
const config = useRuntimeConfig();
const toast = useToast();

// Tabs state
const activeTab = ref(0);
const tabs = [
  { key: 'permohonan', label: 'Permohonan Informasi Publik' },
  { key: 'tracking', label: 'Tracking Permohonan' }
];

// Form data refs
const kategori = ref('');
const nama = ref('');
const no_an = ref('');
const email = ref('');
const alamat = ref('');
const pekerjaan = ref('');
const no_telp = ref('');
const rincian = ref('');
const tujuan = ref('');
const cara_memperoleh = ref('');
const salinan_informasi = ref('');
const cara_mendapatkan = ref('');
const isSubmitting = ref(false);
const isTracking = ref(false);
let widgetId1 = null; // For reCAPTCHA

const errors = ref({});
const form = ref({
  email: '',
  no_permohonan: ''
});

// Tracking data
const showLacak = ref(false);
const lacak = ref({});
const alasanShow = ref(false);

// Methods
const permohonanStore = usePermohonanStore();

const createPermohonan = async (formData) => {
  try {
    // Convert to array of key-value pairs for store
    const formDataArray = [
      ['kategori', formData.kategori],
      ['nama', formData.nama],
      ['no_an', formData.no_an],
      ['email', formData.email],
      ['alamat', formData.alamat],
      ['telp', formData.no_telp],
      ['pekerjaan', formData.pekerjaan],
      ['rincian', formData.rincian],
      ['tujuan', formData.tujuan],
      ['cara', formData.cara_memperoleh],
      ['salinan_info', formData.salinan_informasi],
      ['cara_dapat', formData.cara_mendapatkan],
      ['status', 'proses']
    ];
    
    const response = await permohonanStore.createUserPermohonan(formDataArray);
    return response;
  } catch (error) {
    console.error("Failed to create permohonan:", error);
    if (error.response?.data?.message) {
      toast.add({ title: error.response.data.message, color: 'red' });
    }
    throw error;
  }
};

const submitForm = async () => {
  try {
    isSubmitting.value = true;
    errors.value = {};

    // Check if captcha is loaded
    if (typeof grecaptcha === 'undefined') {
      toast.add({ title: 'Captcha tidak dapat dimuat. Silakan refresh halaman.', color: 'red' });
      isSubmitting.value = false;
      return;
    }

    // Validate captcha
    const captchaValid = grecaptcha.getResponse(widgetId1);
    errors.value.captcha = '';
    
    if (captchaValid.length === 0) {
      toast.add({ title: "Captcha silakan di isi", color: 'red' });
      errors.value.captcha = "Captcha silahkan di isi";
      isSubmitting.value = false;
      return;
    }
    
    errors.value = {}; // Reset errors before validation
    
    // Form validation
    if (!kategori.value) errors.value.kategori = 'Kategori harus diisi';
    if (!nama.value) errors.value.nama = 'Nama harus diisi';
    if (!no_an.value) errors.value.no_an = 'No Identitas harus diisi';
    if (!email.value) errors.value.email = 'Email harus diisi';
    if (!alamat.value) errors.value.alamat = 'Alamat harus diisi';
    if (!pekerjaan.value) errors.value.pekerjaan = 'Pekerjaan harus diisi';
    if (!no_telp.value) errors.value.no_telp = 'No. Telepon harus diisi';
    if (!rincian.value) errors.value.rincian = 'Rincian informasi harus diisi';
    if (!tujuan.value) errors.value.tujuan = 'Tujuan penggunaan harus diisi';
    if (!cara_memperoleh.value) errors.value.cara_memperoleh = 'Cara memperoleh harus diisi';
    if (!salinan_informasi.value) errors.value.salinan_informasi = 'Salinan informasi harus diisi';
    if (!cara_mendapatkan.value) errors.value.cara_mendapatkan = 'Cara mendapatkan harus diisi';
    
    // Check if there are any errors
    if (Object.keys(errors.value).length > 0) {
      toast.add({ title: 'Silakan lengkapi semua field yang diperlukan', color: 'yellow' });
      isSubmitting.value = false;
      return;
    }
    
    // Prepare form data
    const formData = {
      kategori: kategori.value,
      nama: nama.value,
      no_an: no_an.value,
      email: email.value,
      alamat: alamat.value,
      pekerjaan: pekerjaan.value,
      no_telp: no_telp.value,
      rincian: rincian.value,
      tujuan: tujuan.value,
      cara_memperoleh: cara_memperoleh.value,
      salinan_informasi: salinan_informasi.value,
      cara_mendapatkan: cara_mendapatkan.value,
      status: 'proses'
    };
    
    // Send to API
    const response = await createPermohonan(formData);
      if (response) {
      toast.add({ title: 'Permohonan informasi berhasil dikirim', color: 'green' });
      
      // Reset form fields
      kategori.value = '';
      nama.value = '';
      no_an.value = '';
      email.value = '';
      alamat.value = '';
      pekerjaan.value = '';
      no_telp.value = '';
      rincian.value = '';
      tujuan.value = '';
      cara_memperoleh.value = '';
      salinan_informasi.value = '';
      cara_mendapatkan.value = '';
      
      // Reset captcha
      if (widgetId1) {
        grecaptcha.reset(widgetId1);
      }
    }
  } catch (error) {
    toast.add({ title: 'Terjadi kesalahan saat mengirim permohonan', color: 'red' });
    console.error('Form submission error:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const onSubmit = async (event) => {
  try {
    event.preventDefault();
    isTracking.value = true;
    showLacak.value = false;

    if (!form.value.no_permohonan || !form.value.email) {
      toast.add({ title: 'Nomor permohonan dan email harus diisi', color: 'yellow' });
      isTracking.value = false;
      return;
    }

    try {
      const response = await permohonanStore.trackPermohonan(form.value.no_permohonan);
      if (response) {
        showLacak.value = true;
        lacak.value = response;
        alasanShow.value = response.status === 'ditolak';
        toast.add({ title: 'Informasi permohonan berhasil ditemukan', color: 'green' });
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.add({ title: 'Nomor permohonan tidak ditemukan', color: 'red' });
      } else {
        toast.add({ title: 'Terjadi kesalahan saat melacak permohonan', color: 'red' });
      }
      console.error('Tracking error:', error);
    }
  } finally {
    isTracking.value = false;
  }
};

const getStatusColor = (status) => {
  const statusMap = {
    'Menunggu': 'yellow',
    'Diproses': 'blue',
    'proses': 'blue',
    'Ditolak': 'red',
    'ditolak': 'red',
    'Selesai': 'green',
    'selesai': 'green'
  };
  return statusMap[status] || 'gray';
};

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return '-';
  
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const date = new Date(dateString);
  const dayName = days[date.getDay()];
  const day = date.getDate();
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();

  return `${dayName}, ${day} ${monthName} ${year}`;
};

// Initialize reCAPTCHA
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

// Initialize page
onMounted(() => {
  initializeCaptcha();
});
</script>

<style scoped>
/* Custom styles for the formulir permohonan page */
.prose h2 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: theme('colors.slate.800');
}

.dark .prose h2 {
  color: theme('colors.white');
}

/* Transition effects */
.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>