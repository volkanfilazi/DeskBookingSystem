<script setup lang="ts">
import { useAdminStore } from '../../store/admin.store'
import { useOfficeStore } from '../../store/office.store'
import VButton from '../../components/base/V-Button.vue'
import VInput from '../../components/base/V-Input.vue'
import { ref } from 'vue';

const useOffice = useOfficeStore()
const useAdmin = useAdminStore()
const name = ref<string>('')
const columns = ref<number>(0)
const rows = ref<number>(0)
const nameErrorMessage = ref<string>('')
const inputErrorMessage = ref<string>('')
const rowErrorMessage = ref<string>('')
const successMessage = ref<string>('')

async function fetchOffices() {
  await useOffice.allOffices()
}

async function handleAdminStore() {
  nameErrorMessage.value = ''
  inputErrorMessage.value = ''
  rowErrorMessage.value = ''
  successMessage.value = ''
  if (!name.value || !columns.value || !rows.value) {

    if (!name.value) {
      nameErrorMessage.value = "Please type a correct name"
    }
    if (!columns.value) {
      inputErrorMessage.value = "Please type a column value!"
    }
    if (!rows.value) {
      rowErrorMessage.value = 'Please type a row value!'
    }
    setTimeout(() => {
      nameErrorMessage.value = ''
      inputErrorMessage.value = ''
      rowErrorMessage.value = ''
    }, 2000);
  }
  else {
    await useAdmin.createOffice({ name: name.value, columns: columns.value, rows: rows.value })
    name.value = ''
    columns.value = 0
    rows.value = 0
    
    await fetchOffices()
    setTimeout(() => {
      useAdmin.createOfficeErrorMessage = ''
    },1500)
  }
}

</script>
<template>
  <div class="flex justify-center flex-col items-center ">
    <div class="flex flex-col items-center gap-2 mt-10 w-full">
      <VInput place-value="office name" type-value="string" v-if="name !== undefined" v-model="name"></VInput>
      <div class="flex flex-col">
        <label for="column">Column</label>
        <VInput id="column" place-value="columns" type-value="number" v-model="columns"></VInput>
      </div>
      <div class="flex flex-col">
        <label for="row">Row</label>
        <VInput id="row" place-value="rows" type-value="number" v-model="rows"></VInput>
      </div>
      <div class="flex justify-center">
        <VButton @click="handleAdminStore">Create New Office</VButton>
      </div>
    </div>
    <div class="h-full w-full flex justify-center mt-5 items-center">
      <div v-if="useAdmin.createOfficeErrorMessage || nameErrorMessage || inputErrorMessage || rowErrorMessage "
        class="border-[1px] shadow-lg shadow-black border-gray-500 flex flex-col p-1 gap-2 rounded-lg">
          <p class="text-green-500">{{ useAdmin.createOfficeErrorMessage }}</p>   
          <p class="text-red-500">{{ nameErrorMessage }}</p>   
          <p class="text-red-500">{{ inputErrorMessage }}</p>   
          <p class="text-red-500">{{ rowErrorMessage }}</p>   
      </div>
    </div>
  </div>
</template>