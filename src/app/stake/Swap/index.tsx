"use client";

import React from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  BeakerIcon,
  ArrowDownIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/solid";

import Image from "next/image";
import {
  stepChartImgUrl,
  stepTokenImgUrl,
  xStepTokenImgUrl,
} from "~/app/constants";
import { Tab } from "@headlessui/react";
import clsx from "clsx";
import SwapInput from "./Input";
import ArrowSeparator from "../components/ArrowSeparator";

const Swap = () => {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();

  return (
    <div className="">
      {/* Swap */}
      {connected ? (
        <div className="mt-4">
          <div className="mb-8 text-3xl font-bold">Stake STEP</div>
          <div className="text-step-description mb-8 font-thin">
            Stake STEP to receive xSTEP
          </div>
          <div className="bg-step-paper w-[450px] rounded-lg p-[30px]">
            <div className="flex justify-between">
              <div className="flex">
                <Image
                  src={xStepTokenImgUrl}
                  width={28}
                  height={28}
                  alt="xStep token"
                />
                <span className="ml-3">xSTEP staking APY</span>
              </div>
              <span>14.43%</span>
            </div>
            <div className="mt-[32px]">
              <p className="mb-[10px] font-bold">{`"Where is my staking reward?"`}</p>
              <p className="text-step-description">
                {`xSTEP is a yield bearing asset. This means it is automatically worth
            more STEP over time. You don't need to claim any rewards, or do
            anything other than hold your xSTEP to benefit from this. Later,
            when you unstake your xSTEP you will receive more STEP than you
            initially deposited.`}
              </p>
            </div>
          </div>
          <div className=" mt-6 w-[450px]">
            <Tab.Group>
              <Tab.List>
                {["Stake", "Unstake"].map((item) => {
                  return (
                    <Tab
                      key={item}
                      className={clsx(
                        "bg-step-paper",
                        "ui-not-selected:opacity-20",
                        "ui-selected:text-step-accent",
                        "rounded-t-lg",
                        "p-3",
                        "font-bold",
                        "transition-all",
                        "duration-150",
                        "focus:outline-none",
                      )}
                    >
                      {item}
                    </Tab>
                  );
                })}
              </Tab.List>
              <Tab.Panels className="bg-step-paper rounded-bl-lg rounded-br-lg rounded-tr-lg p-3">
                <Tab.Panel>
                  <SwapInput
                    tokenName="STEP"
                    tokenUrl={stepTokenImgUrl}
                    label="You stake"
                  />
                  <ArrowSeparator />
                  <SwapInput
                    tokenName="xSTEP"
                    tokenUrl={xStepTokenImgUrl}
                    label="You stake"
                  />
                </Tab.Panel>
                <Tab.Panel>
                  <SwapInput
                    tokenName="xSTEP"
                    tokenUrl={xStepTokenImgUrl}
                    label="You receive"
                  />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      ) : (
        /* Placeholder */
        <div className="flex h-[60vh] flex-col justify-center">
          <div className="flex flex-col items-center">
            <Image
              src={stepChartImgUrl}
              alt="Step finance logo"
              width={140}
              height={40}
            />
            <span className="mt-2 text-2xl">Please connect wallet!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Swap;
