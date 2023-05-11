<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useFavouritesStore } from '../../store/favourites.store';
import { useUserStore } from '../../store/user.store';
import { Icon } from '@iconify/vue';

const favouritesStore = useFavouritesStore()
const userStore = useUserStore()
const userId = ref<string>()

onMounted(async () => {
  userId.value = userStore.userProfile?.id
  await favouritesStore.getFavouritesByUserId(userId.value!)
})

async function fetchDeleteFavourites(id: string) {
  await favouritesStore.deleteFavourites(id)
  userId.value = userStore.userProfile?.id
  await favouritesStore.getFavouritesByUserId(userId.value!)
}

</script>
<template>
  <div class="flex justify-center flex-wrap items-center gap-2 w-full">
    <div class="shadow-md shadow-black bg-gray-900 text-white min-w-[290px] min-h-[290px] max-w-[290px] p-2"
      v-for="favourites in favouritesStore.allFavourites">
      <div class="flex justify-end ">
        <div @click="fetchDeleteFavourites(favourites.id)" class="w-[25px] group cursor-pointer">
          <Icon class="hidden group-hover:flex" icon="material-symbols:heart-broken-sharp" color="red" width="25px"
            height="25px" />
          <Icon class="group-hover:hidden" icon="mdi:cards-heart" color="red" width="25" height="25" />
        </div>
      </div>
      <div class="flex justify-center">
        <p class="text-black p-1 rounded-lg bg-yellow-500">{{ favourites.desk.office.name }}</p>
      </div>
      <div class="flex justify-center">
        <p class="font-bold">{{ favourites.desk.label }}</p>
      </div>
      <p>Column : {{ favourites.desk.column }}</p>
      <p>Row : {{ favourites.desk.row }}</p>
      <p>{{ favourites.desk.equipment }}</p>
      <p>{{ favourites.id }}</p>
    </div>
    <div v-if="!favouritesStore.allFavourites.length" class="bg-gray-600 p-10 rounded-lg">
      you dont have any favorites added!
    </div>
  </div>
</template>
