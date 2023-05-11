<script setup lang="ts">
import { useDesksStore } from '../../store/desks.store'
import { useCommentStore } from '../../store/comment.store'
import { useFormatStore } from '../../store/dateFormater.store';
import { useUserStore } from '../../store/user.store';
import { useStorage } from '@vueuse/core'
import VIcon from '../../components/base/V-Icon.vue'
import VModal from '../../components/base/V-Modal.vue'
import VButton from '../../components/base/V-Button.vue'
import '@vuepic/vue-datepicker/dist/main.css'
import { onMounted, ref, watchEffect } from 'vue';

const useDeskStore = useDesksStore()
const commentStore = useCommentStore()
const dateFormater = useFormatStore()
const userStore = useUserStore()

const selectedDesk = useStorage("selectedDesk", "")

const selectedEditItem = ref<string>('')
const commentDeleteConfirmToogle = ref<boolean>(false)
const popupEditToogle = ref<boolean>(false)
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


function deleteActive() {
  commentDeleteConfirmToogle.value = true
}
function deleteClose() {
  commentDeleteConfirmToogle.value = false
}

function selectedEditElement(id: string) {
  selectedEditItem.value = id
  popupEditToogle.value = true
}

function popupCloseButton() {
  popupEditToogle.value = false
  commentDeleteConfirmToogle.value = false
  commentStore.commentUpdateErrorMessage = ''
  commentValue.value = ''
}

async function fetchUpdateComment(comment: string) {
  const response = await commentStore.updateComment(selectedEditItem.value, comment)
  await commentStore.getCommentsByDeskId(selectedDesk.value)
  if (response) {
    setTimeout(() => {
      popupEditToogle.value = false
      commentDeleteConfirmToogle.value = false
      commentStore.commentUpdateErrorMessage = ''
      commentValue.value = ''
    }, 1500)
  }
}

async function fetchDeleteComment() {
  await commentStore.deleteComment(selectedEditItem.value)
  await commentStore.getCommentsByDeskId(selectedDesk.value)
  setTimeout(() => {
    commentStore.commentUpdateErrorMessage = ''
    commentValue.value = ''
    popupEditToogle.value = false
  }, 1500)
}

</script>

