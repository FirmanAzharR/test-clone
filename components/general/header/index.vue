<template>
    <!-- eslint-disable vue/no-multiple-template-root -->
  <header 
    class="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 p-5"
    :class="[
      scrolled 
        ? isDark 
          ? 'bg-slate-900/60 border-b border-slate-800 shadow-sm backdrop-blur-sm' 
          : 'bg-slate-900/60 border-b border-blue-100 shadow-sm backdrop-blur-sm text-white' 
        : 'bg-slate-900/80 text-white backdrop-blur-lg',
    ]"
  >
    <nav class="flex items-center justify-between px-4 py-3 mx-auto max-w-7xl lg:px-6" aria-label="Global">
      <!-- Logo -->
      <div class="flex-shrink-0">
        <!-- Shimmer for logo when loading -->
        <div v-if="isLoading" class="w-auto h-10">
          <Vue3LoadingShimmer class="w-32 h-10 rounded" />
        </div>

        <!-- Actual logo when loaded -->
        <NuxtLink v-else to="/" class="flex items-center space-x-4">
          <img 
            class="w-auto h-10" 
            :src="logoJogja" 
            alt="Logo Jogja" 
          />
          <!-- Show appropriate logo based on scroll state and dark mode -->
          <img 
            v-if="!scrolled && !isDark" 
            class="w-auto h-10" 
            :src="logoWhite" 
            alt="Logo" 
          />
          <img 
            v-else-if="isDark" 
            class="w-auto h-10" 
            :src="logoWhite" 
            alt="Logo" 
          />
          <img 
            v-else 
            class="w-auto h-10" 
            :src="logoBlack" 
            alt="Logo" 
          />
        </NuxtLink>
      </div>

      <!-- Desktop Navigation -->
      <div class="hidden lg:flex lg:items-center lg:gap-x-1">
        <!-- Shimmer for menu items when loading -->
        <div v-if="isLoading" class="flex items-center gap-x-1">
          <Vue3LoadingShimmer v-for="i in 4" :key="`menu-shimmer-${i}`" class="w-20 mx-1 rounded-lg h-9" />
        </div>

        <!-- Actual menu items when loaded - MODIFIED to show max 4 items -->
        <template v-else>
          <!-- First 4 menu items -->
          <div v-for="(item, index) in visibleMenuItems" :key="item.id" class="relative group">
            <NuxtLink :to="item.link" :target="isExternalLink(item.link) ? '_blank' : undefined"
              :rel="isExternalLink(item.link) ? 'noopener noreferrer' : undefined"
              class="flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg" :class="[
                scrolled
                  ? isDark
                    ? activeMenuKey === getMenuKey(item, index)
                      ? 'text-white bg-blue-600 hover:bg-blue-700'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    : activeMenuKey === getMenuKey(item, index)
                      ? 'text-white bg-blue-600 hover:bg-blue-700'
                      : 'text-white hover:bg-blue-50 hover:text-blue-600'
                  : activeLink === item.link
                    ? 'text-white bg-white/20 backdrop-blur-sm hover:bg-white/30'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
              ]" :data-menu-index="index" @click="setActiveMenu(getMenuKey(item, index))">
              <div class="flex flex-col">
                <div>
                  {{ item.title }}
                </div>
                <!-- <span class="text-sm opacity-75 aksara-jawa" v-if="isAksaraJawaEnabled">
                  ꧋{{ convertToJavanese(item.title) }}
                </span> -->
              </div>
              <!-- Dropdown indicator -->
              <UIcon v-if="item.submenu && JSON.parse(item.submenu).length"
                :name="activeSubmenu === index ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                class="w-4 h-4 ml-1 transition-transform duration-200" />
            </NuxtLink>
            <div v-if="item.submenu && JSON.parse(item.submenu).length"
              class="absolute z-20 invisible mt-1 transition-all duration-200 origin-top-left scale-95 opacity-0 top-full group-hover:visible group-hover:scale-100 group-hover:opacity-100"
              :style="getMainMenuPosition(index, item)" @mouseenter="maintainMainMenuHover(index, true)"
              @mouseleave="maintainMainMenuHover(index, false)">
              <div class="flex gap-4 min-w-0 overflow-x-auto pb-2 px-1">
                <!-- Level 1 Card -->
                <div class="flex-shrink-0 w-56 p-3 rounded-lg shadow-lg backdrop-blur-sm"
                  :class="isDark ? 'bg-slate-900/95 border border-slate-800' : 'bg-white/95 border border-blue-100'"
                  @mouseenter="maintainMainMenuHover(index, true)" @mouseleave="maintainMainMenuHover(index, false)">
                  <div class="py-1 overflow-y-auto max-h-[60vh]">
                    <template v-for="sub in JSON.parse(item.submenu)" :key="sub.id">
                      <div class="mb-1">
                        <div class="flex items-center justify-between">
                          <NuxtLink :to="sub.link" :target="isExternalLink(sub.link) ? '_blank' : undefined"
                            :rel="isExternalLink(sub.link) ? 'noopener noreferrer' : undefined"
                            class="flex-grow block px-3 py-2 text-sm transition-colors duration-150 rounded-md" :class="[
                              isDark
                                ? activeLink === sub.link
                                  ? 'text-white bg-blue-600'
                                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                : activeLink === sub.link
                                  ? 'text-white bg-blue-600'
                                  : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'
                            ]" @click="setActiveLink(sub.link)">
                            {{ sub.title }}
                          </NuxtLink>
                          <!-- Button to show level 2 submenu -->
                          <button v-if="sub.submenu && JSON.parse(sub.submenu).length"
                            @mouseenter="setMainSubmenuHover(index, sub.id, true); maintainMainMenuHover(index, true)"
                            @mouseleave="setMainSubmenuHover(index, sub.id, false)"
                            class="flex-shrink-0 flex items-center justify-center w-6 h-6 transition-colors duration-200 rounded-full ml-2"
                            :class="{
                              'bg-blue-50 text-blue-600': mainSubmenuHovered[`${index}-${sub.id}`] && !isDark,
                              'bg-slate-800 text-blue-400': mainSubmenuHovered[`${index}-${sub.id}`] && isDark,
                              'hover:bg-blue-50 hover:text-blue-600': !isDark,
                              'hover:bg-slate-800 hover:text-blue-400': isDark
                            }">
                            <UIcon name="i-heroicons-chevron-right" class="w-3 h-3 transition-transform duration-200" />
                          </button>

                        </div>
                      </div>
                    </template>
                  </div>
                </div>

                <!-- Level 2 Cards -->
                <template v-for="sub in JSON.parse(item.submenu)" :key="`level2-main-${sub.id}`">
                  <div
                    v-show="mainSubmenuHovered[`${index}-${sub.id}`] && sub.submenu && JSON.parse(sub.submenu).length"
                    class="flex-shrink-0 w-56 p-3 rounded-lg shadow-lg backdrop-blur-sm"
                    :class="isDark ? 'bg-slate-900/95 border border-slate-800' : 'bg-white/95 border border-blue-100'"
                    @mouseenter="setMainSubmenuHover(index, sub.id, true); maintainMainMenuHover(index, true)"
                    @mouseleave="setMainSubmenuHover(index, sub.id, false)">
                    <div class="py-1 overflow-y-auto max-h-[60vh]">
                      <!-- <div class="mb-2 px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {{ sub.title }}
                      </div> -->
                      <template v-for="(sub2, sub2Index) in JSON.parse(sub.submenu)" :key="sub2.id">
                        <div class="mb-1">
                          <div class="flex items-center justify-between">
                            <NuxtLink :to="sub2.link" :target="isExternalLink(sub2.link) ? '_blank' : undefined"
                              :rel="isExternalLink(sub2.link) ? 'noopener noreferrer' : undefined"
                              class="flex-grow block px-3 py-2 text-sm transition-colors duration-150 rounded-md"
                              :class="[
                                isDark
                                  ? activeLink === sub2.link
                                    ? 'text-white bg-blue-600'
                                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                  : activeLink === sub2.link
                                    ? 'text-white bg-blue-600'
                                    : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'
                              ]" @click="setActiveLink(sub2.link)">
                              {{ sub2.title }}
                            </NuxtLink>
                            <!-- Button to show level 3 submenu -->
                            <button v-if="sub2.submenu && JSON.parse(sub2.submenu).length"
                              @mouseenter="setMainSubmenuHover(index, sub.id, sub2.id, true); maintainMainMenuHover(index, true)"
                              @mouseleave="setMainSubmenuHover(index, sub.id, sub2.id, false)"
                              class="flex-shrink-0 flex items-center justify-center w-6 h-6 transition-colors duration-200 rounded-full ml-2"
                              :class="{
                                'bg-blue-50 text-blue-600': mainSubmenuHovered[`${index}-${sub.id}-${sub2.id}`] && !isDark,
                                'bg-slate-800 text-blue-400': mainSubmenuHovered[`${index}-${sub.id}-${sub2.id}`] && isDark,
                                'hover:bg-blue-50 hover:text-blue-600': !isDark,
                                'hover:bg-slate-800 hover:text-blue-400': isDark
                              }">
                              <UIcon name="i-heroicons-chevron-right"
                                class="w-3 h-3 transition-transform duration-200" />
                            </button>
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </template> <!-- Level 3 Cards -->
                <template v-for="sub in JSON.parse(item.submenu)" :key="`level3-main-${sub.id}`">
                  <template v-for="(sub2, sub2Index) in sub.submenu ? JSON.parse(sub.submenu) : []"
                    :key="`level3-main-${sub2.id}`">
                    <div
                      v-show="mainSubmenuHovered[`${index}-${sub.id}-${sub2.id}`] && sub2.submenu && JSON.parse(sub2.submenu).length"
                      class="flex-shrink-0 w-56 p-3 rounded-lg shadow-lg backdrop-blur-sm"
                      :class="isDark ? 'bg-slate-900/95 border border-slate-800' : 'bg-white/95 border border-blue-100'"
                      @mouseenter="setMainSubmenuHover(index, sub.id, sub2.id, true); setMainSubmenuHover(index, sub.id, true); maintainMainMenuHover(index, true)"
                      @mouseleave="setMainSubmenuHover(index, sub.id, sub2.id, false)">
                      <div class="py-1 overflow-y-auto max-h-[60vh]">
                        <!-- <div class="mb-2 px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          {{ sub2.title }}
                        </div> -->
                        <template v-for="sub3 in JSON.parse(sub2.submenu)" :key="sub3.id">
                          <div class="mb-1">
                            <NuxtLink :to="sub3.link" :target="isExternalLink(sub3.link) ? '_blank' : undefined"
                              :rel="isExternalLink(sub3.link) ? 'noopener noreferrer' : undefined"
                              class="block px-3 py-2 text-sm transition-colors duration-150 rounded-md" :class="[
                                isDark
                                  ? activeLink === sub3.link
                                    ? 'text-white bg-blue-600'
                                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                  : activeLink === sub3.link
                                    ? 'text-white bg-blue-600'
                                    : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'
                              ]" @click="setActiveLink(sub3.link)">
                              {{ sub3.title }}
                            </NuxtLink>
                          </div>
                        </template>
                      </div>
                    </div>
                  </template>
                </template>
              </div>
            </div>
          </div> <!-- "More" dropdown for additional menu items -->
          <div v-if="hasMoreMenuItems" class="relative group" @mouseleave="resetMoreSubmenus"> <button data-more-menu
              class="flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg" :class="[
                scrolled
                  ? isDark
                    ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    : 'text-white hover:bg-blue-50 hover:text-blue-600'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              ]">
              <div class="flex flex-col">
                <div>Menu Lainnya</div>
                <span class="text-sm opacity-75 aksara-jawa" v-if="isAksaraJawaEnabled">꧋{{ convertToJavanese(`Menu
                  Lainnya`)
                }}</span>
              </div>
              <UIcon name="i-heroicons-chevron-down"
                class="w-4 h-4 ml-1 transition-transform duration-200 group-hover:rotate-180" />
            </button> <!-- More menu dropdown with separate cards for level 2 and 3 -->
            <div ref="moreDropdownRef"
              class="absolute left-0 z-20 invisible mt-1 transition-all duration-200 origin-top-left scale-95 opacity-0 top-full group-hover:visible group-hover:scale-100 group-hover:opacity-100"
              :style="moreDropdownStyle">
              <div class="flex gap-4 max-w-5xl min-w-0 overflow-x-auto pb-2">
                <!-- Main Menu Card (Contains parent items with collapsible submenus) -->
                <div class="flex-shrink-0 w-64 p-3 rounded-lg shadow-lg backdrop-blur-sm"
                  :class="isDark ? 'bg-slate-900/95 border border-slate-800' : 'bg-white/95 border border-blue-100'">
                  <div class="py-1 overflow-y-auto max-h-[60vh]">
                    <!-- Show parent menu items with collapsible submenus -->
                    <template v-for="(item, index) in hiddenMenuItems" :key="item.id">
                      <div class="mb-1">
                        <!-- Parent menu item -->
                        <div class="flex items-center justify-between">
                          <NuxtLink :to="item.link" :target="isExternalLink(item.link) ? '_blank' : undefined"
                            :rel="isExternalLink(item.link) ? 'noopener noreferrer' : undefined"
                            class="flex-grow block px-3 py-2 text-sm transition-colors duration-150 rounded-md" :class="[
                              isDark
                                ? activeLink === item.link
                                  ? 'text-white bg-blue-600'
                                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                : activeLink === item.link
                                  ? 'text-white bg-blue-600'
                                  : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'
                            ]" @click="setActiveLink(item.link)">
                            <div class="flex flex-col">
                              <div>{{ item.title }}</div>
                              
                            </div>
                          </NuxtLink>

                          <!-- Toggle button for submenu with arrow indicator -->
                          <button v-if="item.submenu && JSON.parse(item.submenu).length"
                            @click="toggleMoreSubmenu(index)"
                            class="flex-shrink-0 flex items-center justify-center w-6 h-6 transition-colors duration-200 rounded-full ml-2"
                            :class="{
                              'bg-blue-50 text-blue-600': moreSubmenuActive[index] && !isDark,
                              'bg-slate-800 text-blue-400': moreSubmenuActive[index] && isDark,
                              'hover:bg-blue-50 hover:text-blue-600': !isDark,
                              'hover:bg-slate-800 hover:text-blue-400': isDark
                            }">
                            <UIcon
                              :name="moreSubmenuActive[index] ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                              class="w-3 h-3 transition-transform duration-200" />
                          </button>
                        </div>

                        <!-- Level 1 submenu (collapsible) -->
                        <Transition name="expand">
                          <div v-if="moreSubmenuActive[index] && item.submenu && JSON.parse(item.submenu).length"
                            class="mt-1 ml-4 border-l border-gray-200 dark:border-gray-700 pl-2">
                            <div v-for="(sub, subIndex) in JSON.parse(item.submenu)" :key="sub.id" class="mb-1">
                              <div class="flex items-center justify-between">
                                <NuxtLink :to="sub.link" :target="isExternalLink(sub.link) ? '_blank' : undefined"
                                  :rel="isExternalLink(sub.link) ? 'noopener noreferrer' : undefined"
                                  class="flex-grow block px-2 py-1 text-xs transition-colors duration-150 rounded-md"
                                  :class="[
                                    isDark
                                      ? activeLink === sub.link
                                        ? 'text-white bg-blue-600'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                      : activeLink === sub.link
                                        ? 'text-white bg-blue-600'
                                        : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                                  ]" @click="setActiveLink(sub.link)">
                                  {{ sub.title }}
                                </NuxtLink>

                                <!-- Button to show level 2 submenu -->
                                <button v-if="sub.submenu && JSON.parse(sub.submenu).length"
                                  @click="toggleLevel2Submenu(index, subIndex)"
                                  class="flex-shrink-0 flex items-center justify-center w-5 h-5 transition-colors duration-200 rounded-full ml-1"
                                  :class="{
                                    'bg-blue-50 text-blue-600': moreSubmenuHovered[`${index}-${subIndex}`] && !isDark,
                                    'bg-slate-800 text-blue-400': moreSubmenuHovered[`${index}-${subIndex}`] && isDark,
                                    'hover:bg-blue-50 hover:text-blue-600': !isDark,
                                    'hover:bg-slate-800 hover:text-blue-400': isDark
                                  }">
                                  <UIcon name="i-heroicons-chevron-right"
                                    class="w-2 h-2 transition-transform duration-200" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </Transition>
                      </div>
                    </template>
                  </div>
                </div><!-- Level 2 Submenu Card -->
                <template v-for="(item, index) in hiddenMenuItems" :key="`level2-${item.id}`">
                  <template v-for="(sub, subIndex) in item.submenu ? JSON.parse(item.submenu) : []"
                    :key="`level2-${sub.id}`">
                    <div
                      v-show="moreSubmenuHovered[`${index}-${subIndex}`] && sub.submenu && JSON.parse(sub.submenu).length"
                      class="flex-shrink-0 w-64 p-3 rounded-lg shadow-lg backdrop-blur-sm"
                      :class="isDark ? 'bg-slate-900/95 border border-slate-800' : 'bg-white/95 border border-blue-100'">
                      <div class="py-1 overflow-y-auto max-h-[60vh]">
                        <div class="mb-2 px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          {{ sub.title }}
                        </div>
                        <template v-for="(sub2, sub2Index) in JSON.parse(sub.submenu)" :key="sub2.id">
                          <div class="mb-1">
                            <div class="flex items-center justify-between">
                              <NuxtLink :to="sub2.link" :target="isExternalLink(sub2.link) ? '_blank' : undefined"
                                :rel="isExternalLink(sub2.link) ? 'noopener noreferrer' : undefined"
                                class="flex-grow block px-3 py-2 text-sm transition-colors duration-150 rounded-md"
                                :class="[
                                  isDark
                                    ? activeLink === sub2.link
                                      ? 'text-white bg-blue-600'
                                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                    : activeLink === sub2.link
                                      ? 'text-white bg-blue-600'
                                      : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'
                                ]" @click="setActiveLink(sub2.link)">
                                {{ sub2.title }}
                              </NuxtLink>

                              <!-- Button to show level 3 submenu -->
                              <button v-if="sub2.submenu && JSON.parse(sub2.submenu).length"
                                @click="toggleLevel3Submenu(index, subIndex, sub2Index)"
                                class="flex-shrink-0 flex items-center justify-center w-6 h-6 transition-colors duration-200 rounded-full ml-2"
                                :class="{
                                  'bg-blue-50 text-blue-600': moreSubmenuHovered[`${index}-${subIndex}-${sub2Index}`] && !isDark,
                                  'bg-slate-800 text-blue-400': moreSubmenuHovered[`${index}-${subIndex}-${sub2Index}`] && isDark,
                                  'hover:bg-blue-50 hover:text-blue-600': !isDark,
                                  'hover:bg-slate-800 hover:text-blue-400': isDark
                                }">
                                <UIcon name="i-heroicons-chevron-right"
                                  class="w-3 h-3 transition-transform duration-200" />
                              </button>
                            </div>
                          </div>
                        </template>
                      </div>
                    </div>
                  </template>
                </template> <!-- Level 3 Submenu Card -->
                <template v-for="(item, index) in hiddenMenuItems" :key="`level3-${item.id}`">
                  <template v-for="(sub, subIndex) in item.submenu ? JSON.parse(item.submenu) : []"
                    :key="`level3-${sub.id}`">
                    <template v-for="(sub2, sub2Index) in sub.submenu ? JSON.parse(sub.submenu) : []"
                      :key="`level3-${sub2.id}`">
                      <div
                        v-show="moreSubmenuHovered[`${index}-${subIndex}-${sub2Index}`] && sub2.submenu && JSON.parse(sub2.submenu).length"
                        class="flex-shrink-0 w-64 p-3 rounded-lg shadow-lg backdrop-blur-sm"
                        :class="isDark ? 'bg-slate-900/95 border border-slate-800' : 'bg-white/95 border border-blue-100'">
                        <div class="py-1 overflow-y-auto max-h-[60vh]">
                          <div class="mb-2 px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            {{ sub2.title }}
                          </div>
                          <template v-for="(sub3, sub3Index) in JSON.parse(sub2.submenu)" :key="sub3.id">
                            <div class="mb-1">
                              <NuxtLink :to="sub3.link" :target="isExternalLink(sub3.link) ? '_blank' : undefined"
                                :rel="isExternalLink(sub3.link) ? 'noopener noreferrer' : undefined"
                                class="block px-3 py-2 text-sm transition-colors duration-150 rounded-md" :class="[
                                  isDark
                                    ? activeLink === sub3.link
                                      ? 'text-white bg-blue-600'
                                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                    : activeLink === sub3.link
                                      ? 'text-white bg-blue-600'
                                      : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'
                                ]" @click="setActiveLink(sub3.link)">
                                {{ sub3.title }}
                              </NuxtLink>
                            </div>
                          </template>
                        </div>
                      </div>
                    </template>
                  </template>
                </template>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-1 sm:gap-2">
        <!-- Shimmer for action buttons when loading -->
        <template v-if="isLoading">
          <Vue3LoadingShimmer class="rounded-full w-9 h-9" />
          <Vue3LoadingShimmer class="rounded-full w-9 h-9" />
          <Vue3LoadingShimmer class="hidden w-20 rounded-full h-9 sm:block" />
          <Vue3LoadingShimmer class="rounded-full w-9 h-9 lg:hidden" />
        </template>

        <!-- Actual buttons when loaded -->
        <template v-else>
          <!-- Dark Mode Toggle Button -->
          <UButton :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
            :color="scrolled ? (isDark ? 'gray' : 'blue') : 'white'"
            :variant="scrolled ? (isDark ? 'ghost' : 'solid') : 'outline'" size="sm" class="text-white rounded-full"
            @click="toggleDarkMode" aria-label="Toggle dark mode" />

          <!-- Search Button -->
          <UButton 
            icon="i-heroicons-magnifying-glass" 
            :color="scrolled ? (isDark ? 'gray' : 'blue') : 'white'" 
            :variant="scrolled ? (isDark ? 'ghost' : 'solid') : 'outline'" 
            size="sm" 
            class="text-white rounded-full"
            @click="openSearchModal" 
            aria-label="Search"
          /> 
          <!---- Login Button 
          <UButton
            :color="isDark ? 'white' : 'blue'"
            :variant="isDark ? 'solid' : 'solid'"
            size="sm"
            class="hidden border-0 rounded-full sm:flex"
            :class="isDark ? 'bg-white text-slate-900 hover:bg-gray-200' : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'"
            @click="goToLogin" v-if="!isLoggedIn">
            Login
          </UButton>
          -->
          <!--- LanguageSwitcher  -->
          <LanguageSwitcher/>
          <!-- Mobile Menu Button -->
          <UButton class="rounded-full lg:hidden" :color="scrolled ? (isDark ? 'gray' : 'gray') : 'white'"
            :variant="scrolled ? (isDark ? 'ghost' : 'ghost') : 'outline'" size="sm"
            @click="mobileMenuOpen = !mobileMenuOpen" aria-label="Menu">
            <UIcon name="i-heroicons-bars-3" class="w-5 h-5" />
          </UButton>
        </template>
      </div>
    </nav>
    
    <!-- Enhanced Search Modal -->
    <UModal v-model="isOpen" prevent-close>
      <UCard :ui="{
        base: 'overflow-hidden shadow-xl border-0',
        header: { padding: 'p-4 sm:p-6' },
        body: { base: 'p-0' },
        footer: { padding: 'p-4 sm:p-6' }
      }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-semibold text-slate-900 dark:text-white">
              Pencarian
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" class="rounded-full"
              @click="closeSearchModal" />
          </div>
        </template>

        <div class="p-4 border-gray-100 sm:p-6 border-y dark:border-slate-800">
          <!-- Search Input with Animation -->
          <div class="relative">
            <UInput v-model="searchQuery" icon="i-heroicons-magnifying-glass" size="lg" placeholder="Cari informasi..."
              class="w-full" :loading="isSearching" :ui="{
                base: 'relative',
                form: 'block w-full rounded-lg border-0 py-3 px-4 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus-visible:outline-none sm:text-sm',
                input: 'border-0 bg-transparent placeholder:text-gray-400 focus:outline-none focus:ring-0 sm:text-sm',
                icon: {
                  base: 'flex-shrink-0 text-gray-400'
                }
              }" />

            <div v-if="searchSuggestions.length && searchQuery && !isSearching"
              class="absolute z-10 w-full mt-1 overflow-hidden bg-white rounded-md shadow-lg dark:bg-slate-900">
              <div class="py-1">
                <button v-for="(suggestion, index) in searchSuggestions" :key="index"
                  @click="selectSuggestion(suggestion)"
                  class="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white hover:bg-blue-50 hover:text-blue-600">
                  <UIcon name="i-heroicons-magnifying-glass" class="w-4 h-4 mr-2 text-gray-400" />
                  {{ suggestion }}
                </button>
              </div>
            </div>
          </div>

          <!-- Search Status -->
          <div v-if="searchQuery" class="flex items-center justify-between mt-4">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              <span v-if="isSearching">Mencari...</span>
              <span v-else-if="searchResults.length">{{ searchResults.length }} hasil ditemukan</span>
              <span v-else-if="hasSearched">Tidak ada hasil ditemukan</span>
            </p>
            <UButton v-if="searchQuery" size="xs" color="gray" variant="soft" @click="clearSearch" class="text-xs">
              Hapus Pencarian
            </UButton>
          </div>

          <!-- Shimmer for search results when searching -->
          <div v-if="isSearching" class="mt-4 space-y-2">
            <div v-for="i in 3" :key="`search-shimmer-${i}`" class="flex p-3 border border-transparent rounded-lg">
              <Vue3LoadingShimmer class="flex-shrink-0 w-10 h-10 mr-4 rounded-lg" />
              <div class="flex-1 min-w-0">
                <Vue3LoadingShimmer class="w-3/4 h-4 mb-2 rounded" />
                <Vue3LoadingShimmer class="w-full h-3 mb-1 rounded" />
                <Vue3LoadingShimmer class="w-full h-3 mb-2 rounded" />
                <div class="flex items-center mt-2 space-x-2">
                  <Vue3LoadingShimmer class="w-16 h-4 rounded-full" />
                  <Vue3LoadingShimmer class="w-24 h-3 rounded" />
                </div>
              </div>
            </div>
          </div>
          <TransitionGroup name="search-results" tag="div" class="mt-4 space-y-4 overflow-y-auto max-h-[60vh]" v-else>
            <div v-if="hasSearched && !searchResults.length && !filteredMenus.length && !isSearching"
              class="p-8 text-center">
              <UIcon name="i-heroicons-magnifying-glass"
                class="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h4 class="text-lg font-medium text-gray-900 dark:text-white">Tidak ada hasil</h4>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Coba kata kunci lain atau periksa ejaan Anda</p>
            </div>
            <!-- Data Menu Section -->
            <template v-if="filteredMenus.length > 0">
              <div key="menu-heading" class="px-3 py-1">
                <h5 class="text-sm font-semibold text-gray-900 dark:text-white">Data Menu</h5>
              </div>
              
              <div 
                v-for="(item, idx) in filteredMenus" 
                :key="`menu-${idx}`" 
                class="flex items-center p-3 transition-all duration-200 border border-transparent rounded-lg hover:border-blue-100 hover:bg-blue-50 dark:hover:border-slate-700 dark:hover:bg-slate-800 group cursor-pointer"
                @click="() => { router.push(item.link); isOpen = false; }"
              >
                <div class="flex-shrink-0 mr-4">
                  <div
                    class="flex items-center justify-center w-10 h-10 text-white rounded-lg bg-blue-500/80 dark:bg-blue-600/80">
                    <UIcon name="i-heroicons-link" class="w-5 h-5" />
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <h4
                    class="text-sm font-medium text-gray-900 truncate dark:text-white dark:group-hover:text-blue-400 group-hover:text-blue-600">
                    {{ item.title }}
                  </h4>
                </div>
                <div class="flex items-center ml-4">
                  <UButton
                    color="blue"
                    variant="ghost"
                    icon="i-heroicons-arrow-right"
                    class="rounded-full opacity-0 group-hover:opacity-100 pointer-events-none"
                    :title="item.title"
                  />
                </div>
              </div>
            </template>

            <!-- Data Konten Section -->
            <template v-if="searchResults.length > 0">
              <div key="content-heading" class="px-3 py-1" :class="{ 'mt-4': filteredMenus.length > 0 }">
                <h5 class="text-sm font-semibold text-gray-900 dark:text-white">Data Konten</h5>
              </div>

              <div v-for="(result, index) in searchResults" :key="`content-${index}`"
                class="flex p-3 transition-all duration-200 border border-transparent rounded-lg dark:hover:border-slate-700 dark:hover:bg-slate-800 hover:border-blue-100 hover:bg-blue-50 group">
                <div class="flex-shrink-0 mr-4">
                  <div class="flex items-center justify-center w-10 h-10 text-white rounded-lg">
                    <NuxtImg :src="result.image" />
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <h4
                    class="text-sm font-medium text-gray-900 truncate dark:text-white dark:group-hover:text-blue-400 group-hover:text-blue-600">
                    {{ result.title }}
                  </h4>
                  <template v-if="isEmbeddedContent(result.description)">
                    <div class="mt-2 text-sm text-blue-600 dark:text-blue-400">
                      <UIcon name="i-heroicons-document" class="inline-block w-4 h-4 mr-1" />
                      <span>File Terlampir</span>
                    </div>
                  </template>
                  <template v-else>
                    <div
                      class="mt-1 text-xs line-clamp-2 prose max-w-none [&_*]:!text-slate-700 dark:[&_*]:!text-slate-300 [&>ul>li::marker]:text-slate-700 dark:[&>ul>li::marker]:text-slate-300 [&>ol>li::marker]:text-slate-700 dark:[&>ol>li::marker]:text-slate-300 [&_a]:hover:!text-blue-600 dark:[&_a]:hover:!text-blue-400"
                      v-html="result.description">
                    </div>
                  </template>
                  <div class="flex items-center mt-2 space-x-2">
                    <span
                      class="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full dark:bg-blue-900/50 dark:text-blue-300">
                      {{ result.kategori }}
                    </span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      {{ formatDate(result.created_at) }}
                    </span>
                  </div>
                </div>
                <div class="flex items-center ml-4">
                  <UButton @click="navigateToResult(result)" color="blue" variant="ghost" icon="i-heroicons-arrow-right"
                    class="rounded-full opacity-0 group-hover:opacity-100" />
                </div>
              </div>
            </template>
          </TransitionGroup>
        </div>

        <template #footer>
          <div class="flex items-center justify-between">
            <p class="text-xs text-gray-500 dark:text-gray-400">Tekan Enter untuk mencari</p>
            <UButton color="blue" @click="performSearch" :loading="isSearching" :disabled="!searchQuery.trim()">
              <UIcon name="i-heroicons-magnifying-glass" class="w-4 h-4 mr-2" />
              Cari
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </header>

  <!-- Move mobile menu outside the header element so it's not affected by header scrolling -->
  <Transition name="slide-right">
    <div v-if="mobileMenuOpen" class="fixed inset-0 z-[100] flex lg:hidden">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="mobileMenuOpen = false"></div>

      <!-- Menu panel -->
      <div class="fixed inset-y-0 right-0 z-[100] w-full max-w-xs px-6 py-6 overflow-y-auto shadow-2xl"
        :class="isDark ? 'bg-slate-900' : 'bg-white'" @click.stop>
        <div class="flex items-center justify-between mb-6">
          <!-- Shimmer for mobile logo when loading -->
          <div v-if="isLoading" class="w-auto h-8">
            <Vue3LoadingShimmer class="h-8 rounded w-28" />
          </div>

          <!-- Actual mobile logo when loaded -->
          <NuxtLink v-else to="/" class="flex items-center" @click="mobileMenuOpen = false">
            <img class="w-auto h-8" :src="isDark ? logoWhite : logoBlack" alt="Logo" />
          </NuxtLink>

          <UButton :color="isDark ? 'gray' : 'gray'" variant="ghost" class="rounded-full"
            @click="mobileMenuOpen = false" aria-label="Close menu">
            <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
          </UButton>
        </div>

        <!-- Mobile menu items -->
        <div class="space-y-1 divide-y" :class="isDark ? 'divide-slate-800' : 'divide-gray-100'">
          <!-- Shimmer for mobile menu items when loading -->
          <div v-if="isLoading" class="space-y-4">
            <div v-for="i in 5" :key="`mobile-shimmer-${i}`" class="py-2">
              <Vue3LoadingShimmer class="w-full h-8 rounded" />
            </div>
          </div>

          <!-- Actual mobile menu items when loaded -->
          <div v-else v-for="(item, index) in menuStore.menuData.data" :key="item.id" class="py-2">
            <div class="flex items-center justify-between">
              <NuxtLink :to="item.link" :target="isExternalLink(item.link) ? '_blank' : undefined"
                :rel="isExternalLink(item.link) ? 'noopener noreferrer' : undefined"
                class="text-base font-medium transition-colors duration-200" :class="[
                  isDark
                    ? activeLink === item.link
                      ? 'text-blue-400'
                      : 'text-slate-300'
                    : activeLink === item.link
                      ? 'text-blue-600'
                      : 'text-slate-700'
                ]"
                @click="mobileMenuOpen = false"
              >
              <div class="flex flex-col">
              <div>
                {{ item.title }}
              </div>
              <span class="text-sm opacity-75">
                {{ convertToJavanese(item.title) }}
              </span>
              </div>
              </NuxtLink>

              <button v-if="item.submenu && JSON.parse(item.submenu).length" @click="toggleMobileSubmenu(index)"
                class="flex items-center justify-center w-8 h-8 transition-colors duration-200 rounded-full" :class="{
                  'bg-blue-50 text-blue-600': activeMobileSubmenu === index && !isDark,
                  'bg-slate-800 text-blue-400': activeMobileSubmenu === index && isDark,
                  'hover:bg-blue-50': !isDark,
                  'hover:bg-slate-800': isDark
                }">
                <UIcon :name="activeMobileSubmenu === index ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                  class="w-4 h-4 transition-transform duration-200" :class="{
                    'text-blue-600': activeMobileSubmenu === index && !isDark,
                    'text-blue-400': activeMobileSubmenu === index && isDark
                  }" />
              </button>
            </div>
            <!-- Mobile submenu with animation -->
            <Transition name="expand">
              <div v-if="activeMobileSubmenu === index && item.submenu && JSON.parse(item.submenu).length"
                class="pl-4 mt-2 space-y-1 border-l-2" :class="isDark ? 'border-slate-700' : 'border-blue-100'">
                <div v-for="(sub, subIndex) in JSON.parse(item.submenu)" :key="sub.id" class="space-y-1">
                  <!-- Level 2 menu item -->
                  <div class="flex items-center justify-between">
                    <NuxtLink v-if="!sub.submenu || !JSON.parse(sub.submenu || '[]').length" :to="sub.link"
                      :target="isExternalLink(sub.link) ? '_blank' : undefined"
                      :rel="isExternalLink(sub.link) ? 'noopener noreferrer' : undefined"
                      class="block py-2 text-sm transition-colors duration-200 flex-1" :class="[
                        isDark
                          ? activeLink === sub.link
                            ? 'text-blue-400'
                            : 'text-slate-400 hover:text-blue-400'
                          : activeLink === sub.link
                            ? 'text-blue-600'
                            : 'text-slate-600 hover:text-blue-600'
                      ]"
                      @click="mobileMenuOpen = false"
                    >
                      {{ sub.title }}
                    </NuxtLink>

                    <!-- Level 2 item with submenu -->
                    <div v-else class="flex items-center justify-between w-full">
                      <NuxtLink :to="sub.link" :target="isExternalLink(sub.link) ? '_blank' : undefined"
                        :rel="isExternalLink(sub.link) ? 'noopener noreferrer' : undefined"
                        class="block py-2 text-sm transition-colors duration-200 flex-1" :class="[
                          isDark
                            ? activeLink === sub.link
                              ? 'text-blue-400'
                              : 'text-slate-400 hover:text-blue-400'
                            : activeLink === sub.link
                              ? 'text-blue-600'
                              : 'text-slate-600 hover:text-blue-600'
                        ]"
                        @click="mobileMenuOpen = false"
                      >
                        {{ sub.title }}
                      </NuxtLink>

                      <button @click="toggleMobileLevel2Submenu(index, subIndex)"
                        class="flex items-center justify-center w-6 h-6 ml-2 transition-colors duration-200 rounded-full"
                        :class="{
                          'bg-blue-50 text-blue-600': activeMobileLevel2Submenu[`${index}-${subIndex}`] && !isDark,
                          'bg-slate-800 text-blue-400': activeMobileLevel2Submenu[`${index}-${subIndex}`] && isDark,
                          'hover:bg-blue-50': !isDark,
                          'hover:bg-slate-800': isDark
                        }">
                        <UIcon
                          :name="activeMobileLevel2Submenu[`${index}-${subIndex}`] ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                          class="w-3 h-3 transition-transform duration-200" />
                      </button>
                    </div>
                  </div>

                  <!-- Level 3 submenu -->
                  <Transition name="expand">
                    <div
                      v-if="activeMobileLevel2Submenu[`${index}-${subIndex}`] && sub.submenu && JSON.parse(sub.submenu).length"
                      class="pl-4 mt-1 space-y-1 border-l-2" :class="isDark ? 'border-slate-600' : 'border-blue-200'">
                      <div v-for="(sub2, sub2Index) in JSON.parse(sub.submenu)" :key="sub2.id" class="space-y-1">
                        <!-- Level 3 menu item -->
                        <div class="flex items-center justify-between">
                          <NuxtLink v-if="!sub2.submenu || !JSON.parse(sub2.submenu || '[]').length" :to="sub2.link"
                            :target="isExternalLink(sub2.link) ? '_blank' : undefined"
                            :rel="isExternalLink(sub2.link) ? 'noopener noreferrer' : undefined"
                            class="block py-1.5 text-xs transition-colors duration-200 flex-1" :class="[
                              isDark
                                ? activeLink === sub2.link
                                  ? 'text-blue-400'
                                  : 'text-slate-500 hover:text-blue-400'
                                : activeLink === sub2.link
                                  ? 'text-blue-600'
                                  : 'text-slate-500 hover:text-blue-600'
                            ]"
                            @click="mobileMenuOpen = false"
                          >
                            {{ sub2.title }}
                          </NuxtLink>

                          <!-- Level 3 item with submenu -->
                          <div v-else class="flex items-center justify-between w-full">
                            <NuxtLink :to="sub2.link" :target="isExternalLink(sub2.link) ? '_blank' : undefined"
                              :rel="isExternalLink(sub2.link) ? 'noopener noreferrer' : undefined"
                              class="block py-1.5 text-xs transition-colors duration-200 flex-1" :class="[
                                isDark
                                  ? activeLink === sub2.link
                                    ? 'text-blue-400'
                                    : 'text-slate-500 hover:text-blue-400'
                                  : activeLink === sub2.link
                                    ? 'text-blue-600'
                                    : 'text-slate-500 hover:text-blue-600'
                              ]"
                              @click="mobileMenuOpen = false"
                            >
                              {{ sub2.title }}
                            </NuxtLink>

                            <button @click="toggleMobileLevel3Submenu(index, subIndex, sub2Index)"
                              class="flex items-center justify-center w-5 h-5 ml-2 transition-colors duration-200 rounded-full"
                              :class="{
                                'bg-blue-50 text-blue-600': activeMobileLevel3Submenu[`${index}-${subIndex}-${sub2Index}`] && !isDark,
                                'bg-slate-800 text-blue-400': activeMobileLevel3Submenu[`${index}-${subIndex}-${sub2Index}`] && isDark,
                                'hover:bg-blue-50': !isDark,
                                'hover:bg-slate-800': isDark
                              }">
                              <UIcon
                                :name="activeMobileLevel3Submenu[`${index}-${subIndex}-${sub2Index}`] ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                                class="w-2.5 h-2.5 transition-transform duration-200" />
                            </button>
                          </div>
                        </div>

                        <!-- Level 4 submenu (deepest level) -->
                        <Transition name="expand">
                          <div
                            v-if="activeMobileLevel3Submenu[`${index}-${subIndex}-${sub2Index}`] && sub2.submenu && JSON.parse(sub2.submenu).length"
                            class="pl-4 mt-1 space-y-1 border-l-2"
                            :class="isDark ? 'border-slate-500' : 'border-blue-300'">
                            <NuxtLink v-for="sub3 in JSON.parse(sub2.submenu)" :key="sub3.id" :to="sub3.link"
                              :target="isExternalLink(sub3.link) ? '_blank' : undefined"
                              :rel="isExternalLink(sub3.link) ? 'noopener noreferrer' : undefined"
                              class="block py-1 text-xs transition-colors duration-200" :class="[
                                isDark
                                  ? activeLink === sub3.link
                                    ? 'text-blue-400'
                                    : 'text-slate-500 hover:text-blue-400'
                                  : activeLink === sub3.link
                                    ? 'text-blue-600'
                                    : 'text-slate-500 hover:text-blue-600'
                              ]"
                              @click="mobileMenuOpen = false"
                            >
                              {{ sub3.title }}
                            </NuxtLink>
                          </div>
                        </Transition>
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Mobile menu footer -->
        <div class="pt-6 mt-6 border-t" :class="isDark ? 'border-slate-800' : 'border-gray-100'">
          <!-- Shimmer for mobile footer when loading -->
          <div v-if="isLoading">
            <Vue3LoadingShimmer class="w-full h-10 mb-4 rounded" />
            <div class="flex items-center justify-between mt-4">
              <div class="flex items-center space-x-4">
                <Vue3LoadingShimmer v-for="i in 3" :key="`footer-icon-shimmer-${i}`" class="w-5 h-5 rounded" />
              </div>
            </div>
          </div>

          <!-- Actual mobile footer when loaded -->
          <template v-else>
            <UButton :color="isDark ? 'white' : 'blue'" :variant="isDark ? 'solid' : 'solid'" block
              :class="isDark ? 'bg-white text-slate-900 hover:bg-gray-200' : 'border-0 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'"
              icon="i-heroicons-envelope" :to="`mailto:${footerData?.email}`">
              Hubungi Kami
            </UButton>
            <UButton :color="isDark ? 'white' : 'blue'" :variant="isDark ? 'solid' : 'solid'" block
              :class="isDark ? 'bg-white text-slate-900 hover:bg-gray-200 mt-2 md:hidden' : 'border-0 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 mt-2 md:hidden'"
              @click="goToLogin" v-if="!isLoggedIn">
              Login
            </UButton>
          </template>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch, reactive, nextTick } from 'vue';
