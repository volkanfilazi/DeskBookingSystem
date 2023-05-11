<script setup lang="ts">
import { useOfficeStore } from '../../store/office.store'
import { onMounted, ref, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core'

const router = useRouter()
const useOffice = useOfficeStore()

const selectedOffice = ref<any>()
useStorage("selectedOffice", selectedOffice)

async function NavigateToDesks(officeId: any) {
  selectedOffice.value = officeId;
  await Promise.all([useOffice.getOfficeById(selectedOffice.value)])
  router.push({ name: 'desksPage', params: { id: officeId } });
}

onBeforeUnmount(async () => {
  useOffice.resetColumRow
})

onMounted(async () => {
  useOffice.resetColumRow
  await useOffice.getOfficeById(selectedOffice.value)
})

</script>
<template>
  <div>
    <div class="flex flex-wrap justify-center items-center h-full gap-2 w-full">
      <div
        class="bg-gray-900 shadow-md shadow-black cursor-pointer border-2 border-transparent hover:border-yellow-300 relative h-[280px] w-[280px] min-w-[280px]"
        v-for="office in useOffice.offices" :key="office.id" @click="NavigateToDesks(office.id)">
        <div class="flex w-full absolute justify-end p-2">
          <p class="bg-yellow-500 rounded-full px-2 py-1 mr-2">Desks: {{ office.rows * office.columns }}</p>
        </div>
        <div class="w-full text-white h-full flex justify-center items-center">
          <p class="text-yellow-500 font-bold">{{ office.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>