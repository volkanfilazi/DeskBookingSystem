import { defineStore } from 'pinia'
import { User } from '../interface/user.interface'
import { ref } from 'vue'
import service from '../composables/http'
import { useStorage } from '@vueuse/core'

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([])
  const filterUsersByLastname = ref<User[]>([])
  const userProfile = ref<User>()
  const updateError = ref<string>()
  const updateSuccess = ref<string>()
  async function getUsers() {
    try {
      const response = await service.get<User[]>(`users`)
      users.value = response.data
      return response.data
    } catch (error) {
      return error
    }
  }

  async function searchUser(lastname: string) {
    const filterUser = users.value.filter((user) => user.lastname.toLowerCase().includes(lastname.toLowerCase()));
    filterUsersByLastname.value = filterUser
  }

  async function getUserProfile(){
    try {
      const response = await service.get<User>(`users/profile`)
      userProfile.value = response.data
      useStorage("userId",userProfile.value.id)  
      return response.data
    } catch (error) {
    }
  }

  async function updateProfile(id: string,firstname: string, lastname: string, email: string, department: string, password: string){
    try {
      const response = await service.put<User>(`users/${id}`,{
        firstname,
        lastname,
        email,
        department,
        password
      })
      updateSuccess.value = 'Your data has been successfully changed...'
      return response.data
    } catch (error:any) {
      updateError.value = error.response.data.message
    }
  }

  async function getAUser(id: string){
    try {
      const response = await service.get(`users/${id}`)            
      return response.data
    } catch (error) {
    }
  }

  async function deleteUser(id: string){
    try {
      const response = await service.delete(`users/${id}`)      
      return response.data
    } catch (error) {
    }
  }
  return {
    getUsers,
    users,
    getUserProfile,
    userProfile,
    updateProfile,
    updateError,
    updateSuccess,
    searchUser,
    filterUsersByLastname,
    deleteUser,
    getAUser,
  }
})