export const contractAddress = "0x61C6E74d8D5B9F3CbBDBf88Bc43debc2f6DD9cD0";

export const abi = {
  compiler: {
    version: "0.8.18+commit.87f61d96",
  },
  language: "Solidity",
  output: {
    abi: [
      {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "_name",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "_quantity",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_price",
            type: "uint256",
          },
        ],
        name: "addProduce",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        name: "buyerVerifications",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        name: "buyers",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes",
            name: "checkData",
            type: "bytes",
          },
        ],
        name: "checkUpkeep",
        outputs: [
          {
            internalType: "bool",
            name: "upkeepNeeded",
            type: "bool",
          },
          {
            internalType: "bytes",
            name: "performData",
            type: "bytes",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "claimTreasury",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        name: "farmerVerifications",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        name: "farmers",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_farmer",
            type: "address",
          },
        ],
        name: "getProduceList",
        outputs: [
          {
            components: [
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "quantity",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "price",
                type: "uint256",
              },
              {
                internalType: "bool",
                name: "sold",
                type: "bool",
              },
            ],
            internalType: "struct CropLink.Produce[]",
            name: "",
            type: "tuple[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes",
            name: "performData",
            type: "bytes",
          },
        ],
        name: "performUpkeep",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "produceList",
        outputs: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "quantity",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "sold",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "registerAsBuyer",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "registerAsFarmer",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "treasury",
        outputs: [
          {
            internalType: "address payable",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "treasuryBalance",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "verifyBuyer",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "verifyFarmer",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    devdoc: {
      kind: "dev",
      methods: {
        "checkUpkeep(bytes)": {
          details:
            "To ensure that it is never called, you may want to add the cannotExecute modifier from KeeperBase to your implementation of this method.",
          params: {
            checkData:
              "specified in the upkeep registration so it is always the same for a registered upkeep. This can easily be broken down into specific arguments using `abi.decode`, so multiple upkeeps can be registered on the same contract and easily differentiated by the contract.",
          },
          returns: {
            performData:
              "bytes that the keeper should call performUpkeep with, if upkeep is needed. If you would like to encode data to decode later, try `abi.encode`.",
            upkeepNeeded:
              "boolean to indicate whether the keeper should call performUpkeep or not.",
          },
        },
        "performUpkeep(bytes)": {
          details:
            "The input to this method should not be trusted, and the caller of the method should not even be restricted to any single registry. Anyone should be able call it, and the input should be validated, there is no guarantee that the data passed in is the performData returned from checkUpkeep. This could happen due to malicious keepers, racing keepers, or simply a state change while the performUpkeep transaction is waiting for confirmation. Always validate the data passed in.",
          params: {
            performData:
              "is the data which was passed back from the checkData simulation. If it is encoded, it can easily be decoded into other types by calling `abi.decode`. This data should not be trusted, and should be validated against the contract's current state.",
          },
        },
      },
      version: 1,
    },
    userdoc: {
      kind: "user",
      methods: {
        "checkUpkeep(bytes)": {
          notice:
            "method that is simulated by the keepers to see if any work actually needs to be performed. This method does does not actually need to be executable, and since it is only ever simulated it can consume lots of gas.",
        },
        "performUpkeep(bytes)": {
          notice:
            "method that is actually executed by the keepers, via the registry. The data returned by the checkUpkeep simulation will be passed into this method to actually be executed.",
        },
      },
      version: 1,
    },
  },
  settings: {
    compilationTarget: {
      "contracts/Croplink.sol": "CropLink",
    },
    evmVersion: "paris",
    libraries: {},
    metadata: {
      bytecodeHash: "ipfs",
    },
    optimizer: {
      enabled: false,
      runs: 200,
    },
    remappings: [],
  },
  sources: {
    "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol": {
      keccak256:
        "0x6e6e4b0835904509406b070ee173b5bc8f677c19421b76be38aea3b1b3d30846",
      license: "MIT",
      urls: [
        "bzz-raw://b3beaa37ee61e4ab615e250fbf01601ae481de843fd0ef55e6b44fd9d5fff8a7",
        "dweb:/ipfs/QmeZUVwd26LzK4Mfp8Zba5JbQNkZFfTzFu1A6FVMMZDg9c",
      ],
    },
    "@chainlink/contracts/src/v0.8/interfaces/AutomationCompatibleInterface.sol":
      {
        keccak256:
          "0x67076747c6f66d8d43472a56e72879c350056bff82e069addaf9064922863340",
        license: "MIT",
        urls: [
          "bzz-raw://b738dba680a6fbc4afc85819743f13f5b7f4790ec8634c9894e1160327b11b6e",
          "dweb:/ipfs/Qmbv3euvQppeBm2g61khcJSRMZWi78xUWzbnjKAvDBnka4",
        ],
      },
    "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol": {
      keccak256:
        "0xac76a31c20c6d66196247376d113a0f19229569ab8c123989649d50be3333e0a",
      license: "MIT",
      urls: [
        "bzz-raw://5400532a5132536ba3d1172604291298f1595f15d7a7f66c95bf89a5823b80be",
        "dweb:/ipfs/QmTvDMmt73kZEGjD9WVgpaN8xLsgGpoXmr2yVUQoQuv8GW",
      ],
    },
    "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol": {
      keccak256:
        "0xc7d7cd730d36825485ef4107d93c3ff18b9f3a5a00ea3d5988ba9a0bd70b10c5",
      license: "MIT",
      urls: [
        "bzz-raw://8cb1064885ecbcd9c3adba779e190cb4a538e5d4d15aeccb67d3376bdffc94bd",
        "dweb:/ipfs/QmcQHK6ewve7tFi4XXK65JthQg4kQzApQikWcURJjGt4iQ",
      ],
    },
    "contracts/Croplink.sol": {
      keccak256:
        "0x48c48fa0d70fb1ff7db188bb36d9019cbdb61d391d0109bbcdfce4613fda21db",
      license: "MIT",
      urls: [
        "bzz-raw://38ec7819dbec2c13b325eff1378a0efda60fd23a1c03b28f9cb6f6c634210a98",
        "dweb:/ipfs/QmcYCWPaZKh7jBDsWPAxxVXu3FFqGkstXe4nfpNzbAn91p",
      ],
    },
  },
  version: 1,
};