import { useMenuStore } from '@/store/menu/menu.js';
import { useLayout } from '~/store/layouts/layouts';
import { useFooterStore } from '@/store/footer/footer.js';
import LanguageSwitcher from '~/components/custom/selectSwicthBahasa/LanguageSwitcher.vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import Vue3LoadingShimmer from 'vue3-loading-shimmer';
import { LatinKeAksara } from '@sajenid/aksara.js';
import { useRuntimeConfig } from '#app';
import { useAuthKeycloakStore } from '~/store/auth/auth';

const keycloakStore = useAuthKeycloakStore()
const isLoggedIn = computed(() => keycloakStore.loggedIn)
const isOpen = ref(false);
const searchQuery = ref('');
const menuStore = useMenuStore();
const layoutStore = useLayout();
const activeSubmenu = ref(null);
const runtimeConfig = useRuntimeConfig();
const isAksaraJawaEnabled = computed(() => runtimeConfig.public.isAksaraJawa === "true");
const mobileMenuOpen = ref(false);
const activeMobileSubmenu = ref(null);
// Add reactive state for mobile submenu levels 2 and 3
const activeMobileLevel2Submenu = reactive({});
const activeMobileLevel3Submenu = reactive({});
const router = useRouter();
const route = useRoute();
// Track active menu by unique key (index or id) to avoid duplicate highlight for same URL
const activeMenuKey = ref(null);
const scrolled = ref(false);
const searchResults = ref([]);
const isSearching = ref(false);
const hasSearched = ref(false);
const searchTimeout = ref(null);
const searchSuggestions = ref([]);
const recentSearches = ref([]);
const isLoading = ref(true);
const footerStore = useFooterStore();
const footerData = computed(() => footerStore.footerData.data?.[0]);

