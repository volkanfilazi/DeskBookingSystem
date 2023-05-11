<script setup lang="ts">
import { useBookingStore } from '../../store/booking.store'
import { useUserStore } from '../../store/user.store';
import VIcon from '../../components/base/V-Icon.vue'
import VModal from '../../components/base/V-Modal.vue'
import VRemoveConfirm from '../../components/base/V-RemoveConfirmAlert.vue'
import { ref, onMounted } from 'vue';
import '@vuepic/vue-datepicker/dist/main.css'
import VueDatePicker from '@vuepic/vue-datepicker';
import VButton from '../../components/base/V-Button.vue'
import { useFormatStore } from '../../store/dateFormater.store'
import { useDesksStore } from '../../store/desks.store';
import { useAdminStore } from '../../store/admin.store';

const bookingStore = useBookingStore()
const userStore = useUserStore()
const formatStore = useFormatStore()
const deskStore = useDesksStore()
const adminStore = useAdminStore()

const popupEditToogle = ref<boolean>(false)
const selectedBookingId = ref<string>('')
const selectedDesk = ref<string>('')
const bookingDeleteConfirmToogle = ref<boolean>(false)
const updateSuccessMessage = ref<string>('')
const selectedFixDeskId = ref<string>('')
const popupRemoveToogle = ref<boolean>(false)

async function fetchGetAllBookingByUser() {
  if (userStore.userProfile)
    await bookingStore.getBookingsAUser(userStore.userProfile.id)
}

function selectedRemoveFixElement(id: string) {
  selectedFixDeskId.value = id
  popupRemoveToogle.value = true
}

function closeRemovePopup(){
  popupRemoveToogle.value = false
}

async function popupCloseButton() {
  popupEditToogle.value = false
  bookingDeleteConfirmToogle.value = false
  bookingStore.bookUpdateErrorMessage = ''
  await fetchGetAllBookingByUser()
}

async function fetchDeleteFixRequest(){
  await adminStore.deleteFixDeskRequest(selectedFixDeskId.value)
  await deskStore.getAllDesks()
  
  setTimeout(() => {
    selectedFixDeskId.value = ''
    popupRemoveToogle.value = false
  },2000)
}

function deleteActive() {
  bookingDeleteConfirmToogle.value = true
}
function deleteClose() {
  bookingDeleteConfirmToogle.value = false
}

