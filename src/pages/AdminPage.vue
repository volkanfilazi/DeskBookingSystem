<script setup lang="ts">
import ShowAllOffices from '../components/admin/AdminOfficeList.vue'
import AdminBookingList from '../components/admin/AdminBookingList.vue'
import AdminFixRequests from '../components/admin/AdminFixRequests.vue';
import AdminCommentList from '../components/admin/AdminCommentList.vue';
import AdminGeneralStatistics from '../components/admin/AdminGeneralStatistics.vue';
import { useUserStore } from '../store/user.store';
import { onMounted, onUnmounted } from 'vue';
import { useCommentStore } from '../store/comment.store';

const userStore = useUserStore()
const commentStore = useCommentStore()
onUnmounted(async () => {
  await userStore.getUsers()
  await commentStore.getComments()
}),
onMounted(async () => {
  await userStore.getUsers()
  await commentStore.getComments()
})

</script>
<template>
  <div class="flex flex-col sm:flex-col md:flex-col lg:flex-row xl:flex-row w-full gap-2">
    <div class="flex w-full h-full sm:w-full md:w-full lg:w-1/6 shadow-lg lg:min-h-[1000px] shadow-black bg-gray-900">
      <AdminGeneralStatistics></AdminGeneralStatistics>
    </div>
    <div class="mt-3 w-full sm:w-full lg:w-4/6 md:w-full">
      <AdminBookingList></AdminBookingList>
      <AdminFixRequests></AdminFixRequests>
      <AdminCommentList></AdminCommentList>
    </div>
    <div class="bg-gray-900 h-full w-full sm:w-full md:w-full lg:w-1/6 lg:min-h-[1000px] flex flex-col shadow-lg shadow-black items-center">
      <ShowAllOffices></ShowAllOffices>
    </div>
  </div>
</template>