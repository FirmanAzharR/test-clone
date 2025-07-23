<template>
  <section
    :class="[
      'w-full py-14 transition-colors duration-300 relative overflow-hidden',
      isDark
        ? 'dark bg-gradient-to-t from-green-900 to-slate-900'
        : 'bg-gradient-to-b from-blue-200 via-blue-100 to-slate-100',
    ]"
  >
    <!-- Enhanced background decorations with animation -->
    <div class="absolute inset-0 pointer-events-none">
      <div
        :class="[
          'absolute w-64 h-64 rounded-full -top-32 -right-32 blur-3xl transition-all duration-700',
          isDark ? 'bg-blue-500/15 animate-pulse-slow' : 'bg-blue-500/10',
        ]"
      ></div>
      <div
        :class="[
          'absolute w-64 h-64 rounded-full -bottom-32 -left-32 blur-3xl transition-all duration-700',
          isDark ? 'bg-blue-500/15 animate-pulse-slow' : 'bg-blue-100/10',
        ]"
      ></div>
      <div
        :class="[
          'absolute w-32 h-32 rounded-full top-1/4 left-1/4 blur-2xl opacity-30 transition-all duration-700',
          isDark
            ? 'bg-purple-500/20 animate-float'
            : 'bg-blue-300/20 animate-float',
        ]"
      ></div>
    </div>

    <div class="container relative z-10 px-4 mx-auto max-w-7xl">
      <!-- Section Header with enhanced design -->
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
            Layanan
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
            ꧋{{ layananTitle }}
          </span>
          <br />
          <div class="mt-4">Layanan Utama</div>
        </h2>
        <div class="flex items-center justify-center mt-4">
          <div
            :class="[
              'w-12 h-1 rounded-full transition-all duration-300',
              isDark
                ? 'bg-gradient-to-r from-blue-500 to-blue-300'
                : 'bg-gradient-to-r from-blue-600 to-blue-400',
            ]"
          ></div>
          <div
            :class="[
              'w-2 h-2 mx-2 rounded-full transition-all duration-300',
              isDark ? 'bg-blue-400' : 'bg-blue-600',
            ]"
          ></div>
          <div
            :class="[
              'w-12 h-1 rounded-full transition-all duration-300',
              isDark
                ? 'bg-gradient-to-r from-blue-300 to-blue-500'
                : 'bg-gradient-to-r from-blue-400 to-blue-600',
            ]"
          ></div>
        </div>
        <p
          :class="[
            'max-w-2xl mx-auto mt-4 transition-all duration-300',
            isDark ? 'text-slate-300' : 'text-slate-600',
          ]"
        >
          Pilih layanan yang sesuai dengan kebutuhan Anda untuk solusi terbaik.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <!-- Left side with enhanced animation -->
        <div class="flex flex-col items-center h-full lg:col-span-4">
          <div
            :class="[
              'relative overflow-hidden transition-all duration-500 transform rounded-2xl w-72 h-full group',
              isDark
                ? 'bg-slate-800/80 backdrop-blur-sm'
                : 'bg-white/90 backdrop-blur-sm',
            ]"
            @mouseenter="isHoveringFeature = true"
            @mouseleave="isHoveringFeature = false"
          >
            <div
              :class="[
                'absolute inset-0 transition-opacity duration-500',
                isDark
                  ? 'opacity-30 bg-gradient-to-br from-blue-900 to-slate-800'
                  : 'opacity-50 bg-gradient-to-br from-blue-50 to-white',
              ]"
            ></div>

            <!-- Animated decorative elements -->
            <div class="absolute inset-0 overflow-hidden opacity-20">
              <div
                class="absolute top-0 left-0 w-16 h-16 transition-transform duration-700 transform -translate-x-8 -translate-y-8 border-t-2 border-l-2 rounded-tl-lg group-hover:translate-x-0 group-hover:translate-y-0"
                :class="isDark ? 'border-blue-400' : 'border-blue-600'"
              ></div>
              <div
                class="absolute top-0 right-0 w-16 h-16 transition-transform duration-700 transform translate-x-8 -translate-y-8 border-t-2 border-r-2 rounded-tr-lg group-hover:translate-x-0 group-hover:translate-y-0"
                :class="isDark ? 'border-blue-400' : 'border-blue-600'"
              ></div>
              <div
                class="absolute bottom-0 left-0 w-16 h-16 transition-transform duration-700 transform -translate-x-8 translate-y-8 border-b-2 border-l-2 rounded-bl-lg group-hover:translate-x-0 group-hover:translate-y-0"
                :class="isDark ? 'border-blue-400' : 'border-blue-600'"
              ></div>
              <div
                class="absolute bottom-0 right-0 w-16 h-16 transition-transform duration-700 transform translate-x-8 translate-y-8 border-b-2 border-r-2 rounded-br-lg group-hover:translate-x-0 group-hover:translate-y-0"
                :class="isDark ? 'border-blue-400' : 'border-blue-600'"
              ></div>
            </div>

            <div class="relative flex flex-col h-full p-6">
              <div class="flex items-center mb-4">
                <div
                  :class="[
                    'flex items-center justify-center w-10 h-10 mr-3 text-white rounded-lg transition-all duration-300 group-hover:scale-110',
                    isDark
                      ? 'bg-gradient-to-br from-blue-600 to-blue-800'
                      : 'bg-gradient-to-br from-blue-500 to-blue-700',
                  ]"
                >
                  <UIcon name="i-heroicons-squares-2x2" class="w-6 h-6" />
                </div>
                <h2
                  :class="[
                    'text-xl font-bold transition-all duration-300',
                    isDark ? 'text-blue-300' : 'text-blue-600',
                  ]"
                >
                  Pilih Layanan
                </h2>
              </div>

              <div
                v-if="isLoading"
                class="flex flex-col items-center justify-center flex-grow"
              >
                <Vue3LoadingShimmer
                  :class="[
                    'w-full h-48 rounded-lg',
                    isDark ? 'shimmer-dark' : '',
                  ]"
                />
              </div>

              <template v-else>
                <client-only>
                  <div class="flex items-center justify-center flex-grow">
                    <Vue3Lottie
                      :animationLink="`/animation/layanan.json`"
                      :height="240"
                      :loop="true"
                      :autoplay="true"
                      :speed="1"
                    />
                  </div>
                </client-only>
              </template>
            </div>
          </div>
        </div>

        <!-- Right side with enhanced service cards -->
        <div class="lg:col-span-8">
          <!-- Carousel controls with improved styling -->
          <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div class="flex items-center">
              <div
                :class="[
                  'flex items-center justify-center w-10 h-10 mr-3 rounded-full transition-all duration-300',
                  isDark ? 'bg-blue-900/50' : 'bg-blue-100',
                ]"
              >
                <UIcon
                  name="i-heroicons-server"
                  :class="[
                    'w-5 h-5 transition-all duration-300',
                    isDark ? 'text-blue-300' : 'text-blue-600',
                  ]"
                />
              </div>
              <h3
                :class="[
                  'text-lg font-bold transition-all duration-300',
                  isDark ? 'text-white' : 'text-slate-900',
                ]"
              >
                Layanan Unggulan
              </h3>
            </div>
            <NuxtLink
              to="/layanan"
              :class="[
                'flex items-center group',
                isDark ? 'text-white' : 'text-blue-600',
              ]"
            >
              <span>Lihat Semua Layanan</span>
              <UIcon
                name="i-heroicons-arrow-right"
                class="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
              />
            </NuxtLink>
          </div>

          <!-- Service cards slider with enhanced styling -->
          <div
            class="relative w-full overflow-hidden rounded-2xl group"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave"
            @touchstart="handleTouchStart"
            @touchend="handleTouchEnd"
          >
            <!-- Shimmer loading state with improved design -->
            <div v-if="isLoading" class="flex flex-wrap">
              <div
                v-for="i in 3"
                :key="`shimmer-${i}`"
                class="flex-shrink-0 w-full p-3 md:w-1/2 lg:w-1/3"
              >
                <div
                  :class="[
                    'flex flex-col h-full overflow-hidden shadow-md rounded-xl',
                    isDark
                      ? 'bg-slate-800/90 border-slate-700'
                      : 'bg-white border border-blue-100',
                  ]"
                >
                  <div
                    class="relative p-5 space-y-1 overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500"
                  >
                    <Vue3LoadingShimmer
                      class="w-3/4 h-6 mb-2 rounded-lg bg-white/20"
                    />
                    <Vue3LoadingShimmer
                      class="w-full h-4 rounded-lg bg-white/20"
                    />
                  </div>

                  <div class="flex-grow p-5">
                    <div class="flex items-center mb-4">
                      <Vue3LoadingShimmer
                        :class="[
                          'w-10 h-10 mr-3 rounded-full',
                          isDark ? 'shimmer-dark' : '',
                        ]"
                      />
                      <div class="space-y-1">
                        <Vue3LoadingShimmer
                          :class="[
                            'w-16 h-3 mb-1 rounded-lg',
                            isDark ? 'shimmer-dark' : '',
                          ]"
                        />
                        <Vue3LoadingShimmer
                          :class="[
                            'w-24 h-4 rounded-lg',
                            isDark ? 'shimmer-dark' : '',
                          ]"
                        />
                      </div>
                    </div>

                    <div class="flex items-center justify-between space-y-1">
                      <Vue3LoadingShimmer
                        :class="[
                          'w-16 h-6 rounded-full',
                          isDark ? 'shimmer-dark' : '',
                        ]"
                      />
                      <Vue3LoadingShimmer
                        :class="[
                          'w-20 h-8 rounded-full',
                          isDark ? 'shimmer-dark' : '',
                        ]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Actual content when loaded with improved transitions and unlimited scroll -->
            <div
              v-else
              ref="carouselTrack"
              class="flex"
              :class="{ 'transition-transform': !isJumping }"
              :style="{
                transform: `translateX(${-getTranslateValue()}%)`,
                transitionDuration: isJumping ? '0ms' : '500ms',
              }"
              @transitionend="handleTransitionEnd"
            >
              <!-- Clone of last slide group -->
              <template v-if="getCloneSlides.last">
                <div class="flex flex-shrink-0 w-full">
                  <div
                    v-for="(item, cIndex) in getCloneSlides.last"
                    :key="`clone-last-${cIndex}`"
                    class="flex-shrink-0 w-full p-3 md:w-1/2 lg:w-1/3"
                  >
                    <div
                      :class="[
                        'flex flex-col h-full overflow-hidden transition-all duration-300 transform shadow-md rounded-xl hover:scale-105 hover:shadow-xl group',
                        isDark
                          ? 'bg-slate-800/90 backdrop-blur-sm border-slate-700'
                          : 'bg-white border border-blue-100',
                      ]"
                    >
                      <!-- Card header with enhanced gradient background -->
                      <div
                        class="relative p-5 overflow-hidden text-white transition-all duration-500 bg-gradient-to-r from-blue-600 to-blue-500 group-hover:from-blue-500 group-hover:to-blue-600"
                      >
                        <div
                          class="absolute w-16 h-16 transition-transform duration-500 bg-white rounded-full -right-4 -top-4 opacity-10 group-hover:scale-125"
                        ></div>
                        <div
                          class="absolute w-12 h-12 transition-transform duration-500 bg-white rounded-full -left-4 -bottom-4 opacity-10 group-hover:scale-125"
                        ></div>
                        <h3
                          class="relative z-10 flex items-center mb-1 text-lg font-bold"
                        >
                          <UIcon
                            :name="getCategoryIcon(item.category)"
                            class="w-5 h-5 mr-2 text-white transition-transform duration-300 group-hover:scale-110"
                          />
                          {{ item.title }}
                        </h3>
                        <p
                          class="relative z-10 text-sm text-blue-100 line-clamp-2"
                        >
                          {{
                            stripHtml(item.description?.substring(0, 60)) ||
                            'Layanan premium untuk kebutuhan Anda'
                          }}
                        </p>
                      </div>
                      <!-- Card content identical to original -->
                      <div class="flex-grow p-5 cursor-pointer">
                        <div class="flex items-center mb-4">
                          <div
                            :class="[
                              'flex items-center justify-center w-10 h-10 mr-3 overflow-hidden text-white rounded-full transition-all duration-300 group-hover:scale-110',
                              isDark
                                ? 'bg-gradient-to-br from-blue-600 to-blue-800'
                                : 'bg-gradient-to-br from-blue-500 to-blue-700',
                            ]"
                          >
                            <NuxtImg
                              v-if="item.image"
                              :src="item.image"
                              alt="Service Icon"
                              class="object-cover w-full h-full"
                            />
                            <UIcon
                              v-else
                              name="i-heroicons-cube"
                              class="w-5 h-5"
                            />
                          </div>
                          <div>
                            <span
                              :class="[
                                'text-xs font-medium transition-colors duration-300',
                                isDark ? 'text-blue-300' : 'text-blue-500',
                              ]"
                              >Kategori</span
                            >
                            <p
                              :class="[
                                'text-sm font-bold transition-colors duration-300',
                                isDark ? 'text-white' : 'text-slate-900',
                              ]"
                            >
                              {{ item.category || 'Layanan Digital' }}
                            </p>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <span
                            :class="[
                              'px-2 py-1 text-xs font-medium rounded-full transition-colors duration-300',
                              isDark
                                ? 'text-blue-300 bg-blue-900/40'
                                : 'text-blue-600 bg-blue-50',
                            ]"
                            >{{
                              cIndex % 3 === 0
                                ? 'Populer'
                                : cIndex % 3 === 1
                                ? 'Baru'
                                : 'Rekomendasi'
                            }}</span
                          >
                          <NuxtLink
                            :to="`/layanan/${item.id}`"
                            :class="[
                              'inline-flex items-center px-3 py-1 text-sm font-medium text-white transition-all duration-300 rounded-full bg-gradient-to-r group-hover:shadow-md',
                              isDark
                                ? 'from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700'
                                : 'from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600',
                            ]"
                          >
                            <span>Detail</span>
                            <UIcon
                              name="i-heroicons-arrow-right"
                              class="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1"
                            />
                          </NuxtLink>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>

              <!-- Original slides -->
              <div
                v-for="(item, index) in featuredServices"
                :key="item.id || index"
                class="flex-shrink-0 w-full p-3 md:w-1/2 lg:w-1/3"
                :style="{ '--index': index }"
              >
                <div
                  :class="[
                    'flex flex-col h-full overflow-hidden transition-all duration-300 transform shadow-md rounded-xl hover:scale-105 hover:shadow-xl group',
                    isDark
                      ? 'bg-slate-800/90 backdrop-blur-sm border-slate-700'
                      : 'bg-white border border-blue-100',
                  ]"
                >
                  <!-- Card header with enhanced gradient background -->
                  <div
                    class="relative p-5 overflow-hidden text-white transition-all duration-500 bg-gradient-to-r from-blue-600 to-blue-500 group-hover:from-blue-500 group-hover:to-blue-600"
                  >
                    <!-- Enhanced decorative elements -->
                    <div
                      class="absolute w-16 h-16 transition-transform duration-500 bg-white rounded-full -right-4 -top-4 opacity-10 group-hover:scale-125"
                    ></div>
                    <div
                      class="absolute w-12 h-12 transition-transform duration-500 bg-white rounded-full -left-4 -bottom-4 opacity-10 group-hover:scale-125"
                    ></div>

                    <h3
                      class="relative z-10 flex items-center mb-1 text-lg font-bold"
                    >
                      <UIcon
                        :name="getCategoryIcon(item.category)"
                        class="w-5 h-5 mr-2 text-white transition-transform duration-300 group-hover:scale-110"
                      />
                      {{ item.title }}
                    </h3>
                    <p class="relative z-10 text-sm text-blue-100 line-clamp-2">
                      {{
                        stripHtml(item.description?.substring(0, 60)) ||
                        'Layanan premium untuk kebutuhan Anda'
                      }}
                    </p>
                  </div>

                  <!-- Card content with improved styling and interactions -->
                  <div class="flex-grow p-5 cursor-pointer">
                    <div class="flex items-center mb-4">
                      <div
                        :class="[
                          'flex items-center justify-center w-10 h-10 mr-3 overflow-hidden text-white rounded-full transition-all duration-300 group-hover:scale-110',
                          isDark
                            ? 'bg-gradient-to-br from-blue-600 to-blue-800'
                            : 'bg-gradient-to-br from-blue-500 to-blue-700',
                        ]"
                      >
                        <NuxtImg
                          v-if="item.image"
                          :src="item.image"
                          alt="Service Icon"
                          class="object-cover w-full h-full"
                        />
                        <UIcon v-else name="i-heroicons-cube" class="w-5 h-5" />
                      </div>
                      <div>
                        <span
                          :class="[
                            'text-xs font-medium transition-colors duration-300',
                            isDark ? 'text-blue-300' : 'text-blue-500',
                          ]"
                        >
                          Kategori
                        </span>
                        <p
                          :class="[
                            'text-sm font-bold transition-colors duration-300',
                            isDark ? 'text-white' : 'text-slate-900',
                          ]"
                        >
                          {{ item.category || 'Layanan Digital' }}
                        </p>
                      </div>
                    </div>

                    <div class="flex items-center justify-between">
                      <span
                        :class="[
                          'px-2 py-1 text-xs font-medium rounded-full transition-colors duration-300',
                          isDark
                            ? 'text-blue-300 bg-blue-900/40'
                            : 'text-blue-600 bg-blue-50',
                        ]"
                      >
                        {{
                          index % 3 === 0
                            ? 'Populer'
                            : index % 3 === 1
                            ? 'Baru'
                            : 'Rekomendasi'
                        }}
                      </span>
                      <NuxtLink
                        :to="`/layanan/${item.id}`"
                        :class="[
                          'inline-flex items-center px-3 py-1 text-sm font-medium text-white transition-all duration-300 rounded-full bg-gradient-to-r group-hover:shadow-md',
                          isDark
                            ? 'from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700'
                            : 'from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600',
                        ]"
                      >
                        <span>Detail</span>
                        <UIcon
                          name="i-heroicons-arrow-right"
                          class="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Clone of first slide group -->
              <template v-if="getCloneSlides.first">
                <div class="flex flex-shrink-0 w-full">
                  <div
                    v-for="(item, cIndex) in getCloneSlides.first"
                    :key="`clone-first-${cIndex}`"
                    class="flex-shrink-0 w-full p-3 md:w-1/2 lg:w-1/3"
                  >
                    <div
                      :class="[
                        'flex flex-col h-full overflow-hidden transition-all duration-300 transform shadow-md rounded-xl hover:scale-105 hover:shadow-xl group',
                        isDark
                          ? 'bg-slate-800/90 backdrop-blur-sm border-slate-700'
                          : 'bg-white border border-blue-100',
                      ]"
                    >
                      <!-- Card header with enhanced gradient background -->
                      <div
                        class="relative p-5 overflow-hidden text-white transition-all duration-500 bg-gradient-to-r from-blue-600 to-blue-500 group-hover:from-blue-500 group-hover:to-blue-600"
                      >
                        <div
                          class="absolute w-16 h-16 transition-transform duration-500 bg-white rounded-full -right-4 -top-4 opacity-10 group-hover:scale-125"
                        ></div>
                        <div
                          class="absolute w-12 h-12 transition-transform duration-500 bg-white rounded-full -left-4 -bottom-4 opacity-10 group-hover:scale-125"
                        ></div>
                        <h3
                          class="relative z-10 flex items-center mb-1 text-lg font-bold"
                        >
                          <UIcon
                            :name="getCategoryIcon(item.category)"
                            class="w-5 h-5 mr-2 text-white transition-transform duration-300 group-hover:scale-110"
                          />
                          {{ item.title }}
                        </h3>
                        <p
                          class="relative z-10 text-sm text-blue-100 line-clamp-2"
                        >
                          {{
                            stripHtml(item.description?.substring(0, 60)) ||
                            'Layanan premium untuk kebutuhan Anda'
                          }}
                        </p>
                      </div>
                      <!-- Card content identical to original -->
                      <div class="flex-grow p-5 cursor-pointer">
                        <div class="flex items-center mb-4">
                          <div
                            :class="[
                              'flex items-center justify-center w-10 h-10 mr-3 overflow-hidden text-white rounded-full transition-all duration-300 group-hover:scale-110',
                              isDark
                                ? 'bg-gradient-to-br from-blue-600 to-blue-800'
                                : 'bg-gradient-to-br from-blue-500 to-blue-700',
                            ]"
                          >
                            <NuxtImg
                              v-if="item.image"
                              :src="item.image"
                              alt="Service Icon"
                              class="object-cover w-full h-full"
                            />
                            <UIcon
                              v-else
                              name="i-heroicons-cube"
                              class="w-5 h-5"
                            />
                          </div>
                          <div>
                            <span
                              :class="[
                                'text-xs font-medium transition-colors duration-300',
                                isDark ? 'text-blue-300' : 'text-blue-500',
                              ]"
                              >Kategori</span
                            >
                            <p
                              :class="[
                                'text-sm font-bold transition-colors duration-300',
                                isDark ? 'text-white' : 'text-slate-900',
                              ]"
                            >
                              {{ item.category || 'Layanan Digital' }}
                            </p>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <span
                            :class="[
                              'px-2 py-1 text-xs font-medium rounded-full transition-colors duration-300',
                              isDark
                                ? 'text-blue-300 bg-blue-900/40'
                                : 'text-blue-600 bg-blue-50',
                            ]"
                            >{{
                              cIndex % 3 === 0
                                ? 'Populer'
                                : cIndex % 3 === 1
                                ? 'Baru'
                                : 'Rekomendasi'
                            }}</span
                          >
                          <NuxtLink
                            :to="`/layanan/${item.id}`"
                            :class="[
                              'inline-flex items-center px-3 py-1 text-sm font-medium text-white transition-all duration-300 rounded-full bg-gradient-to-r group-hover:shadow-md',
                              isDark
                                ? 'from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700'
                                : 'from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600',
                            ]"
                          >
                            <span>Detail</span>
                            <UIcon
                              name="i-heroicons-arrow-right"
                              class="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1"
                            />
                          </NuxtLink>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>

            <!-- Enhanced navigation arrows -->
            <button
              v-if="!isLoading && featuredServices.length > cardsPerSlide"
              @click="prevSlide"
              :disabled="isLoading || isJumping"
              :class="[
                'absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ml-2',
                isDark
                  ? 'bg-slate-800/80 text-white hover:bg-slate-700 focus:ring-blue-500'
                  : 'bg-white/80 text-slate-800 hover:bg-slate-100 focus:ring-blue-500',
                'opacity-0 group-hover:opacity-100',
              ]"
              aria-label="Previous slide"
            >
              <UIcon name="i-heroicons-chevron-left" class="w-5 h-5" />
            </button>

            <button
              v-if="!isLoading && featuredServices.length > cardsPerSlide"
              @click="nextSlide"
              :disabled="isLoading || isJumping"
              :class="[
                'absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 mr-2',
                isDark
                  ? 'bg-slate-800/80 text-white hover:bg-slate-700 focus:ring-blue-500'
                  : 'bg-white/80 text-slate-800 hover:bg-slate-100 focus:ring-blue-500',
                'opacity-0 group-hover:opacity-100',
              ]"
              aria-label="Next slide"
            >
              <UIcon name="i-heroicons-chevron-right" class="w-5 h-5" />
            </button>
          </div>

          <!-- Carousel navigation with improved styling -->
          <div class="flex items-center justify-between mt-6">
            <div class="flex space-x-2">
              <UButton
                icon="i-heroicons-chevron-left"
                :color="isDark ? 'white' : 'blue'"
                variant="outline"
                class="transition-transform duration-300 rounded-full hover:scale-105"
                @click="manualPrevSlide"
                :disabled="isLoading"
              />
              <UButton
                icon="i-heroicons-chevron-right"
                :color="isDark ? 'white' : 'blue'"
                variant="outline"
                class="transition-transform duration-300 rounded-full hover:scale-105"
                @click="manualNextSlide"
                :disabled="isLoading"
              />
            </div>
            <div class="flex space-x-2">
              <!-- Shimmer indicators when loading -->
              <template v-if="isLoading">
                <Vue3LoadingShimmer
                  v-for="i in 3"
                  :key="`indicator-shimmer-${i}`"
                  :class="[
                    'w-8 h-2 rounded-full',
                    isDark ? 'shimmer-dark' : '',
                  ]"
                />
              </template>

              <!-- Enhanced indicators when loaded -->
              <template v-else>
                <button
                  v-for="(_, index) in totalSlides"
                  :key="index"
                  @click="setCurrentSlide(index)"
                  :class="[
                    'w-8 h-2 transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                    currentSlide === index ||
                    (currentSlide === -1 && index === totalSlides.value - 1) ||
                    (currentSlide === totalSlides.value && index === 0)
                      ? isDark
                        ? 'bg-gradient-to-r from-blue-500 to-blue-400 scale-110'
                        : 'bg-gradient-to-r from-blue-600 to-blue-500 scale-110'
                      : isDark
                      ? 'bg-slate-600 hover:bg-blue-400'
                      : 'bg-gray-300 hover:bg-blue-300',
                  ]"
                  :aria-label="`Go to slide ${index + 1}`"
                ></button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  watch,
  onBeforeUnmount,
  nextTick,
} from 'vue';
import { useBannerStore } from '@/store/banner/banner.js';
import { useLayout } from '@/store/layouts/layouts.js';
import Vue3LoadingShimmer from 'vue3-loading-shimmer';
import { LatinKeAksara } from '@sajenid/aksara.js';

