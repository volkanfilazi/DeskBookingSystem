<script setup lang="ts">
import { promiseTimeout, useStorage } from '@vueuse/core';
import { ref } from 'vue';
import VButton from '../components/base/V-Button.vue'
import router from '../router/router';
import { useUserStore } from '../store/user.store';

const refreshToken = useStorage("refreshToken", "")
const accessToken = useStorage("saveToken", "")
const userId = useStorage("userId","")
const userStore = useUserStore()
const logoutToogle = ref(false)
const logoutSuccessToogle = ref(false)
const count = ref(3)

function counter() {
    logoutToogle.value = true;

    const timer = setInterval(async () => {
        count.value--

        if (count.value == 0) {
            clearInterval(timer);
            await promiseTimeout(500)
            logoutSuccessToogle.value = true
            logOut()
        }
    }, 1000);
}

function logOut() {
    userId.value = undefined
    refreshToken.value = undefined
    accessToken.value = undefined
    userStore.userProfile = undefined
    router.push({ name: 'loginPage' })
}

function goToHome() {
    router.push({ name: 'homePage' })
}

</script>

<template>
    <div class="flex justify-center items-center">
        <div class="border-[1px] flex flex-col p-10 items-center justify-center gap-10 rounded-xl h-[300px]">
            <h3 v-if="!logoutSuccessToogle">Are you sure you want to logout?</h3>
            <div class="flex flex-col sm:flex-col md:flex-row gap-2">
                <VButton v-if="!logoutToogle" @click="goToHome()">Cancel</VButton>
                <VButton v-if="!logoutSuccessToogle" @click="counter()">Logout</VButton>
            </div>
            <p v-if="logoutToogle">You will logout in <span class="text-yellow-300">{{ count }}</span><span> seconds</span>
            </p>
        </div>
    </div>
</template>