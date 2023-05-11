import { defineStore } from 'pinia'
import { OfficeResponse, OfficeRequest } from '../interface/office.interface'
import { Desk,DeskRequest } from '../interface/desk.interface'
import { ref } from 'vue'
import { FixRequests, Status } from '../interface/fixRequest.interface'
import service from '../composables/http'
import { BookingInterface, BookingRequest } from '../interface/booking.interface'


export const useAdminStore = defineStore('admin', () => {
  const requests = ref<FixRequests[]>([])
  const errorMessage = ref<string>('')
  const createDeskErrorMessage = ref<string>('')
  const createDeskSuccessMessage = ref<string>('')
  const updateOfficeNameErrorMessage = ref<string>('')
  const deleteBookingErrorMessage = ref<string>('')
  const createOfficeErrorMessage = ref<string>('')
  const adminUpdateDeskErrorMessage = ref<string>('')

  async function createOffice(body: OfficeRequest) {
    try {
      const response = await service.post<OfficeResponse>(`admin/offices`, body)
      createOfficeErrorMessage.value = 'Office has been successfully created'
      return response.data
    } catch (error:any) {
      createOfficeErrorMessage.value = error.response.data.message      
    }
  }

  async function deleteOffice(id: string) {
    try {
      const response = await service.delete<OfficeResponse>(`admin/offices/${id}`)

      return response.data
    } catch (error) {
    }
  }

  async function updateOffice(id: string, name: string) {
    try {
      const response = await service.put<OfficeResponse>(`admin/offices/${id}`, {
        name
      })
      updateOfficeNameErrorMessage.value = `Your office name has been successfully changed to ${name}`
      setTimeout(() =>{
        updateOfficeNameErrorMessage.value = ''
      },2000)
      return response.data
    } catch (error:any) {
      updateOfficeNameErrorMessage.value = error.response.data.message
    }
  }

  async function createDesk(body: DeskRequest) {
    try {
      const response = await service.post<Desk>(`admin/desks`, body)
      createDeskErrorMessage.value = "You created a desk."
      setTimeout(() => {
        createDeskErrorMessage.value = ''
      }, 2000);   
      return response
    } catch (error:any) {
      createDeskErrorMessage.value = error.response.data.message  
    }
  }

  async function getDesks() {
    try {
      const response = await service.get<Desk>(`desks`)

      return response.data
    } catch (error) {
      return error
    }
  }

  async function fixDeskRequests() {
    try {
      const response = await service.get<FixRequests[]>(`admin/fix-desk-requests`)
      requests.value = response.data
      return response.data

    } catch (error:any) {
      deleteBookingErrorMessage.value = error.response.data.message  
    }
  }

  const statusMapping = {
    [Status.Approved]: "approved",
    [Status.Rejected]: "rejected"
  };
  async function decideFixDeskRequests(id: string, status: Status) {
    try {
      await service.put<FixRequests>(`admin/fix-desk-requests`, {
        id,
        status: statusMapping[status]
      })
    } catch (error) {

    }
  }

  async function deleteFixDeskRequest(id: string){
    try {
      const response = await service.delete(`fixdesk-requests/${id}`)  
        deleteBookingErrorMessage.value = 'Reservation has been successfully removed!'   
        return response.data
    } catch (error:any) {
      deleteBookingErrorMessage.value = error.response.data.message
    }
  }

  async function deleteADesk(id: string) {
    try {
      await service.delete(`admin/desks/${id}`)
    } catch (error) {

    }
  }

  async function updateDesk(id: string, body:DeskRequest) {
    try {
      const response = await service.put<Desk>(`admin/desks/${id}`, body)
      return response
    } catch (error:any) {
      adminUpdateDeskErrorMessage.value = error.response.data.message
      return error
    }
  }

  async function deleteBooking(id: string) {
    try {
      const response = await service.delete(`admin/bookings/${id}`)
      deleteBookingErrorMessage.value = ''
      return response.data
    } catch (error:any) {
      deleteBookingErrorMessage.value = error.response.data.message
    }
  }

  async function updateBooking(id: string, body:BookingRequest) {
    try {
      const response = await service.put<BookingInterface>(`bookings/${id}`, body)
      return response
    } catch (error:any) {
      errorMessage.value = error.data.message
    }
  }

  async function giveAdmin(id: string) {
    try {
      const response = await service.put<BookingInterface>(`admin/promote`,{
        id,
        "isAdmin":true
      })
      
      return response
    } catch (error:any) {
      errorMessage.value = error.data.message
    }
  }

  function removeState(){
    updateOfficeNameErrorMessage.value = ''
    createDeskErrorMessage.value = ''
    deleteBookingErrorMessage.value = ''
  }

  return {
    createOffice,
    createDesk,
    getDesks,
    fixDeskRequests,
    requests,
    decideFixDeskRequests,
    deleteADesk,
    updateDesk,
    deleteOffice,
    updateOffice,
    deleteBooking,
    updateBooking,
    errorMessage,
    deleteFixDeskRequest,
    createDeskErrorMessage,
    createDeskSuccessMessage,
    updateOfficeNameErrorMessage,
    removeState,
    deleteBookingErrorMessage,
    giveAdmin,
    createOfficeErrorMessage,
    adminUpdateDeskErrorMessage
  }
})