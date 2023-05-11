<script setup lang="ts">
import { Icon } from '@iconify/vue';

export interface Props {
  open: boolean
}

export interface Emits {
  (e: 'check', value: boolean): void
}

const prop = withDefaults(defineProps<Props>(), {
  open: false
})

const emit = defineEmits<Emits>()
</script>
<template>
  <div @click.self="emit('check', true)" class="relative flex justify-center items-center">
    <div class="w-[15px] h-[15px] border-[1px] border-white-400"></div>
    <Icon v-show="prop.open" class="absolute" icon="material-symbols:check-small" color="#f1a51a" width="50"
      height="50" />
  </div>
</template>