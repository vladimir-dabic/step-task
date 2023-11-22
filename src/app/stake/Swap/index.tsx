"use client";

import React from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

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
import StakeHeaderAndDescription from "../components/StakeHeaderAndDescription";

const Swap = () => {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();

  return (
    <div className="">
      {/* Swap */}
      {connected ? (
        <div className="mt-4">
          <StakeHeaderAndDescription />
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
                        "ui-selected:text-teal-400",
                        // "ui-selected:text-step-accent",
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
              <Tab.Panels className="bg-step-paper rounded-bl-lg rounded-br-lg rounded-tr-lg p-5">
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
            <button className="bg-step-paper mt-6 h-10 w-full rounded-lg">
              hej
            </button>
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