const runtimeConfig = useRuntimeConfig();
const isAksaraJawaEnabled = computed(
  () => runtimeConfig.public.isAksaraJawa === 'true'
);
const layananTitle = computed(() =>
  isAksaraJawaEnabled.value ? LatinKeAksara('Layanan Utama') : ''
);
const bannerStore = useBannerStore();
const layoutStore = useLayout();
const currentSlide = ref(0);
const isLoading = ref(true);
const isHoveringFeature = ref(false);
const isJumping = ref(false); // Flag untuk transisi unlimited scroll
const isDark = computed(() => {
  return layoutStore.theme === 'dark';
});

// Total slides untuk carousel - lebih responsif untuk mobile view
const totalSlides = computed(() => {
  if (!featuredServices.value.length) return 0;
  return Math.ceil(featuredServices.value.length / cardsPerSlide.value);
});

// Helper functions untuk slide kloning - yang disesuaikan untuk mobile dan desktop view
const getCloneSlides = computed(() => {
  if (!featuredServices.value.length) return { first: null, last: null };

  // Pada mobile view, kita perlu membatasi kloning hanya untuk 3 item pertama
  // untuk tampilan mobile
  if (windowWidth.value < 768 && featuredServices.value.length > 3) {
    // Untuk mobile, hanya ambil 3 item pertama saja
    const mobileItems = featuredServices.value.slice(0, 3);

    return {
      first: [mobileItems[0]],
      last: [mobileItems[2]],
    };
  }

  // Untuk desktop, gunakan logika normal
  const currentCardsPerSlide = cardsPerSlide.value;

  // Group cards based on cards per slide
  const firstGroup = featuredServices.value.slice(0, currentCardsPerSlide);
  const lastGroupIndex = Math.max(
    0,
    featuredServices.value.length - currentCardsPerSlide
  );
  const lastGroup = featuredServices.value.slice(lastGroupIndex);

  return {
    first: firstGroup,
    last: lastGroup,
  };
});

