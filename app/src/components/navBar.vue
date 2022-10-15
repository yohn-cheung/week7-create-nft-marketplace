<script setup>
import { RouterLink } from "vue-router";
import { ref } from "vue";

const connected = ref(false);
</script>

<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark mb-4">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Top navbar</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarCollapse"
        aria-controls="navbarCollapse"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarCollapse">
        <ul class="navbar-nav me-auto mb-2 mb-md-0">
          <li class="nav-item">
            <RouterLink class="nav-link active" to="/">Marketplace</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/list">List My NFT</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/profile">Profile</RouterLink>
          </li>
        </ul>
        <a class="btn btn-outline-success" v-if="connected">Connected </a>
        <a class="btn btn-outline-success" v-else>Connect Wallet </a>
      </div>
    </div>
  </nav>
</template>

<style scoped></style>
