import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import {ref} from 'vue'
import { CommentResponse } from '../interface/comment.interface'
import service from '../composables/http'

export const useCommentStore = defineStore('comment', () => {
    const selectedDesk = useStorage("selectedDesk", "") 
    const deskComments = ref<CommentResponse[]>([])
    const allComments = ref<CommentResponse[]>([])
    const oneComment = ref<CommentResponse>()
    const commentError = ref<string>('')
    const commentUpdateErrorMessage = ref<string>('')

    async function createComment(comment:string){
        try {
            const response = await service.post<CommentResponse>(`comments`,{
                comment,
                desk: selectedDesk.value
            })
            commentError.value = "Your message is successfully shared :)"
            return response.data
        } catch (error:any) {
          commentError.value = error.data.message
        }
    }

    async function getCommentsByDeskId(id:string){
        try {
            const response = await service.get<CommentResponse[]>(`comments/desk/${id}?page=${0}`)
            deskComments.value = response.data
            
            return response.data
        } catch (error) {
        }
    }

    async function getComments(){
      try {
          const response = await service.get<CommentResponse[]>(`comments?page=${0}`)
          allComments.value = response.data
          
          return response.data
      } catch (error:any) {
       
      }
  }

  async function updateComment(id: string, comment:string){
    try {
      const response = await service.put<CommentResponse[]>(`comments/${id}`,{
        comment,
        desk: selectedDesk.value
      })
      commentUpdateErrorMessage.value = 'Your message has been successfuly changed!'
      return response.data
    } catch (error:any) {
      commentUpdateErrorMessage.value = error.data.message
    }
  }
  async function deleteComment(id: string){
    try {
      const response = await service.delete(`comments/${id}`)
      commentUpdateErrorMessage.value = 'Your message has been successfuly removed!'
      return response.data
    } catch (error:any) {
      commentUpdateErrorMessage.value = error.data.message
    }
  }

  async function getOneComment(id: string){
    try {
      const response = await service.get<CommentResponse>(`comments/one/${id}`)
      oneComment.value = response.data
      return response.data
    } catch (error) {
    }
  }


  function formatComment(comment:string) {
    let result ='';
    for (let i = 0; i < comment.length; i += 70) {
      const substring = comment.substr(i, 70);
      result += substring + '\n';
    }
    return result;
  }
  
    function resetState(){
        deskComments.value = []
        commentError.value = ''
    }

    return {
        createComment,
        getCommentsByDeskId,
        deskComments,
        resetState,
        getComments,
        allComments,
        commentError,
        updateComment,
        commentUpdateErrorMessage,
        deleteComment,
        getOneComment,
        oneComment,
        formatComment
    }
})