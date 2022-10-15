<script setup>
import { RouterView } from "vue-router";
import NavBar from "./components/navBar.vue";
</script>

<template>
  <NavBar />

  <main class="container">
    <RouterView />
  </main>
</template>

<style scoped></style>
