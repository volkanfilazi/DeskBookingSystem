<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Department } from '../../interface/user.interface';
import { useUserStore } from '../../store/user.store';
import VModal from '../../components/base/V-Modal.vue'
import VButton from '../../components/base/V-Button.vue'
import VInput from '../../components/base/V-Input.vue'
import { useDateFormat } from '@vueuse/shared';

const userStore = useUserStore()
const popupEditToogle = ref<boolean>(false)
const firstname = ref<string>('')
const lastname = ref<string>('')
const email = ref<string>('')
const password = ref<string>('')
const selected = ref("");
const departmentValue = ref<Department>()

function inputCreater() {
  firstname.value = userStore.userProfile?.firstname || ''
  lastname.value = userStore.userProfile?.lastname || ''
  email.value = userStore.userProfile?.email || ''
  departmentValue.value = userStore.userProfile?.department!
}

async function popupCloseButton() {
  popupEditToogle.value = false
  userStore.updateError = ''
  await userStore.getUserProfile()
  inputCreater()
}

async function popupOpenButton() {
  popupEditToogle.value = true
}

onMounted(async () => {
  inputCreater()
})

async function fetchUpdateProfile(id: string) {
  if (selected.value === "CodingSchool") {
    departmentValue.value = Department.CodingSchool
  } else if (selected.value === "Diamir") {
    departmentValue.value = Department.Diamir
  }
  else if (selected.value === "Diamir") {
    departmentValue.value = Department.Diamir
  }
  else if (selected.value === "WebundSoehne") {
    departmentValue.value = Department.WebundSoehne
  }
  else if (selected.value === "DarwinsLab") {
    departmentValue.value = Department.DarwinsLab
  }
  else if (selected.value === "DeepDive") {
    departmentValue.value = Department.DeepDive
  } else {
    departmentValue.value = Department.TailoredApps
  }
  const response = await userStore.updateProfile(id, firstname.value, lastname.value, email.value, departmentValue.value, password.value)

  await userStore.getUserProfile()
  if (response) {
    userStore.updateError = ''
    setTimeout(() => {
      userStore.updateSuccess = ''
      popupEditToogle.value = false
    }, 1500)
  }
}

</script>
<template>
  <div class="flex justify-center w-full gap-2 items-center flex-col  text-white">
    <div class="bg-gray-900 p-5 flex gap-2 flex-col rounded-md shadow-md shadow-black">
      <p>Firstname: {{ userStore.userProfile?.firstname }}</p>
      <p>Lastname: {{ userStore.userProfile?.lastname }}</p>
      <p>Admin: {{ userStore.userProfile?.isAdmin }}</p>
      <p>Email: {{ userStore.userProfile?.email }}</p>
      <p>Departmant: {{ userStore.userProfile?.department }}</p>
      <p>Created At: {{ useDateFormat(userStore.userProfile?.createdAt, 'DD/MM/YYYY HH:mm').value }}</p>
      <div class="flex items-center justify-center">
        <VButton @click="popupOpenButton()">Update</VButton>
      </div>
    </div>
  </div>
  <VModal :open="popupEditToogle" @close="popupCloseButton()">
    <template #default>
      <div class="flex flex-col gap-1 justify-center items-center">
        <div>
          <label class="block text-white" for="firstname">firstname</label>
          <VInput placeValue="volkan" typeValue="string" v-model="firstname"></VInput>
        </div>
        <div>
          <VInput placeValue="filazi" typeValue="string" v-model="lastname"></VInput>
        </div>
        <div>
          <label class="block text-white" for="email">email</label>
          <VInput placeValue="volkanfilazi@example.com" typeValue="string" v-model="email"></VInput>
        </div>
        <div>
          <label class="block text-white" for="password">password</label>
          <VInput placeValue="password" typeValue="string" v-model="password"></VInput>
        </div>
        <select class="bg-gray-500 text-white border mt-5 border-yellow-300" v-model="selected">
          <option disabled value="">{{ departmentValue }}</option>
          <option v-for="dept in Department" :value="dept">{{ dept }}</option>
        </select>
      </div>
      <div class="flex justify-center items-center mt-5">
        <VButton @click="fetchUpdateProfile(userStore.userProfile?.id!)">Update</VButton>
      </div>
      <div v-if="userStore.updateError" class="h-full w-full flex justify-center mt-5 items-center">
        <div class="border-[1px] shadow-lg shadow-black border-gray-500 flex items-center gap-2 rounded-lg">
          <div class="flex flex-col p-2">
            <div class="flex flex-col" v-for="error in userStore.updateError">
              <p class="text-red-500">- {{ error }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="border-[1px] shadow-md shadow-black border-gray-500 flex items-center gap-2 rounded-lg p-2 mt-5 mb-5"
        v-if="userStore.updateSuccess">
        <p class="text-green-500 text-center">{{ userStore.updateSuccess }}</p>
      </div>
    </template>
  </VModal>
</template>