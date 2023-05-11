<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useCommentStore } from '../../store/comment.store';
import { truncate } from 'lodash'
import VModal from '../base/V-Modal.vue'
import VButton from '../base/V-Button.vue'

const useComment = useCommentStore()
const commentToogle = ref(false)
const selectedEditItem = ref<string>('')

async function selectedEditElement(id: string) {
  useComment.commentUpdateErrorMessage = ''
  selectedEditItem.value = id
  commentToogle.value = true
  await useComment.getOneComment(selectedEditItem.value)  
}

function popupCloseButton() {
  commentToogle.value = false
  useComment.commentUpdateErrorMessage = ''
}

async function fetchDeleteComment() {
  await useComment.deleteComment(selectedEditItem.value)
  await useComment.getComments()
  setTimeout(() => {
    commentToogle.value = false
  },1500)
}

onMounted(async () => {
  await useComment.getComments()
})

</script>
<template>
  <div class="mt-3 flex flex-col md:p-5 min-h-[200px] bg-gray-900 rounded-md">
    <h1 class="text-white text-2xl font-bold  text-center">User Comment List</h1>
    <div class="flex flex-wrap gap-2 items-center max-h-[500px] overflow-auto justify-center mt-5">
      <div class="w-full sm:w-full md:w-[280px] flex flex-wrap text-gray-400 cursor-pointer" v-for="request in useComment.allComments" :key="request.id">
        <div
          class="border-dotted w-full sm:w-full md:w-[280px] flex flex-col border-[1px] h-[100px] hover:border-yellow-400 border-gray-400 rounded-md p-2" @click="selectedEditElement(request.id)" >
          <p class="text-yellow-400">{{ request.user.firstname }}</p>
          <p>{{ truncate(request.comment, { length: 30 }) }}</p>
        </div>
      </div>
      <div v-if="useComment.allComments.length <= 0">
        <p class="text-yellow-400">There is no Comments</p>
      </div>
    </div>
  </div>
  <VModal :open="commentToogle" @close="popupCloseButton()">
    <template #default>
      <div class="flex flex-col">
        <h1 class="text-center text-white">Comment Details</h1>
        <div class="mt-2">
          <p>{{ useComment.oneComment?.user.firstname }} <span>{{ useComment.oneComment?.user.lastname }}</span></p>
          <p>{{ useComment.oneComment?.desk.label }}</p>
          <p>{{ useComment.oneComment?.user.department }}</p>
          <p>{{ useComment.oneComment?.desk.id }}</p>
          <p class="max-w-[300px] overflow-auto" v-if="useComment.allComments.length">{{ useComment.oneComment?.comment }}</p>
        </div>
        <div class="flex items-center justify-center mt-5">
          <VButton @click="fetchDeleteComment()">Delete</VButton>
        </div>
        <div v-if="useComment.commentUpdateErrorMessage" class="mt-3 flex items-center gap-2 rounded-lg">
          <div class="bg-yellow-500 h-full w-[30px] rounded-l-lg"></div>
          <ul class="text-green-500">
            <li>{{ useComment.commentUpdateErrorMessage }}</li>
          </ul>
        </div>
      </div>
    </template>
  </VModal>
</template>