// Tambah: State untuk activeLink
const activeLink = ref(route.fullPath);

// Tambah: Watch agar activeLink selalu sesuai route
watch(
  () => route.fullPath,
  (newPath) => {
    activeLink.value = newPath;
  },
  { immediate: true }
);

// New state for tracking expanded submenus in the "More" dropdown
const moreSubmenuActive = reactive({});

// New function to toggle submenus in the "More" dropdown
const toggleMoreSubmenu = (index) => {
  moreSubmenuActive[index] = !moreSubmenuActive[index];
};

// Replace hover state with click-based toggle state for all submenu levels
const moreSubmenuHovered = reactive({});

// Main menu submenu hover state
const mainSubmenuHovered = reactive({});

// Add state for tracking main menu positioning
const mainMenuPositions = reactive({});

// Reactive function to calculate and cache main menu positions
const getMainMenuPosition = (index, item) => {
  if (!process.client || !item.submenu) return {};

  // Create a cache key that includes the current submenu states
  const submenuStates = Object.keys(mainSubmenuHovered)
    .filter(key => key.startsWith(`${index}-`) && mainSubmenuHovered[key])
    .sort()
    .join(',');

  const cacheKey = `${index}-${submenuStates}`;

  // Return cached position if available and submenu states haven't changed
  if (mainMenuPositions[cacheKey]) {
    return mainMenuPositions[cacheKey];
  }

  // Calculate new position
  const position = calculateMainMenuPosition(index, item);

  // Cache the position
  mainMenuPositions[cacheKey] = position;

  // Clean up old cache entries for this menu
  Object.keys(mainMenuPositions).forEach(key => {
    if (key.startsWith(`${index}-`) && key !== cacheKey) {
      delete mainMenuPositions[key];
    }
  });

  return position;
};

