# USDC Cross-Chain Hoarding

<h4 align="center">
  <a href="https://github.com/moneyhoardersglobalnetwork/usdc-cross-chain-hoarding">Repo</a> |
  <a href="https://scaffoldeth.io">Website</a>
</h4>

🧪 A MHGN Hoarder Labs project for ChainLink's Block Magic Hackathon..

This application is a cross-chain hoarding application that allows users to deposit USDC into a smart contract and earn 6% APY then withdraw USDC and rewards from the smart contract to their wallet.

Users can also tranfer USDC cross-chain to other wallets. Using ChainLink's CCIP protocol, users can now hoard USDC on Polygon Amoy, Avalanche Fuji, Ethereum Sepolia, and maybe more once the contracts go live on Polygon and Avalanche.

USDC has been adopted as the primary currency on the MHGN ecosystem second to MHDG and is the most popular stablecoin on the market. MHGD or Money Hoarders Global Dollars is the native token of the MHGN ecosystem. MHGD will be minted using USDC and DAI on Polygon Amoy, Avalanche Fuji, Ethereum Sepolia and Base Sepolia.

The MHGD mint contracts allow users to swap their USDC or DAI for MHGD.
The mint contract does not use CCIP only the USDCCrossChainHoarding.sol contracts use CCIP.
We split code into four contracts for each network so frontend is only configured to one network.

MHGD will be paired to BOP by MHGN and other assets creating the ability to exchange values across the MHGN ecosystem. For use cases like gaming, MHGD can be used to buy in-game items, or for other use cases like buying NFTs.

Eventually MHGD and BOP will be transferable across different network ecosystems.




⚙️ Built using Scaffold-Eth-2, NextJS, RainbowKit, Hardhat, Wagmi, Viem, and Typescript.

- ✅ **Contract Hot Reload**: Your frontend auto-adapts to your smart contract as you edit it.
- 🪝 **[Custom hooks](https://docs.scaffoldeth.io/hooks/)**: Collection of React hooks wrapper around [wagmi](https://wagmi.sh/) to simplify interactions with smart contracts with typescript autocompletion.
- 🧱 [**Components**](https://docs.scaffoldeth.io/components/): Collection of common web3 components to quickly build your frontend.
- 🔥 **Burner Wallet & Local Faucet**: Quickly test your application with a burner wallet and local faucet.
- 🔐 **Integration with Wallet Providers**: Connect to different wallet providers and interact with the Ethereum network.

![Debug Contracts tab](https://github.com/scaffold-eth/scaffold-eth-2/assets/55535804/b237af0c-5027-4849-a5c1-2e31495cccb1)

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

To get started with Scaffold-ETH 2, follow the steps below:

1. Clone this repo & install dependencies

```
git clone https://github.com/scaffold-eth/scaffold-eth-2.git
cd scaffold-eth-2
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `hardhat.config.ts`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

**What's next**:

- Edit your smart contract `YourContract.sol` in `packages/hardhat/contracts`
- Edit your frontend homepage at `packages/nextjs/app/page.tsx`. For guidance on [routing](https://nextjs.org/docs/app/building-your-application/routing/defining-routes) and configuring [pages/layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts) checkout the Next.js documentation.
- Edit your deployment scripts in `packages/hardhat/deploy`
- Edit your smart contract test in: `packages/hardhat/test`. To run test use `yarn hardhat:test`

## Documentation

Visit our [docs](https://docs.scaffoldeth.io) to learn how to start building with Scaffold-ETH 2.

To know more about its features, check out our [website](https://scaffoldeth.io).

## Contributing to Scaffold-ETH 2

We welcome contributions to Scaffold-ETH 2!

Please see [CONTRIBUTING.MD](https://github.com/scaffold-eth/scaffold-eth-2/blob/main/CONTRIBUTING.md) for more information and guidelines for contributing to Scaffold-ETH 2.

Github pushing
Git Hub Staging, Commiting, Pushing //Commands for updating repo on github(Build this out)

//Check remote origin

git remote set-url origin https://github.com/USERNAME/REPOSITORY.git

git remote -v

git add . //adds modified files to commit# mhgn-hoarding-gateway

git commit -m "update from local" // Commit your changes to be pushed to repo

Use the --no-verify option to skip git commit hooks, e.g. git commit -m "commit message" --no-verify . When the --no-verify option is used, the pre-commit and commit-msg hooks are bypassed. Copied! You can also use the -n option, which is short for --no-verify .

git push //push to repo //Push updates to repo (main)

