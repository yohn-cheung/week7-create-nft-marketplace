<script setup>
import { ref, computed } from "vue";
import { ethers } from "ethers";

import { uploadFileToIPFS, uploadJSONToIPFS } from "../assets/pinata";
import MarketplaceJSON from "../assets/Marketplace.json";
import { useWalletStore } from "@/stores/wallet";

const wallet = useWalletStore();
const loading = ref(false);
// const disabled = ref(true);
const errorState = ref(false);

const form = ref({
  name: "",
  description: "",
  price: "",
});

const fileURL = ref(null);
const message = ref("");
const notification = ref(false);

async function onFileChanged($event) {
  loading.value = true;
  notification.value = false;
  const target = $event.target;
  if (target && target.files) {
    var file = target.files[0];
    //check for file extension
    try {
      //upload the file to IPFS
      const response = await uploadFileToIPFS(file);
      console.log("response: ", response);
      if (response.success === true) {
        notification.value = true;
        errorState.value = false;
        message.value = "Uploaded image to Pinata";
        fileURL.value = response.pinataURL;
      }
    } catch (e) {
      notification.value = true;
      errorState.value = true;
      message.value = "Error during file upload";
    }
  }
  loading.value = false;
}

async function uploadMetadataToIPFS() {
  const nftJSON = {
    name: form.value.name,
    description: form.value.description,
    price: form.value.price.toString(),
    image: fileURL.value,
  };

  try {
    //upload the metadata JSON to IPFS
    const response = await uploadJSONToIPFS(nftJSON);
    if (response.success === true) {
      return response.pinataURL;
    }
  } catch (e) {
    console.log("Something went wrong with uploading to Pinata");
  }
}

async function listNFT() {
  notification.value = false;
  loading.value = true;
  //Upload data to IPFS
  try {
    const metadataURL = await uploadMetadataToIPFS();
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // //Pull the deployed contract instance
    let contract = new ethers.Contract(
      MarketplaceJSON.address,
      MarketplaceJSON.abi,
      signer
    );

    //massage the params to be sent to the create NFT request
    const priceToString = form.value.price.toString();
    const price = ethers.utils.parseUnits(priceToString, "ether");
    let listingPrice = await contract.getListPrice();
    listingPrice = listingPrice.toString();

    //actually create the NFT
    let transaction = await contract.createToken(metadataURL, price, {
      value: listingPrice,
    });
    await transaction.wait();

    notification.value = true;
    errorState.value = false;
    message.value = "Successfully listed your NFT!";
    loading.value = false;

    window.location.replace("/");
  } catch (e) {
    console.log("error: ", e);
    notification.value = true;
    errorState.value = true;
    message.value = "Uploading NFT failed";
    loading.value = false;
  }
}

const disabled = computed(() => {
  if (
    !form.value.name ||
    !form.value.description ||
    !form.value.price ||
    !fileURL.value ||
    loading.value
  ) {
    return true;
  } else {
    return false;
  }
});
</script>

<template>
  <div v-if="!wallet.connected">
    <div class="alert alert-secondary text-center" role="alert">
      Connect your wallet
    </div>
  </div>
  <div v-else>
    <h3 className="text-center">Upload your NFT to the marketplace</h3>
    <section class="row">
      <div class="col-md-8 offset-md-2">
        <div class="row">
          <div class="col-md-12">
            <label class="form-label">NFT name</label>
            <input type="text" class="form-control" v-model="form.name" />
          </div>
          <div class="col-md-12">
            <span class="form-label">NFT desription</span>
            <textarea
              class="form-control"
              cols="40"
              rows="5"
              aria-label="With textarea"
              v-model="form.description"
            ></textarea>
          </div>
          <div class="col-md-6">
            <label class="form-label">Price in NFT</label>
            <input
              type="number"
              class="form-control"
              placeholder="Min 0.01 ETH"
              step="0.01"
              v-model.number="form.price"
            />
          </div>
          <div class="col-md-6">
            <label class="form-label">Upload image</label>
            <input
              type="file"
              class="form-control"
              @change="onFileChanged($event)"
              accept="image/*"
              capture
            />
          </div>
          <div class="col-md-12 d-grid mt-3">
            <a
              type="button"
              class="btn btn-primary"
              :class="disabled ? 'disabled' : ''"
              @click="listNFT"
            >
              List NFT
            </a>
          </div>
          <div class="col-12 d-grid mt-3" v-if="loading">
            <div class="d-flex align-items-center">
              <strong>Loading...</strong>
              <div
                class="spinner-border ms-auto"
                role="status"
                aria-hidden="true"
              ></div>
            </div>
          </div>
          <div class="col-12 d-grid mt-3" v-if="notification">
            <div
              class="alert"
              :class="errorState ? 'alert-danger' : 'alert-success'"
              role="alert"
            >
              {{ message }}
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
a.disabled {
  pointer-events: none;
}
</style>