// Add ref and state for "Menu Lainnya" dropdown positioning
const moreDropdownRef = ref(null);
const moreDropdownPosition = ref({});

// Reactive computed property for "Menu Lainnya" dropdown positioning
const moreDropdownStyle = computed(() => {
  if (!process.client) {
    return { left: '0', transform: '' };
  }

  // Create a cache key that includes the current submenu states
  const submenuStates = Object.keys(moreSubmenuHovered)
    .filter(key => moreSubmenuHovered[key])
    .sort()
    .join(',');

  const cacheKey = `more-${submenuStates}`;

  // Calculate position if not cached or submenu states changed
  if (!moreDropdownPosition.value[cacheKey]) {
    const position = calculateMoreDropdownPosition();
    moreDropdownPosition.value = { [cacheKey]: position };

    // Clean up old cache entries
    Object.keys(moreDropdownPosition.value).forEach(key => {
      if (key !== cacheKey) {
        delete moreDropdownPosition.value[key];
      }
    });
  }

  return moreDropdownPosition.value[cacheKey] || { left: '0', transform: '' };
});

// Add toggle functions for level 2 and level 3 submenus
const toggleLevel2Submenu = (index, subIndex) => {
  const key = `${index}-${subIndex}`;
  moreSubmenuHovered[key] = !moreSubmenuHovered[key];
};

