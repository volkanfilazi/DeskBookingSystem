<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue';
import { useStorage } from '@vueuse/core'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { useBookingStore } from '../../store/booking.store'
import { useCommentStore } from '../../store/comment.store';
import VButton from '../../components/base/V-Button.vue'

const useBooking = useBookingStore()
const commentStore = useCommentStore()
const selectedDesk = useStorage("selectedDesk", "")

const commentValue = ref<string>('')
const commentValueNumber = ref<number>()

function commentCharacterCalculater() {
  commentValueNumber.value = 200 - commentValue.value.length
  if (commentValueNumber.value === 0) {
    commentValueNumber.value === 0
  }
}

onMounted(() => {
  commentCharacterCalculater()
})

watchEffect(() => {
  commentCharacterCalculater()
})

async function fetchBookingDeskById(id: string) {
  useBooking.getSingleBookingDesk(id)
}

function convertToAPIFormat(date: any) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}T00:00:00.000Z`;
}
const date = ref([new Date(), new Date(new Date().setDate(new Date().getDate() + 7))]);

async function addABook() {
  const [startDate, endDate] = date.value;
  const startApiDate = convertToAPIFormat(startDate);
  const endApiDate = convertToAPIFormat(endDate);

  useBooking.bookADesk(startApiDate, endApiDate, selectedDesk.value);
  await useBooking.getSingleBookingDesk(selectedDesk.value)
  await useBooking.bookingList()
  await fetchBookingDeskById(selectedDesk.value)
  setTimeout(() => {
    useBooking.bookRequestErrorMessage = ''
  }, 2000)
}

async function fetchFixRequest() {
  await useBooking.fixRequest(selectedDesk.value)
  setTimeout(() => {
    useBooking.bookRequestErrorMessage = ''
  }, 1500)
}

const errorMessage = ref<string>('')
async function fetchCreateComment() {
  await commentStore.createComment(commentValue.value)
  await commentStore.getCommentsByDeskId(selectedDesk.value)
  errorMessage.value = commentStore.commentError
  commentValue.value = ''
  setTimeout(() => {
    errorMessage.value = ''
  }, 2000)
}

</script>
<template>
  <div class="w-full border-[1px] pl-3 sm:w-full md:w-1/3 bg-gray-900 pt-3 pr-3 flex flex-col border-gray-600">
    <div class="flex mt-2 flex-col">
      <h1 class="text-white">Comment</h1>
      <div class="w-full relative">
        <textarea
          class="border-[1px] w-full bg-transparent mt-2 h-[150px] mb-5 pl-3 text-white focus:placeholder:text-yellow-400 outline-none focus:border-yellow-400"
          type="text" maxlength="200" placeholder="write a comment for this desk" v-model="commentValue"
          @input="commentCharacterCalculater()"></textarea>
        <p class="absolute right-0 mb-7 mr-2 bottom-0 text-white">max character 200 / <span class="text-green-400">{{
          commentValueNumber }}</span></p>
      </div>
      <div class="flex justify-center">
        <VButton @click="fetchCreateComment()">Comment</VButton>
      </div>
    </div>
    <p class="text-white text-center font-bold mt-5">Add a Book</p>
    <div class="flex flex-col justify-between p-2 gap-3">
      <VueDatePicker v-model="date" range />
      <div class="flex justify-center">
        <VButton @click="addABook()">Approve Reservation</VButton>
      </div>
      <div class="flex justify-center">
        <VButton @click="fetchFixRequest()">Fix Request</VButton>
      </div>
      <div v-if="useBooking.bookRequestErrorMessage"
        class="border-[1px] h-[80px] mt-5 just shadow-md shadow-black border-gray-500 flex items-center gap-2 rounded-lg">
        <div class="bg-yellow-500 h-[80px] w-[30px] rounded-l-lg"></div>
        <ul class="text-red-500">
          {{ useBooking.bookRequestErrorMessage }}
        </ul>
      </div>
      <div v-if="errorMessage"
        class="border-[1px] h-[80px] mt-5 just shadow-md shadow-black border-gray-500 flex items-center gap-2 rounded-lg">
        <div class="bg-yellow-500 h-[80px] w-[30px] rounded-l-lg"></div>
        <p class="text-red-500">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>