"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { ArrowSmallRightIcon } from "@heroicons/react/24/outline";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { TransactionReceipt } from "viem";
import React from "react";

export const ApproveUsdc = () => {
  const [visible, setVisible] = useState(true);
  const [amount, approve_amount] = useState("");
  const address = "0xF83efD432e30c4618C1196C8da52B9351513107E";
  const { writeContractAsync } = useScaffoldWriteContract("IERC20");


  return (
    <div className="flex bg-[url('/assets/background.jpeg')] relative pb-10">
      <div className="flex flex-col w-full mx-5 sm:mx-8 2xl:mx-20 items-center">
        <div className={`mt-10 flex gap-2 ${visible ? "" : "invisible"} max-w-2xl`}>
          <div className="flex flex-col mt-6 px-7 py-8 bg-base-200 opacity-80 rounded-2xl shadow-lg border-2 border-primary">
            <span className="text-4xl sm:text-6xl text-black">Approve Usdc</span>

            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5">
              <input
                type="uint256"
                placeholder="Amount"
                className="input font-bai-jamjuree w-full px-5 bg-[url('/assets/background.jpeg')] bg-[length:100%_100%] border border-primary text-black text-lg sm:text-2xl placeholder-black uppercase"
                onChange={e => approve_amount(e.target.value)}
              />
              <div className="flex rounded-full border border-primary p-1 flex-shrink-0">
                <div className="flex rounded-full border-2 border-primary p-1">
                <button
              className="btn btn-primary uppercase"
                    onClick={async () => {
                      try {
                        await writeContractAsync({ functionName: "approve", args: [address, BigInt(amount)] });
                      } catch (err) {
                        console.error("Error calling execute function");
                      }
                    }}
            >
              Approve!
            </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
