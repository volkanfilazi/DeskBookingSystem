<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '../store/user.store';

const userStore = useUserStore()
const hiddenNavToogle = ref(false)

</script>
<template>
  <div class="bg-gray-800 border-b-2 flex justify-center border-white">
    <div class="w-4/5 relative h-16 bg-gray-800 flex justify-between items-center">
      <router-link class="hover:text-yellow-400 z-[500]" :to="{ name: 'homePage' }">Booking System</router-link>
      <ul class="flex gap-2">
        <div class="hidden sm:hidden md:flex gap-2">
          <router-link class="hover:text-yellow-400" :to="{ name: 'homePage' }">Home</router-link>
          <template v-if="!userStore.userProfile">
            <router-link class="hover:text-yellow-400" :to="{ name: 'loginPage' }">Login</router-link>
            <router-link class="hover:text-yellow-400" :to="{ name: 'registerPage' }">Register</router-link>
          </template>
          <template v-else>
            <router-link class="hover:text-yellow-400" :to="{ name: 'officesPage' }">Offices</router-link>
            <router-link class="hover:text-yellow-400" :to="{ name: 'profilePage', params: { id: userStore?.userProfile?.id } }">Profile</router-link>
            <router-link class="hover:text-yellow-400" :to="{ name: 'reservationPage', params: { id: userStore?.userProfile?.id } }">My
              Reservations</router-link>
            <router-link class="hover:text-yellow-400" :to="{ name: 'favoritesPage' }">Favorites</router-link>
            <router-link class="hover:text-yellow-400" :to="{ name: 'adminPage' }" v-if="userStore.userProfile?.isAdmin">Admin</router-link>
            <router-link class="hover:text-yellow-400" :to="{ name: 'logoutPage' }">Logout</router-link>
          </template>
        </div>

        <div class="flex sm:flex md:hidden lg:hidden flex-col items-end absolute top-0 right-0 justify-end bg-gray-800 z-10">
          <div class="mt-5 min-w-[150px] flex text-center items-center w-full justify-center">
            <p class="cursor-pointer" @click="hiddenNavToogle = !hiddenNavToogle">Menu</p>
          </div>
          <div v-if="hiddenNavToogle" class="border-b-[2px] min-w-[150px] border-l-[2px] border-r-[2px] px-2 flex mt-5 flex-col">
            <router-link class="hover:text-yellow-400" :to="{ name: 'homePage' }">Home</router-link>
            <template v-if="!userStore.userProfile">
              <router-link class="hover:text-yellow-400" :to="{ name: 'loginPage' }">Login</router-link>
              <router-link class="hover:text-yellow-400" :to="{ name: 'registerPage' }">Register</router-link>
            </template>
            <template v-else>
              <router-link class="hover:text-yellow-400" :to="{ name: 'officesPage' }">Offices</router-link>
              <router-link class="hover:text-yellow-400" :to="{ name: 'profilePage', params: { id: userStore?.userProfile?.id } }">Profile</router-link>
              <router-link class="hover:text-yellow-400" :to="{ name: 'reservationPage', params: { id: userStore?.userProfile?.id } }">My
                Reservations</router-link>
              <router-link class="hover:text-yellow-400" :to="{ name: 'favoritesPage' }">Favorites</router-link>
              <router-link class="hover:text-yellow-400" :to="{ name: 'adminPage' }" v-if="userStore.userProfile?.isAdmin">Admin</router-link>
              <router-link class="hover:text-yellow-400" :to="{ name: 'logoutPage' }">Logout</router-link>
            </template>
          </div>
        </div>
      </ul>
    </div>
  </div>
</template>