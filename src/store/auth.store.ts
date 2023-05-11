import { useStorage } from '@vueuse/core'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { JwtDecode } from '../interface/jwtdecode.interface'
import { LoginRequest, LoginResponse, User } from '../interface/user.interface'

export const useAuthStore = defineStore("auth", () => {
  
  const key = 'https://deskbooking.dev.webundsoehne.com/api/'
  const access_token = useStorage("saveToken", "")
  const refresh_token =  useStorage("refreshToken", "")

  const loginErrorMessage = ref<string>('')
  const registerSuccessMessage = ref<string>('')
  const registerErrorMessage = ref<string[]>([])
  const registerEmailError = ref('')
  const jwt = ref<JwtDecode>()
  const tokenIsOverSoon = ref(false)

  async function register(firstname: string, lastname: string, email: string, department: string, password: string) {
    try {
      const response = await axios.post<User>(`${key}users/register`,
        {
          firstname,
          lastname,
          email,
          department,
          password
        }
      )
      return response.data
    } catch (error: any) {
        if(error.response.data.statusCode === 400){
        registerErrorMessage.value = error.response.data.message
      }

      if(error.response.data.statusCode === 409){
        registerEmailError.value = error.response.data.message
      }

      setTimeout(() => {
        registerErrorMessage.value = []
        registerEmailError.value = ''
      },3000)
    }
  }

  async function logIn(body: LoginRequest) {
    try {   
      const response = await axios.post<LoginResponse>(`${key}users/login`, body)
      console.log(response);
      
      access_token.value = response.data.token
      jwt.value = jwtDecode(access_token.value)  
          
      const expDate = new Date(jwt.value?.exp! * 1000);
      const now = Math.floor(Date.now() / 1000);
      const expiresIn = expDate.getTime() - now * 1000;
      const minutes = Math.floor(expiresIn / 60000);
      
      useStorage("checkToken",tokenIsOverSoon.value)
      if(minutes < 10){
        tokenIsOverSoon.value = true
      }

      refresh_token.value = response.data.refresh
      access_token.value = access_token.value
      loginErrorMessage.value = ''
      
      return response.data
    } catch (error: any) {
      loginErrorMessage.value = 'E-Mail or Password is incorrect!'
    }
  }
  async function refresh() {
    try {
      await axios.post<LoginResponse>(`${key}users/refresh`, {
        refresh: refresh_token.value
      })

    } catch (error) {
    }

  }
  function resetState() {
    registerSuccessMessage.value = ''
  }

  return {
    register,
    registerSuccessMessage,
    resetState,
    logIn,
    refresh,
    access_token,
    loginErrorMessage,
    registerErrorMessage,
    registerEmailError
  }

})


