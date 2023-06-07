require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
require("hardhat-contract-sizer")
require("@openzeppelin/hardhat-upgrades")
require("@chainlink/env-enc").config()
//const { networks } = require("./networks")
//require("@nomiclabs/hardhat-waffle");
// Any file that has require('dotenv').config() statement 
// will automatically load any variables in the root's .env file.
module.exports = {
  solidity: {
    version: '^0.8.0',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
    networks: {
     mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/XAlaIyfz7DWmQtYrDstHy9_Gfyh7iqtT`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      gas: 2100000,
      gasPrice: 8000000000, // 8 gwei
    },
  },
};
