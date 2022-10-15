<script setup>
import { ref } from "vue";

const item = ref({
  name: "NFT#1",
  description: "Alchemy's First NFT",
  website: "http://axieinfinity.io",
  image:
    "https://gateway.pinata.cloud/ipfs/QmTsRJX7r5gyubjkdmzFrKQhHv74p5wT9LdeF1m3RTqrE5",
  price: "0.03ETH",
  currentlySelling: "True",
  address: "0xe81Bf5A757CB4f7F82a2F23b1e59bE45c33c5b13",
});
</script>

<template>
  <h1>This is NFT single page page</h1>
  <section class="row">
    <div class="col-md-6 offset-md-3">
      <div class="card">
        <img :src="item.image" class="card-img-top" alt="..." />
        <div class="card-body">
          <h5 class="card-title">{{ item.name }}</h5>
          <h6 class="card-subtitle mb-2 text-muted">Price: {{ item.price }}</h6>
          <p class="card-text">
            {{ item.description }}
          </p>
          <a :href="item.website" class="btn btn-primary">Go somewhere</a>
        </div>
        <div class="card-footer text-muted">
          Selling now: {{ item.currentlySelling }}
        </div>
      </div>
    </div>
  </section>
</template>

<style></style>
