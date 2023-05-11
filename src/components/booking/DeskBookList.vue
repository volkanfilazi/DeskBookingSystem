<script setup lang="ts">
import { useBookingStore } from '../../store/booking.store'
import { useUserStore } from '../../store/user.store';
import VIcon from '../../components/base/V-Icon.vue'
import VModal from '../../components/base/V-Modal.vue'
import { onMounted, ref } from 'vue';
import '@vuepic/vue-datepicker/dist/main.css'
import VueDatePicker from '@vuepic/vue-datepicker';
import { useStorage } from '@vueuse/core'
import VButton from '../../components/base/V-Button.vue'
import VRemoveConfirm from '../../components/base/V-RemoveConfirmAlert.vue'
import { useFormatStore } from '../../store/dateFormater.store'
import { useDesksStore } from '../../store/desks.store';
import { Icon } from '@iconify/vue';
import { useAdminStore } from '../../store/admin.store';

const bookingStore = useBookingStore()
const userStore = useUserStore()
const formatStore = useFormatStore()
const deskStore = useDesksStore()
const adminStore = useAdminStore()
const selectedEditItem = ref<string>('')
const fixRemoveElement = ref<string>('')
const fixRemoveToogle = ref(false)
const selectedDesk = useStorage("selectedDesk", "")
const updateSuccessMessage = ref<string>('')
const bookingDeleteConfirmToogle = ref<boolean>(false)

function deleteActive() {
  bookingDeleteConfirmToogle.value = true
}
function deleteClose() {
  bookingDeleteConfirmToogle.value = false
}

function selectedEditElement(id: string) {
  adminStore.deleteBookingErrorMessage = ''
  selectedEditItem.value = id
  popupEditToogle.value = true
}

function selectedFixRemoveItem(id: string) {
  fixRemoveElement.value = id
  fixRemoveToogle.value = true
}

function closeRemovePopup() {
  fixRemoveToogle.value = false
}

const popupEditToogle = ref<boolean>(false)

function popupCloseButton() {
  popupEditToogle.value = false
  bookingDeleteConfirmToogle.value = false
  bookingStore.bookUpdateErrorMessage = ''
}

async function fetchDeleteFixRequest(id: string) {
  await adminStore.deleteFixDeskRequest(id)
  await deskStore.getAllDesks()

  setTimeout(() => {
    adminStore.deleteBookingErrorMessage = ''
    fixRemoveElement.value = ''
    fixRemoveToogle.value = false
  }, 2000)
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

  const response = await bookingStore.updateABook(selectedEditItem.value, { dateStart: startApiDate, dateEnd: endApiDate, deskId: selectedDesk.value })
  bookingStore.bookingList()
  bookingStore.getSingleBookingDesk(selectedDesk.value)

  if (response) {
    bookingStore.bookUpdateErrorMessage = ''
    updateSuccessMessage.value = 'Successfully updated!'
    setTimeout(() => {
      updateSuccessMessage.value = ''
      bookingStore.bookUpdateErrorMessage = ''
      popupEditToogle.value = false
    }, 1500)
  }
}

async function fetchDeleteBooking(id: string) {
  await bookingStore.deleteBookingByUser(id)

  await bookingStore.getSingleBookingDesk(selectedDesk.value)
  setTimeout(() => {
    popupEditToogle.value = false
    bookingDeleteConfirmToogle.value = false
    bookingStore.deleteBookingErrorMessage = ''
  }, 1500)
}

onMounted(async () => {
  await deskStore.getAllDesks()
  await bookingStore.bookingList()
})

</script>
<template>
  <div
    class="flex flex-col w-full max-h-[1000px] overflow-auto sm:w-full md:w-1/3 border-[1px] gap-2 bg-gray-900 p-2 border-gray-600 ">
    <p class="text-white font-bold mt-5">All Bookings</p>
    <div class="border-[1px] border-dashed p-2 border-green-400" v-for="bookings in bookingStore.getSingleBooking">
      <VIcon @click="selectedEditElement(bookings.id)" v-if="userStore.userProfile?.id === bookings.user.id"></VIcon>
      <p>Desk type is <span class="text-green-400">Flex</span></p>
      <div class="flex text-white gap-1">
        <p>{{ bookings.user.firstname }}</p>
        <p>{{ bookings.user.lastname }}</p>
      </div>
      <div class="flex text-yellow-400 gap-1">
        <p>{{ formatStore.formatDate(bookings.dateStart) }} -</p>
        <p>{{ formatStore.formatDate(bookings.dateEnd) }}</p>
      </div>
    </div>
    <div class="border-[1px] relative border-dashed p-2 border-red-400" v-for="fix in deskStore.bookingPageSingleFix">
      <Icon @click="selectedFixRemoveItem(fix.fixdesk?.id)" class="absolute right-0 top-0 cursor-pointer p-1"
        icon="ic:baseline-delete" width="28" height="28" color="red" />
      <div class="flex flex-col text-white">
        <p>Desk type is <span class="text-red-400">Fix</span></p>
        <p>{{ fix.fixdesk.user.firstname }} - {{ fix.fixdesk.user.lastname }}</p>
      </div>
      <div class="flex text-yellow-400 gap-1">
        <p>{{ formatStore.formatDate(fix.createdAt) }} - Unlimited</p>
      </div>
    </div>
  </div>
  <VRemoveConfirm :open="fixRemoveToogle" @close="closeRemovePopup()">
    <div class="flex flex-col gap-6 text-yellow-400 mt-5 items-center">
      <h3>Are you sure you want to delete this reservation? </h3>
      <div class="flex gap-2">
        <VButton @click="fetchDeleteFixRequest(fixRemoveElement)">Confirm</VButton>
        <VButton @click="closeRemovePopup()">Cancel</VButton>
      </div>
      <p class="text-red-500">{{ adminStore.deleteBookingErrorMessage }}</p>
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
          <div class="flex justify-center gap-2 mt-2">
            <VButton @click="fetchDeleteBooking(selectedEditItem)">Confirm</VButton>
            <VButton @click="deleteClose()">Cancel</VButton>
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
