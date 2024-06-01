"use client";
import { useState } from "react";
import { ArrowSmallRightIcon } from "@heroicons/react/24/outline";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import React from "react";

export const UnHoard = () => {
  const [visible, setVisible] = useState(true);
  const [amount, setAmount] = useState<string | undefined>(undefined);
  const { writeContractAsync } = useScaffoldWriteContract("UsdcCrossChainHoarding");

 

  return (
    <div className="flex bg-[url('/assets/background.jpeg')] relative pb-10">
      <div className="flex flex-col w-full mx-5 sm:mx-8 2xl:mx-20 items-center">
        <div className={`mt-10 flex gap-2 ${visible ? "" : "invisible"} max-w-2xl`}>
          <div className="flex flex-col mt-6 px-7 py-8 bg-base-200 opacity-80 rounded-2xl shadow-lg border-2 border-primary items-center">
            <span className="text-4xl sm:text-6xl text-black">UnHoard USDC</span>

            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5">
              <div className="flex rounded-full border border-primary p-1 flex-shrink-0">
                <div className="flex rounded-full border-2 border-primary p-1">
                <button
              className="btn btn-primary uppercase"
                    onClick={async () => {
                      try {
                         {
                          await writeContractAsync({ functionName: "Unhoard" });
                        }
                      } catch (err) {
                        console.error("Error calling execute function");
                      }
                    }}
            >
              UnHoard!
            </button>
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2 items-start">
              <span className="text-md leading-tight">Project 6:</span>
              <div className="badge badge-warning">Hoarding time must be greater than 360 seconds to UnHoard</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
