<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../store/auth.store";
import { useUserStore } from "../store/user.store";
import VButton from '../components/base/V-Button.vue'
import VInput from '../components/base/V-Input.vue'
import VCheckbox from '../components/base/V-Checkbox.vue'
import { useStorage } from "@vueuse/core";


const authStore = useAuthStore();
const userStore = useUserStore()
const router = useRouter();
const route = useRoute()

const email = ref("");
const password = ref("");
const loginTootle = ref<boolean>(false)
const checked = ref(false)

const savedEmail = useStorage("email", "")
const savedPassword = useStorage("password", "")
const response = ref()

onMounted(() => {
  if (checked.value === true) {
    email.value = savedEmail.value
    password.value = savedPassword.value
  }
})

useStorage("check", checked)

function NavigateToAdmin() {
  if (route.query.redirect) {
    router.push({ path: route.query.redirect as string })
  } else {
    router.push({ name: 'adminPage' });
  }
}

function NavigateToOffice() {
  if (route.query.redirect)
    router.push({ path: route.query.redirect as string })
  else
    router.push({ name: 'officesPage', });
}

const minValue = ref(5)
const errorMessage = ref('')
const emailErrorMessage = ref('')
const emailSuccess = ref(false)
const passwordSuccess = ref(false)

function passwordLiveValidation() {
  if (password.value?.length < minValue.value) {
    errorMessage.value = 'Password must have min 5 charakter'
    passwordSuccess.value = false
  } else {
    passwordSuccess.value = true
  }
}

function emailLiveValidation() {
  if (!email.value.includes('@') || !email.value.includes('.')) {
    emailErrorMessage.value = 'Email must have @ and .'
    emailSuccess.value = false
  } else {
    emailSuccess.value = true
  }
}

async function fetchLogin() {
  loginTootle.value = true
  passwordLiveValidation()
  emailLiveValidation()
  if (passwordSuccess.value && emailSuccess.value) {
    response.value = await authStore.logIn({ email: email.value, password: password.value })
  }
  if (response.value) {
    await userStore.getUserProfile()
    if (userStore.userProfile) {
      if (userStore.userProfile?.isAdmin)
        NavigateToAdmin()
      if (!userStore.userProfile?.isAdmin)
        NavigateToOffice()
    }
  }
  rememberMe()
}

function rememberMe() {
  if (checked.value) {
    savedEmail.value = email.value
    savedPassword.value = password.value
  } else {
    savedEmail.value = ''
    savedPassword.value = ''
  }
}

function NavigateToRegister() {
  router.push({ name: 'registerPage' })
}

</script>
<template>
  <div class="flex flex-col justify-center items-center">
    <div
      class="flex flex-col items-center justify-center bg-gray-900 border-[1px] group hover:border-yellow-400 shadow-sm shadow-yellow-400 p-10">
      <div class="w-full flex flex-col">
        <h1 class="text-white py-2 font-bold group-hover:text-yellow-400 text-2xl">Login</h1>
        <label class="block text-white" for="email">Email</label>
        <VInput placeValue="example@example.com" type-value="string" @input="emailLiveValidation" v-model="email">
        </VInput>
      </div>
      <div class="w-full flex flex-col">
        <label class="block text-white" for="password">Password</label>
        <VInput placeValue="***********" type-value="password" v-model="password" :class="{'border-red-500': errorMessage}" @input="passwordLiveValidation"
          :minlength="minValue"></VInput>
      </div>
      <div class="flex justify-start items-center gap-1 w-full pl-1">
        <VCheckbox class="cursor-pointer" :open="checked" @click="checked = !checked"></VCheckbox>
        <h3 @click="checked = !checked" class="text-[14px] cursor-pointer">Remember me</h3>
      </div>
      <div class="flex flex-col gap-5 mt-5">
        <VButton @click="fetchLogin()">Login</VButton>
        <h3>Don't have an account? <span @click="NavigateToRegister()" class="text-yellow-400 cursor-pointer">Sign
            up</span></h3>
      </div>
      <div class="mt-5">
        <div class="flex items-center" :class="[{'text-red-500': !passwordSuccess},{'text-green-500': passwordSuccess}]" >
          <p class="error-message">{{ errorMessage }}</p>
        </div>
        <div class="flex items-center" :class="[{'text-red-500': !emailSuccess},{'text-green-500': emailSuccess}]">
            <p class="email-error-message">{{ emailErrorMessage }}</p>
        </div>
        <p v-if="authStore.loginErrorMessage" style="color: red;">{{ authStore.loginErrorMessage }}</p>
      </div>
    </div>

  </div>
</template>
    
