<script setup>
import { computed, toRef, useSlots } from "vue";
import { useField } from "vee-validate";


const props = defineProps({
  value: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  primary: {
    type: Boolean,
    default: false,
  },
  tooltipTitle: {
    type: String,
    default: "",
  },
  tooltipDescription: {
    type: String,
    default: "",
  },
});
const emit = defineEmits();
const name = toRef(props, "name");
const root = ref(null);
const {
  value: inputValue,
  errorMessage,
  handleBlur,
  handleChange,
  meta,
} = useField(name);

const modelValue = computed({
  get() {
    return inputValue.value;
  },
  set(value) {
    handleChange(value);
    emit("update:value", {
      value: props.value,
      // checked: value?.includes(props.value),
    });
  },
});

const clickFunction = () => {
  modelValue.value = !modelValue.value;
};

watch(errorMessage, (newVal) => {
  if (newVal) {
    nextTick(() => {
      root.value.scrollIntoView({ behavior: "smooth" });
    });
  }
});
</script>

<template>
  <div class="inline-flex w-fit" :class="{ success: meta.valid }" ref="root">
    <label
      v-if="label"
      :for="name"
      class="form-label mb-2 inline-flex items-center"
      :class="{
        'font-bold text-red-500': !!errorMessage,
      }"
    >
      <span v-if="primary">
        <span class="font-bold text-red-500">*</span>
      </span>
      {{ label }}
      <GlobalTooltip
        v-if="tooltipTitle || tooltipDescription"
        :title="tooltipTitle"
        :description="tooltipDescription"
      />
    </label>
    <div class="item relative inline-flex justify-center">
      <div @click="!disabled && clickFunction()" class="checkbox-wrapper-51">
        <input
          :id="name"
          :name="name"
          type="checkbox"
          :value="value || true"
          v-model="modelValue"
          :disabled="disabled"
          :readonly="readonly"
        />
        <span for="cbx-51" class="toggle">
          <span> </span>
        </span>
      </div>
    </div>
    <div
      v-if="!!errorMessage"
      class="mt-1 text-xs text-red-500 dark:text-red-500"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

<style>
.checkbox-wrapper-51 input[type="checkbox"] {
  visibility: hidden;
  display: none;
}

.checkbox-wrapper-51 .toggle {
  position: relative;
  display: block;
  width: 42px;
  height: 24px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transform: translate3d(0, 0, 0);
}
.checkbox-wrapper-51 .toggle:before {
  content: "";
  position: relative;
  top: 1px;
  left: 1px;
  width: 40px;
  height: 22px;
  display: block;
  background: #c8ccd4;
  border-radius: 12px;
  transition: background 0.2s ease;
}
.checkbox-wrapper-51 .toggle span {
  position: absolute;
  top: 0;
  left: 0;
  width: 24px;
  height: 24px;
  display: block;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(154, 153, 153, 0.75);
  transition: all 0.2s ease;
}
.checkbox-wrapper-51 .toggle span svg {
  margin: 7px;
  fill: none;
}
.checkbox-wrapper-51 .toggle span svg path {
  stroke: #c8ccd4;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 24;
  stroke-dashoffset: 0;
  transition: all 0.5s linear;
}
.checkbox-wrapper-51 input[type="checkbox"]:checked + .toggle:before {
  background: #e42313;
}
.checkbox-wrapper-51 input[type="checkbox"]:checked + .toggle span {
  transform: translateX(18px);
}
.checkbox-wrapper-51 input[type="checkbox"]:checked + .toggle span path {
  stroke: #e42313;
  stroke-dasharray: 25;
  stroke-dashoffset: 25;
}
.checkbox-wrapper-51 input[type="checkbox"]:disabled + .toggle span {
  background: #e6e6e6;
  box-shadow: none;
}
.checkbox-wrapper-51 input[type="checkbox"]:disabled + .toggle:before {
  background: gray;
}
</style>
