<script setup lang="ts">
import { ref } from 'vue'
import { useAdminStore } from '../../store/admin.store';
import { useBookingStore } from '../../store/booking.store'
import VueDatePicker from '@vuepic/vue-datepicker';
import VModal from '../../components/base/V-Modal.vue'
import VRemoveConfirm from '../../components/base/V-RemoveConfirmAlert.vue'
import VButton from '../../components/base/V-Button.vue'
import VIcon from '../../components/base/V-Icon.vue'
import '@vuepic/vue-datepicker/dist/main.css'
import { useDesksStore } from '../../store/desks.store';
import { Icon } from '@iconify/vue';
import { useFormatStore } from '../../store/dateFormater.store';

const useBooking = useBookingStore()
const useAdmin = useAdminStore()
const useDesk = useDesksStore()
const useFormat = useFormatStore()

const popupEditToogle = ref<boolean>(false)
const popupRemoveToogle = ref<boolean>(false)
const selectedBookingId = ref<string>('')
const selectedFixDeskId = ref<string>('')
const selectedDeskId = ref<string>('')
const toogleErrorMessage = ref<string>('')
const toogleSuccessMessage = ref<string>('')

function selectedEditElement(id: string, deskId: string) {
  selectedBookingId.value = id
  selectedDeskId.value = deskId
  popupEditToogle.value = true
}

function selectedRemoveElement(id: string) {
  selectedBookingId.value = id
  popupRemoveToogle.value = true
}

function selectedRemoveFixElement(id: string) {
  selectedFixDeskId.value = id
  popupRemoveToogle.value = true
}

function popupCloseButton() {
  popupEditToogle.value = false
  selectedBookingId.value = ''
  selectedFixDeskId.value = ''
  toogleErrorMessage.value = ''
  toogleSuccessMessage.value = ''
}

function alertCloseButton() {
  selectedBookingId.value = ''
  selectedFixDeskId.value = ''
  popupRemoveToogle.value = false
}

