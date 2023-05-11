<script setup lang="ts">
import { promiseTimeout, useStorage } from '@vueuse/core'
import { ref, watchEffect, onUnmounted } from 'vue';
import { useOfficeStore } from '../../store/office.store'
import { useAdminStore } from '../../store/admin.store'
import { useEnumStore } from '../../store/enum.store'
import { useDesksStore } from '../../store/desks.store'
import { Icon } from '@iconify/vue';
import VModal from '../../components/base/V-Modal.vue'
import { useRouter } from 'vue-router';
import VIcon from '../../components/base/V-Icon.vue'
import VButton from '../../components/base/V-Button.vue'
import VInput from '../../components/base/V-Input.vue'
import VRemoveConfirm from '../../components/base/V-RemoveConfirmAlert.vue'

const adminSelectedOffice = useStorage("adminSelectedOffice", "")

const useAdmin = useAdminStore()
const useDesks = useDesksStore()
const useOffice = useOfficeStore()
const useEquipments = useEnumStore()
const router = useRouter()

async function fetchEquipments() {
  await useEquipments.getEquipments()
}

fetchEquipments()

const label = ref<any>('')
const equipment = ref<any>([])
const popupRemoveToogle = ref(false)
const editLabel = ref<string>('')
const editEquipment = ref<any>([])
const selectedEditItem = ref<string>('')
const selectedRemoveItem= ref<string>('')
const editLabelErrorMessage = ref<string>('')
const editInputErrorMessage = ref<string>('')
const editsuccessMessage = ref<string>('')

const popupEditToogle = ref<boolean>(false)
const editButtonActive = ref<boolean>(false)
const editIsDone = ref<boolean>(false)

const updateName = ref<string>('')


const allDesks = ref<any[]>([])

onUnmounted(() => {
  useAdmin.removeState()
})

async function fetchDesks() {
  await useDesks.getAllDesks()
}

async function fetchGetOfficeById() {
  await useOffice.getOfficeById(adminSelectedOffice.value)
}

async function fetchCreateDesk(id: string) {
  await useAdmin.createDesk({ label: label.value, office: id, equipment: equipment.value })
  await fetchDesks()
}

async function fetchDeleteDesk() {
  await useAdmin.deleteADesk(selectedRemoveItem.value)
  if(useAdmin.deleteBookingErrorMessage === ''){
    setTimeout(() => {
      popupRemoveToogle.value = false
    },1500)
  }
  await fetchDesks()
}

function selectedEditElement(id: string) {
  selectedEditItem.value = id  
  popupEditToogle.value = true
}

function selectedRemoveElement(id: string) {
  selectedRemoveItem.value = id
  popupRemoveToogle.value = true
}

async function fetchEditDesk() {
  editLabelErrorMessage.value = ''
  editInputErrorMessage.value = ''
  editsuccessMessage.value = ''
  if (!editLabel.value || editEquipment.value.length === 0) {
    if (!editLabel.value) {
      editLabelErrorMessage.value = "Please type a correct label"
    }
    if (editEquipment.value.length === 0) {
      editInputErrorMessage.value = "Please select at least 1 equipment"
    }
  } else {
    await useAdmin.updateDesk(selectedEditItem.value, { label: editLabel.value, office: adminSelectedOffice.value, equipment: editEquipment.value })
    editsuccessMessage.value = "Desk has been successfully updated"
    editLabel.value = ''
    editEquipment.value = []
    fetchDesks()
    setTimeout(() => {
      editsuccessMessage.value = ""
      popupEditToogle.value = false
    },1500)
  }
}
const deleteToogle = ref<boolean>(false)
async function fetchDeleteOffice() {
  deleteToogle.value = true
  await useAdmin.deleteOffice(adminSelectedOffice.value)
  await promiseTimeout(2000)
  router.push({ name: 'adminPage' });
  deleteToogle.value = false
}

async function fetchUpdateOffice() {
  await useAdmin.updateOffice(adminSelectedOffice.value, updateName.value)
}
const selectedDeskId = ref<string>('')
function alertCloseButton() {
  selectedDeskId.value = ''
  popupRemoveToogle.value = false
}

function popupCloseButton() {
  editLabelErrorMessage.value = ''
  editInputErrorMessage.value = ''
  editsuccessMessage.value = ''
  popupEditToogle.value = false
}
function editButton() {
  editButtonActive.value = true
  editIsDone.value = true
}

function editButtonOff() {
  editButtonActive.value = false
  editIsDone.value = false
}

if (adminSelectedOffice) {
  fetchDesks()
  fetchGetOfficeById()
}
const searchDesk = ref<string>('')

watchEffect(() => {
  useDesks.adminDesksSearch(searchDesk.value)
  if (useDesks.searchDeskArray) {
    allDesks.value = useDesks.searchDeskArray
  } else {
    allDesks.value = useDesks.adminPanelDesks
  }
  useOffice.getColumn
  useOffice.getRow
})

