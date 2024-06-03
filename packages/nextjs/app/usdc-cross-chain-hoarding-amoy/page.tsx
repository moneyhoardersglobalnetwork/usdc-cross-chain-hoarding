import { ApproveUsdc } from "./_components/ApproveUsdc";
import { Claim } from "./_components/Claim";

import { ContractInteraction } from "./_components/ContractInteraction";
import { DonateUsdc } from "./_components/DonateUsdc";
import { Hoard } from "./_components/Hoard";
import { IncreaseHoard } from "./_components/IncreaseHoard";
import { TransferUsdc } from "./_components/TransferUsdc";
import { UnHoard } from "./_components/UnHoard";
import { UsdcHoardingContractData } from "./_components/UsdcHoardingContractData";
import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "USDC Cross-Chain Hoarding UI",
  description: "Hoard USDC across chains",
});

const Debug: NextPage = () => {
  return (
    <>
      
      <UsdcHoardingContractData />
      <ContractInteraction />
      <ApproveUsdc />
      <DonateUsdc />
      <TransferUsdc />
      <Hoard />
      <IncreaseHoard />
      <UnHoard />
      <Claim />
      <div className="text-center mt-8 bg-secondary p-10">
        <h1 className="text-4xl my-0">USDC Cross-Chain Hoarding</h1>
        <p className="text-neutral">
          You can debug & interact with your deployed contracts here.
          <br /> Check{" "}
          <code className="italic bg-base-300 text-base font-bold [word-spacing:-0.5rem] px-1">
            packages / nextjs / app / debug / page.tsx
          </code>{" "}
        </p>
      </div>
    </>
  );
};

export default Debug;