// Fungsi untuk menghitung nilai translateX dengan akurat tanpa akumulasi
const getTranslateValue = () => {
  // Koreksi indeks jika melebihi batas yang diizinkan
  if (currentSlide.value > totalSlides.value) {
    // Reset jika melebihi batas maksimal
    currentSlide.value = currentSlide.value % totalSlides.value;
  } else if (currentSlide.value < -1) {
    // Reset jika melebihi batas minimal
    currentSlide.value = -1;
  }

  // Jika currentSlide -1, artinya di clone terakhir
  if (currentSlide.value === -1) {
    return 0; // Posisi paling awal (clone terakhir)
  }
  // Jika currentSlide di range normal (0 sampai totalSlides-1)
  else if (currentSlide.value >= 0 && currentSlide.value < totalSlides.value) {
    return (currentSlide.value + 1) * 100; // +1 karena ada clone di awal
  }
  // Jika currentSlide sama dengan totalSlides, artinya di clone pertama
  else if (currentSlide.value === totalSlides.value) {
    return (totalSlides.value + 1) * 100;
  }

  // Fallback untuk kasus yang tidak terduga
  return (currentSlide.value + 1) * 100;
};

// State untuk menyimpan lebar layar
const windowWidth = ref(0);

// Compute cards per slide berdasarkan lebar layar
const cardsPerSlide = computed(() => {
  // Determine cards per slide based on screen size
  if (windowWidth.value >= 1024) return 3;
  if (windowWidth.value >= 768) return 2;
  return 1;
});

