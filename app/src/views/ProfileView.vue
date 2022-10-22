<script setup>
import { ref, onMounted } from "vue";
import { ethers } from "ethers";
import MarketplaceJSON from "../assets/Marketplace.json";
import axios from "axios";
import { useWalletStore } from "@/stores/wallet";

const wallet = useWalletStore();

const nfts = ref([]);
const address = ref("");
const totalPrice = ref("");

async function getNFTData() {
  let sumPrice = 0;

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
  let transaction = await contract.getMyNFTs();

  /*
   * Below function takes the metadata from tokenURI and the data returned by getMyNFTs() contract function
   * and creates an object of information that is to be displayed
   */

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
      sumPrice += Number(price);
      return item;
    })
  );

  nfts.value = items;
  address.value = addr;
  totalPrice.value = sumPrice.toPrecision(3);
}

onMounted(() => {
  getNFTData();
});
</script>
<template>
  <div v-if="!wallet.connected">
    <div class="alert alert-secondary text-center" role="alert">
      Connect your wallet
    </div>
  </div>
  <div v-else>
    <section class="row">
      <ul>
        <li><span>Wallet address</span>: {{ address }}</li>
        <li><span>No. of NFTs</span>: {{ nfts.length }} NFT's</li>
        <li><span>Total value</span>:{{ totalPrice }} ETH</li>
      </ul>
    </section>

    <section class="row">
      <div
        v-if="nfts.length === 0"
        class="alert alert-dark text-center"
        role="alert"
      >
        You have not yet bought a NFT
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
            <RouterLink class="btn btn-primary" :to="`/nftpage/${item.tokenId}`"
              >Open NFT</RouterLink
            >
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
ul li {
  list-style: none;
}
</style>
