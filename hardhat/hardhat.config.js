require("@nomicfoundation/hardhat-toolbox");
const fs = require('fs');
// const infuraId = fs.readFileSync(".infuraid").toString().trim() || "";
require('dotenv').config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    goerli: {
      url: process.env.VUE_APP_ALCHEMY_API_URL,
      accounts: [ process.env.VUE_APP_PRIVATE_KEY ]
    }
  },
  solidity: "0.8.9",
  settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
};