function convertToAPIFormat(date: any) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}T00:00:00.000Z`;
}
const date = ref([new Date(), new Date(new Date().setDate(new Date().getDate() + 7))]);


async function fetchBooking() {
  await useBooking.bookingList()
}

async function fetchGetAllDesks() {
  await useDesk.getAllDesks()
}

async function fetchDeleteBooking(id: string) {
  await useAdmin.deleteBooking(id)
  setTimeout(() => {
    selectedBookingId.value = ''
    selectedFixDeskId.value = ''
    popupRemoveToogle.value = false
    useAdmin.removeState()
  }, 2000)
  fetchBooking()
}

async function fetchUpdateBooking(id: string) {
  toogleErrorMessage.value = ''
  toogleSuccessMessage.value = ''
  const [startDate, endDate] = date.value;
  const startApiDate = convertToAPIFormat(startDate);
  const endApiDate = convertToAPIFormat(endDate);
  const response = await useAdmin.updateBooking(selectedBookingId.value, { dateStart: startApiDate, dateEnd: endApiDate, deskId: id })
  if (response) {
    toogleErrorMessage.value = ''
    toogleSuccessMessage.value = 'Booked successfuly...'
    fetchBooking()
    setTimeout(() => {
      selectedBookingId.value = ''
      selectedFixDeskId.value = ''
      popupEditToogle.value = false
      toogleSuccessMessage.value = ''
    }, 200)
  } else {
    toogleErrorMessage.value = useAdmin.errorMessage
  }
}

async function fetchDeleteFixRequest(id: string) {
  await useAdmin.deleteFixDeskRequest(id)
  await useDesk.getAllDesks()
  await useAdmin.fixDeskRequests()
  setTimeout(() => {
    selectedBookingId.value = ''
    selectedFixDeskId.value = ''
    popupRemoveToogle.value = false
    useAdmin.removeState()
  }, 2000)
}

fetchBooking()
fetchGetAllDesks()

</script>
<template>
  <div class="p-5 bg-gray-900 rounded-md">
    <div>
      <h1 class="font-bold text-2xl text-white">All Booking List</h1>
      <div class="hidden sm:grid text-white grid-flow-col grid-cols-5 border-dotted border-b-[1px] border-gray-600">
        <p>Status</p>
        <p>Name</p>
        <p>StartDate</p>
        <p>EndDate</p>
        <p>Office</p>
        <p>Edit</p>
      </div>
    </div>
    <div class="h-[300px] overflow-auto">
      <div
        class=" sm:flex sm:flex-col md:grid md:grid-flow-col text-gray-400 grid-cols-5 gap-2 border-dotted border-b-[1px] border-gray-600 p-2"
        v-for="booking in useBooking.bookingArray">
        <div class="w-[20px] h-[20px] bg-green-500 rounded-full"></div>
        <p>{{ booking.user.firstname }}</p>
        <p class="text-yellow-400">{{ useFormat.formatDate(booking.dateStart) }}</p>
        <p class="text-yellow-400">{{ useFormat.formatDate(booking.dateEnd) }}</p>
        <p>{{ booking.desk.office.name }}</p>
        <div class="flex items-center gap-1">
          <VIcon @click="selectedEditElement(booking.id, booking.desk.id)"></VIcon>
          <Icon class="mt-1 cursor-pointer" @click="selectedRemoveElement(booking.id)" icon="ic:baseline-delete"
            color="red" width="20" height="20" />
        </div>
      </div>
      <div
        class="sm:flex sm:flex-col md:grid md:grid-flow-col text-gray-400 grid-cols-5 gap-2 border-dotted border-b-[1px] border-gray-600 p-2"
        v-if="useDesk.filterFixDesks" v-for="desk in useDesk.filterFixDesks">
        <div class="w-[20px] h-[20px] bg-red-500 rounded-full"></div>
        <p class="ml-2">{{ desk.fixdesk.user.firstname }}</p>
        <p class="ml-4 text-red-500">{{ useFormat.formatDate(desk.fixdesk.createdAt) }}</p>
        <p class="ml-6 text-red-500">Unlimitless</p>
        <p class="ml-8">{{ desk.office.name }}</p>
        <p>{{ desk.fixdesk.status }}</p>
        <Icon class="mt-1 cursor-pointer" @click="selectedRemoveFixElement(desk.fixdesk.id)" icon="ic:baseline-delete"
          color="gray" width="20" height="20" />
      </div>
      <VModal :open="popupEditToogle" @close="popupCloseButton()">
        <template #default>
          <div class="flex justify-center">
            <div class="h-[100px] flex flex-col absolute w-[280px]">
              <VueDatePicker class="mt-5" v-model="date" range />
              <div class="flex justify-center mt-5">
                <VButton @click="fetchUpdateBooking(selectedDeskId)">Update</VButton>
              </div>
              <div v-if="toogleErrorMessage || toogleSuccessMessage"
                class="border-[1px] border-gray-500 mt-10 flex items-center gap-2 rounded-lg">
                <div class="bg-yellow-500 h-full w-[30px] rounded-l-lg"></div>
                <ul class="text-red-500">
                  <li class="p-1">{{ toogleErrorMessage }}</li>
                  <li class="p-1">{{ toogleSuccessMessage }}</li>
                </ul>
              </div>
            </div>
          </div>
        </template>
      </VModal>
      <VRemoveConfirm :open="popupRemoveToogle" @close="alertCloseButton()">
        <div class="flex flex-col text-yellow-400 mt-5 items-center">
          <h3>Are you sure you want to delete this reservation? </h3>
          <div v-if="selectedBookingId" class="flex mt-10 gap-2">
            <div class="flex justify-center">
              <VButton @click="fetchDeleteBooking(selectedBookingId)">Confirm</VButton>
            </div>
            <div class="flex justify-center">
              <VButton @click="alertCloseButton()">Cancel</VButton>
            </div>
          </div>
          <div v-if="selectedFixDeskId" class="flex mt-10 gap-2">
            <div class="flex justify-center">
              <VButton @click="fetchDeleteFixRequest(selectedFixDeskId)">Confirm</VButton>
            </div>
            <div class="flex justify-center">
              <VButton @click="alertCloseButton()">Cancel</VButton>
            </div>
          </div>
          <div v-if="useAdmin.deleteBookingErrorMessage"
            class="border-[1px] border-gray-500 mt-10 flex items-center gap-2 rounded-lg">
            <div class="bg-yellow-500 h-full w-[30px] rounded-l-lg"></div>
            <ul class="text-green-500">
              <li class="p-1">{{ useAdmin.deleteBookingErrorMessage }}</li>
            </ul>
          </div>
        </div>
      </VRemoveConfirm>
    </div>
  </div>
</template>