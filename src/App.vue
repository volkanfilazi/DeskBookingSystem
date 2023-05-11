<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="bg-gray-800 min-h-[100vh] flex flex-col">
    <NavBar></NavBar>
  <div class="w-full mb-1 h-full bg-gray-800 justify-center flex grow">
    <RouterView></RouterView>
    </div>
  <Footer></Footer>
  </div>
</template>

<style scoped></style>