const toggleLevel3Submenu = (index, subIndex, sub2Index) => {
  const key = `${index}-${subIndex}-${sub2Index}`;
  moreSubmenuHovered[key] = !moreSubmenuHovered[key];
};

// Function to reset all submenu states when "Menu Lainnya" closes
const resetMoreSubmenus = () => {
  // Add a small delay to allow users to move between submenu areas
  setTimeout(() => {
    // Reset all level 1 submenu states
    Object.keys(moreSubmenuActive).forEach(key => {
      moreSubmenuActive[key] = false;
    });

    // Reset all level 2 and level 3 submenu states
    Object.keys(moreSubmenuHovered).forEach(key => {
      moreSubmenuHovered[key] = false;
    });
  }, 100); // 100ms delay
};

// Function to handle main menu submenu hover states
const setMainSubmenuHover = (index, subId, sub2IdOrIsHovered = null, isHovered = null) => {
  let key;
  let actualIsHovered;

  // Handle different parameter combinations
  if (typeof sub2IdOrIsHovered === 'boolean') {
    // Called with 3 params: (index, subId, isHovered)
    key = `${index}-${subId}`;
    actualIsHovered = sub2IdOrIsHovered;
  } else {
    // Called with 4 params: (index, subId, sub2Id, isHovered)
    key = `${index}-${subId}-${sub2IdOrIsHovered}`;
    actualIsHovered = isHovered;
  }

  if (actualIsHovered) {
    mainSubmenuHovered[key] = true;
    // Clear any pending timeout for this key
    if (mainSubmenuTimeouts[key]) {
      clearTimeout(mainSubmenuTimeouts[key]);
      delete mainSubmenuTimeouts[key];
    }

    // When hovering over a level 3 item, also ensure parent level 2 stays open
    if (key.split('-').length === 3) {
      const parentKey = key.split('-').slice(0, 2).join('-');
      mainSubmenuHovered[parentKey] = true;
      if (mainSubmenuTimeouts[parentKey]) {
        clearTimeout(mainSubmenuTimeouts[parentKey]);
        delete mainSubmenuTimeouts[parentKey];
      }
    }
  } else {
    // Add a longer delay before hiding to allow mouse movement between elements
    mainSubmenuTimeouts[key] = setTimeout(() => {
      mainSubmenuHovered[key] = false;
      delete mainSubmenuTimeouts[key];

      // If this was a level 2 item, also check if any level 3 items are still hovered
      if (key.split('-').length === 2) {
        const hasActiveLevel3 = Object.keys(mainSubmenuHovered).some(k =>
          k.startsWith(key + '-') && mainSubmenuHovered[k]
        );

        // If no level 3 items are active, it's safe to close this level 2 item
        if (!hasActiveLevel3) {
          mainSubmenuHovered[key] = false;
        }
      }
    }, 500); // Increased delay to 500ms for better UX
  }
};

