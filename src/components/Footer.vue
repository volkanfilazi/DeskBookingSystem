<template>
  <div class="w-full h-full sm:h-full md:h-14 bg-gray-800 border-t-2 relative border-white flex items-center justify-center">
    <div class="w-4/5 flex justify-between">
      <div class="text-white">
        <p>Booking System</p>
      </div>
      <div>
        <ul class="flex flex-col gap-2 text-white sm:flex-col md:flex-row lg:flex-row xl:flex-row">
          <router-link class="hover:text-yellow-400" :to="{ name: 'conditions' }">Conditions</router-link>
          <router-link class="hover:text-yellow-400" :to="{ name: 'cookies' }">Cookies</router-link>
          <router-link class="hover:text-yellow-400" :to="{ name: 'privacy' }">Privacy</router-link>
        </ul>
      </div>
    </div>
  </div>
</template>