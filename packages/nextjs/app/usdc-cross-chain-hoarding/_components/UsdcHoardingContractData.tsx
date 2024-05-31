"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import Image from "next/image";
import { formatEther } from "ethers";
import { useAccount } from "wagmi";
import {
  useScaffoldContract,
  useScaffoldReadContract,
  useScaffoldWriteContract,
  useScaffoldEventHistory,
  useScaffoldWatchContractEvent,
} from "~~/hooks/scaffold-eth";
import React from "react";

export const UsdcHoardingContractData = () => {
  const { address } = useAccount();

  const { data: usdcTokenSymbol } = useScaffoldReadContract({
    contractName: "IERC20",
    functionName: "symbol",
  });

  const { data: usdcTokenBalance } = useScaffoldReadContract({
    contractName: "IERC20",
    functionName: "balanceOf",
    args: [address],
  });

  const { data: usdcTokenAllowance } = useScaffoldReadContract({
    contractName: "IERC20",
    functionName: "allowance",
    args: [address, "0xfd8Ff2c739DD3dc566C6f7A060bB69663e7dA8Bc"],
  });

  const { data: hoardingBalance } = useScaffoldReadContract({
    contractName: "UsdcCrossChainHoardingBase",
    functionName: "Check_Usdc_Hoarded_Balance",
    args: [address],
  });

  const { data: calculateReward } = useScaffoldReadContract({
    contractName: "UsdcCrossChainHoardingBase",
    functionName: "calculateReward",
    args: [address],
  });

  const { data: GetHoardingingTimeInSeconds } = useScaffoldReadContract({
    contractName: "UsdcCrossChainHoardingBase",
    functionName: "GetHoardingingTimeInSeconds",
    args: [address],
  });

  const { data: totalHoarded } = useScaffoldReadContract({
    contractName: "UsdcCrossChainHoardingBase",
    functionName: "hoarders",
    args: [address],
  });

  const { data: totalSupply } = useScaffoldReadContract({
    contractName: "IERC20",
    functionName: "totalSupply",
  });

  const { data: Total_Hoarders } = useScaffoldReadContract({
    contractName: "UsdcCrossChainHoardingBase",
    functionName: "Total_Hoarders",
  });

  const { data: Total_Reward_Pool } = useScaffoldReadContract({
    contractName: "UsdcCrossChainHoardingBase",
    functionName: "Total_Reward_Pool",
  });

  const { data: hoarded } = useScaffoldReadContract({
    contractName: "UsdcCrossChainHoardingBase",
    functionName: "totalHoarded",
  });

  useScaffoldWatchContractEvent({
    contractName: "UsdcCrossChainHoardingBase",
    eventName: "Hoarded",
    listener: logs => {
      logs.map(log => {
        const { user, amount } = log.args;
        console.log("📡 Hoarded event", user, amount);
      });
    },
  });

  const {
    data: hoardedEvents,
    isLoading: isLoadingEvents,
    error: errorReadingEvents,
  } = useScaffoldEventHistory({
    contractName: "UsdcCrossChainHoardingBase",
    eventName: "Hoarded",
    fromBlock: process.env.NEXT_PUBLIC_DEPLOY_BLOCK ? BigInt(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) : 0n,
    filters: { user: address },
    blockData: true,
  });

  console.log("Events:", isLoadingEvents, errorReadingEvents, hoardedEvents);

  const { data: usdcCrossChainHoardingBase } = useScaffoldContract({ contractName: "UsdcCrossChainHoardingBase" });
  console.log("usdcCrossChainHoardingBase: ", usdcCrossChainHoardingBase);

  return (
    <div className="flex flex-col justify-center items-center bg-[url('/assets/background.jpeg')] bg-[length:100%_100%] py-10 px-5 sm:px-0 lg:py-auto max-w-[100vw] ">
      <div
        className={`flex flex-col max-w-full items-center bg-accent bg-opacity-100 rounded-2xl shadow-lg px-5 py-4 w-full }`}
      >
        <div className="text-6xl text-right min-w-[3rem] px-2 py-1 flex justify-end font-bai-jamjuree">
          Welcome Hoarder
        </div>
        This is the USDC Cross-Chain Hoarding User Interface
        <div className="flex relative w-40 h-40">
          <Image alt="USDC logo" className="cursor-pointer"  src="/usdc-logo.png" width={120} height={100} />
        </div>
      </div>
      <p>
        {" "}
        <div className="text-xl text-accent">
          Your wallet balance:{" "}
          <div className="inline-flex items-center justify-center text-white">
          {usdcTokenBalance?.toString() || "0"}
            <span className="font-bold ml-1">{usdcTokenSymbol}</span>
          </div>
        </div>
      </p>
      <p>
        {" "}
        <div className="text-xl text-accent">
          Hoarding Contract Allowance:{" "}
          <div className="inline-flex items-center justify-center text-white">
            {usdcTokenAllowance?.toString() || "0"}
            <span className="font-bold ml-1">{usdcTokenSymbol}</span>
          </div>
        </div>
      </p>
      <p>
        {" "}
        <div className="text-xl text-accent">
          You Hoarded:{" "}
          <div className="inline-flex items-center justify-center text-white">
            {hoardingBalance?.toString() || "0"}
            <span className="font-bold ml-1">{usdcTokenSymbol}</span>
          </div>
        </div>
      </p>
      <div className="block justify-between w-full">
        <div className="bg-accent border border-primary rounded-xl flex">
          <div className="p-2 py-1 border-r border-primary flex items-top w-min">Total Hoarders</div>
          <div className="text-2xl text-right min-w-[3rem] px-2 py-1 flex justify-end font-bai-jamjuree">
            {Total_Hoarders?.toString() || "0"}
          </div>
        </div>
        <div className="bg-accent border border-primary rounded-xl flex">
          <div className="p-2 py-1 border-r border-primary flex items-top w-min">Total Reward Pool</div>
          <div className="text-2xl text-right min-w-[3rem] px-2 py-1 flex justify-end font-bai-jamjuree">
            {Total_Reward_Pool?.toString() || "0"}
          </div>
        </div>
        <div className="bg-accent border border-primary rounded-xl flex">
          <div className="p-2 py-1 border-r border-primary flex items-top w-min">Total Hoarded</div>
          <div className="text-2xl text-right min-w-[3rem] px-2 py-1 flex justify-end font-bai-jamjuree">
            {hoarded?.toString() || "0"}
          </div>
        </div>
        <div className="bg-accent border border-primary rounded-xl flex">
          <div className="p-2 py-1 border-r border-primary flex items-top w-min">Hoarding Stats</div>
          <div className="text-2xl text-right min-w-[3rem] px-2 py-1 flex justify-end font-bai-jamjuree">
            {totalHoarded?.toString() || "0"}
          </div>
        </div>
        <div>
          <div className="flex justify-between w-full">
            <div className="bg-accent border border-primary rounded-xl flex">
              <div className="p-2 py-1 border-r border-primary flex items-top w-min">Total Supply</div>
              <div className="text-2xl text-right min-w-[3rem] px-2 py-1 flex justify-end font-bai-jamjuree">
                {totalSupply?.toString() || "0"}
              </div>
            </div>
          </div>
        </div>
      </div>
      <p></p>
      <div className="grid lg:grid-cols-3 flex-grow">
        <div className="bg-accent border border-primary rounded-xl flex">
          <div className="p-2 py-1 border-r border-primary flex items-top w-min">Hoarding Time in Seconds</div>
          <div className="text-2xl text-right min-w-[3rem] px-2 py-1 flex justify-end font-bai-jamjuree">
            {GetHoardingingTimeInSeconds?.toString() || "0"}
          </div>
        </div>
        <div></div>
        <div className="grid lg:grid-cols-1 flex-grow">
          <div className="bg-accent border border-primary rounded-xl flex">
            <div className="p-2 py-1 border-r border-primary flex items-top w-min">Pending Rewards</div>
            <div className="text-2xl text-right min-w-[3rem] px-2 py-1 flex justify-end font-bai-jamjuree">
              {calculateReward?.toString() || "0"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
