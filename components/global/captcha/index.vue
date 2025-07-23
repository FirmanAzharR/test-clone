<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Captcha Verification</label>

      <div class="flex flex-row items-center justify-between gap-2">
        <div
          class="flex h-14 w-2/3 select-none items-center justify-center rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 px-4 py-2 text-xl font-semibold tracking-[.25em] text-gray-900 dark:text-white relative overflow-hidden"
          :class="[text_decoration, font_style, decoration_style]">
          <!-- Background noise pattern for security -->
          <div class="absolute inset-0 opacity-10 bg-noise"></div>

          <!-- Random dots for additional security -->
          <div v-for="(dot, index) in dots" :key="index"
            class="absolute w-1 h-1 bg-gray-500 rounded-full dark:bg-gray-400"
            :style="{ top: `${dot.y}%`, left: `${dot.x}%` }">
          </div>

          <!-- Random lines for additional security -->
          <div v-for="(line, index) in lines" :key="`line-${index}`" class="absolute bg-gray-500 dark:bg-gray-400"
            :style="{
              top: `${line.y}%`,
              left: `${line.x}%`,
              width: `${line.width}%`,
              height: '1px',
              transform: `rotate(${line.angle}deg)`
            }">
          </div>

          <span class="relative z-10">{{ captcha_img }}</span>
        </div>

        <button
          class="flex items-center justify-center w-1/3 px-4 py-2 text-gray-700 transition-colors duration-200 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer h-14 hover:bg-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
          @click="handleRefresh">
          <Icon name="material-symbols:refresh-rounded" class="w-5 h-5"/>
          Refresh
        </button>
      </div>
    </div>

    <div class="relative">
      <input type="text" name="captcha" placeholder="Enter captcha code" v-model="captchaInput" @input="validateCaptcha"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        :class="{
          'border-green-500 focus:ring-green-500 focus:border-green-500': isMatched === true,
          'border-red-500 focus:ring-red-500 focus:border-red-500': isMatched === false && captchaInput.length > 0
        }" />

      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none" v-if="captchaInput.length > 0">
        <svg v-if="isMatched" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-green-500" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>
    </div>

    <p v-if="isMatched === false && captchaInput.length > 0" class="mt-1 text-sm text-red-500">
      Captcha doesn't match. Please try again.
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

// Props and emits
const emit = defineEmits(['isMatch']);

// State variables
const text_decoration = ref('');
const font_style = ref('');
const decoration_style = ref('');
const captcha_img = ref('');
const captchaInput = ref('');
const isMatched = ref(null);
const dots = ref([]);
const lines = ref([]);

// Generate random dots for captcha background
const generateDots = () => {
  dots.value = [];
  for (let i = 0; i < 30; i++) {
    dots.value.push({
      x: Math.random() * 100,
      y: Math.random() * 100
    });
  }
};

// Generate random lines for captcha background
const generateLines = () => {
  lines.value = [];
  for (let i = 0; i < 4; i++) {
    lines.value.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      width: 20 + Math.random() * 60,
      angle: Math.random() * 180
    });
  }
};

const handleRefresh = (event) => {
  event.preventDefault();
  generateCaptcha()
}

// Generate captcha text and styling
const generateCaptcha = () => {
  captcha_img.value = '';
  captchaInput.value = '';
  isMatched.value = null;

  // Generate random characters (excluding confusing characters like 0, O, 1, I, l)
  const randomchar = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#&';

  // Generate 5 characters for better security
  for (let i = 0; i < 5; i++) {
    captcha_img.value += randomchar.charAt(Math.floor(Math.random() * randomchar.length));
  }

  // Random style options
  const decoration = ['underline', 'line-through', ''];
  const style = ['italic', 'not-italic'];
  const decoration_type = [
    'decoration-solid',
    'decoration-double',
    'decoration-dotted',
    'decoration-dashed',
    'decoration-wavy',
  ];

  // Apply random styles
  const random_decoration = Math.floor(Math.random() * decoration.length);
  const random_style = Math.floor(Math.random() * style.length);
  const random_decoration_type = Math.floor(Math.random() * decoration_type.length);

  // Set classes
  text_decoration.value = decoration[random_decoration];
  font_style.value = style[random_style];
  decoration_style.value = decoration_type[random_decoration_type];

  // Generate visual noise
  generateDots();
  generateLines();
};

// Validate captcha input
const validateCaptcha = () => {
  if (captchaInput.value.length > 0) {
    isMatched.value = captchaInput.value === captcha_img.value;
    emit('isMatch', isMatched.value);
  } else {
    isMatched.value = null;
    emit('isMatch', false);
  }
};

// Initialize captcha on component mount
onMounted(() => {
  generateCaptcha();
});
</script>

<style scoped>
.bg-noise {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

input {
  transition: all 0.2s ease-in-out;
}

input:focus {
  outline: none;
}
</style>