</script>
<template>
  <div class="flex flex-col sm:flex-col md:flex-row lg:flex-row w-full gap-2">
    <div class="flex flex-col bg-gray-900 gap-10 p-5 items-center">
      <div class="flex flex-col w-full gap-2">
        <p class="text-2xl text-center mt-5 p-1 text-white">Maximum Capacity : {{ useOffice.areaCalculater }} </p>
        <h1 class="text-center text-white mt-5 bg-gray-600">Create Desk</h1>
        <VInput typeValue="string" placeValue="name" v-model="label"></VInput>
        <div v-for="equi in useEquipments.equipments">
          <div class="flex justify-between">
            <label class="text-white" :for="'eq-' + equi">{{ equi }}</label>
            <input type="checkbox" :id="'eq-' + equi" :value="equi" v-model="equipment">
          </div>
        </div>
        <div class="flex justify-center">
          <VButton @click="fetchCreateDesk(adminSelectedOffice)">Create new
            Desk</VButton>
        </div>
        <div v-if="useAdmin.createDeskErrorMessage"
          class="border-[1px] border-gray-500 max-w-[280px] flex items-center gap-2 rounded-lg">
          <div class="bg-yellow-500 h-[60px] w-[30px] rounded-l-lg"></div>
          <ul class="text-red-500">
            <li>{{ useAdmin.createDeskErrorMessage }}</li>
          </ul>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <h1 class="text-white text-center bg-gray-600">Update Office Name</h1>
        <VInput typeValue="string" placeValue="update name" v-model="updateName"></VInput>
        <div class="flex justify-center">
          <VButton @click="fetchUpdateOffice()">Update Office Name</VButton>
        </div>
        <div v-if="useAdmin.updateOfficeNameErrorMessage"
          class="border-[1px] border-gray-500 max-w-[280px] flex items-center gap-2 rounded-lg">
          <div class="bg-yellow-500 h-[60px] w-[30px] rounded-l-lg"></div>
          <ul class="text-red-500">
            <li>{{ useAdmin.updateOfficeNameErrorMessage }}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class=" min-h-[750px] w-full p-1">
      <div>
        <div class="flex flex-col items-center mt-3 sm:flex-col md:flex-row lg:flex-row gap-2 w-full">
          <div class="relative w-full">
            <input
              class=" outline-none focus:border-yellow-300 text-white focus:placeholder:text-yellow-300 pl-10 bg-transparent w-full border-[1px] border-white rounded-md p-1"
              v-model="searchDesk" placeholder="Find a desk from desk label..." type="search">
            <span class="absolute top-1 left-2">
              <Icon icon="material-symbols:zoom-out-rounded" color="white" width="28" height="28" />
            </span>
          </div>
          <div class="flex items-center gap-2">
            <VButton v-if="!editIsDone" @click="editButton()">Edit Desk</VButton>
            <VButton v-if="editIsDone" @click="editButtonOff()">Done</VButton>
            <div class="relative">
              <VButton @click="fetchDeleteOffice()">Delete Office</VButton>
            </div>
          </div>
        </div>
        <div class="flex w-full mt-3">
          <div class="grid w-full border-[1px] min-h-[200px] p-1 gap-2"
            :style="{ gridTemplateColumns: `repeat(${useOffice.getColumn}, 1fr)`, gridTemplateRows: `repeat(${useOffice.getRow}, 1fr)` }">
            <div class="">
              <p class="text-red-500 bg-gray-900 text-center" v-if="!allDesks.length">There is nothing to show</p>
            </div>
            <div v-for="desk in allDesks" :key="desk.id"
              class="card w-full lg:min-h-[250px] p-2 rounded-lg relative text-white"
              :class="{ 'bg-green-800': !desk.nextBooking, 'bg-orange-600': desk.fixdesk, 'bg-blue-500': desk.nextBooking }"
              :style="{ gridColumn: (desk.column + 1) + ' / span 1', gridRow: (desk.row + 1) + ' / span 1' }">
              <div v-if="editButtonActive" class="flex items-center justify-end gap-2 p-1">
                <VIcon @click="selectedEditElement(desk.id)"></VIcon>
                <Icon class="mt-1 cursor-pointer" @click="selectedRemoveElement(desk.id)" icon="ic:baseline-delete" color="gray"
                  width="20" height="20" />
              </div>
              <p>desk name : {{ desk.label }}</p>
              <p>row : {{ desk.row +1}}</p>
              <p>col : {{ desk.column +1}}</p>
              <p>equipments : {{ desk.equipment}}</p>
              <div class="flex justify-center mb-10">
                <Icon icon="material-symbols:keyboard" color="white" width="50px" height="50px" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <VRemoveConfirm :open="popupRemoveToogle" @close="alertCloseButton()">
        <div class="flex flex-col text-yellow-400 mt-5 items-center">
          <h3>Are you sure you want to delete this reservation? </h3>
          <div v-if="selectedRemoveItem" class="flex mt-10 gap-2">
            <div class="flex justify-center">
              <VButton @click="fetchDeleteDesk()">Confirm</VButton>
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
    <VModal :open="popupEditToogle" @close="popupCloseButton()">
      <template #default>
        <div class="flex flex-col">
          <h1 class="text-center text-white">Desk Update</h1>
          <VInput typeValue="string" placeValue="Input your label" v-model="editLabel"></VInput>
          <div v-for="equi in useEquipments.equipments">
            <div class="flex justify-between">
              <label class="text-white" :for="'equ-' + equi">{{ equi }}</label>
              <input type="checkbox" :id="'equ-' + equi" :value="equi" v-model="editEquipment">
            </div>
          </div>
          <button
            class="bg-transparent border-[1px] mt-5 hover:bg-yellow-400 transition-all ease-in duration-200 hover:text-black p-1 rounded-lg text-yellow-400"
            @click="fetchEditDesk()">Update</button>
          <div v-if="editLabelErrorMessage || editInputErrorMessage"
            class="border-[1px] border-gray-500 mt-3 flex items-center gap-2 rounded-lg p-1">
            <ul class="text-red-500">
              <li class="p-1">{{ editLabelErrorMessage }}</li>
              <li class="p-1">{{ editInputErrorMessage }}</li>
            </ul>
          </div>
          <div v-else>
            <ul class="text-green-500">
              <li class="p-1">{{ editsuccessMessage }}</li>
            </ul>
          </div>
        </div>
      </template>
    </VModal>
  </div>
</template>