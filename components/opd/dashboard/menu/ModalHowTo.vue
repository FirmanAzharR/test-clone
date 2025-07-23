<template>
  <div>
    <UButton variant="ghost" color="gray" icon="material-symbols:help-outline" @click="isOpen = true">
      Bantuan
    </UButton>

    <UModal v-model="isOpen" :ui="{ width: 'max-w-4xl' }" :prevent-close="true">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="flex items-center text-xl font-semibold text-gray-900 dark:text-white">
              <Icon name="material-symbols:menu-book" class="mr-2 text-blue-500" />
              Panduan Penggunaan Menu Manager
            </h3>
            <UButton color="gray" variant="ghost" icon="material-symbols:close" class="-my-1" @click="isOpen = false" />
          </div>
        </template>

        <div class="space-y-6">
          <div>
            <h4 class="mb-2 text-lg font-medium text-blue-600 dark:text-blue-400">
              <Icon name="material-symbols:menu" class="inline-block mr-1" />
              Mengelola Menu Utama
            </h4>
            <div class="pl-6 space-y-2">
              <div class="flex items-start">
                <UBadge color="blue" class="mt-1 mr-2">1</UBadge>
                <p>
                  <span class="font-medium">Tambah Menu:</span> Klik tombol "Tambah Menu"
                  di bagian atas untuk membuat menu baru.
                </p>
              </div>
              <div class="flex items-start">
                <UBadge color="blue" class="mt-1 mr-2">2</UBadge>
                <p>
                  <span class="font-medium">Edit Menu:</span> Klik tombol "Edit" pada menu
                  yang ingin diubah.
                </p>
              </div>
              <div class="flex items-start">
                <UBadge color="blue" class="mt-1 mr-2">3</UBadge>
                <p>
                  <span class="font-medium">Hapus Menu:</span> Klik tombol "Hapus" pada
                  menu yang ingin dihapus.
                </p>
              </div>
              <div class="flex items-start">
                <UBadge color="blue" class="mt-1 mr-2">4</UBadge>
                <p>
                  <span class="font-medium">Mengubah Urutan:</span> Drag and drop menu
                  dengan menarik ikon
                  <Icon name="akar-icons:drag-horizontal-fill" class="inline-block mx-1" />
                  untuk mengubah urutan menu.
                </p>
              </div>
            </div>
          </div>
          <div>
            <h4 class="mb-2 text-lg font-medium text-blue-600 dark:text-blue-400">
              <Icon name="lucide:layers" class="inline-block mr-1" />
              Mengelola Submenu (Hingga 3 Level)
            </h4>
            <div class="pl-6 space-y-2">
              <div class="flex items-start">
                <UBadge color="blue" class="mt-1 mr-2">1</UBadge>
                <p>
                  <span class="font-medium">Tampilan Submenu:</span> Secara default semua
                  submenu tersembunyi. Klik ikon
                  <Icon name="heroicons:chevron-down" class="inline-block mx-1 text-gray-500" />
                  untuk membuka submenu dan
                  <Icon name="heroicons:chevron-up" class="inline-block mx-1 text-gray-500" />
                  untuk menutupnya.
                </p>
              </div>
              <div class="flex items-start">
                <UBadge color="blue" class="mt-1 mr-2">2</UBadge>
                <p>
                  <span class="font-medium">Tambah Submenu:</span> Untuk menambahkan
                  submenu, klik tombol '+' sesuai tingkatannya: pada menu utama untuk
                  menambahkan submenu level 1, pada submenu level 1 untuk menambahkan
                  submenu level 2, dan pada submenu level 2 untuk menambahkan submenu
                  level 3.
                </p>
              </div>
              <div class="flex items-start">
                <UBadge color="blue" class="mt-1 mr-2">3</UBadge>
                <p>
                  <span class="font-medium">Edit Submenu:</span> Klik tombol "Edit" pada
                  submenu di level manapun yang ingin diubah.
                </p>
              </div>
              <div class="flex items-start">
                <UBadge color="blue" class="mt-1 mr-2">4</UBadge>
                <p>
                  <span class="font-medium">Hapus Submenu:</span> Klik tombol "Hapus" pada
                  submenu di level manapun yang ingin dihapus.
                </p>
              </div>
              <div class="flex items-start">
                <UBadge color="blue" class="mt-1 mr-2">5</UBadge>
                <p>
                  <span class="font-medium">Mengubah Urutan Submenu:</span> Drag and drop
                  submenu dengan menarik ikon
                  <Icon name="ic:twotone-drag-indicator" class="inline-block mx-1" />
                  untuk mengubah urutan submenu pada level yang sama.
                </p>
              </div>
            </div>
          </div>
          <div>
            <h4 class="mb-2 text-lg font-medium text-purple-600 dark:text-purple-400">
              <Icon name="material-symbols:drag-pan" class="inline-block mr-1" />
              Fitur Drag and Drop Multi-Level
            </h4>
            <div class="pl-6 space-y-2">
              <div class="flex items-start">
                <UBadge color="purple" class="mt-1 mr-2">1</UBadge>
                <div>
                  <p class="font-medium">Mengubah Urutan Pada Level yang Sama:</p>
                  <p class="mt-1 text-sm">
                    Setiap menu dan submenu dapat diurutkan dengan drag and drop pada
                    level yang sama. Misalnya, submenu level 1 hanya dapat diurutkan
                    dengan sesama submenu level 1.
                  </p>
                  <div class="p-2 mt-1 text-sm bg-gray-100 rounded-md dark:bg-gray-800">
                    <Icon name="material-symbols:info-outline" class="inline-block mr-1 text-blue-500" />
                    <span>Setiap level submenu ditandai dengan warna dan border yang berbeda:
                      Level 1 (teal), Level 2 (indigo), Level 3 (purple).</span>
                  </div>
                </div>
              </div>
              <div class="flex items-start">
                <UBadge color="purple" class="mt-1 mr-2">2</UBadge>
                <div>
                  <p class="font-medium">Mengubah Submenu Antar Level:</p>
                  <p class="mt-1 text-sm">
                    Anda dapat memindahkan submenu setingkat dari satu menu ke menu lain.
                    Misalnya, seret submenu level 1 dari "Menu A" ke area submenu level 1
                    di "Menu B".
                  </p>
                </div>
              </div>
              <div class="flex items-start">
                <UBadge color="purple" class="mt-1 mr-2">5</UBadge>
                <div>
                  <p class="font-medium">Batasan:</p>
                  <p class="mt-1 text-sm">
                    Fitur drag and drop hanya berlaku untuk submenu dengan level yang sama
                    dan digunakan untuk mengubah urutan.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 class="mb-2 text-lg font-medium text-red-600 dark:text-red-400">
              <Icon name="material-symbols:warning-outline" class="inline-block mr-1" />
              Penting
            </h4>
            <div class="p-3 border border-red-200 rounded-md bg-red-50 dark:bg-red-900/20 dark:border-red-800">
              <p class="flex items-center font-medium">
                <Icon name="material-symbols:save-outline" class="mr-2" />
                Jangan lupa untuk menyimpan perubahan!
              </p>
              <p class="mt-1 text-sm">
                Setelah melakukan perubahan pada menu atau submenu, klik tombol "Simpan"
                di bagian bawah untuk menyimpan perubahan ke server.
              </p>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="blue" @click="isOpen = false"> Mengerti </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Interactive Tutorial Overlay with Nuxt UI Components -->
    <UModal v-if="tutorialActive" :model-value="tutorialActive" :ui="{ width: 'max-w-3xl' }" prevent-close>
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <UAvatar size="lg" color="blue" icon="material-symbols:school" />
              <h3 class="ml-3 text-xl font-bold">Tutorial Interaktif</h3>
            </div>
            <UButton color="gray" variant="ghost" icon="material-symbols:close" @click="tutorialActive = false" />
          </div>
        </template>

        <div class="space-y-6">
          <!-- Progress Bar -->
          <UProgress :value="(currentStep / tutorialSteps.length) * 100" color="blue" class="h-2" />

          <!-- Step Header -->
          <div class="flex items-center">
            <UBadge size="lg" color="blue" variant="solid"
              class="flex items-center justify-center w-10 h-10 text-lg font-bold rounded-full">
              {{ currentStep }}
            </UBadge>
            <h4 class="ml-3 text-lg font-medium">
              {{ tutorialSteps[currentStep - 1].title }}
            </h4>
          </div>

          <!-- Content Area -->
          <UCard color="gray" variant="soft" class="border border-gray-200 dark:border-gray-700">
            <p>{{ tutorialSteps[currentStep - 1].description }}</p>

            <!-- Animation Placeholder - You'll add Lottie here -->
            <div class="flex justify-center mt-4">
              <div
                class="flex items-center justify-center w-full h-64 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
                <p class="text-gray-500 dark:text-gray-400">Animation Placeholder</p>
              </div>
            </div>

            <!-- Tip Box -->
            <UAlert v-if="tutorialSteps[currentStep - 1].tip" class="mt-4" color="blue" variant="soft"
              icon="material-symbols:tips-and-updates-outline" :description="tutorialSteps[currentStep - 1].tip" />
          </UCard>
        </div>

        <template #footer>
          <div class="flex items-center justify-between">
            <UButton v-if="currentStep > 1" color="gray" variant="soft" @click="currentStep--">
              <div class="flex items-center">
                <Icon name="material-symbols:arrow-back" class="mr-2" />
                <span>Sebelumnya</span>
              </div>
            </UButton>
            <div v-else></div>

            <div class="flex items-center space-x-2">
              <UBadge v-for="(_, index) in tutorialSteps" :key="index"
                :color="index + 1 === currentStep ? 'blue' : 'gray'"
                :variant="index + 1 === currentStep ? 'solid' : 'soft'" class="w-2 h-2 p-0 rounded-full"
                @click="currentStep = index + 1" />
            </div>

            <UButton v-if="currentStep < tutorialSteps.length" color="blue" @click="currentStep++">
              <div class="flex items-center">
                <span>Selanjutnya</span>
                <Icon name="material-symbols:arrow-forward" class="ml-2" />
              </div>
            </UButton>
            <UButton v-else color="blue" @click="tutorialActive = false">
              <div class="flex items-center">
                <Icon name="material-symbols:check-circle" class="mr-2" />
                <span>Selesai</span>
              </div>
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isOpen = ref(false);
const tutorialActive = ref(false);
const currentStep = ref(1);

