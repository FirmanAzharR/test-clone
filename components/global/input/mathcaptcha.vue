<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-row items-center justify-between gap-2">
      <div
        id="image"
        class="flex h-12 w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-xl font-semibold tracking-[.25em] shadow"
        :class="[decoration_style]"
        selectable="False"
      ></div>

      <Icon
        @click="generateCaptcha()"
        name="material-symbols:refresh-rounded"
        color="#000"
        size="20px"
        class="flex h-12 w-1/3 cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 shadow"
      />
    </div>

    <input
      type="text"
      id="submit"
      placeholder="Captcha code"
      class="h-12 rounded-lg border border-gray-300 bg-white p-2 shadow"
      @keypress="onlynumber"
    />
    <p id="key" class="text-red-600"></p>

    <button
      @click="printmsg()"
      class="border-primary justshowv-showy-center items-center gap-2 self-stretch rounded-lg border bg-primary-600 px-5 py-3 font-sans text-base font-semibold leading-normal text-white shadow"
    >
      Sign In
    </button>
  </div>
</template>

<script setup>
let captcha;
var decoration_style = ref();
let number = 0;
var state_a = ref();
defineExpose({
  state_a,
});
const onlynumber = (e) => {
  var keyCode = e.which;
  var value = e.target.value;
  if (keyCode < 48 || keyCode > 58) {
    e.preventDefault();
  }
};
const generateCaptcha = () => {
  // Clear old input
  document.getElementById("submit").value = "";

  // Access the element to store
  // the generated captcha
  captcha = document.getElementById("image");
  const randomnumber = "0123456789";
  const decoration_type = ["decoration-solid"];

  // Generate captcha for length of
  // 2 random number + 2 random number = result
  // const rand_numb = () => {
  //   number = ""
  //   for (let i = 0; i < 5; i++) {
  //     number += randomnumber.charAt(Math.random() * randomnumber.length);
  //   }
  //   return parseInt(number)
  // };

  number = Math.floor(10000 + Math.random() * 90000);

  // Random style
  const random_decoration_type = Math.floor(
    Math.random() * decoration_type.length,
  );

  // Store generated input
  captcha.innerHTML = `${number}`;

  // Add classes
  decoration_style = decoration_type[random_decoration_type];
};

const printmsg = () => {
  const usr_input = document.getElementById("submit").value;

  // Check whether the input is equal
  // to generated captcha or not
  if (usr_input == number) {
    let s = (document.getElementById("key").innerHTML = "");
    state_a.value = "matched";
    console.log("menampilkan value di child", state_a.value);
    generateCaptcha();
  } else {
    state_a.value = "not matched";
    document.getElementById("submit").style.border = "1px solid red";
    let s = (document.getElementById("key").innerHTML = "Captcha Not Matched");
    generateCaptcha();
  }
};

onMounted(() => {
  generateCaptcha();
});
</script>

<style lang="scss" scoped></style>
