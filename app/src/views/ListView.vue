<script setup>
import { ref } from "vue";
import { ethers } from "ethers";

import { uploadFileToIPFS, uploadJSONToIPFS } from "../assets/pinata";
import MarketplaceJSON from "../assets/Marketplace.json";

const form = ref({
  name: "",
  description: "",
  price: "",
});

const fileURL = ref(null);
const message = ref("");

async function onFileChanged($event) {
  const target = $event.target;
  if (target && target.files) {
    var file = target.files[0];
    //check for file extension
    try {
      //upload the file to IPFS
      const response = await uploadFileToIPFS(file);
      if (response.success === true) {
        console.log("Uploaded image to Pinata: ", response.pinataURL);
        fileURL.value = response.pinataURL;

        console.log("fileURL: ", fileURL);
      }
    } catch (e) {
      console.log("Error during file upload", e);
    }
  }
}

// This function uploads the metadata to IPDS
async function uploadMetadataToIPFS() {
  //TODO: FIND A SOLUTION FOR THIS
  //Make sure that none of the fields are empty
  // if (
  //   form.value.name !== "" ||
  //   form.value.description !== "" ||
  //   form.value.price !== "" ||
  //   !fileURL.value
  // )
  //   return;

  if (!fileURL.value) return;

  console.log("test past the return");

  const nftJSON = {
    name: form.value.name,
    description: form.value.description,
    price: form.value.price,
    image: fileURL.value,
  };

  try {
    //upload the metadata JSON to IPFS
    const response = await uploadJSONToIPFS(nftJSON);
    if (response.success === true) {
      console.log("Uploaded JSON to Pinata: ", response);
      return response.pinataURL;
    }
  } catch (e) {
    alert("something went worng with uploading");
    console.log("error uploading JSON metadata:", e);
  }
}

async function listNFT() {
  //Upload data to IPFS
  try {
    const metadataURL = await uploadMetadataToIPFS();
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    message.value = "Please wait.. uploading (upto 5 mins)";

    // //Pull the deployed contract instance
    let contract = new ethers.Contract(
      MarketplaceJSON.address,
      MarketplaceJSON.abi,
      signer
    );

    console.log("contract: ", contract);

    //massage the params to be sent to the create NFT request
    const price = ethers.utils.parseUnits(form.value.price, "ether");
    let listingPrice = await contract.getListPrice();
    listingPrice = listingPrice.toString();

    //actually create the NFT
    let transaction = await contract.createToken(metadataURL, price, {
      value: listingPrice,
    });
    await transaction.wait();

    alert("Successfully listed your NFT!");
    message.value = "";

    window.location.replace("/");
  } catch (e) {
    // alert("Upload error" + e);
    alert("upload cancelled");
  }
}
</script>

<template>
  <h3 className="text-center">Upload your NFT to the marketplace</h3>
  <section class="row g-3">
    <div class="col-md-12">
      <label class="form-label">NFT name</label>
      <input type="text" class="form-control" v-model="form.name" />
    </div>
    <div class="col-12">
      <span class="form-label">NFT desription</span>
      <textarea
        class="form-control"
        cols="40"
        rows="5"
        aria-label="With textarea"
        v-model="form.description"
      ></textarea>
    </div>
    <div class="col-6">
      <label class="form-label">Price in NFT</label>
      <input
        class="form-control"
        placeholder="Min 0.01 ETH"
        step="0.01"
        v-model="form.price"
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
    <div class="col-12 d-grid">
      <a type="button" class="btn btn-primary" @click="listNFT"> List NFT </a>
    </div>

    <div>
      {{ message }}
    </div>
  </section>
</template>

<style></style>
