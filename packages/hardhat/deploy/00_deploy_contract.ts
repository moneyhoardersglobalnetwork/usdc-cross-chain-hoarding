import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys a contract named "UsdcCrossChainHoarding" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  //const _router = "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59"; // Sepolia router
  //const _link = "0x779877A7B0D9E8603169DdbD7836e478b4624789"; // Sepolia link 
  //const router = "0x9C32fCB86BF0f4a1A8921a9Fe46de3198bb884B2"; // Amoy router
  //const link = "0x0Fd9e8d3aF1aaee056EB9e802c3A762a667b1904"; // Amoy link  
  const router = "0xF694E193200268f9a4868e4Aa017A0118C9a8177"; // Fuji router
  const link = "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846"; // Fuji link  
  //const b_router = "0xD3b06cEbF099CE7DA4AcCf578aaebFDBd6e88a93"; // Base Sepolia router
  //const b_link = "0xE4aB69C077896252FAFBD49EFD26B5D171A32410"; // Base Sepolia link                                                                                                                                                                                                                                                               
/*
  await deploy("UsdcCrossChainHoarding", {
    from: deployer,
    // Contract constructor arguments
    args: [_router, _link],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  await deploy("UsdcCrossChainHoardingAmoy", {
    from: deployer,
    // Contract constructor arguments
    args: [router, link],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  await deploy("UsdcCrossChainHoardingBase", {
    from: deployer,
    // Contract constructor arguments
    args: [b_router, b_link],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  await deploy("IERC20", {
    from: deployer,
    // Contract constructor arguments
    args: [],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });
  */
  await deploy("UsdcCrossChainHoardingFuji", {
    from: deployer,
    // Contract constructor arguments
    args: [router, link],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags UsdcCrossChainHoarding
deployYourContract.tags = ["UsdcCrossChainHoarding"];