const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 100) + '...';
};

const featuredServices = computed(() => {
  // Untuk tampilan mobile, batasi hanya 3 layanan saja
  if (windowWidth.value < 768) {
    return bannerStore.bannerData.data?.slice(0, 3) || [];
  }
  // Untuk tampilan desktop/tablet, gunakan maksimum 9 item
  return bannerStore.bannerData.data?.slice(0, 9) || [];
});

// Function to get the appropriate icon based on category
const getCategoryIcon = (category) => {
  if (!category) return 'i-heroicons-cube';

  const lowerCategory = category.toLowerCase();

  if (lowerCategory.includes('digital') || lowerCategory.includes('teknologi'))
    return 'i-heroicons-computer-desktop';

  if (lowerCategory.includes('publik') || lowerCategory.includes('masyarakat'))
    return 'i-heroicons-users';

  if (lowerCategory.includes('data') || lowerCategory.includes('informasi'))
    return 'i-heroicons-document-chart-bar';

  if (lowerCategory.includes('komunikasi') || lowerCategory.includes('media'))
    return 'i-heroicons-chat-bubble-left-right';

  return 'i-heroicons-cube';
};

// Carousel navigation with unlimited scroll
// Variabel untuk mengelola state navigasi
let navigateTimer = null;
let clickCount = 0;
const MAX_CLICKS = 3; // Batas maksimum klik berturutan
const DEBOUNCE_TIME = 150; // 150ms debounce - sedikit lebih lama untuk menangani klik cepat
const RESET_CLICK_COUNT_TIME = 800; // 800ms untuk reset hitungan klik

