<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useOfficeStore } from '../../store/office.store'
import { useStorage } from '@vueuse/core'
import { useRouter } from 'vue-router';
import VIcon from '../../components/base/V-Icon.vue'
import VModal from '../base/V-Modal.vue';
import AdminCreateNewOffice from './AdminCreateNewOffice.vue';

const router = useRouter()
const useOffice = useOfficeStore()
const adminSelectedOffice = ref<any>()
const popupEditToogle = ref<boolean>(false)

useStorage("adminSelectedOffice", adminSelectedOffice)

function selectedEditElement() {
  popupEditToogle.value = true
}

function popupCloseButton() {
  popupEditToogle.value = false
}

onMounted(async () => {
  await useOffice.allOffices()
})

function NavigateToDeskEdit(officeId: any) {
  adminSelectedOffice.value = officeId;
  router.push({ name: 'deskEditPage', params: { id: officeId } });
}

</script>
<template>
  <div>
    <div class="w-full flex items-center justify-between mt-10">
      <h1 class="text-start pt-1 text-white font-bold">Offices</h1>
      <VIcon @click="selectedEditElement()" class="pr-2 mr-5"></VIcon>
    </div>
    <div class="flex flex-col max-h-[1200px] overflow-auto">
      <div class="flex flex-row flex-wrap lg:flex-col items-center justify-center mt-2">
        <div
          class="bg-transparent border-dotted border-[1px] rounded-md hover:border-yellow-400 border-white shadow-lg cursor-pointer mt-2 mr-2 relative h-[100px] w-[200px] sm:w-[200px] lg:w-[170px] xl:w-[230px] min-w-[150px]"
          v-for="office in useOffice.offices" :key="office.id" @click="NavigateToDeskEdit(office.id)">
          <div class="flex w-full absolute justify-end p-2">
            <p class="bg-yellow-500 rounded-full p-1 mr-2">Desks:{{ office.rows * office.columns }}</p>
          </div>
          <div class="w-full text-white h-full flex justify-center items-center">
            <p>{{ office.name }}</p>
          </div>
        </div>
      </div>
      <VModal :open="popupEditToogle" @close="popupCloseButton()">
        <AdminCreateNewOffice></AdminCreateNewOffice>
      </VModal>
    </div>
  </div>
</template>