// Store timeouts for main menu submenus
const mainSubmenuTimeouts = {};

// Store timeouts for main menu hover state
const mainMenuTimeouts = {};

// Function to maintain main menu hover state
const maintainMainMenuHover = (index, isHovered) => {
  const key = `main-${index}`;

  if (isHovered) {
    // Clear any pending timeout for this menu
    if (mainMenuTimeouts[key]) {
      clearTimeout(mainMenuTimeouts[key]);
      delete mainMenuTimeouts[key];
    }
  } else {
    // Add a longer delay before allowing the menu to close
    mainMenuTimeouts[key] = setTimeout(() => {
      // Reset all submenu states for this main menu after delay
      Object.keys(mainSubmenuHovered).forEach(submenuKey => {
        if (submenuKey.startsWith(`${index}-`)) {
          mainSubmenuHovered[submenuKey] = false;
        }
      });
      delete mainMenuTimeouts[key];
    }, 600); // Increased delay to 600ms for better UX
  }
};

// Function to calculate main menu dropdown position
const calculateMainMenuPosition = (index, item) => {
  if (!item.submenu) return {};

  const submenuData = JSON.parse(item.submenu);
  let cardCount = 1; // Always start with 1 for the main card

  // Count additional cards based on active submenus
  submenuData.forEach(sub => {
    if (mainSubmenuHovered[`${index}-${sub.id}`] && sub.submenu) {
      cardCount++;
      const sub2Data = JSON.parse(sub.submenu);
      sub2Data.forEach(sub2 => {
        if (mainSubmenuHovered[`${index}-${sub.id}-${sub2.id}`] && sub2.submenu) {
          cardCount++;
        }
      });
    }
  });

  // Calculate required width (card width + gaps)
  const cardWidth = 224; // w-56 = 224px
  const gap = 16; // gap-4 = 16px
  const totalWidth = (cardWidth * cardCount) + (gap * (cardCount - 1));
  const padding = 8; // px-1 on each side
  const requiredWidth = totalWidth + (padding * 2);

  // Get viewport width
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const maxWidth = Math.min(viewportWidth * 0.9, 1280); // max-w-5xl equivalent

  // Calculate optimal left position
  let leftPosition = '0';
  let transform = '';

  if (requiredWidth > maxWidth) {
    // If content is wider than max width, use default positioning with scroll
    leftPosition = '0';
  } else if (requiredWidth > viewportWidth * 0.8) {
    // If content is close to viewport width, center it
    transform = 'translateX(-50%)';
    leftPosition = '50%';
  } else {
    // Check if dropdown would overflow on the right side
    const menuButton = document.querySelector(`[data-menu-index="${index}"]`);
    if (menuButton) {
      const buttonRect = menuButton.getBoundingClientRect();
      const spaceOnRight = viewportWidth - buttonRect.left;

      if (spaceOnRight < requiredWidth) {
        // Not enough space on the right, shift left
        const shiftLeft = requiredWidth - spaceOnRight + 20; // 20px buffer
        transform = `translateX(-${shiftLeft}px)`;
      }
    }
  }

  return {
    left: leftPosition,
    transform: transform,
    maxWidth: `${Math.min(maxWidth, requiredWidth)}px`
  };
};