// Function untuk membatasi klik berturut-turut dengan perlindungan tambahan
const throttleNavigation = (callback) => {
  // Batalkan timer sebelumnya jika ada untuk mencegah overlap
  if (navigateTimer) {
    clearTimeout(navigateTimer);
  }

  // Jika klik melebihi batas, force reset carousel
  clickCount++;
  if (clickCount > MAX_CLICKS) {
    isJumping.value = true;

    // Hentikan autoplay untuk mencegah konflik
    stopAutoplay();

    // Delay untuk memastikan UI tetap responsif
    navigateTimer = setTimeout(() => {
      // Gunakan requestAnimationFrame untuk menjamin timing yang lebih baik
      requestAnimationFrame(() => {
        // Reset ke slide pertama asli
        currentSlide.value = 0;

        // Reset click count
        clickCount = 0;

        // Re-enable transisi setelah sedikit delay dengan nextTick
        nextTick(() => {
          setTimeout(() => {
            isJumping.value = false;

            // Mulai autoscroll kembali setelah 4 detik jika tidak hover
            setTimeout(() => {
              if (!isHovering.value && !document.hidden) {
                startAutoplay();
              }
            }, 3000);
          }, 50);
        });
      });

      navigateTimer = null;
    }, DEBOUNCE_TIME);

    return;
  }

  // Set timer untuk memanggil callback setelah debounce
  navigateTimer = setTimeout(() => {
    // Eksekusi callback dalam requestAnimationFrame untuk timing yang lebih baik
    requestAnimationFrame(() => {
      callback();
    });

    navigateTimer = null;

    // Set timer untuk reset hitungan klik dengan jeda yang lebih panjang
    setTimeout(() => {
      clickCount = 0;
    }, RESET_CLICK_COUNT_TIME);
  }, DEBOUNCE_TIME);
};

