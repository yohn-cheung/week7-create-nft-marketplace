<script setup>
import { ref } from "vue";

const form = ref({
  name: "",
  description: "",
  price: "",
});

const file = ref(null);

function onFileChanged($event) {
  const target = $event.target;
  if (target && target.files) {
    console.log("target.files: ", target.files);
    file.value = target.files[0];
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
        type="number"
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
      <button type="button" class="btn btn-primary">List NFT</button>
    </div>
  </section>
</template>

<style></style>
