<script setup lang="ts">
import { useAdminStore } from '../../store/admin.store';
import { Status } from '../../interface/fixRequest.interface'
import { useDesksStore } from '../../store/desks.store';
import VButton from '../../components/base/V-Button.vue'
import { onMounted } from 'vue';

const useDesk = useDesksStore()
const useAdmin = useAdminStore()

async function fetchDecideFixRequest(id: string, status: Status) {
  await useAdmin.decideFixDeskRequests(id, status)
  await useDesk.getAllDesks()
  await useAdmin.fixDeskRequests()
}

async function fetchDeleteFixRequest(id: string) {
  await useAdmin.deleteFixDeskRequest(id)
  await useDesk.getAllDesks()
  await useAdmin.fixDeskRequests()
}

onMounted(async () => {
  await useAdmin.fixDeskRequests()
})

</script>
<template>
  <div class="p-5 mt-3 flex flex-col min-h-[200px] bg-gray-900 rounded-md">
    <h1 class="text-white text-2xl font-bold text-center">Fix Desk Requests</h1>
    <div class="flex flex-wrap gap-2 max-h-[500px] overflow-auto items-center justify-center mt-5">
      <div class="w-[280px] m-w-[200px] text-gray-400 ml-5" v-for="request in useAdmin.requests">
        <div class="border-dotted border-[1px] min-h-[400px] border-gray-400 rounded-md p-2">
          <p>Name: {{ request.user.firstname }} <span>{{ request.user.lastname }}</span></p>
          <p :class="[{'text-red-500': request.status != Status.Approved},{'text-green-500': request.status === Status.Approved}]">Status: {{ request.status }}</p>
          <p>id: {{ request.desk.id }}</p>
          <p>Office: {{ request.desk.office.name }}</p>
          <p>Label: {{ request.desk.label }}</p>
          <p>Type: {{ request.desk.type }}</p>
          <p>Department: {{ request.user.department }}</p>
          <div class="w-full flex flex-col justify-center mt-5 gap-5">
            <div class="flex justify-center">
              <VButton v-if="request.status != Status.Approved" @click="fetchDecideFixRequest(request.id, Status.Approved)">Approve</VButton>
            </div>
            <div class="flex justify-center">
              <VButton @click="fetchDecideFixRequest(request.id, Status.Rejected)">Reject</VButton>
            </div>
            <div class="flex justify-center">
              <VButton @click="fetchDeleteFixRequest(request.id)">Delete</VButton>
            </div>
          </div>
        </div>
      </div>
      <div v-if="useAdmin.requests.length <= 0">
        <p class="text-yellow-400">There is no fix request</p>
      </div>
    </div>
  </div>
</template>