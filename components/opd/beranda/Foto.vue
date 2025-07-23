<template>
  <section
    :class="[
      'w-full py-14 transition-colors duration-300',
      isDark
        ? 'dark bg-gradient-to-t from-green-900 to-green-800/45'
        : 'bg-gradient-to-b from-blue-100 via-blue-50 to-slate-100',
    ]"
  >
    <!-- Decorative elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        :class="[
          'absolute w-64 h-64 rounded-full -top-32 -right-32 blur-3xl',
          isDark ? 'bg-blue-500/10' : 'bg-blue-500/5',
        ]"
      ></div>
      <div
        :class="[
          'absolute w-64 h-64 rounded-full -bottom-32 -left-32 blur-3xl',
          isDark ? 'bg-blue-500/10' : 'bg-blue-500/5',
        ]"
      ></div>
    </div>

    <div class="container relative px-4 mx-auto max-w-7xl">
      <!-- Header Section with modern design -->
      <div class="mb-12 text-center">
        <div
          :class="[
            'inline-block px-3 py-1 mb-3 text-sm font-medium rounded-full transition-all duration-300 transform hover:scale-105',
            isDark
              ? 'text-blue-300 bg-blue-900/40'
              : 'text-blue-600 bg-blue-100',
          ]"
        >
          <span class="flex items-center">
            <UIcon name="i-heroicons-sparkles" class="w-4 h-4 mr-1" />
            Multimedia
          </span>
        </div>
        <h2
          :class="[
            'text-3xl font-bold md:text-4xl lg:text-5xl transition-all duration-300',
            isDark ? 'text-white' : 'text-slate-900',
          ]"
        >
          <span
            :class="[
              'text-2xl font-normal',
              isDark ? 'text-blue-300' : 'text-blue-600',
              'aksara-jawa',
            ]"
            v-if="isAksaraJawaEnabled"
          >
            ꧋{{ galeriTitle }}
          </span>
          <br />
          <div class="mt-4">Galleri Foto</div>
        </h2>
        <div class="flex items-center justify-center mt-4">
          <div
            :class="[
              'w-12 h-1 rounded-full',
              isDark
                ? 'bg-gradient-to-r from-blue-500 to-blue-300'
                : 'bg-gradient-to-r from-blue-600 to-blue-400',
            ]"
          ></div>
          <div
            :class="[
              'w-2 h-2 mx-2 rounded-full',
              isDark ? 'bg-blue-400' : 'bg-blue-600',
            ]"
          ></div>
          <div
            :class="[
              'w-12 h-1 rounded-full',
              isDark
                ? 'bg-gradient-to-r from-blue-300 to-blue-500'
                : 'bg-gradient-to-r from-blue-400 to-blue-600',
            ]"
          ></div>
        </div>
        <p
          :class="[
            'max-w-2xl mx-auto mt-4',
            isDark ? 'text-slate-300' : 'text-slate-600',
          ]"
        >
          Foto terbaru
          {{ footerData?.nama_opd || 'Dinas Komunikasi dan Informatika' }}
        </p>
      </div>

      <!-- Shimmer loading state -->
      <div v-if="isLoading" class="grid grid-cols-12 gap-4">
        <!-- Large left image shimmer -->
        <div class="col-span-12 md:col-span-6 lg:col-span-5 h-[500px]">
          <div
            :class="[
              'h-full overflow-hidden rounded-xl shadow-md',
              isDark ? 'shadow-slate-700/50' : '',
            ]"
          >
            <Vue3LoadingShimmer
              :class="[
                'w-full h-full rounded-xl',
                isDark ? 'shimmer-dark' : '',
              ]"
            />
          </div>
        </div>

        <!-- Right column shimmer -->
        <div class="col-span-12 md:col-span-6 lg:col-span-7">
          <div class="grid h-full grid-cols-12 gap-4">
            <!-- Top right image shimmer -->
            <div class="col-span-12 h-[240px]">
              <div
                :class="[
                  'h-full overflow-hidden rounded-xl shadow-md',
                  isDark ? 'shadow-slate-700/50' : '',
                ]"
              >
                <Vue3LoadingShimmer
                  :class="[
                    'w-full h-full rounded-xl',
                    isDark ? 'shimmer-dark' : '',
                  ]"
                />
              </div>
            </div>

            <!-- Bottom right images shimmer -->
            <div class="col-span-12 md:col-span-7 h-[240px]">
              <div
                :class="[
                  'h-full overflow-hidden rounded-xl shadow-md',
                  isDark ? 'shadow-slate-700/50' : '',
                ]"
              >
                <Vue3LoadingShimmer
                  :class="[
                    'w-full h-full rounded-xl',
                    isDark ? 'shimmer-dark' : '',
                  ]"
                />
              </div>
            </div>

            <div class="col-span-12 md:col-span-5 h-[240px]">
              <div
                :class="[
                  'h-full overflow-hidden rounded-xl shadow-md',
                  isDark ? 'shadow-slate-700/50' : '',
                ]"
              >
                <Vue3LoadingShimmer
                  :class="[
                    'w-full h-full rounded-xl',
                    isDark ? 'shimmer-dark' : '',
                  ]"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Additional images shimmer -->
        <div
          class="col-span-12 md:col-span-4 h-[240px]"
          v-for="i in 3"
          :key="`shimmer-additional-${i}`"
        >
          <div
            :class="[
              'h-full overflow-hidden rounded-xl shadow-md',
              isDark ? 'shadow-slate-700/50' : '',
            ]"
          >
            <Vue3LoadingShimmer
              :class="[
                'w-full h-full rounded-xl',
                isDark ? 'shimmer-dark' : '',
              ]"
            />
          </div>
        </div>
      </div>

      <!-- Gallery Grid with enhanced hover effects - shown when loaded -->
      <div v-else>
        <!-- Mobile view with pagination -->
        <div class="md:hidden relative">
          <!-- Navigation buttons for mobile -->
          <div class="absolute z-10 -translate-y-1/2 -left-2 top-1/2">
            <button
              @click="prevMobilePage"
              :class="[
                'flex items-center justify-center w-8 h-8 transition-colors rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed',
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-blue-400'
                  : 'bg-white hover:bg-blue-50 text-blue-600',
              ]"
              :disabled="currentMobilePage === 0"
              aria-label="Previous photos"
            >
              <UIcon name="i-heroicons-chevron-left" class="w-4 h-4" />
            </button>
          </div>

          <div class="absolute z-10 -translate-y-1/2 -right-2 top-1/2">
            <button
              @click="nextMobilePage"
              :class="[
                'flex items-center justify-center w-8 h-8 transition-colors rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed',
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-blue-400'
                  : 'bg-white hover:bg-blue-50 text-blue-600',
              ]"
              :disabled="currentMobilePage >= 1"
              aria-label="Next photos"
            >
              <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
            </button>
          </div>

          <!-- Mobile content with page transitions -->
          <div class="overflow-hidden">
            <div
              class="flex transition-transform duration-500 ease-out"
              :style="{ transform: `translateX(-${currentMobilePage * 100}%)` }"
            >
              <!-- First Page - Highlight and 2 supporting images -->
              <div class="flex-shrink-0 w-full">
                <div class="grid grid-cols-12 gap-4">
                  <!-- Large highlight image -->
                  <div class="col-span-12 h-[300px]">
                    <NuxtLink
                      v-if="fotoStore?.fotoData?.data?.[0]"
                      :to="`/foto/detail/${fotoStore.fotoData.data[0].id}`"
                      class="h-full"
                    >
                      <div class="h-full overflow-hidden rounded-xl shadow-md">
                        <div
                          class="relative w-full h-full overflow-hidden cursor-pointer group"
                        >
                          <img
                            :src="fotoStore.fotoData.data[0].image"
                            alt="Gallery Photo"
                            class="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                          />
                          <div
                            class="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-blue-900/80 via-blue-800/50 to-transparent group-hover:opacity-100"
                          ></div>
                          <div
                            class="absolute bottom-0 left-0 right-0 p-6 transition-all duration-300 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                          >
                            <span
                              :class="[
                                'inline-block px-2 py-1 mb-2 text-xs font-medium text-white rounded',
                                isDark ? 'bg-blue-700' : 'bg-blue-600',
                              ]"
                            >
                              {{
                                formatDate(
                                  fotoStore.fotoData.data[0].created_at
                                )
                              }}
                            </span>
                            <h3 class="mb-2 text-xl font-bold text-white">
                              {{ fotoStore.fotoData.data[0].title }}
                            </h3>
                            <div class="flex items-center">
                              <UIcon name="i-heroicons-camera" class="w-4 h-4 mr-2 text-blue-300" />
                              <span class="text-sm text-blue-100">{{ akronim }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </NuxtLink>
                  </div>

                  <!-- Two supporting images -->
                  <div
                    class="col-span-6 h-[160px]"
                    v-if="fotoStore?.fotoData?.data?.[1]"
                  >
                    <NuxtLink
                      :to="`/foto/detail/${fotoStore.fotoData.data[1].id}`"
                      class="h-full"
                    >
                      <div class="h-full overflow-hidden rounded-xl shadow-md">
                        <div
                          class="relative w-full h-full overflow-hidden cursor-pointer group"
                        >
                          <img
                            :src="fotoStore.fotoData.data[1].image"
                            alt="Gallery Photo"
                            class="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                          />
                          <div
                            class="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-blue-900/80 via-blue-800/50 to-transparent group-hover:opacity-100"
                          ></div>
                          <div
                            class="absolute bottom-0 left-0 right-0 p-3 transition-all duration-300 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                          >
                            <span
                              class="inline-block px-2 py-1 mb-1 text-xs font-medium text-white rounded bg-blue-600"
                            >
                              {{
                                formatDate(
                                  fotoStore.fotoData.data[1].created_at
                                )
                              }}
                            </span>
                            <h3
                              class="text-sm font-bold text-white line-clamp-2"
                            >
                              {{ fotoStore.fotoData.data[1].title }}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </NuxtLink>
                  </div>

                  <div
                    class="col-span-6 h-[160px]"
                    v-if="fotoStore?.fotoData?.data?.[2]"
                  >
                    <NuxtLink
                      :to="`/foto/detail/${fotoStore.fotoData.data[2].id}`"
                      class="h-full"
                    >
                      <div class="h-full overflow-hidden rounded-xl shadow-md">
                        <div
                          class="relative w-full h-full overflow-hidden cursor-pointer group"
                        >
                          <img
                            :src="fotoStore.fotoData.data[2].image"
                            alt="Gallery Photo"
                            class="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                          />
                          <div
                            class="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-blue-900/80 via-blue-800/50 to-transparent group-hover:opacity-100"
                          ></div>
                          <div
                            class="absolute bottom-0 left-0 right-0 p-3 transition-all duration-300 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                          >
                            <span
                              class="inline-block px-2 py-1 mb-1 text-xs font-medium text-white rounded bg-blue-600"
                            >
                              {{
                                formatDate(
                                  fotoStore.fotoData.data[2].created_at
                                )
                              }}
                            </span>
                            <h3
                              class="text-sm font-bold text-white line-clamp-2"
                            >
                              {{ fotoStore.fotoData.data[2].title }}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </NuxtLink>
                  </div>
                </div>
              </div>

              <!-- Second Page - 4 remaining images in 2x2 grid -->
              <div class="flex-shrink-0 w-full">
                <div class="grid grid-cols-12 gap-4">
                  <template v-if="fotoStore?.fotoData?.data?.length > 3">
                    <div
                      class="col-span-6 h-[160px]"
                      v-for="(item, index) in fotoStore.fotoData.data.slice(
                        3,
                        7
                      )"
                      :key="index + 3"
                    >
                      <NuxtLink :to="`/foto/detail/${item.id}`" class="h-full">
                        <div
                          class="h-full overflow-hidden rounded-xl shadow-md"
                        >
                          <div
                            class="relative w-full h-full overflow-hidden cursor-pointer group"
                          >
                            <img
                              :src="item.image"
                              alt="Gallery Photo"
                              class="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                            />
                            <div
                              class="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-blue-900/80 via-blue-800/50 to-transparent group-hover:opacity-100"
                            ></div>
                            <div
                              class="absolute bottom-0 left-0 right-0 p-3 transition-all duration-300 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                            >
                              <span
                                class="inline-block px-2 py-1 mb-1 text-xs font-medium text-white rounded bg-blue-600"
                              >
                                {{ formatDate(item.created_at) }}
                              </span>
                              <h3
                                class="text-sm font-bold text-white line-clamp-2"
                              >
                                {{ item.title }}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </NuxtLink>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination indicators -->
          <div class="flex justify-center mt-4 space-x-2">
            <button
              v-for="page in 2"
              :key="`mobile-indicator-${page}`"
              @click="currentMobilePage = page - 1"
              :class="[
                'h-2 rounded-full transition-all duration-300',
                currentMobilePage === page - 1
                  ? isDark
                    ? 'bg-blue-500 w-8'
                    : 'bg-blue-600 w-8'
                  : isDark
                  ? 'bg-slate-600 hover:bg-blue-400 w-2'
                  : 'bg-slate-300 hover:bg-blue-400 w-2',
              ]"
              :aria-label="`Go to page ${page}`"
            ></button>
          </div>
        </div>

        <!-- Desktop layout (unchanged) -->
        <div class="hidden md:grid grid-cols-12 gap-4">
          <!-- Large left image -->
          <div class="col-span-6 lg:col-span-5 h-[500px]">
            <NuxtLink
              v-if="fotoStore?.fotoData?.data?.[0]"
              :to="`/foto/detail/${fotoStore.fotoData.data[0].id}`"
              class="h-full"
            >
              <div
                :class="[
                  'h-full overflow-hidden rounded-xl shadow-md',
                  isDark ? 'shadow-slate-700/50' : '',
                ]"
              >
                <div
                  class="relative w-full h-full overflow-hidden cursor-pointer group"
                >
                  <img
                    :src="fotoStore.fotoData.data[0].image"
                    alt="Gallery Photo"
                    class="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                  />
                  <!-- Gradient overlay -->
                  <div
                    class="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-blue-900/80 via-blue-800/50 to-transparent group-hover:opacity-100"
                  ></div>

                  <!-- Photo details on hover -->
                  <div
                    class="absolute bottom-0 left-0 right-0 p-6 transition-all duration-300 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    <span
                      :class="[
                        'inline-block px-2 py-1 mb-2 text-xs font-medium text-white rounded',
                        isDark ? 'bg-blue-700' : 'bg-blue-600',
                      ]"
                    >
                      {{ formatDate(fotoStore.fotoData.data[0].created_at) }}
                    </span>
                    <h3 class="mb-2 text-xl font-bold text-white">
                      {{ fotoStore.fotoData.data[0].title }}
                    </h3>
                    <div class="flex items-center">
                      <UIcon name="i-heroicons-camera" class="w-4 h-4 mr-2 text-blue-300" />
                      <span class="text-sm text-blue-100">{{ akronim }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </NuxtLink>
          </div>

          <!-- Right column -->
          <div class="col-span-6 lg:col-span-7">
            <div class="grid h-full grid-cols-12 gap-4">
              <!-- Top right image -->
              <div class="col-span-12 h-[240px]">
                <NuxtLink
                  v-if="fotoStore?.fotoData?.data?.[1]"
                  :to="`/foto/detail/${fotoStore.fotoData.data[1].id}`"
                  class="h-full"
                >
                  <div
                    :class="[
                      'h-full overflow-hidden rounded-xl shadow-md',
                      isDark ? 'shadow-slate-700/50' : '',
                    ]"
                  >
                    <div
                      class="relative w-full h-full overflow-hidden cursor-pointer group"
                    >
                      <img
                        :src="fotoStore.fotoData.data[1].image"
                        alt="Gallery Photo"
                        class="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                      />
                      <!-- Gradient overlay -->
                      <div
                        class="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-blue-900/80 via-blue-800/50 to-transparent group-hover:opacity-100"
                      ></div>

                      <!-- Photo details on hover -->
                      <div
                        class="absolute bottom-0 left-0 right-0 p-6 transition-all duration-300 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                      >
                        <span
                          :class="[
                            'inline-block px-2 py-1 mb-2 text-xs font-medium text-white rounded',
                            isDark ? 'bg-blue-700' : 'bg-blue-600',
                          ]"
                        >
                          {{
                            formatDate(fotoStore.fotoData.data[1].created_at)
                          }}
                        </span>
                        <h3 class="mb-2 text-lg font-bold text-white">
                          {{ fotoStore.fotoData.data[1].title }}
                        </h3>
                      </div>
                    </div>
                  </div>
                </NuxtLink>
              </div>

              <!-- Bottom right images -->
              <div class="col-span-7 h-[240px]">
                <NuxtLink
                  v-if="fotoStore?.fotoData?.data?.[2]"
                  :to="`/foto/detail/${fotoStore.fotoData.data[2].id}`"
                  class="h-full"
                >
                  <div
                    :class="[
                      'h-full overflow-hidden rounded-xl shadow-md',
                      isDark ? 'shadow-slate-700/50' : '',
                    ]"
                  >
                    <div
                      class="relative w-full h-full overflow-hidden cursor-pointer group"
                    >
                      <img
                        :src="fotoStore.fotoData.data[2].image"
                        alt="Gallery Photo"
                        class="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                      />
                      <!-- Gradient overlay -->
                      <div
                        class="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-blue-900/80 via-blue-800/50 to-transparent group-hover:opacity-100"
                      ></div>

                      <!-- Photo details on hover -->
                      <div
                        class="absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                      >
                        <span
                          :class="[
                            'inline-block px-2 py-1 mb-2 text-xs font-medium text-white rounded',
                            isDark ? 'bg-blue-700' : 'bg-blue-600',
                          ]"
                        >
                          {{
                            formatDate(fotoStore.fotoData.data[2].created_at)
                          }}
                        </span>
                        <h3 class="mb-1 text-base font-bold text-white">
                          {{ fotoStore.fotoData.data[2].title }}
                        </h3>
                      </div>
                    </div>
                  </div>
                </NuxtLink>
              </div>

              <div class="col-span-5 h-[240px]">
                <NuxtLink
                  v-if="fotoStore?.fotoData?.data?.[3]"
                  :to="`/foto/detail/${fotoStore.fotoData.data[3].id}`"
                  class="h-full"
                >
                  <div
                    :class="[
                      'h-full overflow-hidden rounded-xl shadow-md',
                      isDark ? 'shadow-slate-700/50' : '',
                    ]"
                  >
                    <div
                      class="relative w-full h-full overflow-hidden cursor-pointer group"
                    >
                      <img
                        :src="fotoStore.fotoData.data[3].image"
                        alt="Gallery Photo"
                        class="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                      />
                      <!-- Gradient overlay -->
                      <div
                        class="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-blue-900/80 via-blue-800/50 to-transparent group-hover:opacity-100"
                      ></div>

                      <!-- Photo details on hover -->
                      <div
                        class="absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                      >
                        <span
                          :class="[
                            'inline-block px-2 py-1 mb-2 text-xs font-medium text-white rounded',
                            isDark ? 'bg-blue-700' : 'bg-blue-600',
                          ]"
                        >
                          {{
                            formatDate(fotoStore.fotoData.data[3].created_at)
                          }}
                        </span>
                        <h3 class="mb-1 text-base font-bold text-white">
                          {{ fotoStore.fotoData.data[3].title }}
                        </h3>
                      </div>
                    </div>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Additional images for larger galleries -->
          <template v-if="fotoStore?.fotoData?.data?.length > 4">
            <div
              class="col-span-4 h-[240px]"
              v-for="(item, index) in fotoStore.fotoData.data.slice(4, 7)"
              :key="index + 4"
            >
              <NuxtLink :to="`/foto/detail/${item.id}`" class="h-full">
                <div
                  :class="[
                    'h-full overflow-hidden rounded-xl shadow-md',
                    isDark ? 'shadow-slate-700/50' : '',
                  ]"
                >
                  <div
                    class="relative w-full h-full overflow-hidden cursor-pointer group"
                  >
                    <img
                      :src="item.image"
                      alt="Gallery Photo"
                      class="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                    />
                    <!-- Gradient overlay -->
                    <div
                      class="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-blue-900/80 via-blue-800/50 to-transparent group-hover:opacity-100"
                    ></div>

                    <!-- Photo details on hover -->
                    <div
                      class="absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                    >
                      <span
                        :class="[
                          'inline-block px-2 py-1 mb-2 text-xs font-medium text-white rounded',
                          isDark ? 'bg-blue-700' : 'bg-blue-600',
                        ]"
                      >
                        {{ formatDate(item.created_at) }}
                      </span>
                      <h3 class="mb-1 text-base font-bold text-white">
                        {{ item.title }}
                      </h3>
                    </div>
                  </div>
                </div>
              </NuxtLink>
            </div>
          </template>
        </div>
      </div>

      <div class="flex justify-center mt-10">
        <NuxtLink :to="`/foto`">
          <UButton
            color="blue"
            variant="link"
            trailing-icon="i-heroicons-arrow-right"
          >
            Lihat Semua Foto
          </UButton>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useFotoStore } from '@/store/foto/foto.js';
