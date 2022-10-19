<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { ethers } from "ethers";
import MarketplaceJSON from "../assets/Marketplace.json";
import axios from "axios";

import { useWalletStore } from "@/stores/wallet";

const wallet = useWalletStore();

const item = ref({
  price: "",
  tokenId: "",
  seller: "",
  owner: "",
  image: "",
  name: "",
  description: "",
});

const route = useRoute();
const address = ref("");

async function getNFTData(tokenId) {
  //After adding your Hardhat network to your metamask, this code will get providers and signers
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const addr = await signer.getAddress();
  //Pull the deployed contract instance
  let contract = new ethers.Contract(
    MarketplaceJSON.address,
    MarketplaceJSON.abi,
    signer
  );
  //create an NFT Token
  const tokenURI = await contract.tokenURI(tokenId);
  const listedToken = await contract.getListedTokenForId(tokenId);
  let meta = await axios.get(tokenURI);
  meta = meta.data;

  item.value.price = meta.price;
  item.value.tokenId = tokenId;
  item.value.seller = listedToken.seller;
  item.value.owner = listedToken.owner;
  item.value.image = meta.image;
  item.value.name = meta.name;
  item.value.description = meta.description;

  address.value = addr;
}

async function buyNFT(tokenId) {
  try {
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(
      MarketplaceJSON.address,
      MarketplaceJSON.abi,
      signer
    );
    // const priceToString = item.value.price.toString();
    //  const salePrice = ethers.utils.parseUnits(priceToString, "ether");
    const salePrice = ethers.utils.parseUnits(item.value.price, "ether");
    let transaction = await contract.executeSale(tokenId, { value: salePrice });
    await transaction.wait();

    alert("You successfully bought the NFT!");
  } catch (e) {
    alert("Payment went wrong");
    //alert("Upload Error" + e);
  }
}

onMounted(() => {
  getNFTData(route.params.id);
});
</script>

<template>
  <div v-if="!wallet.connected">
    <div class="alert alert-secondary text-center" role="alert">
      Connect your wallet
    </div>
  </div>
  <div v-else>
    <h1 class="text-center">BUY THIS NFT</h1>
    <section class="row">
      <div class="col-md-6 offset-md-3">
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
            <div v-if="address === item.owner || address === item.seller">
              You are the owner of this NFT
            </div>
            <a v-else class="btn btn-primary" @click="buyNFT(item.tokenId)"
              >Buy NFT</a
            >
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style></style>
