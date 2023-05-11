<script setup lang="ts">
import { promiseTimeout } from '@vueuse/shared';
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

const isLoading = ref(false)
const clicked = async () => {
  isLoading.value = true
  await promiseTimeout(3000)
  isLoading.value = false
}
</script>
<template>
  <button @click.self="clicked()" :disabled="isLoading"
    class="flex justify-center items-center bg-transparent border-[1px] min-w-[150px] min-h-[34px] hover:bg-yellow-400 transition-all ease-in duration-100 hover:text-black p-1 rounded-lg text-yellow-400">
    <Icon v-if="isLoading" icon="eos-icons:bubble-loading" class="text-white" />
    <slot v-else></slot>
  </button>
</template>

<style scoped>
:disabled {
  opacity: 0.15;
  pointer-events: none
}
</style>