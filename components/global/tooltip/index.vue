<script setup>
const props = defineProps({
  class: {
    type: String,
    default: "btn",
  },
  title: {
    type: String,
    default: "tooltip",
  },
  description: {
    type: String,
    default: "tooltip description",
  },
});
</script>

<template>
  <a
    tabindex="0"
    role="link"
    aria-label="tooltip 1"
    class="group/item relative mt-20 rounded-full focus:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 md:mt-0"
  >
    <div v-if="!$slots.default" class="cursor-pointer px-1 py-0.5">
      <Icon name="ic:baseline-help-outline" class="h-5 w-5 text-gray-600" />
    </div>
    <slot v-else />
    <div
      id="tooltip1"
      role="tooltip"
      class="absolute left-0 z-20 -mt-16 ml-8 hidden w-64 rounded bg-white p-4 opacity-0 shadow-lg transition duration-150 ease-in-out group-hover/item:block group-hover/item:opacity-100"
    >
      <svg
        class="absolute bottom-0 left-0 top-0 -ml-2 h-full"
        width="9px"
        height="16px"
        viewBox="0 0 9 16"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <g
          id="Page-1"
          stroke="none"
          stroke-width="1"
          fill="none"
          fill-rule="evenodd"
        >
          <g
            id="Tooltips-"
            transform="translate(-874.000000, -1029.000000)"
            fill="#FFFFFF"
          >
            <g
              id="Group-3-Copy-16"
              transform="translate(850.000000, 975.000000)"
            >
              <g id="Group-2" transform="translate(24.000000, 0.000000)">
                <polygon
                  id="Triangle"
                  transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) "
                  points="4.5 57.5 12.5 66.5 -3.5 66.5"
                ></polygon>
              </g>
            </g>
          </g>
        </g>
      </svg>
      <p class="pb-1 text-sm font-bold text-gray-800">
        {{ title }}
      </p>
      <p class="pb-3 text-xs leading-4 text-gray-600">
        {{ description }}
      </p>
    </div>
  </a>
  <!--Code Block for white tooltip ends-->
</template>
