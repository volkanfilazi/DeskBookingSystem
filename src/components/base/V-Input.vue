
<script setup lang="ts">
import { computed } from "@vue/runtime-core"

export interface Props {
  modelValue: string | number,
  typeValue: "string" | "number" | "password",
  placeValue: string
}

export interface Emits {
  (e: 'update:modelValue', value: string | number): void
}

const probs = defineProps<Props>()

const emit = defineEmits<Emits>()

const value = computed({
  get() {
    return probs.modelValue
  },
  set(value: string | number) {
    emit("update:modelValue", value)
  }
})

const inputValue = computed({
  get() {
    return value.value
  },
  set(value) {
    if (probs.typeValue === "number") {
      value = Number(value)
    }
    emit("update:modelValue", value)
  }
})


</script>
<template>
  <input v-model="inputValue"
    class="border-[1px] text-white mb-5 focus:border-yellow-300 outline-none border-white bg-transparent p-2 rounded-lg border-"
    :type="typeValue" :placeholder="placeValue">
</template>



