<script setup lang="ts">
  import { onMounted } from 'vue';
import DeskCards from '../components/office/DeskCards.vue'
import { useEnumStore } from '../store/enum.store';

  const useEquipments = useEnumStore()

  onMounted( async () => {
    await useEquipments.getEquipments()    
  })
</script>
<template>
  <DeskCards></DeskCards>
</template>

<style scoped></style>