import { useFooterStore } from '@/store/footer/footer.js';
import { onMounted, ref, computed } from 'vue';
import Vue3LoadingShimmer from 'vue3-loading-shimmer';
import { useLayout } from '~/store/layouts/layouts';
import { LatinKeAksara } from '@sajenid/aksara.js'
 
const config = useRuntimeConfig();
const akronim = config.public.akronim || 'Dinas Kominfo DIY';
const runtimeConfig = useRuntimeConfig();
const isAksaraJawaEnabled = computed(
  () => runtimeConfig.public.isAksaraJawa === 'true'
);
const galeriTitle = computed(() =>
  isAksaraJawaEnabled.value ? LatinKeAksara('Galleri Foto') : ''
);
const layoutStore = useLayout();
const fotoStore = useFotoStore();
const footerStore = useFooterStore();
const isLoading = ref(true);
const isDark = computed(() => {
  return layoutStore.theme === 'dark';
});

// Add computed property to access footer data
const footerData = computed(() => {
  return (
    footerStore.footerData?.data?.[0] || footerStore.footerData?.[0] || null
  );
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

const currentMobilePage = ref(0);

const prevMobilePage = () => {
  if (currentMobilePage.value > 0) {
    currentMobilePage.value -= 1;
  }
};

const nextMobilePage = () => {
  if (currentMobilePage.value < 1) {
    currentMobilePage.value += 1;
  }
};

onMounted(async () => {
  try {
    isLoading.value = true;

    await footerStore.getFooterData();
    await fotoStore.getFotoData();
    setTimeout(() => {
      isLoading.value = false;
    }, 1000);
  } catch (error) {
    console.error('Error loading photo data:', error);
    isLoading.value = false;
  }
});
</script>

<style scoped>
.group:hover img {
  transform: scale(1.1);
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.bg-gradient-to-r {
  background-size: 200% auto;
  transition: background-position 0.5s ease;
}

.bg-gradient-to-r:hover {
  background-position: right center;
}

.from-blue-900\/80 {
  --tw-gradient-from: rgba(30, 58, 138, 0.8);
  --tw-gradient-stops: var(--tw-gradient-from), transparent;
}

.shimmer-dark {
  --shimmer-color: rgba(51, 65, 85, 0.5);
  --shimmer-highlight: rgba(71, 85, 105, 0.8);
}

.dark {
  transition: all 0.3s ease;
}

:deep(.shimmer-dark .shimmer) {
  background: linear-gradient(
    90deg,
    var(--shimmer-color) 0%,
    var(--shimmer-highlight) 50%,
    var(--shimmer-color) 100%
  );
}

/* Aksara Jawa font styling */
.aksara-jawa {
  font-family: 'nyk Ngayogyan New';
  line-height: 2 !important;
}
</style>