const nextSlide = () => {
  if (isLoading.value || isJumping.value) return;

  // Hentikan autoscroll saat tombol diklik
  stopAutoplay();

  throttleNavigation(() => {
    const maxSlides = totalSlides.value - 1;

    // Validasi sebelum mengubah index
    if (currentSlide.value === maxSlides) {
      // Jika sudah di slide terakhir, pindah ke slide kloning pertama
      currentSlide.value = maxSlides + 1;
    } else if (currentSlide.value < maxSlides) {
      // Memastikan increment tidak melebihi batas
      currentSlide.value++;
    }

    // Mulai autoscroll kembali setelah 4 detik
    setTimeout(() => {
      if (!isHovering.value) {
        startAutoplay();
      }
    }, 3000);
  });
};

const prevSlide = () => {
  if (isLoading.value || isJumping.value) return;

  // Hentikan autoscroll saat tombol diklik
  stopAutoplay();

  throttleNavigation(() => {
    // Validasi sebelum mengubah index
    if (currentSlide.value === 0) {
      // Jika sudah di slide pertama, pindah ke slide kloning terakhir
      currentSlide.value = -1;
    } else if (currentSlide.value > -1) {
      // Memastikan decrement tidak melewati batas
      currentSlide.value--;
    }

    // Mulai autoscroll kembali setelah 4 detik
    setTimeout(() => {
      if (!isHovering.value) {
        startAutoplay();
      }
    }, 3000);
  });
};