<template>
  <div v-if="useDeskStore.deskById"
    class="border-[1px] w-full sm:w-full border-gray-600 md:w-1/3 p-2 pt-3 bg-gray-900 pl-5 pr-5 flex flex-col">
    <h1 class="text-white font-bold mt-5">Infos</h1>
    <div class="flex flex-col justify-between">
      <div class="border-[1px] flex flex-col gap-4 p-2 border-gray-600">
        <div class="flex items-center gap-2">
          <p class="text-white">Status : </p>
          <div v-if="useDeskStore.deskById?.fixdesk !== null"
            class="rounded-full w-[20px] h-[20px] pl-2 pr-2 text-transparent pt-1"
            :class="[{ 'bg-red-500': useDeskStore.deskById?.fixdesk, 'bg-green-500': !useDeskStore.deskById?.fixdesk }]">
          </div>
          <div v-else class="rounded-full w-[20px] h-[20px] pl-2 pr-2 text-transparent pt-1" :class="'bg-green-500'">
          </div>
        </div>
        <p class="text-white">Desk Type : <span v-if="useDeskStore.deskById?.fixdesk" class="text-red-500">Fix</span> <span v-if="!useDeskStore.deskById?.fixdesk" class="text-green-500">Flex</span></p>
        <p class="text-white">Office Name : <span class="text-yellow-500">{{ useDeskStore.deskById.office.name
        }}</span>
        </p>
        <p class="text-white">Office Max Capasity : <span class="text-yellow-500">{{
          useDeskStore.deskById.office.columns * useDeskStore.deskById.office.rows }}</span></p>
        <p class="text-white">Desk Position Row : <span class="text-yellow-500">{{ useDeskStore.deskById.row
        }}</span>
        </p>
        <p class="text-white">Desk Position Column : <span class="text-yellow-500">{{ useDeskStore.deskById.column
        }}</span>
        </p>
        <p class="text-white">Equipments : <span class="text-yellow-500">{{ useDeskStore.deskById.equipment
        }}</span>
        </p>
        <p class="text-white">CreatedAt : <span class="text-yellow-500">{{ useDeskStore.deskById.createdAt
        }}</span>
        </p>
        <h3 class="text-white bg-gray-500 text-center">Comments</h3>
        <div v-if="commentStore.deskComments && commentStore.deskComments.length"
          class="border-[1px] max-h-[400px] overflow-auto border-gray-600 space-y-2 p-2">
          <div class="border-dotted border-b-[1px]" v-for="comments in commentStore.deskComments" :key="comments.id">
            <div class="flex justify-between">
              <p v-if="userStore.userProfile?.id != comments.user.id" class="text-yellow-400">{{ comments.user.firstname
              }}</p>
              <div class="flex items-center gap-1">
                <VIcon @click="selectedEditElement(comments.id)" v-if="userStore.userProfile?.id === comments.user.id">
                </VIcon>
                <p v-if="userStore.userProfile?.id === comments.user.id" class="text-yellow-400 mt-1"> Your Comment </p>
              </div>
              <p class="text-yellow-400 text-[15px]">{{ dateFormater.formatDate(comments.commentedAt) }}</p>
            </div>
            <p class="text-white">{{ commentStore.formatComment(comments.comment) }}</p>
          </div>
        </div>
      </div>
      <div class="flex flex-col w-full mt-5">
        <div class="flex gap-2 items-center">
          <div class=" w-[20px] h-[10px] pl-2 pr-2 bg-red-500"></div>
          <p class="text-white">Fix Booked</p>
        </div>
        <div class="flex gap-2 items-center">
          <div class="w-[20px] h-[10px] pl-2 pr-2 bg-green-500">
          </div>
          <p class="text-white">Flex Booked</p>
        </div>
      </div>
    </div>
  </div>
  <VModal :open="popupEditToogle" @close="popupCloseButton()">
    <template #default>
      <div class="flex flex-col">
        <h1 class="text-center text-white">Comment Update</h1>
        <div class="w-full relative">
          <textarea
            class="border-[1px] w-full bg-transparent mt-2 h-[150px] mb-5 pl-3 text-white focus:placeholder:text-yellow-400 outline-none focus:border-yellow-400"
            type="text" maxlength="200" placeholder="write a comment for this desk" v-model="commentValue"
            @input="commentCharacterCalculater()"></textarea>
          <p class="absolute right-0 mb-7 mr-2 bottom-0 text-white">max character <span>{{ commentValueNumber }}</span>
          </p>
        </div>
        <div class="flex justify-center">
          <VButton @click="fetchUpdateComment(commentValue)" class="mt-10">Update</VButton>
        </div>
        <div class="flex justify-center">
          <VButton v-if="!commentDeleteConfirmToogle" class="mt-10" @click="deleteActive()">Delete</VButton>
        </div>
        <div v-if="commentDeleteConfirmToogle" class="gap-1 mt-3 group">
          <div class="flex items-center justify-center gap-3">
            <div class="border-l-[2px] group-hover:border-yellow-400 border-t-[2px] w-[70px] h-[20px]"></div>
            <p class="text-white group-hover:text-yellow-400">Are you sure?</p>
            <div class="border-r-[2px] group-hover:border-yellow-400 border-t-[2px] w-[70px] h-[20px]"></div>
          </div>
          <div class="flex justify-center gap-2 mt-2">
            <VButton @click="fetchDeleteComment()">Confirm</VButton>
            <VButton @click="deleteClose()">Cancel</VButton>
          </div>
        </div>
        <div v-if="commentStore.commentUpdateErrorMessage"
          class="border-[1px] h-[80px] mt-5 just shadow-md shadow-black border-gray-500 flex items-center gap-2 rounded-lg">
          <div class="bg-yellow-500 h-[80px] w-[30px] rounded-l-lg"></div>
          <p class="text-red-500">{{ commentStore.commentUpdateErrorMessage }}</p>
        </div>
      </div>
    </template>
  </VModal>
</template>