// Function to calculate "Menu Lainnya" dropdown position
const calculateMoreDropdownPosition = () => {
  if (!hiddenMenuItems.value || hiddenMenuItems.value.length === 0) {
    return { left: '0', transform: '' };
  }

  let cardCount = 1; // Always start with 1 for the main menu card

  // Count additional cards based on active submenus
  hiddenMenuItems.value.forEach((item, index) => {
    if (item.submenu) {
      const submenuData = JSON.parse(item.submenu);
      submenuData.forEach((sub, subIndex) => {
        if (moreSubmenuHovered[`${index}-${subIndex}`] && sub.submenu) {
          cardCount++;
          const sub2Data = JSON.parse(sub.submenu);
          sub2Data.forEach((sub2, sub2Index) => {
            if (moreSubmenuHovered[`${index}-${subIndex}-${sub2Index}`] && sub2.submenu) {
              cardCount++;
            }
          });
        }
      });
    }
  });

  // Calculate required width (card width + gaps)
  const cardWidth = 256; // w-64 = 256px (slightly wider than main menu cards)
  const gap = 16; // gap-4 = 16px
  const totalWidth = (cardWidth * cardCount) + (gap * (cardCount - 1));
  const requiredWidth = totalWidth;

  // Get viewport width
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const maxWidth = Math.min(viewportWidth * 0.9, 1280); // max-w-5xl equivalent

  // Calculate optimal positioning similar to main menu
  let leftPosition = '0';
  let transform = '';

  if (requiredWidth > maxWidth) {
    // If content is wider than max width, use default positioning with scroll
    leftPosition = '0';
  } else if (requiredWidth > viewportWidth * 0.8) {
    // If content is close to viewport width, center it
    transform = 'translateX(-50%)';
    leftPosition = '50%';
  } else {
    // Check if dropdown would overflow on the right side - similar to main menu logic
    const moreButton = document.querySelector('[data-more-menu]');
    if (moreButton) {
      const buttonRect = moreButton.getBoundingClientRect();
      const spaceOnRight = viewportWidth - buttonRect.left;

      if (spaceOnRight < requiredWidth) {
        // Not enough space on the right, shift left
        const shiftLeft = requiredWidth - spaceOnRight + 20; // 20px buffer
        transform = `translateX(-${shiftLeft}px)`;
      }
      // If there's enough space, align with button (left edge)
      // No transform needed as left: '0' will align with button's left edge
    }
  }

  return {
    left: leftPosition,
    transform: transform,
    maxWidth: `${Math.min(maxWidth, requiredWidth)}px`
  };
};

// New computed properties for menu handling
const MAX_VISIBLE_MENU_ITEMS = 4; // Changed from 5 to 4

const visibleMenuItems = computed(() => {
  if (!menuStore.menuData || !menuStore.menuData.data) return [];
  return menuStore.menuData.data.slice(0, MAX_VISIBLE_MENU_ITEMS);
});

const hiddenMenuItems = computed(() => {
  if (!menuStore.menuData || !menuStore.menuData.data) return [];
  return menuStore.menuData.data.slice(MAX_VISIBLE_MENU_ITEMS);
});

const hasMoreMenuItems = computed(() => {
  if (!menuStore.menuData || !menuStore.menuData.data) return false;
  return menuStore.menuData.data.length > MAX_VISIBLE_MENU_ITEMS;
});

const isExternalLink = (link) => {
  if (!link) return false;
  return link.startsWith('http://') || link.startsWith('https://');
};

// Computed property to check if dark mode is active
const isDark = computed(() => {
  return layoutStore.theme === 'dark';
});

// Toggle dark mode function
const toggleDarkMode = () => {
  layoutStore.themeSwitch();
};

const convertToJavanese = (text) => {
  try {
    return LatinKeAksara(text);
  } catch (error) {
    console.error('Error converting to Javanese script:', error);
    return text; // Fallback to original text if conversion fails
  }
};

// Load recent searches from localStorage
onMounted(() => {
  try {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      recentSearches.value = JSON.parse(savedSearches);
    }
  } catch (error) {
    console.error('Error loading recent searches:', error);
  }
});

// Save recent searches to localStorage
const saveRecentSearch = (query) => {
  if (!query.trim()) return;

  // Add to the beginning and remove duplicates
  recentSearches.value = [
    query,
    ...recentSearches.value.filter(item => item !== query)
  ].slice(0, 5); // Keep only the 5 most recent

  try {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value));
  } catch (error) {
    console.error('Error saving recent searches:', error);
  }
};

// Check if content has embedded Google Drive files
const isEmbeddedContent = (content) => {
  if (!content) return false;
  // Check if content contains Google Drive embed patterns
  return content.includes('drive.google.com/file') ||
    content.includes('docs.google.com/viewer') ||
    content.includes('<iframe') && content.includes('drive.google.com');
};

// Format date for search results
const formatDate = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

// Debounced search function
const debouncedSearch = (query) => {
  // Clear any existing timeout
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }

  // Set a new timeout
  searchTimeout.value = setTimeout(async () => {
    if (query.trim()) {
      isSearching.value = true;
      try {
        await menuStore.getSearchMenuData(query);
        searchResults.value = menuStore.dataSearchMenu || [];
        hasSearched.value = true;
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        isSearching.value = false;
      }
    } else {
      searchResults.value = [];
    }
  }, 500); // 500ms debounce time
};

// Watch for changes in search query
watch(searchQuery, (newQuery) => {
  // Update search suggestions
  if (newQuery.trim()) {
    searchSuggestions.value = recentSearches.value.filter(item =>
      item.toLowerCase().includes(newQuery.toLowerCase())
    );

    // Trigger search automatically as user types
    debouncedSearch(newQuery);
  } else {
    searchSuggestions.value = [];
    searchResults.value = [];
    hasSearched.value = false;
  }
});

// Watch for changes in main submenu hover states to trigger position recalculation
watch(
  () => ({ ...mainSubmenuHovered }),
  () => {
    // Force reactivity update for positioning
    if (process.client) {
      nextTick(() => {
        // Trigger position recalculation on next tick
      });
    }
  },
  { deep: true }
);

