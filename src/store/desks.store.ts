import { defineStore } from 'pinia'
import { Desk , GetDeskById } from '../interface/desk.interface'
import { ref } from 'vue';
import { useStorage } from '@vueuse/core'
import service from '../composables/http'

export const useDesksStore = defineStore('desks', () => {
  const selectedOffice = useStorage("selectedOffice", "")
  const adminSelectedOffice = useStorage("adminSelectedOffice", "")
  const selectedDesk = useStorage("selectedDesk", "")
  const userId = useStorage("userId","")
  const desks = ref<Desk[]>([])
  const originalDesksList = ref<Desk[]>([])
  const deskById = ref<GetDeskById>()
  const adminPanelDesks = ref<Desk[]>([])
  const searchDeskArray = ref<Desk[]>([])
  const filterFixDesks = ref<Desk[]>([])
  const allDesksArray = ref<Desk[]>([])
  const singleUserFixedArray = ref<Desk[]>([])
  const bookingPageSingleFix = ref<Desk[]>([])

  const filtereByEquiErrorMessage = ref<string>('')

  async function getAllDesks() {
    try {
      const response = await service.get<Desk[]>(`desks`)
      
      desks.value = response.data
      allDesksArray.value = response.data
      const filteredDesks = response.data.filter((item) => item.office.id === selectedOffice.value)
      const filteredAdminPanelDesks = response.data.filter((item) => item.office.id === adminSelectedOffice.value)
      filterFixDesks.value = response.data.filter((item) => item.fixdesk?.status === "approved")   
      originalDesksList.value = filteredDesks
      desks.value = filteredDesks
      adminPanelDesks.value = filteredAdminPanelDesks
      singleUserFixedArray.value = filterFixDesks.value.filter((item) => item.fixdesk?.user.id === userId.value)
      bookingPageSingleFix.value = filterFixDesks.value.filter((singleItem) => singleItem.id === selectedDesk.value )
      return response.data
    } catch (error) {
    }
  }

  function adminDesksSearch(labelName: string) {
    const filteredSearchDesks = adminPanelDesks.value.filter((item) => item.label.toLowerCase().includes(labelName.toLowerCase()));
    searchDeskArray.value = filteredSearchDesks
  }

  function userFilterByEquipment(selectedEquipment: any[]) {
    if (!Array.isArray(selectedEquipment)) {
      return;
    }
    if (selectedEquipment.length === 0) {
      desks.value = originalDesksList.value;
      
      return;
    }
    const filteredEquipment = originalDesksList.value.filter((item) =>
      selectedEquipment.every((item2) =>
        item.equipment.includes(item2)
      )
    );
    if (filteredEquipment.length > 0) {
      desks.value = filteredEquipment;
      filtereByEquiErrorMessage.value =''
    } else {
      desks.value = [];
      filtereByEquiErrorMessage.value = "Sorry, there is no desk matching your criteria.";
    }
  }

  function sortByDeskFix(){
    desks.value = originalDesksList.value.filter((item) => item.fixdesk)
    filtereByEquiErrorMessage.value = ''
  }

  function sortByDeskFlex(){
    desks.value = originalDesksList.value.filter((item) => !item.fixdesk)
    filtereByEquiErrorMessage.value = ''
  }

  function sortByDeskFree(){
    desks.value = originalDesksList.value.filter((item) => !item.nextBooking && !item.fixdesk)
    filtereByEquiErrorMessage.value = ''
  }
  
  function defaultSortByDeskType(){
    desks.value = originalDesksList.value
    filtereByEquiErrorMessage.value = ''
  }
  async function getDeskById() {
    try {
      const response = await service.get<GetDeskById>(`desks/${selectedDesk.value}`)
      deskById.value = response.data

      return response.data
    } catch (error) {
    }
  }

  function resetDesksState(){
    desks.value = []
}

  return {
    getAllDesks,
    desks,
    adminPanelDesks,
    getDeskById,
    deskById,
    adminDesksSearch,
    searchDeskArray,
    filterFixDesks,
    allDesksArray,
    resetDesksState,
    userFilterByEquipment,
    filtereByEquiErrorMessage,
    sortByDeskFix,
    sortByDeskFlex,
    defaultSortByDeskType,
    sortByDeskFree,
    singleUserFixedArray,
    bookingPageSingleFix
    
  }
})