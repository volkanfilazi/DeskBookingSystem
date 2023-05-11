<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue';
import { User } from '../../interface/user.interface';
import { useAdminStore } from '../../store/admin.store';
import { useBookingStore } from '../../store/booking.store';
import { useCommentStore } from '../../store/comment.store';
import { useDesksStore } from '../../store/desks.store';
import { useOfficeStore } from '../../store/office.store';
import { useUserStore } from '../../store/user.store';
import VIcon from '../base/V-Icon.vue'
import VModal from '../base/V-Modal.vue'
import VButton from '../base/V-Button.vue'
import { Icon } from '@iconify/vue';

const deskStore = useDesksStore()
const officeStore = useOfficeStore()
const userStore = useUserStore()
const useBookings = useBookingStore()
const useComments = useCommentStore()
const useAdmin = useAdminStore()
const allUsers = ref<User[]>([])
const userDetails = ref()
const userDetailToogle = ref(false)
const userToogle = ref(false)
const searchInput = ref('')

function popupCloseButton() {
  userToogle.value = false
  userDetailToogle.value = false
}

function openUserToogle() {
  userToogle.value = true
}

function userDetailBack(){
  userDetailToogle.value = false
}

async function fetchGiveAdmin(id: string){
  await useAdmin.giveAdmin(id)
  await userStore.getUsers()
}

async function getASingleUser(id: string){
  const response = await userStore.getAUser(id)
  userDetails.value = response  
  userDetailToogle.value = !userDetailToogle.value
}

watchEffect(async () => {
  userStore.searchUser(searchInput.value)
  if (userStore.filterUsersByLastname) {
    allUsers.value = userStore.filterUsersByLastname
  } else {
    allUsers.value = userStore.users
  }
})

onMounted(async () => {
  await useComments.getComments()
  await userStore.getUsers()
  allUsers.value = userStore.users
  userStore.searchUser(searchInput.value)
})

</script>
<template>
  <div class="flex justify-center items-center md:flex-row gap-2 mt-10 flex-wrap p-10 pt-3 pb-3 mb-3">
    <div class="w-40 h-40 flex flex-col justify-center items-center border-dotted border-[1px] bg-gray-900">
      <p class="text-white">Total Desks:</p>
      <p class="text-[50px] text-yellow-400">{{ deskStore.allDesksArray.length }}</p>
    </div>
    <div class="w-40 h-40 flex flex-col justify-center items-center border-dotted border-[1px] bg-gray-900 ">
      <p class="text-white">Total Offices:</p>
      <p class="text-[50px] text-yellow-400">{{ officeStore.offices.length }}</p>
    </div>
    <div class="w-40 h-40 flex relative flex-col justify-center items-center border-dotted border-[1px] bg-gray-900 ">
      <VIcon @click="openUserToogle()" class="absolute top-0 right-0 pt-2 pr-2"></VIcon>
      <p class="text-white">Total Users:</p>
      <p class="text-[50px] text-yellow-400">{{ userStore.users.length }}</p>
    </div>
    <div class="w-40 h-40 flex flex-col justify-center items-center border-dotted border-[1px] bg-gray-900 ">
      <p class="text-white">Total Bookings:</p>
      <p class="text-[50px] text-yellow-400">{{ useBookings.bookingArray.length }}</p>
    </div>
    <div class="w-40 h-40 flex flex-col justify-center items-center border-dotted border-[1px] bg-gray-900 ">
      <p class="text-white">Total Comments:</p>
      <p class="text-[50px] text-yellow-400">{{ useComments.allComments.length }}</p>
    </div>
  </div>
  <VModal :open="userToogle" @close="popupCloseButton()">
    <template #default>
      <div v-if="!userDetailToogle" class="flex flex-col w-full h-[500px] sm:w-full md:w-[500px] md:h-[500px] overflow-auto">
        <h1 class="text-center text-white">Manage Users</h1>
        <div class="pr-2 pl-2">
          <input
            class="w-full bg-transparent border-[1px] text-white outline-none rounded-md focus:border-yellow-400 pl-3 focus:placeholder:text-yellow-400"
            placeholder="search a user..." type="search" v-model="searchInput">
        </div>
        <p class="text-yellow-400 text-center mt-5" v-if="!allUsers.length">User not found</p>
        <div v-for="user in allUsers" :key="user.id" class="mt-2">
          <div class="flex justify-between pr-2 pl-2">
            <div class="w-full flex justify-between sm:w-full md:w-1/2">
              <p @click="getASingleUser(user.id)" class="text-white cursor-pointer hover:text-yellow-400">{{ user.lastname }}
                <span v-if="user.lastname === 'Stattmann'" class="text-red-500">(King)</span>
                <span v-if="user.lastname === 'Summer'" class="text-red-500">(Captain)</span>
                <span v-if="user.lastname === 'gruber'" class="text-red-500">(Guardian)</span>
                <span v-if="user.lastname === 'Mötz'" class="text-red-500">(Hacker)</span>
              </p>
              <p class="text-yellow-400" v-if="user.isAdmin">Admin</p>
              <p class="text-white" v-else="users.isAdmin">User</p>
            </div>
            <div class="flex justify-end gap-1 w-1/2">
              <p v-if="!user.isAdmin" @click="fetchGiveAdmin(user.id)" class="bg-green-500 hover:bg-yellow-400 hover:text-black cursor-pointer pr-1 pl-1">Make Admine</p>
              <Icon class="cursor-pointer" @click="getASingleUser(user.id)" icon="mdi:card-account-details" width="30" height="30" color="E5FFCC" />
            </div>
          </div>
        </div>
      </div>
      <div v-if="userDetailToogle" class="flex flex-col gap-5 justify-center ">
        <div class="flex flex-col gap-2">
          <div>name : {{ userDetails?.firstname}} <span>{{ userDetails?.lastname }}</span></div>
          <div>email : {{ userDetails?.email}}</div>
          <div>created at : {{ userDetails?.createdAt}}</div>
          <div>department : {{ userDetails?.department}}</div>
          <div v-if="userDetails?.isAdmin">Level : Admin</div>
          <div v-else>Level : User</div>
        </div>
        <div class="flex justify-center items-center mt-10">
          <VButton @click="userDetailBack">Back</VButton>
        </div>
      </div>
    </template>
  </VModal>
</template>