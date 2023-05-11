import { defineStore } from 'pinia'
import { BookingInterface, BookingRequest } from '../interface/booking.interface'
import { ref } from 'vue'
import service from '../composables/http'

export const useBookingStore = defineStore('booking', () => {
    const bookingArray = ref<BookingInterface[]>([])
    const getSingleBooking = ref<BookingInterface[]>([])
    const getAllBookingsUser = ref<BookingInterface[]>([])
    const bookRequestErrorMessage = ref<string>()
    const bookUpdateErrorMessage = ref<string>()
    const bookGetBookingsUserErrorMessage = ref<string>('')
    const deleteBookingErrorMessage = ref<string>('')

    async function bookingList() {
        try {
            const response = await service.get<BookingInterface[]>(`bookings`)
            bookingArray.value = response.data    
            return response.data
        } catch (error) {
        }
    }

    async function getSingleBookingDesk(id: string) {
        try {
            const response = await service.get<BookingInterface[]>(`bookings/desk/${id}`)
            getSingleBooking.value = response.data
            return response.data
        } catch (error) {
        }
    }

    async function bookADesk(dateStart: string, dateEnd: string, desk: string) {
        try {
            const response = await service.post<BookingInterface>(`bookings`, {
                dateStart,
                dateEnd,
                desk
            })
            bookRequestErrorMessage.value = "Your reservation is successfully added!"

            return response.data
        } catch (error: any) {
          bookRequestErrorMessage.value = error.response.data.message
            
        }
    }

    async function updateABook(bookingId: string, body: BookingRequest){
      try {
        const response = await service.put<BookingInterface>(`bookings/${bookingId}`,body)
        return response.data
      } catch (error:any) {
        bookUpdateErrorMessage.value = error.response.data.message
      }
    }

    async function fixRequest(desk: string) {
        try {
            await service.post<BookingInterface>(`fixdesk-requests`, {
                desk
            })
            bookRequestErrorMessage.value = "Your Fix Desk request successfuly sendet!"
        } catch (error: any) {
            bookRequestErrorMessage.value = error.response.data.message
        }
    }

    async function getBookingsAUser(id: string){
      try {
        const response = await service.get<BookingInterface[]>(`bookings/user/${id}`)
        getAllBookingsUser.value = response.data
        return response.data
      } catch (error:any) {
        bookGetBookingsUserErrorMessage.value = error.data.message
      }
    }

    async function deleteBookingByUser(id: string) {
      try {
        const response = await service.delete(`bookings/${id}`)
        deleteBookingErrorMessage.value = 'Reservation has been successfully removed!'
        return response
      } catch (error:any) {
        deleteBookingErrorMessage.value = error.data.message
      }
    }

    function resetState(){
        getSingleBooking.value = []
        bookRequestErrorMessage.value = undefined
    }
    return {
        bookingList,
        bookingArray,
        getSingleBookingDesk,
        getSingleBooking,
        bookADesk,
        bookRequestErrorMessage,
        fixRequest,
        resetState,
        updateABook,
        bookUpdateErrorMessage,
        getBookingsAUser,
        getAllBookingsUser,
        bookGetBookingsUserErrorMessage,
        deleteBookingByUser,
        deleteBookingErrorMessage,
    }
})