// Watch for changes in "Menu Lainnya" submenu hover states to trigger position recalculation
watch(
  () => ({ ...moreSubmenuHovered }),
  () => {
    // Force reactivity update for positioning
    if (process.client) {
      nextTick(() => {
        // Clear cached position to force recalculation
        moreDropdownPosition.value = {};
      });
    }
  },
  { deep: true }
);

// Perform search
const performSearch = () => {
  if (!searchQuery.value.trim()) return;

  debouncedSearch(searchQuery.value);
  saveRecentSearch(searchQuery.value);
  searchSuggestions.value = [];
};

// Select a suggestion
const selectSuggestion = (suggestion) => {
  searchQuery.value = suggestion;
  performSearch();
};

// Clear search
const clearSearch = () => {
  searchQuery.value = '';
  searchResults.value = [];
  hasSearched.value = false;
  searchSuggestions.value = [];
};

// Navigate to search result
const navigateToResult = (result) => {
  console.log('Navigating to result:', result);
  let targetLink = result.link; // Use existing link if available

  // If link is missing, try to construct it based on kategori and slug
  if (!targetLink && result.slug) {
    const category = result.kategori ? result.kategori.toLowerCase() : '';
    console.log(`Constructing link for category: ${category}, slug: ${result.slug}`);

    // Map categories to base paths (adjust based on actual routes)
    const categoryPaths = {
      'berita': '/berita/detail',
      'artikel': '/artikel/detail',
      'video': '/video',
      'foto': '/foto/detail',
      'layanan': '/layanan',
      'page': '/page'
    };

    // Fallback if category is not in our mapping
    const basePath = categoryPaths[category] || '/detail';
    targetLink = `${basePath}/${result.slug}`;
    console.log(`Constructed link: ${targetLink}`);
  }

  // Attempt navigation if we have a valid link
  if (targetLink) {
    console.log('Pushing to:', targetLink);
    try {
      router.push(targetLink);
      isOpen.value = false; // Close modal after successful navigation
    } catch (error) {
      console.error('Navigation failed:', error);
    }
  } else {
    console.warn('Navigation skipped: Could not determine a valid link for:', result);
    // Optionally provide user feedback here that the link couldn't be determined
  }
};

const openSearchModal = () => {
  isOpen.value = true;
  searchSuggestions.value = recentSearches.value.slice(0, 5);

  setTimeout(() => {
    const searchInput = document.querySelector('.search-modal input');
    if (searchInput) {
      searchInput.focus();
    }
  }, 100);
};

const closeSearchModal = () => {
  isOpen.value = false;

  setTimeout(() => {
    if (!isOpen.value) {
      searchQuery.value = '';
      searchResults.value = [];
      hasSearched.value = false;
      searchSuggestions.value = [];
    }
  }, 300);
};

const config = useRuntimeConfig();
const apiBaseUrl = ref(`${config.public.apiBaseUrl}/api/assets/asset-img-opd-frontend/assets`);
const logoBlack = ref(`${apiBaseUrl.value}/logo-black.png`);
const logoWhite = ref(`${apiBaseUrl.value}/logo-white.png`);

// Handle scroll events
const handleScroll = () => {
  scrolled.value = window.scrollY > 20;
};

const goToLogin = () => {
  router.push("/login");
};

// Mobile menu submenu toggle
const toggleMobileSubmenu = (index) => {
  if (activeMobileSubmenu.value === index) {
    activeMobileSubmenu.value = null;
  } else {
    activeMobileSubmenu.value = index;
  }
};

// Toggle functions for mobile level 2 and level 3 submenus
const toggleMobileLevel2Submenu = (parentIndex, subIndex) => {
  const key = `${parentIndex}-${subIndex}`;
  if (activeMobileLevel2Submenu[key]) {
    activeMobileLevel2Submenu[key] = false;
  } else {
    activeMobileLevel2Submenu[key] = true;
  }
};

const toggleMobileLevel3Submenu = (parentIndex, subIndex, sub2Index) => {
  const key = `${parentIndex}-${subIndex}-${sub2Index}`;
  if (activeMobileLevel3Submenu[key]) {
    activeMobileLevel3Submenu[key] = false;
  } else {
    activeMobileLevel3Submenu[key] = true;
  }
};

// Set active link for highlighting
// Set active menu by unique key (index or id)
const setActiveMenu = (key) => {
  activeMenuKey.value = key;
};

// Helper to generate unique key for menu item (prefer id, fallback to index)
const getMenuKey = (item, index) => item.id || index;

onMounted(async () => {
  try {
    // Show shimmer loading while data is being fetched
    isLoading.value = true;

    await footerStore.getFooterData();
    await menuStore.getMenuData();
    activeLink.value = route.path;
    // Initialize all items in moreSubmenuActive for reactivity
    if (menuStore.menuData && menuStore.menuData.data) {
      menuStore.menuData.data.forEach((item, idx) => {
        moreSubmenuActive[idx] = false;

        // Initialize submenu hover state for all levels
        if (item.submenu) {
          const submenus = JSON.parse(item.submenu);
          submenus.forEach((sub, subIdx) => {
            moreSubmenuHovered[`${idx}-${subIdx}`] = false;
            // Initialize mobile level 2 submenu state
            activeMobileLevel2Submenu[`${idx}-${subIdx}`] = false;

            if (sub.submenu) {
              const level2Submenus = JSON.parse(sub.submenu);
              level2Submenus.forEach((sub2, sub2Idx) => {
                moreSubmenuHovered[`${idx}-${subIdx}-${sub2Idx}`] = false;
                // Initialize mobile level 3 submenu state
                activeMobileLevel3Submenu[`${idx}-${subIdx}-${sub2Idx}`] = false;
              });
            }
          });
        }
      });
    }

    // Simulate a minimum loading time for better UX (optional)
    setTimeout(() => {
      isLoading.value = false;
    }, 1000); // Minimum 1 second of shimmer loading for better UX
  } catch (error) {
    console.error('Error loading menu data:', error);
    isLoading.value = false;
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll();
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);

  // Clear any pending search timeout
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }

  // Clear any pending main submenu timeouts
  Object.values(mainSubmenuTimeouts).forEach(timeout => {
    clearTimeout(timeout);
  });

  // Clear any pending main menu timeouts
  Object.values(mainMenuTimeouts).forEach(timeout => {
    clearTimeout(timeout);
  });
});

// Computed property for searching in menu data
const filteredMenus = computed(() => {
  if (!searchQuery.value || !menuStore.menuData || !menuStore.menuData.data) return [];

  const results = [];
  const query = searchQuery.value.toLowerCase();

  menuStore.menuData.data.forEach(item => {
    if (item.submenu) {
      const submenus = typeof item.submenu === 'string' ? JSON.parse(item.submenu) : item.submenu;
      if (Array.isArray(submenus)) {
        const matchingSubmenus = submenus.filter(sub =>
          sub.title &&
          typeof sub.title === 'string' &&
          sub.title.toLowerCase().includes(query)
        );

        // Add each matching submenu as a separate result
        matchingSubmenus.forEach(sub => {
          results.push({
            ...sub,
            isSubmenu: true
          });
        });
      }
    }
  });

  return results;
});

</script>

<style scoped>
/* Slide-in animation for mobile menu */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease-out;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Expand animation for mobile submenu and More dropdown submenu */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease-out;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 500px;
  opacity: 1;
}

/* Search results animation */
.search-results-enter-active,
.search-results-leave-active {
  transition: all 0.3s ease;
}

.search-results-enter-from,
.search-results-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.search-results-move {
  transition: transform 0.3s ease;
}

/* Smooth hover transitions */
a,
button,
div {
  transition: all 0.2s ease;
}

/* Ensure text is readable on transparent background */
.bg-transparent .text-white {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* Gradient animation for buttons */
.bg-gradient-to-r {
  background-size: 200% auto;
  transition: background-position 0.5s ease;
}

.bg-gradient-to-r:hover {
  background-position: right center;
}

/* Dark mode specific styles */
:root.dark header .text-slate-700 {
  color: rgb(203, 213, 225);
}

:root.dark header .hover\:bg-blue-50:hover {
  background-color: rgb(30, 41, 59);
}

:root.dark header .hover\:text-blue-600:hover {
  color: rgb(96, 165, 250);
}

/* Add custom scrollbar styling for the More dropdown and main menu */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 20px;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(71, 85, 105, 0.5);
}

.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 20px;
}

.dark .overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: rgba(71, 85, 105, 0.5);
}

/* Aksara Jawa font styling */
.aksara-jawa {
  font-family: "nyk Ngayogyan New";
  font-size: 1.1rem !important;
  /* Increased from default */
  line-height: 2 !important;
}
</style>
