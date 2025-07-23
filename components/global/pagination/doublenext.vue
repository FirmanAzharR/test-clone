<script setup>
import { computed } from "vue";

const emit = defineEmits();

const props = defineProps({
  pages: {
    default: 0,
  },
  current_page: {
    default: 0,
  },
  page_size: {
    default: 0,
  },
  list_page_size: {
    default: () => [10, 15, 20, 25],
  },
});

const pages = computed({
  get() {
    return props.pages;
  },
  set(value) {
    emit("pages", value);
  },
});

const page_size = computed({
  get() {
    return props.page_size;
  },
  set(value) {
    emit("page_size", value);
  },
});

const current_page = computed({
  get() {
    return props.current_page;
  },
  set(value) {
    setTimeout(() => {
      emit("current_page", value);
    }, 500);
  },
});

const listOpen = ref(false);

const previousPage = () => {
  if (current_page.value > 1) {
    current_page.value -= 1;
  }
};

const previousFourPage = () => {
  if (current_page.value > 4) {
    current_page.value -= 4;
  }
};

const nextPage = () => {
  if (current_page.value < pages.value) {
    current_page.value += 1;
  }
};

const nextFourPage = () => {
  if (current_page.value < pages.value - 4) {
    current_page.value += 4;
  }
};

const changeByNumber = (page) => {
  current_page.value = page;
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
};

const changeItemPerPage = (number) => {
  page_size.value = number;
  current_page.value = 1;
  listOpen.value = false;
};
</script>

<template>
  <div
    class="mt-8 flex w-full flex-col-reverse items-center justify-between gap-2 sm:flex-row"
  >
    <div
      @click="listOpen = !listOpen"
      class="relative flex cursor-pointer flex-row items-center justify-between gap-2 self-start rounded-lg border border-gray-300 bg-white px-2.5 py-2 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
    >
      <span class="text-sm md:text-base">{{ page_size }}</span>
      <Icon
        name="ion:chevron-down"
        class="h-4 w-4 text-black dark:text-white md:h-5 md:w-5"
      />
      <div
        v-if="listOpen"
        @click="listOpen = !listOpen"
        class="absolute left-0 top-full mt-1 flex w-full cursor-pointer flex-col items-center gap-2 rounded-lg border border-gray-300 dark:border-slate-950 bg-white p-2 dark:bg-slate-900 dark:text-slate-200 shadow-sm"
      >
        <span
          v-for="item in list_page_size"
          @click="changeItemPerPage(item)"
          class="w-full text-center text-sm md:text-base"
          >{{ item }}</span
        >
      </div>
    </div>

    <div class="flex flex-row items-center gap-1 sm:gap-2 md:gap-4">
      <Icon
        @click="previousFourPage()"
        name="mdi:chevron-double-left"
        :color="current_page <= 4 ? '#D0D5DD' : '#667085'"
        size="25px"
        :class="current_page <= 4 ? '' : 'cursor-pointer'"
      />
      <Icon
        @click="previousPage()"
        name="material-symbols:chevron-left-rounded"
        :color="current_page == 1 ? '#D0D5DD' : '#667085'"
        size="25px"
        :class="current_page == 1 ? '' : 'cursor-pointer'"
      />
      <div class="flex flex-row items-center gap-2">
        <template v-for="(page, index) in pages" :key="index">
          <div
            v-if="
              page == 1 ||
              page == pages ||
              (page >= current_page - 1 && page <= current_page + 1)
            "
            @click="changeByNumber(page)"
            class="cursor-pointer rounded-lg px-3 py-1 text-sm font-medium text-gray-600 md:px-4 md:py-2 md:text-base"
            :class="current_page == page ? 'bg-primary-600 text-white' : ''"
          >
            <span v-if="page != current_page">{{ page }}</span>
            <span v-else>{{ page }}</span>
          </div>

          <span
            v-else-if="page >= current_page - 2 && page <= current_page + 2"
          >
            ...
          </span>
        </template>
      </div>
      <Icon
        @click="nextPage()"
        name="material-symbols:chevron-right-rounded"
        :color="current_page == pages ? '#D0D5DD' : '#667085'"
        size="25px"
        :class="current_page == pages ? '' : 'cursor-pointer'"
      />
      <Icon
        @click="nextFourPage()"
        name="mdi:chevron-double-right"
        :color="current_page >= pages - 4 ? '#D0D5DD' : '#667085'"
        size="25px"
        :class="current_page >= pages - 4 ? '' : 'cursor-pointer'"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-item {
  cursor: pointer;
  a.page-link {
    @apply font-bold text-blue-600;
  }
  &.active {
    a.page-link {
      @apply cursor-default bg-blue-600 text-white;
    }
  }
}
</style>