// Tutorial steps with detailed instructions
const tutorialSteps = [
  {
    title: "Menambahkan Menu Baru",
    description:
      "Klik tombol 'Tambah Menu' di bagian atas untuk membuat menu baru. Isi form dengan judul menu dan informasi lainnya yang diperlukan.",
    tip: "Gunakan nama menu yang singkat dan jelas untuk memudahkan navigasi pengguna.",
  },
  {
    title: "Mengubah Urutan Menu",
    description:
      "Untuk mengubah urutan menu, klik dan tahan ikon drag (≡) di sebelah kiri nama menu, kemudian geser ke posisi yang diinginkan.",
    tip:
      "Menu akan otomatis diurutkan sesuai dengan posisi yang Anda tentukan. Jangan lupa untuk menyimpan perubahan.",
  },
  {
    title: "Mengelola Submenu Multi-Level",
    description:
      "Sistem mendukung hingga 3 level submenu. Klik tombol '+' untuk menambah submenu dan klik ikon (+) untuk membuka atau (-) untuk menutup area submenu.",
    tip:
      "Setiap level submenu memiliki warna yang berbeda untuk memudahkan identifikasi: Level 1 (teal), Level 2 (indigo), dan Level 3 (purple).",
  },
  {
    title: "Drag and Drop Antar Level",
    description:
      "Anda dapat mengatur urutan menu dan submenu dengan cara drag & drop. Menu/submenu hanya dapat diurutkan pada level yang sama (sesama menu utama, sesama submenu level 1, dst).",
    tip:
      "Untuk mengubah level submenu, drag submenu ke area submenu level yang berbeda. Pastikan area target telah dibuka dengan mengklik ikon (+).",
  },
  {
    title: "Mengubah Submenu Menjadi Menu",
    description:
      "Untuk mengubah submenu dari level manapun menjadi menu utama, drag submenu tersebut ke area menu utama (di luar area submenu).",
    tip:
      "Submenu yang memiliki submenu di dalamnya harus dikosongkan terlebih dahulu sebelum dapat diubah level-nya.",
  },
  {
    title: "Menyimpan Perubahan",
    description:
      "Setelah selesai melakukan perubahan pada menu dan submenu, klik tombol 'Simpan' di bagian bawah untuk menyimpan semua perubahan ke server.",
    tip:
      "Perubahan disimpan sementara di penyimpanan lokal, jadi jika terjadi masalah Anda dapat menggunakan tombol 'Reset' untuk mengembalikan ke perubahan tersimpan terakhir.",
  },
];

// Function to show the interactive tutorial
const showInteractiveTutorial = () => {
  isOpen.value = false; // Close the main help modal
  currentStep.value = 1; // Reset to first step
  tutorialActive.value = true; // Show the tutorial overlay
};
</script>
