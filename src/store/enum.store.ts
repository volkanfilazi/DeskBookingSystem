import { defineStore } from 'pinia'
import { Equipments } from '../interface/equipments'
import { ref } from 'vue';
import service from '../composables/http';

export const useEnumStore = defineStore('equipments', () => {
  const equipments = ref<Equipments[]>([])
  async function getEquipments() {
    try {
      const response = await service.get<Equipments[]>(`equipments`)
      equipments.value = response.data
      return response.data
    } catch (error) {
    }
  }

  return {
    getEquipments,
    equipments
  }
})