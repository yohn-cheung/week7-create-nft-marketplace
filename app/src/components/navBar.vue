<script setup>
import { RouterLink } from "vue-router";
import { ref, onMounted } from "vue";

const connected = ref(false);
const currentAccount = ref("");

async function isWalletConnected() {
  try {
    const { ethereum } = window;
    const chainID = await ethereum.request({ method: "eth_chainId" });
    if (chainID !== "0x5") {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x5" }],
      });
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length > 0) {
      const account = accounts[0];
      currentAccount.value = accounts[0];
      connected.value = true;
      console.log("wallet is connected! " + account);
    } else {
      alert("Make sure MetaMask is connected");
    }
  } catch (error) {
    console.log("error: ", error);
  }
}
async function connectWallet() {
  try {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("please install MetaMask");
      alert("please install MetaMask");
    }
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    currentAccount.value = accounts[0];
    isWalletConnected();
    window.reload;
  } catch (error) {
    console.log(error);
    console.log("something went wrong, try again");
  }
}

onMounted(() => {
  isWalletConnected();
});
</script>

<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark mb-4">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">Top navbar</a>
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
        <ul class="navbar-nav me-auto mb-2 mb-md-0" v-if="connected">
          <li class="nav-item">
            <RouterLink class="nav-link" exact-active-class="active" to="/"
              >Marketplace</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" exact-active-class="active" to="/list"
              >List My NFT</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink
              class="nav-link"
              exact-active-class="active"
              to="/profile"
              >Profile</RouterLink
            >
          </li>
        </ul>
        <a class="btn btn-outline-success" v-if="connected">Connected </a>
        <a class="btn btn-outline-success" v-else @click="connectWallet"
          >Connect Wallet
        </a>
      </div>
    </div>
  </nav>
</template>

<style scoped></style>
