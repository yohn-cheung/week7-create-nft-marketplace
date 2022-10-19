import { ref } from "vue";
import { defineStore } from "pinia";

export const useWalletStore = defineStore("wallet", () => {
  const connected = ref(false);

  return { connected };
});
