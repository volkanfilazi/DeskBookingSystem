<script setup lang="ts">
import { useOfficeStore } from '../store/office.store'
import OfficeCards from '../components/office/OfficeCards.vue'
import { onMounted } from 'vue';

const useOffice = useOfficeStore()
onMounted( async () => {
  await useOffice.allOffices()
})

</script>
<template>
  <OfficeCards></OfficeCards>
</template>