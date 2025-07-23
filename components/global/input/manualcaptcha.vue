<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-row items-center justify-between gap-2">
      <span
        class="flex h-12 w-2/3 select-none items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-xl font-semibold tracking-[.25em] text-gray-900 dark:text-white"
        :class="[text_decoration, font_style, decoration_style]"
      >
        {{ captcha_img }}
      </span>

      <Icon
        name="material-symbols:refresh-rounded"
        size="20px"
        class="flex h-12 w-1/3 cursor-pointer items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-gray-900 dark:text-white"
        @click="generateCaptcha()"
      />
    </div>

    <GlobalInputText
      name="captcha"
      placeholder="Enter captcha"
      @input="printmsg"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";

// Variabel
const emit = defineEmits();
const text_decoration = ref();
const font_style = ref();
const decoration_style = ref();
const captcha_img = ref("");

// Function
const validationSchema = yup.object({
  captcha: yup.string().required().label("Captcha"),
});
const { handleSubmit, resetForm, setValues, values } = useForm({
  initialValues: {
    captcha: "",
  },
  validationSchema: validationSchema,
});
const generateCaptcha = () => {
  captcha_img.value = "";
  const randomchar =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#&";
  const decoration = ["underline", "line-through"];
  const style = ["italic", "not-italic"];
  const decoration_type = [
    "decoration-solid",
    "decoration-double",
    "decoration-dotted",
    "decoration-dashed",
    "decoration-wavy",
  ];
  for (let i = 1; i < 5; i++) {
    captcha_img.value += randomchar.charAt(Math.random() * randomchar.length);
  }
  // Random style
  const random_decoration = Math.floor(Math.random() * decoration.length);
  const random_style = Math.floor(Math.random() * style.length);
  const random_decoration_type = Math.floor(
    Math.random() * decoration_type.length,
  );
  // Add classes
  text_decoration.value = decoration[random_decoration];
  font_style.value = style[random_style];
  decoration_style.value = decoration_type[random_decoration_type];
};
const printmsg = () => {
  if (values.captcha == captcha_img.value) {
    emit("isMatch", true);
  } else {
    emit("isMatch", false);
  }
};

onMounted(() => {
  generateCaptcha();
});
</script>

<style lang="scss" scoped></style>
