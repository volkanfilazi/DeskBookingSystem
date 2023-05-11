<script setup lang="ts">
import AddABook from '../components/booking/AddABook.vue'
import DeskBookList from '../components/booking/DeskBookList.vue'
import { useDesksStore } from '../store/desks.store'
import { useBookingStore } from '../store/booking.store'
import BookingInfos from '../components/booking/BookingInfos.vue'
import { useCommentStore } from '../store/comment.store'
import { useStorage } from '@vueuse/core'
import { onBeforeUnmount, onMounted } from 'vue'

const selectedDesk = useStorage("selectedDesk", "")
const useDeskStore = useDesksStore()
const bookingStore = useBookingStore()
const commentStore = useCommentStore()

onBeforeUnmount(async () => {
  await bookingStore.getSingleBookingDesk(selectedDesk.value)
  await commentStore.getCommentsByDeskId(selectedDesk.value)
  bookingStore.resetState()
  commentStore.resetState()
})

onMounted(async () => {
  await useDeskStore.getDeskById()
  await bookingStore.getSingleBookingDesk(selectedDesk.value)
  await commentStore.getCommentsByDeskId(selectedDesk.value)
})

</script>

<template>
  <div class="flex flex-col sm:flex-col md:flex-row lg:flex-row w-full gap-2 pl-2 pr-2 mt-5">
    <BookingInfos />
    <DeskBookList></DeskBookList>
    <AddABook></AddABook>
  </div>
</template>