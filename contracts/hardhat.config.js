require("@nomiclabs/hardhat-waffle");
require("@hashgraph/hardhat-hedera");
require("dotenv").config();

module.exports = {
  solidity: "0.8.17",
  networks: {
    hedera: {
      url: "https://testnet.hashio.io/api",
      accounts: process.env.OPERATOR_PRIVATE_KEY ? [process.env.OPERATOR_PRIVATE_KEY] : [],
      chainId: 296,
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
