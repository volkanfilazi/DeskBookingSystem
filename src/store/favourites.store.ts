import { defineStore } from 'pinia'
import { ref } from 'vue'
import service from '../composables/http'
import { FavouritesRequest, FavouritesResponse } from '../interface/favourites.store'

export const useFavouritesStore = defineStore('favorites', () => {
  const allFavourites = ref<FavouritesResponse[]>([])
  async function createFavourite(body: FavouritesRequest){
    try {
      const response = await service.post<FavouritesResponse>(`favourites`,body)
      return response.data
    } catch (error:any) {
    }
  }

  async function getFavouritesByUserId(id: string){
    try {
      const response = await service.get<FavouritesResponse[]>(`favourites/user/${id}`)
      allFavourites.value = response.data
      response.data.filter((item) => item.user.id)        
      return response.data
    } catch (error:any) {
    }
  }

  async function deleteFavourites(id: string){
    try {
      const response = await service.delete(`favourites/${id}`)
      return response.data
    } catch (error) {
    }
  }
  return{
    createFavourite,
    getFavouritesByUserId,
    allFavourites,
    deleteFavourites
  }
})