// Handle transisi antar slide kloning dan asli dengan penanganan yang lebih robust
const handleTransitionEnd = () => {
  // Hanya lakukan transisi jika tidak ada transisi lain yang sedang berjalan
  if (isJumping.value) return;

  if (currentSlide.value === totalSlides.value) {
    // Transisi ke kloning pertama selesai, lompat ke slide pertama tanpa animasi
    isJumping.value = true;

    // Gunakan requestAnimationFrame untuk memastikan browser telah melakukan render
    requestAnimationFrame(() => {
      currentSlide.value = 0;

      // Pastikan DOM diupdate sebelum mengaktifkan transisi lagi
      nextTick(() => {
        // Berikan sedikit delay untuk memastikan perubahan telah diterapkan
        setTimeout(() => {
          isJumping.value = false;
        }, 50);
      });
    });
  } else if (currentSlide.value === -1) {
    // Transisi ke kloning terakhir selesai, lompat ke slide terakhir tanpa animasi
    isJumping.value = true;

    // Gunakan requestAnimationFrame untuk memastikan browser telah melakukan render
    requestAnimationFrame(() => {
      currentSlide.value = totalSlides.value - 1;

      // Pastikan DOM diupdate sebelum mengaktifkan transisi lagi
      nextTick(() => {
        // Berikan sedikit delay untuk memastikan perubahan telah diterapkan
        setTimeout(() => {
          isJumping.value = false;
        }, 50);
      });
    });
  }
};

// Auto-play carousel with pause on hover
let autoplayInterval;

// Tambahkan referensi untuk carousel track
const carouselTrack = ref(null);

const startAutoplay = () => {
  // Jangan mulai autoplay baru jika sudah berjalan
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
  }

  autoplayInterval = setInterval(() => {
    if (!isLoading.value && !isHovering.value && !document.hidden) {
      // Hanya jalankan nextSlide jika browser tab aktif dan tidak sedang hover
      nextSlide();
    }
  }, 4000);
};

const stopAutoplay = () => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
    autoplayInterval = null;
  }
};

// Track hover state to pause autoplay
const isHovering = ref(false);
const handleMouseEnter = () => {
  isHovering.value = true;
  stopAutoplay();
};
const handleMouseLeave = () => {
  isHovering.value = false;
  startAutoplay();
};

// Reset slide when screen size changes
watch(
  () => cardsPerSlide.value,
  () => {
    currentSlide.value = 0;
  }
);

// Swipe support for mobile
const touchStartX = ref(0);
const touchEndX = ref(0);

const handleTouchStart = (e) => {
  touchStartX.value = e.changedTouches[0].screenX;
};

const handleTouchEnd = (e) => {
  touchEndX.value = e.changedTouches[0].screenX;
  handleSwipe();
};

