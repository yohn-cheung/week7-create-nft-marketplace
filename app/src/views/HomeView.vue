<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";

const sampleData = ref([
  {
    name: "NFT#1",
    description: "Alchemy's First NFT",
    website: "http://axieinfinity.io",
    image:
      "https://gateway.pinata.cloud/ipfs/QmTsRJX7r5gyubjkdmzFrKQhHv74p5wT9LdeF1m3RTqrE5",
    price: "0.03ETH",
    currentlySelling: "True",
    address: "0xe81Bf5A757CB4f7F82a2F23b1e59bE45c33c5b13",
  },
  {
    name: "NFT#2",
    description: "Alchemy's Second NFT",
    website: "http://axieinfinity.io",
    image:
      "https://gateway.pinata.cloud/ipfs/QmdhoL9K8my2vi3fej97foiqGmJ389SMs55oC5EdkrxF2M",
    price: "0.03ETH",
    currentlySelling: "True",
    address: "0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
  },
  {
    name: "NFT#3",
    description: "Alchemy's Third NFT",
    website: "http://axieinfinity.io",
    image:
      "https://gateway.pinata.cloud/ipfs/QmTsRJX7r5gyubjkdmzFrKQhHv74p5wT9LdeF1m3RTqrE5",
    price: "0.03ETH",
    currentlySelling: "True",
    address: "0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
  },
]);
</script>

<template>
  <h1>Top NFTs</h1>
  <section class="row">
    <div class="col" v-for="(item, index) in sampleData" :key="index">
      <div class="card">
        <img :src="item.image" class="card-img-top" alt="..." />
        <div class="card-body">
          <h5 class="card-title">{{ item.name }}</h5>
          <h6 class="card-subtitle mb-2 text-muted">Price: {{ item.price }}</h6>
          <p class="card-text">
            {{ item.description }}
          </p>
          <!-- <a :href="item.website" class="btn btn-primary">Go somewhere</a> -->
          <RouterLink class="btn btn-primary" to="/nftpage"
            >Open page</RouterLink
          >
        </div>
        <div class="card-footer text-muted">
          Selling now: {{ item.currentlySelling }}
        </div>
      </div>
    </div>
  </section>
</template>
