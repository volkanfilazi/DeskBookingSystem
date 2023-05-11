import { defineStore } from 'pinia'
import { GetOffice } from '../interface/office.interface'
import { ref } from 'vue';
import service from '../composables/http';

export const useOfficeStore = defineStore('office', () => {
  const offices = ref<GetOffice[]>([])
  const getRow = ref<number>()
  const getColumn = ref<number>()
  const areaCalculater = ref<number>()

  async function allOffices() {
    try {
      const response = await service.get<GetOffice[]>(`offices`)
      offices.value = response.data

      return response.data
    } catch (error) {
    }
  }

  async function getOfficeById(id: string) {
    try {
      const response = await service.get<GetOffice>(`offices/${id}`)
      getColumn.value = response.data.columns
      getRow.value = response.data.rows
      areaCalculater.value = getColumn.value * getRow.value
      return response.data
    } catch (error) {
    }
  }

  function resetColumRow(){
    getColumn.value = undefined
    getRow.value = undefined
  }

  return {
    allOffices,
    offices,
    getOfficeById,
    getColumn,
    getRow,
    areaCalculater,
    resetColumRow
  }
})