const handleSwipe = () => {
  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  if (touchStartX.value - touchEndX.value > minSwipeDistance) {
    // Swiped left
    nextSlide();
  } else if (touchEndX.value - touchStartX.value > minSwipeDistance) {
    // Swiped right
    prevSlide();
  }
};

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(async () => {
  try {
    // Set initial window width
    updateWindowWidth();

    // Show shimmer loading while data is being fetched
    isLoading.value = true;

    await bannerStore.getBannerData();

    // Simulate a minimum loading time for better UX
    setTimeout(() => {
      isLoading.value = false;
      startAutoplay();

      // Pastikan timer sebelumnya dibatalkan sebelum memulai animasi
      if (navigateTimer) {
        clearTimeout(navigateTimer);
        navigateTimer = null;
        clickCount = 0;
      }
    }, 1200); // Slightly longer minimum loading time for better UX perception

    // Add resize listener for responsive cardsPerSlide
    window.addEventListener('resize', updateWindowWidth);

    // Add event listeners for hover state
    const carouselElement = document.querySelector(
      '.w-full.overflow-hidden.rounded-2xl'
    );
    if (carouselElement) {
      carouselElement.addEventListener('mouseenter', handleMouseEnter);
      carouselElement.addEventListener('mouseleave', handleMouseLeave);

      // Add touch event listeners for mobile swipe
      carouselElement.addEventListener('touchstart', handleTouchStart);
      carouselElement.addEventListener('touchend', handleTouchEnd);
    }

    // Menambahkan event listener visibilitychange untuk menghentikan autoplay ketika tab tidak aktif
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoplay();
      } else if (!isHovering.value) {
        startAutoplay();
      }
    });

    // Preload images for smoother transitions
    if (bannerStore.bannerData.data?.length) {
      bannerStore.bannerData.data.forEach((item) => {
        if (item.image) {
          const img = new Image();
          img.src = item.image;
        }
      });
    }
  } catch (error) {
    console.error('Error loading banner data:', error);
    isLoading.value = false;
    startAutoplay();
  }
});

// Clean up
onBeforeUnmount(() => {
  stopAutoplay();

  // Remove event listeners
  const carouselElement = document.querySelector(
    '.w-full.overflow-hidden.rounded-2xl'
  );
  if (carouselElement) {
    carouselElement.removeEventListener('mouseenter', handleMouseEnter);
    carouselElement.removeEventListener('mouseleave', handleMouseLeave);
    carouselElement.removeEventListener('touchstart', handleTouchStart);
    carouselElement.removeEventListener('touchend', handleTouchEnd);
  }

  // Remove resize event listener
  window.removeEventListener('resize', updateWindowWidth);
});

// Handle click pada indikator dengan proteksi throttling
const setCurrentSlide = (index) => {
  if (isLoading.value || isJumping.value) return;
  // Hentikan autoscroll saat indikator diklik
  stopAutoplay();

  throttleNavigation(() => {
    // Validasi index untuk memastikan dalam batas aman
    if (index >= 0 && index < totalSlides.value) {
      currentSlide.value = index;
    }

    // Mulai autoscroll kembali setelah 4 detik
    setTimeout(() => {
      if (!isHovering.value) {
        startAutoplay();
      }
    }, 3000);
  });
};

// Fungsi khusus untuk tombol navigasi di luar carousel
const manualNextSlide = () => {
  // Hentikan autoplay terlebih dahulu - pastikan berhenti
  stopAutoplay();

  // Panggil nextSlide untuk navigasi
  nextSlide();

  // Pastikan tidak akan auto-start lagi dalam waktu dekat
  setTimeout(() => {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }

    // Mulai autoplay kembali setelah 4 detik jika tidak ada interaksi
    setTimeout(() => {
      if (!isHovering.value && !document.hidden) {
        startAutoplay();
      }
    }, 3000);
  }, 100);
};

const manualPrevSlide = () => {
  // Hentikan autoplay terlebih dahulu - pastikan berhenti
  stopAutoplay();

  // Panggil prevSlide untuk navigasi
  prevSlide();

  // Pastikan tidak akan auto-start lagi dalam waktu dekat
  setTimeout(() => {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }

    // Mulai autoplay kembali setelah 4 detik jika tidak ada interaksi
    setTimeout(() => {
      if (!isHovering.value && !document.hidden) {
        startAutoplay();
      }
    }, 3000);
  }, 100);
};
</script>

<style scoped>
.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Enhanced hover effects */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

.hover\:scale-110:hover {
  transform: scale(1.1);
}

/* Gradient animations */
.bg-gradient-to-r {
  background-size: 200% auto;
  transition: background-position 0.5s ease;
}

.bg-gradient-to-r:hover {
  background-position: right center;
}

/* Card animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeInUp 0.5s ease-out forwards;
  animation-delay: calc(var(--index) * 0.1s);
}

/* Floating animation */
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Slow pulse animation */
@keyframes pulse-slow {
  0%,
  100% {
    opacity: 0.15;
  }
  50% {
    opacity: 0.3;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Dark mode shimmer styles */
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

/* Accessibility improvements */
button:focus-visible,
a:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Aksara Jawa font styling */
.aksara-jawa {
  font-family: 'nyk Ngayogyan New';
  line-height: 2 !important;
}

@media (max-width: 768px) {
  button,
  a {
    min-height: 44px;
    min-width: 44px;
  }
}
</style>
