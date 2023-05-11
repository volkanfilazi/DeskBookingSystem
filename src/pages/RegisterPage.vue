<script setup lang="ts">
import { onUnmounted, ref } from "vue";
import { useAuthStore } from "../store/auth.store";
import { Department } from "../interface/user.interface";
import VInput from '../components/base/V-Input.vue'
import VButton from '../components/base/V-Button.vue'
import router from "../router/router";

const authStore = useAuthStore();

const firstname = ref<string>("");
const lastname = ref("");
const email = ref("");
const password = ref("");
const selected = ref("");
const departmentValue = ref<Department>()
const successMessage = ref("Your account has been successfully created")
const successToogle = ref(false)

onUnmounted(async () => {
  authStore.resetState()
})

async function fetchRegister() {
  authStore.registerEmailError= ''
  authStore.registerErrorMessage = []
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

  const response = await authStore.register(firstname.value, lastname.value, email.value, departmentValue.value, password.value)
  if (response) {
    firstname.value = ''
    lastname.value = ''
    email.value = ''
    password.value = ''
    authStore.registerErrorMessage = []
    setTimeout(() => {
      successToogle.value = true
    },2000)
  }
}

function NavigateToLogin() {
  setTimeout(() => {
    router.push({ name: 'loginPage' })
    successToogle.value = false
  },2000)
}

</script>

<template>
  <div class="flex flex-col justify-center items-center">
    <div v-if="!successToogle"
      class="flex flex-col items-center justify-center bg-gray-900 hover:border-yellow-400 shadow-sm shadow-yellow-400 group border-[1px] p-10">
      <h3 class="text-white text-lg font-bold mb-5 group-hover:text-yellow-400">Register</h3>
      <div>
        <label class="block text-white" for="firstname">Firstname</label>
        <VInput placeValue="volkan" type-value="string" id="firstname" v-model="firstname"></VInput>
      </div>
      <div>
        <label class="block text-white" for="lastname">Lastname</label>
        <VInput placeValue="filazi" type-value="string" id="lastname" v-model="lastname"></VInput>
      </div>
      <div>
        <label class="block text-white" for="email">Email</label>
        <VInput placeValue="example@example.com" type-value="string" id="email" v-model="email"></VInput>
      </div>
      <div>
        <label class="block text-white" for="password">Password</label>
        <VInput placeValue="*******" type-value="password" v-model="password"></VInput>
      </div>
      <select class="bg-gray-500 text-white border border-yellow-300" v-model="selected">
        <option disabled value="">Please select one</option>
        <option v-for="dept in Department" :value="dept">{{ dept }}</option>
      </select>
      <VButton class="mt-5" @click="fetchRegister()">Register</VButton>
      <div v-if="authStore.registerErrorMessage.length > 0" class="border-[1px] p-2 mt-5">
        <div v-for="registerError in authStore.registerErrorMessage">
          <p class="text-red-500">{{ registerError }}</p>
        </div>
      </div>
      <div class="text-red-500">
        {{ authStore.registerEmailError }}
      </div>
      <div class="text-green-500" v-if="authStore.registerSuccessMessage">{{ authStore.registerSuccessMessage }}</div>
    </div>
    <div v-if="successToogle" class="text-green-400 flex flex-col gap-2 border-[1px] p-5 rounded-lg bg-gray-900">
      <div>{{ successMessage }}</div>
      <VButton @click="NavigateToLogin()">go to Login</VButton>
    </div>
  </div>
</template>