<script setup>
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import { ethers } from "ethers";
import MarketplaceJSON from "../assets/Marketplace.json";
import axios from "axios";
import { useWalletStore } from "@/stores/wallet";

const wallet = useWalletStore();

const nfts = ref([]);

async function getAllNFTs() {
  //After adding your Hardhat network to your metamask, this code will get providers and signers
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  //Pull the deployed contract instance
  let contract = new ethers.Contract(
    MarketplaceJSON.address,
    MarketplaceJSON.abi,
    signer
  );
  //create an NFT Token
  let transaction = await contract.getAllNFTs();

  //Fetch all the details of every NFT from the contract and display
  const items = await Promise.all(
    transaction.map(async (i) => {
      const tokenURI = await contract.tokenURI(i.tokenId);
      let meta = await axios.get(tokenURI);
      meta = meta.data;

      let price = ethers.utils.formatUnits(i.price.toString(), "ether");
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.image,
        name: meta.name,
        description: meta.description,
      };
      return item;
    })
  );
  nfts.value = items;
}

onMounted(() => {
  getAllNFTs();
});
</script>

<template>
  <div v-if="!wallet.connected">
    <div class="alert alert-secondary text-center" role="alert">
      Connect your wallet
    </div>
  </div>
  <div v-else>
    <h1 class="text-center">Top NFTs</h1>
    <section class="row">
      <div
        v-if="nfts.length === 0"
        class="alert alert-dark text-center"
        role="alert"
      >
        <RouterLink class="nav-link" to="/list"
          >Upload your first NFT</RouterLink
        >
      </div>

      <div
        class="col-md-4 col-sm-4 pb-5"
        v-for="(item, index) in nfts"
        :key="index"
      >
        <div class="card">
          <img :src="item.image" class="card-img-top" alt="..." />
          <div class="card-body">
            <h5 class="card-title">{{ item.name }}</h5>
            <h6 class="card-subtitle mb-2 text-muted">
              Price: {{ item.price }}
            </h6>
            <p class="card-text">
              {{ item.description }}
            </p>
            <!-- <a :href="item.website" class="btn btn-primary">Go somewhere</a> -->
            <RouterLink class="btn btn-primary" :to="`/nftpage/${item.tokenId}`"
              >Open NFT</RouterLink
            >
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
