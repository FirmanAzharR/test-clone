<template>
  <footer
    class="relative py-16 overflow-hidden transition-colors duration-300"
    :class="[
      isDark
        ? 'bg-gradient-to-b from-green-900 to-slate-900'
        : 'bg-gradient-to-b from-blue-100 via-blue-50 to-slate-100',
    ]"
  >
    <!-- Decorative elements -->
    <div class="absolute inset-0 pointer-events-none">
      <div
        class="absolute w-64 h-64 rounded-full -bottom-32 -right-32 blur-3xl"
        :class="isDark ? 'bg-blue-500/10' : 'bg-blue-500/5'"
      ></div>
      <div
        class="absolute w-64 h-64 rounded-full -top-32 -left-32 blur-3xl"
        :class="isDark ? 'bg-blue-500/10' : 'bg-blue-300/5'"
      ></div>
    </div>

    <!-- Top Section with enhanced design -->
    <div class="container relative px-6 mx-auto mb-12">
      <!-- Shimmer for top section when loading -->
      <div
        v-if="isLoading"
        class="flex flex-col items-center justify-between p-8 shadow-lg rounded-2xl md:flex-row"
        :class="isDark ? 'bg-slate-800' : 'bg-white'"
      >
        <div class="max-w-md mb-6 md:mb-0">
          <Vue3LoadingShimmer class="w-64 h-8 mb-2 rounded" />
          <Vue3LoadingShimmer class="w-40 h-6 mt-2 rounded" />
          <Vue3LoadingShimmer class="w-20 h-1 mt-3 rounded-full" />
        </div>

        <div class="flex flex-col gap-3 sm:flex-row">
          <Vue3LoadingShimmer class="w-40 h-10 rounded-lg" />
          <Vue3LoadingShimmer class="w-40 h-10 rounded-lg" />
        </div>
      </div>

      <!-- Actual top section when loaded -->
      <div
        v-else
        class="flex flex-col items-center justify-between p-8 shadow-lg rounded-2xl md:flex-row"
        :class="isDark ? 'bg-slate-800' : 'bg-white'"
      >
        <div class="max-w-md mb-6 md:mb-0">
          <h2
            class="text-2xl font-bold md:text-3xl"
            :class="isDark ? 'text-white' : 'text-slate-900'"
          >
            {{ footerData?.nama_opd || 'Dinas Komunikasi dan Informatika' }}
          </h2>
          <span class="block mt-2 text-lg text-blue-600 dark:text-blue-400"
            >D.I. Yogyakarta</span
          >
          <div class="w-20 h-1 mt-3 bg-blue-600 rounded-full"></div>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row">
          <UButton
            :color="isDark ? 'blue' : 'blue'"
            variant="solid"
            class="px-6 border-none"
            :class="
              isDark
                ? 'bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500'
                : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'
            "
            icon="i-heroicons-envelope"
            :to="`mailto:${footerData?.email}`"
          >
            Hubungi Kami
          </UButton>

          <UButton
            :color="isDark ? 'gray' : 'white'"
            variant="outline"
            class="px-6"
            :class="
              isDark
                ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                : 'border-blue-200 text-slate-700 hover:bg-blue-50'
            "
            icon="i-heroicons-map"
            @click="openMapModal"
          >
            Peta Situs
          </UButton>
        </div>
      </div>
    </div>

    <!-- Main Footer Content with improved layout -->
    <div class="container relative px-6 mx-auto">
      <!-- Shimmer for footer columns when loading -->
      <div
        v-if="isLoading"
        class="grid grid-cols-1 gap-8 space-x-1 md:grid-cols-2 lg:grid-cols-4"
      >
        <!-- Column 1: Logo and Contact shimmer -->
        <div
          class="p-6 shadow-md rounded-xl"
          :class="isDark ? 'bg-slate-800' : 'bg-white'"
        >
          <div class="flex items-center mb-6 space-x-1 space-y-1">
            <Vue3LoadingShimmer class="w-10 h-10 mr-3 rounded-lg" />
            <Vue3LoadingShimmer class="w-32 h-6 rounded" />
          </div>

          <div class="space-y-4">
            <div
              v-for="i in 3"
              :key="`contact-shimmer-${i}`"
              class="flex items-start"
            >
              <Vue3LoadingShimmer class="w-8 h-8 mr-3 rounded-full" />
              <Vue3LoadingShimmer class="w-full h-4 rounded" />
            </div>
          </div>
        </div>

        <!-- Column 2: Layanan shimmer -->
        <div
          class="p-6 shadow-md rounded-xl"
          :class="isDark ? 'bg-slate-800' : 'bg-white'"
        >
          <div class="flex items-center mb-6 space-y-1">
            <Vue3LoadingShimmer class="w-10 h-10 mr-3 rounded-lg" />
            <Vue3LoadingShimmer class="w-32 h-6 rounded" />
          </div>
          <div class="space-y-3">
            <div
              v-for="i in 4"
              :key="`layanan-shimmer-${i}`"
              class="flex items-center space-y-1"
            >
              <Vue3LoadingShimmer class="w-2 h-2 mr-3 rounded-full" />
              <Vue3LoadingShimmer class="w-full h-4 rounded" />
            </div>
          </div>
        </div>

        <!-- Column 3: Informasi shimmer -->
        <div
          class="p-6 shadow-md rounded-xl"
          :class="isDark ? 'bg-slate-800' : 'bg-white'"
        >
          <div class="flex items-center mb-6 space-y-1">
            <Vue3LoadingShimmer class="w-10 h-10 mr-3 rounded-lg" />
            <Vue3LoadingShimmer class="w-32 h-6 rounded" />
          </div>
          <div class="space-y-3">
            <div
              v-for="i in 4"
              :key="`informasi-shimmer-${i}`"
              class="flex items-center space-y-1"
            >
              <Vue3LoadingShimmer class="w-2 h-2 mr-3 rounded-full" />
              <Vue3LoadingShimmer class="w-full h-4 rounded" />
            </div>
          </div>
        </div>

        <!-- Column 4: Media Sosial shimmer -->
        <div
          class="p-6 shadow-md rounded-xl"
          :class="isDark ? 'bg-slate-800' : 'bg-white'"
        >
          <div class="flex items-center mb-6 space-y-1">
            <Vue3LoadingShimmer class="w-10 h-10 mr-3 rounded-lg" />
            <Vue3LoadingShimmer class="w-32 h-6 rounded" />
          </div>

          <div class="grid grid-cols-4 gap-2">
            <div
              v-for="i in 4"
              :key="`social-shimmer-${i}`"
              class="flex flex-col items-center space-y-1"
            >
              <Vue3LoadingShimmer class="w-10 h-10 mb-1 rounded-full" />
              <Vue3LoadingShimmer class="w-16 h-3 rounded" />
            </div>
          </div>
        </div>
      </div>

      <!-- Actual footer columns when loaded -->
      <div v-else class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <!-- Column 1: Logo and Contact with better styling -->
        <div
          class="p-6 transition-transform duration-300 shadow-md rounded-xl hover:-translate-y-1 hover:shadow-lg"
          :class="isDark ? 'bg-slate-800' : 'bg-white'"
        >
          <div class="flex items-center mb-6">
            <div
              class="flex items-center justify-center w-10 h-10 mr-3 text-white rounded-lg"
              :class="isDark ? 'bg-blue-500' : 'bg-blue-600'"
            >
              <UIcon name="i-heroicons-building-office-2" class="w-6 h-6" />
            </div>
            <h3
              class="text-xl font-bold"
              :class="isDark ? 'text-white' : 'text-slate-900'"
            >
              {{ footerData?.nama_opd || 'Dinas Komunikasi dan Informatika' }}
            </h3>
          </div>

          <div
            class="space-y-4 text-sm"
            :class="isDark ? 'text-slate-300' : 'text-slate-600'"
          >
            <div class="flex items-start group">
              <div
                class="flex items-center justify-center w-8 h-8 mr-3 transition-colors rounded-full"
                :class="
                  isDark
                    ? 'bg-blue-900/50 group-hover:bg-blue-800/70'
                    : 'bg-blue-100 group-hover:bg-blue-200'
                "
              >
                <UIcon
                  name="i-heroicons-map-pin"
                  class="w-4 h-4"
                  :class="isDark ? 'text-blue-400' : 'text-blue-600'"
                />
              </div>
              <p>
                {{ footerData?.alamat || 'Jl. Brigjen Katamso, Yogyakarta' }}
              </p>
            </div>
            <div class="flex items-center group">
              <div
                class="flex items-center justify-center w-8 h-8 mr-3 transition-colors rounded-full"
                :class="
                  isDark
                    ? 'bg-blue-900/50 group-hover:bg-blue-800/70'
                    : 'bg-blue-100 group-hover:bg-blue-200'
                "
              >
                <UIcon
                  name="i-heroicons-envelope"
                  class="w-4 h-4"
                  :class="isDark ? 'text-blue-400' : 'text-blue-600'"
                />
              </div>
              <p>{{ footerData?.email || 'info@jogjaprov.go.id' }}</p>
            </div>
            <div class="flex items-center group">
              <div
                class="flex items-center justify-center w-8 h-8 mr-3 transition-colors rounded-full"
                :class="
                  isDark
                    ? 'bg-blue-900/50 group-hover:bg-blue-800/70'
                    : 'bg-blue-100 group-hover:bg-blue-200'
                "
              >
                <UIcon
                  name="i-heroicons-phone"
                  class="w-4 h-4"
                  :class="isDark ? 'text-blue-400' : 'text-blue-600'"
                />
              </div>
              <p>{{ footerData?.telp || '(0274) 555123' }}</p>
            </div>
          </div>
        </div>

        <!-- Column 3: Informasi with hover effects -->
        <div
          class="p-6 transition-transform duration-300 shadow-md rounded-xl hover:-translate-y-1 hover:shadow-lg"
          :class="isDark ? 'bg-slate-800' : 'bg-white'"
        >
          <div class="flex items-center mb-6">
            <div
              class="flex items-center justify-center w-10 h-10 mr-3 text-white rounded-lg"
              :class="isDark ? 'bg-blue-500' : 'bg-blue-600'"
            >
              <UIcon name="i-heroicons-newspaper" class="w-6 h-6" />
            </div>
            <h3
              class="text-xl font-bold"
              :class="isDark ? 'text-white' : 'text-slate-900'"
            >
              Informasi
            </h3>
          </div>
          <ul class="space-y-3">
            <li v-for="(item, index) in informasiLinks" :key="index">
              <NuxtLink
                :to="item.link"
                :target="isExternalLink(item.link) ? '_blank' : undefined"
                :rel="
                  isExternalLink(item.link) ? 'noopener noreferrer' : undefined
                "
                class="flex items-center group"
                @click="setActiveLink(item.link)"
              >
                <div
                  class="w-2 h-2 mr-3 transition-all duration-300 rounded-full group-hover:w-4"
                  :class="
                    isDark
                      ? 'bg-blue-700 group-hover:bg-blue-500'
                      : 'bg-blue-300 group-hover:bg-blue-600'
                  "
                ></div>
                <span
                  class="text-sm transition-colors"
                  :class="
                    isDark
                      ? 'text-slate-300 group-hover:text-blue-400'
                      : 'text-slate-600 group-hover:text-blue-600'
                  "
                >
                  {{ item.title }}
                </span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Column 4: Media Sosial with enhanced social buttons -->
        <div
          class="p-6 transition-transform duration-300 shadow-md rounded-xl hover:-translate-y-1 hover:shadow-lg"
          :class="isDark ? 'bg-slate-800' : 'bg-white'"
        >
          <div class="flex items-center mb-6">
            <div
              class="flex items-center justify-center w-10 h-10 mr-3 text-white rounded-lg"
              :class="isDark ? 'bg-blue-500' : 'bg-blue-600'"
            >
              <UIcon name="i-heroicons-globe-alt" class="w-6 h-6" />
            </div>
            <h3
              class="text-xl font-bold"
              :class="isDark ? 'text-white' : 'text-slate-900'"
            >
              Media Sosial
            </h3>
          </div>

          <div class="space-y-4">
            <template v-if="footerData && footerData.social">
              <div
                v-for="social in parsedSocial"
                :key="social.id"
                class="flex items-center group"
              >
                <div
                  class="flex items-center justify-center w-8 h-8 mr-3 transition-colors rounded-full"
                  :class="
                    isDark
                      ? 'bg-blue-900/50 group-hover:bg-blue-800/70'
                      : 'bg-blue-100 group-hover:bg-blue-200'
                  "
                >
                  <UIcon
                    :name="`i-mdi-${social.id}`"
                    class="w-4 h-4"
                    :class="isDark ? 'text-blue-400' : 'text-blue-600'"
                  />
                </div>
                <a
                  :href="`https://www.${social.id}.com/${social.sosmed}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-sm transition-colors"
                  :class="
                    isDark
                      ? 'text-slate-300 group-hover:text-blue-400'
                      : 'text-slate-600 group-hover:text-blue-600'
                  "
                >
                  {{ formatSocialName(social.id) }}
                </a>
              </div>
            </template>
            <div v-else class="grid grid-cols-4 gap-2">
              <NuxtLink
                v-for="(icon, index) in socialLinks"
                :key="index"
                :to="icon.link"
                :target="isExternalLink(icon.link) ? '_blank' : undefined"
                :rel="
                  isExternalLink(icon.link) ? 'noopener noreferrer' : undefined
                "
                class="flex flex-col items-center transition-transform duration-300 hover:-translate-y-1"
              >
                <div
                  :class="[
                    'flex items-center justify-center w-10 h-10 mb-1 text-white rounded-full shadow-md',
                    icon.color,
                  ]"
                >
                  <UIcon :name="`i-mdi-${icon.name}`" class="w-5 h-5" />
                </div>
                <span
                  class="text-xs"
                  :class="isDark ? 'text-slate-300' : 'text-slate-600'"
                >
                  {{ icon.name.charAt(0).toUpperCase() + icon.name.slice(1) }}
                </span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Analytics Stats Card -->
      <div
        class="p-6 mt-12 mb-8 shadow-lg rounded-2xl"
        :class="isDark ? 'bg-slate-800/80' : 'bg-white'"
      >
        <!-- Shimmer for analytics section when loading -->
        <div
          v-if="isLoading || footerStore.isLoading"
          class="flex flex-wrap justify-center gap-8"
        >
          <div
            v-for="i in 5"
            :key="`analytics-shimmer-${i}`"
            class="flex flex-col items-center"
          >
            <Vue3LoadingShimmer class="w-16 h-16 mb-3 rounded-full" />
            <Vue3LoadingShimmer class="w-32 h-4 mb-1 rounded" />
            <Vue3LoadingShimmer class="w-16 h-6 rounded" />
          </div>
        </div>
        <!-- Actual analytics section when loaded -->
        <div
          v-else
          class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 md:gap-6"
        >
          <!-- Today's Visitors -->
          <div class="flex flex-col items-center">
            <div
              class="flex items-center justify-center mb-3 text-white rounded-full w-14 h-14 md:w-16 md:h-16"
              :class="
                isDark
                  ? 'bg-gradient-to-br from-blue-600 to-blue-400'
                  : 'bg-gradient-to-br from-blue-600 to-blue-400'
              "
            >
              <UIcon name="i-heroicons-user-group" class="w-8 h-8" />
            </div>
            <p
              class="mb-1 text-sm font-medium"
              :class="isDark ? 'text-slate-300' : 'text-slate-500'"
            >
              Pengunjung Hari Ini
            </p>
            <p
              class="text-2xl font-bold"
              :class="isDark ? 'text-white' : 'text-slate-800'"
            >
              {{ footerStore.totalTodaySums.activeUsers || 0 }}
            </p>
          </div>

          <!-- Today's Page Views -->
          <div class="flex flex-col items-center">
            <div
              class="flex items-center justify-center mb-3 text-white rounded-full w-14 h-14 md:w-16 md:h-16"
              :class="
                isDark
                  ? 'bg-gradient-to-br from-green-600 to-green-400'
                  : 'bg-gradient-to-br from-green-600 to-green-400'
              "
            >
              <UIcon name="i-heroicons-document-text" class="w-8 h-8" />
            </div>
            <p
              class="mb-1 text-sm font-medium"
              :class="isDark ? 'text-slate-300' : 'text-slate-500'"
            >
              Views Hari Ini
            </p>
            <p
              class="text-2xl font-bold"
              :class="isDark ? 'text-white' : 'text-slate-800'"
            >
              {{ footerStore.totalTodaySums.screenPageViews || 0 }}
            </p>
          </div>

          <!-- Last 7 Days Visitors -->
          <div class="flex flex-col items-center">
            <div
              class="flex items-center justify-center mb-3 text-white rounded-full w-14 h-14 md:w-16 md:h-16"
              :class="
                isDark
                  ? 'bg-gradient-to-br from-yellow-600 to-yellow-400'
                  : 'bg-gradient-to-br from-yellow-600 to-yellow-400'
              "
            >
              <UIcon name="i-heroicons-users" class="w-8 h-8" />
            </div>
            <p
              class="mb-1 text-sm font-medium text-center"
              :class="isDark ? 'text-slate-300' : 'text-slate-500'"
            >
              Pengunjung 7 Hari
            </p>
            <p
              class="text-2xl font-bold"
              :class="isDark ? 'text-white' : 'text-slate-800'"
            >
              {{ footerStore.total7Sums.activeUsers || 0 }}
            </p>
          </div>
          <!-- Total Visitors -->
          <div class="flex flex-col items-center">
            <div
              class="flex items-center justify-center mb-3 text-white rounded-full w-14 h-14 md:w-16 md:h-16"
              :class="
                isDark
                  ? 'bg-gradient-to-br from-purple-600 to-purple-400'
                  : 'bg-gradient-to-br from-purple-600 to-purple-400'
              "
            >
              <UIcon name="i-heroicons-chart-bar" class="w-8 h-8" />
            </div>
            <p
              class="mb-1 text-sm font-medium"
              :class="isDark ? 'text-slate-300' : 'text-slate-500'"
            >
              Total Pengunjung
            </p>
            <p
              class="text-2xl font-bold"
              :class="isDark ? 'text-white' : 'text-slate-800'"
            >
              {{ (footerStore.totalSums.activeUsers || 0).toLocaleString() }}
            </p>
          </div>

          <!-- Total Views -->
          <div class="flex flex-col items-center">
            <div
              class="flex items-center justify-center mb-3 text-white rounded-full w-14 h-14 md:w-16 md:h-16"
              :class="
                isDark
                  ? 'bg-gradient-to-br from-indigo-600 to-indigo-400'
                  : 'bg-gradient-to-br from-indigo-600 to-indigo-400'
              "
            >
              <UIcon name="i-heroicons-eye" class="w-8 h-8" />
            </div>
            <p
              class="mb-1 text-sm font-medium"
              :class="isDark ? 'text-slate-300' : 'text-slate-500'"
            >
              Total Views
            </p>
            <p
              class="text-2xl font-bold"
              :class="isDark ? 'text-white' : 'text-slate-800'"
            >
              {{
                (footerStore.totalSums.screenPageViews || 0).toLocaleString()
              }}
            </p>
          </div>

          <!-- Last Updated -->
          <div class="flex flex-col items-center">
            <div
              class="flex items-center justify-center mb-3 text-white rounded-full w-14 h-14 md:w-16 md:h-16"
              :class="
                isDark
                  ? 'bg-gradient-to-br from-teal-600 to-teal-400'
                  : 'bg-gradient-to-br from-teal-600 to-teal-400'
              "
            >
              <UIcon name="i-heroicons-clock" class="w-8 h-8" />
            </div>
            <p
              class="mb-1 text-sm font-medium"
              :class="isDark ? 'text-slate-300' : 'text-slate-500'"
            >
              Terakhir Diperbarui
            </p>
            <p
              class="text-lg font-bold"
              :class="isDark ? 'text-white' : 'text-slate-800'"
            >
              {{ formatDate(new Date()) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Copyright Section -->
      <div
        class="pt-8 mt-8 text-center border-t"
        :class="isDark ? 'border-slate-700' : 'border-slate-200'"
      >
        <!-- Shimmer for copyright section when loading -->
        <div v-if="isLoading">
          <Vue3LoadingShimmer class="w-64 h-4 mx-auto mb-4 rounded" />
          <div class="flex flex-wrap justify-center gap-4 mt-4">
            <Vue3LoadingShimmer
              v-for="i in 4"
              :key="`link-shimmer-${i}`"
              class="w-20 h-3 mx-1 rounded"
            />
          </div>
        </div>

        <!-- Actual copyright section when loaded -->
        <div v-else>
          <p
            class="text-sm"
            :class="isDark ? 'text-slate-400' : 'text-slate-600'"
          >
            © {{ new Date().getFullYear() }}
            {{
              footerData?.nama_opd ||
              'Dinas Komunikasi dan Informatika D.I. Yogyakarta'
            }}. All rights reserved.
          </p>
        </div>
      </div>
    </div>

    <!-- Map Modal -->
    <UModal v-model="showMapModal" :ui="{ width: 'sm:max-w-5xl' }">
      <UCard
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-xl font-semibold"
              :class="isDark ? 'text-white' : 'text-gray-900'"
            >
              Peta Lokasi
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="rounded-full"
              @click="showMapModal = false"
            />
          </div>
        </template>

        <div
          class="flex items-center justify-center w-full"
          style="min-height: 500px"
        >
          <div
            v-if="mapIframeHtml"
            v-html="sanitizeMapHtml(mapIframeHtml)"
            class="flex justify-center w-full h-full"
          ></div>
          <div
            v-else
            class="flex flex-col items-center justify-center w-full h-full p-8 text-center"
          >
            <UIcon
              name="i-heroicons-map"
              class="w-12 h-12 mb-4"
              :class="isDark ? 'text-blue-400' : 'text-blue-600'"
            />
            <p :class="isDark ? 'text-gray-300' : 'text-gray-600'">
              Peta lokasi tidak tersedia saat ini.
            </p>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end">
            <UButton color="gray" variant="solid" @click="showMapModal = false">
              Tutup
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </footer>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { useFooterStore } from '@/store/footer/footer.js';
import { useLayout } from '@/store/layouts/layouts.js';
import Vue3LoadingShimmer from 'vue3-loading-shimmer';
import { useRoute } from 'vue-router';
import { useRuntimeConfig } from '#app';
import { useRouter } from 'vue-router';
import { useAuthToken } from '~/composable/useAuthToken'

const footerStore = useFooterStore();
const layoutStore = useLayout();
const route = useRoute();
const isLoading = ref(true); // Add loading state for footer
const activeLink = ref('');
const showMapModal = ref(false);

const informasiLinks = ref([
  { title: 'Berita Terbaru', link: '/berita' },
  { title: 'Galeri Foto', link: '/foto' },
  { title: 'Galeri Video', link: '/video' },
  { title: 'Kebijakan Privasi', link: '/kebijakan', kebijakan: true }
]);

const router = useRouter();
const config = useRuntimeConfig();
const { token } = useAuthToken();
const kebijakanExists = ref(true);
const apiBaseUrl = config.public.apiBaseUrl;
// Function to check kebijakan content availability
const checkKebijakanContent = async () => {
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
  
  // Filter informasiLinks jika konten kebijakan tidak ada
  if (!kebijakanExists.value) {
    informasiLinks.value = informasiLinks.value.filter(item => !item.kebijakan);
  }
};

const socialLinks = ref([
  {
    name: 'facebook',
    color: 'bg-[#1877F2]',
    link: 'https://www.facebook.com/diskominfojogja',
  },
  {
    name: 'twitter',
    color: 'bg-[#1DA1F2]',
    link: 'https://www.twitter.com/diskominfojogja',
  },
  {
    name: 'instagram',
    color: 'bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]',
    link: 'https://www.instagram.com/diskominfojogja',
  },
  {
    name: 'youtube',
    color: 'bg-[#FF0000]',
    link: 'https://www.youtube.com/diskominfojogja',
  },
]);

const isDark = computed(() => {
  return layoutStore.theme === 'dark';
});

const formatSocialName = (id) => {
  const platformNames = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    twitter: 'Twitter',
    youtube: 'YouTube',
  };
  return platformNames[id] || id.charAt(0).toUpperCase() + id.slice(1);
};

const isExternalLink = (link) => {
  if (!link) return false;
  return link.startsWith('http://') || link.startsWith('https://');
};

const setActiveLink = (link) => {
  activeLink.value = link;
};

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

onMounted(async () => {
  console.log('Footer component mounted, initializing data...');
  isLoading.value = true;

  try {
    await footerStore.getFooterData();
    await footerStore.TokenGenerateAnalytic();
    await checkKebijakanContent(); // Check kebijakan content availability
    activeLink.value = route.path;
  } catch (error) {
  } finally {
    setTimeout(() => {
      isLoading.value = false;
      console.log('Footer loading completed');
    }, 1000);
  }
});

const trackSocialClick = (platform) => {
  console.log(`Tracking click on ${platform} social media...`);
  footerStore.trackSocialClick(platform);
};

const footerData = computed(() => footerStore.footerData.data?.[0]);

const parsedSocial = computed(() => {
  if (!footerData.value || !footerData.value.social) return [];
  try {
    return JSON.parse(footerData.value.social);
  } catch (e) {
    console.error('Error parsing social data:', e);
    return [];
  }
});

// Add this method to handle iframe HTML safely
const sanitizeMapHtml = (html) => {
  if (!html) return '';
  // Basic sanitization - only allow iframe tags with safe attributes
  // In a production app, you might want to use a proper sanitizer library
  if (
    html.includes('<iframe') &&
    html.includes('src="https://www.google.com/maps/embed')
  ) {
    // Modify iframe to be responsive and centered
    return html.replace(
      '<iframe',
      '<iframe style="width:100%; height:500px; border:0; display:block; margin:0 auto;"'
    );
  } else if (html.startsWith('https://')) {
    // If it's just a URL, convert it to an iframe with centering styles
    return `<iframe src="${html}" width="100%" height="500px" style="border:0; display:block; margin:0 auto;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
  }
  return '';
};

const mapIframeHtml = computed(() => {
  return footerData.value?.gmap || '';
});

// Open map modal
const openMapModal = () => {
  showMapModal.value = true;
};
</script>

<style scoped>
/* Hover animations */
.hover\:-translate-y-1:hover {
  transform: translateY(-0.25rem);
  transition: transform 0.3s ease;
}

/* Gradient animations */
.bg-gradient-to-r {
  background-size: 200% auto;
  transition: background-position 0.5s ease;
}

.bg-gradient-to-r:hover {
  background-position: right center;
}

/* Smooth transitions */
a,
button,
div {
  transition: all 0.3s ease;
}

/* Dark mode transitions */
.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>