function convertToAPIFormat(date: any) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}T00:00:00.000Z`;
}
const date = ref([new Date(), new Date(new Date().setDate(new Date().getDate() + 7))]);

async function updateABooking() {
  bookingStore.bookUpdateErrorMessage = ''
  const [startDate, endDate] = date.value;
  const startApiDate = convertToAPIFormat(startDate);
  const endApiDate = convertToAPIFormat(endDate);

  const response = await bookingStore.updateABook(selectedBookingId.value, { dateStart: startApiDate, dateEnd: endApiDate, deskId: selectedDesk.value })
  await bookingStore.bookingList()
  await bookingStore.getSingleBookingDesk(selectedDesk.value)
  await fetchGetAllBookingByUser()

  if (response) {
    bookingStore.bookUpdateErrorMessage = ''
    updateSuccessMessage.value = 'Successfully updated!'
    setTimeout(() => {
      bookingStore.deleteBookingErrorMessage = ''
      updateSuccessMessage.value = ''
      bookingStore.bookUpdateErrorMessage = ''
      popupEditToogle.value = false
    }, 1500)
  }
}

onMounted(async () => {
  fetchGetAllBookingByUser()
  await deskStore.getAllDesks()
})

function selectedEditElement(id: string) {
  selectedBookingId.value = id
  popupEditToogle.value = true
}

async function fetchDeleteBooking(id: string) {
  await bookingStore.deleteBookingByUser(id)
  await bookingStore.getSingleBookingDesk(selectedDesk.value)
  await fetchGetAllBookingByUser()
  bookingDeleteConfirmToogle.value = false
  setTimeout(() => {
    bookingStore.deleteBookingErrorMessage = ''
    popupEditToogle.value = false

  }, 1500)
}

</script>
<template>
  <div class="flex flex-col items-center">
    <div class="bg-gray-900 p-1 w-[290px] mt-5">
      <h1 class="text-white text-2xl text-center">All Bookings</h1>
    </div>
    <div
      class="flex flex-col flex-wrap w-full pt-5 pb-5 mt-3 sm:flex-col md:flex-row md:justify-center lg:flex-row max-h-[1000px] overflow-auto border-[1px] gap-2 bg-gray-900 p-2 border-gray-600 ">
      <div v-for="fix in deskStore.singleUserFixedArray"
        class="border-[1px] w-full sm:w-full md:w-[290px] lg:w-[290px] min-w-[290px] flex flex-col gap-1 border-dashed p-2 border-red-400">
        <div class="flex items-center justify-between">
          <p class="text-yellow-400">{{ formatStore.formatDate(fix.createdAt) }} - Unlimited</p>
          <div class="w-[30px] h-[30px] justify-center items-center flex">
            <VIcon @click="selectedRemoveFixElement(fix.fixdesk.id)"></VIcon>
          </div>
        </div>
        <p class="text-yellow-400">{{ fix.office.name }}</p>
        <p class="text-red-400">Fix</p>
        <p>Desk name : {{ fix.label }}</p>
        <p>Column :{{ fix.column }}</p>
        <p>Row : {{ fix.row }}</p>
        <p>Equipments : {{ fix.equipment }}</p>
      </div>
      <div
        class="border-[1px] w-full sm:w-full md:w-[290px] lg:w-[290px] min-w-[290px] border-dashed p-2 border-green-400"
        v-for="book in bookingStore.getAllBookingsUser">
        <div class="flex justify-between items-center">
          <div class="flex text-yellow-400 gap-1">
            <p>{{ formatStore.formatDate(book.dateStart) }} -</p>
            <p>{{ formatStore.formatDate(book.dateEnd) }}</p>
          </div>
          <div class="w-[30px] h-[30px] justify-center items-center flex">
            <VIcon @click="selectedEditElement(book.id)"></VIcon>
          </div>
        </div>
        <div class="flex flex-col text-white gap-1">
          <div class="flex flex-col">
            <p class="text-yellow-400">{{ book.desk.office.name }}</p>
            <p class="text-green-400">Flex</p>
          </div>
          <p>Desk Name : {{ book.desk.label }}</p>
          <p>Column : {{ book.desk.office.columns }}</p>
          <div class="flex flex-col">
            <p>Row : {{ book.desk.office.rows }}</p>
            <p>Equipments : {{ book.desk.equipment }}</p>
          </div>
        </div>
      </div>
      <div v-if="!bookingStore.getAllBookingsUser.length && !deskStore.singleUserFixedArray.length">
        you dont have any bookings added!
      </div>
    </div>
  </div>
  <VRemoveConfirm :open="popupRemoveToogle" @close="closeRemovePopup()">
    <div class="flex flex-col text-yellow-400 mt-5 items-center">
          <h3>Are you sure you want to delete this reservation? </h3>
          <div v-if="selectedFixDeskId" class="flex mt-10 gap-2">
            <div class="flex justify-center">
              <VButton @click="fetchDeleteFixRequest()">Confirm</VButton>
            </div>
            <div class="flex justify-center">
              <VButton @click="closeRemovePopup()">Cancel</VButton>
            </div>
          </div>
          <div
            class="border-[1px] border-gray-500 mt-10 flex items-center gap-2 rounded-lg">
            <div class="bg-yellow-500 h-full w-[30px] rounded-l-lg"></div>
            <ul class="text-green-500">
              <li></li>
            </ul>
          </div>
        </div>
  </VRemoveConfirm>
  <VModal :open="popupEditToogle" @close="popupCloseButton()">
    <template #default>
      <div class="flex flex-col">
        <h1 class="text-center text-white">Booking Update</h1>
        <VueDatePicker class="mt-5" v-model="date" range />
        <div class="flex justify-center">
          <VButton class="mt-10" @click="updateABooking()">Update</VButton>
        </div>
        <div class="flex justify-center">
          <VButton class="mt-10" @click="deleteActive()">Delete</VButton>
        </div>
        <div v-if="bookingDeleteConfirmToogle" class="gap-1 mt-3 group">
          <div class="flex items-center justify-center gap-3">
            <div class="border-l-[2px] group-hover:border-yellow-400 border-t-[2px] w-[70px] h-[20px]"></div>
            <p class="text-white group-hover:text-yellow-400">Are you sure?</p>
            <div class="border-r-[2px] group-hover:border-yellow-400 border-t-[2px] w-[70px] h-[20px]"></div>
          </div>
          <div class="flex gap-2 mt-2 justify-center">
            <div class="flex justify-center">
              <VButton @click="fetchDeleteBooking(selectedBookingId)">Confirm</VButton>
            </div>
            <div class="flex justify-center">
              <VButton @click="deleteClose()">Cancel</VButton>
            </div>
          </div>
        </div>
        <div v-if="bookingStore.bookUpdateErrorMessage || updateSuccessMessage || bookingStore.deleteBookingErrorMessage"
          class="border-[1px] border-gray-500 mt-3 flex items-center gap-2 rounded-lg">
          <div class="bg-yellow-500 h-[80px] w-[30px] rounded-l-lg"></div>
          <ul class="text-red-500">
            <li class="text-red-500">{{ bookingStore.bookUpdateErrorMessage }}</li>
            <li class="text-green-500">{{ updateSuccessMessage }}</li>
            <li class="text-green-500">{{ bookingStore.deleteBookingErrorMessage }}</li>
          </ul>
        </div>
      </div>
    </template>
  </VModal>
</template>
