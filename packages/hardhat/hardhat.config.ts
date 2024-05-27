import * as dotenv from "dotenv";
dotenv.config();
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomicfoundation/hardhat-verify";
import "hardhat-deploy";
import "hardhat-deploy-ethers";

// If not set, it uses ours Alchemy's default API key.
// You can get your own at https://dashboard.alchemyapi.io
const providerApiKey = process.env.ALCHEMY_API_KEY || "wL0YrXJoCW4zXJeNds22I33_PiE8R-Gm";
// If not set, it uses the hardhat account 0 private key.
const deployerPrivateKey =
  process.env.DEPLOYER_PRIVATE_KEY ?? "add later";
// If not set, it uses ours Etherscan default API key.
const etherscanApiKey = process.env.ETHERSCAN_API_KEY || "S93YCV2GH2YIAAY1CAH5QYYP4QKZJDYRUB";

const COMPILER_SETTINGS = {
  optimizer: {
      enabled: true,
      runs: 1000000,
  },
  metadata: {
      bytecodeHash: "none",
  },
}


const config: HardhatUserConfig = {
  solidity: {
    compilers: [
        {
            version: "0.8.20",
            settings: COMPILER_SETTINGS,
        },
        {
            version: "0.8.7",
            settings: COMPILER_SETTINGS,
        },
        {
            version: "0.8.6",
            settings: COMPILER_SETTINGS,
        },
        {
            version: "0.8.0",
            settings: COMPILER_SETTINGS,
        },
    ],
},
  defaultNetwork: "sepolia",
  namedAccounts: {
    deployer: {
      // By default, it will take the first Hardhat account as the deployer
      default: 0,
    },
  },
  networks: {
    // View the networks that are pre-configured.
    // If the network you are looking for is not here you can add new network settings
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${providerApiKey}`,
        enabled: process.env.MAINNET_FORKING_ENABLED === "true",
      },
    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    arbitrum: {
      url: `https://arb-mainnet.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    arbitrumSepolia: {
      url: `https://arb-sepolia.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    polygon: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    polygonAmoy: {
      url: `https://polygon-amoy.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    polygonZkEvm: {
      url: `https://polygonzkevm-mainnet.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    polygonZkEvmTestnet: {
      url: `https://polygonzkevm-testnet.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    base: {
      url: "https://mainnet.base.org",
      accounts: [deployerPrivateKey],
    },
    baseSepolia: {
      url: "https://base-sepolia.g.alchemy.com/v2/OuV1CVoq7gCMAy7E7f0b7xiLzNFQ57VS",
      accounts: [deployerPrivateKey],
    },
  },
  // configuration for harhdat-verify plugin
  etherscan: {
    apiKey: `${etherscanApiKey}`,
  },
  // configuration for etherscan-verify from hardhat-deploy plugin
  verify: {
    etherscan: {
      apiKey: `${etherscanApiKey}`,
    },
  },
  sourcify: {
    enabled: false,
  },
};

export default config;
