"use client";

import React, { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getAccount, TOKEN_PROGRAM_ID, getMint } from "@solana/spl-token";
import {
  type AccountInfo,
  type TokenAmount,
  PublicKey,
  clusterApiUrl,
} from "@solana/web3.js";

import Image from "next/image";
import {
  STEP_MINT_PUBKEY,
  XSTEP_MINT_PUBKEY,
  stepChartImgUrl,
  stepTokenImgUrl,
  xStepTokenImgUrl,
} from "~/app/constants";
import { Tab } from "@headlessui/react";
import clsx from "clsx";
import SwapInput from "./Input";
import ArrowSeparator from "../components/ArrowSeparator";
import StakeHeaderAndDescription from "../components/StakeHeaderAndDescription";
import { type IParsedAccountData } from "~/app/types";

const Swap = () => {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const [stepBalance, setStepBalance] = useState<TokenAmount>();
  const [xStepBalance, setXstepBalance] = useState<TokenAmount>();

  const getTokensInfo = async () => {
    console.log("get token info");

    try {
      const accounts = (await connection.getParsedProgramAccounts(
        TOKEN_PROGRAM_ID,
        {
          filters: [
            {
              dataSize: 165, // number of bytes
            },
            {
              memcmp: {
                offset: 32, // number of bytes
                bytes: publicKey?.toBase58() ?? new PublicKey("").toBase58(), // base58 encoded string
              },
            },
          ],
        },
      )) as {
        pubkey: PublicKey;
        account: AccountInfo<IParsedAccountData>;
      }[];

      const step = accounts.find(
        (item) => item.account.data.parsed.info.mint === STEP_MINT_PUBKEY,
      );
      if (step) {
        setStepBalance(step.account.data.parsed.info.tokenAmount);
      }

      const xStep = accounts.find(
        (item) => item.account.data.parsed.info.mint === XSTEP_MINT_PUBKEY,
      );

      if (xStep) {
        setXstepBalance(xStep.account.data.parsed.info.tokenAmount);
      }

      // console.log("*********", accounts, "***********");

      // console.log(
      //   `Found ${accounts.length} token account(s) for wallet ${"MY_WALLET_ADDRESS"}: `,
      // );
      // accounts.forEach((account, i) => {
      // console.log(
      //   `-- Token Account Address ${i + 1}: ${account.pubkey.toString()} --`,
      // );
      // console.log(`Mint: ${account.account.data.parsed.info.mint}`);
      // console.log(
      //   `Amount: ${account.account.data.parsed.info.tokenAmount.uiAmount}`,
      // );
      // console.log("_______________________");
      // });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    console.log("FX", publicKey);

    if (publicKey) {
      getTokensInfo().catch((err) => console.error(err));
    }
  }, [publicKey]);

  return (
    <div className="">
      {/* Swap */}
      {connected ? (
        <div className="mt-4">
          <StakeHeaderAndDescription />
          <div className="mt-[20px] w-[450px]">
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
              <Tab.Panels
                className="
                bg-step-paper
                focus
                rounded-bl-lg
                rounded-br-lg
                rounded-tr-lg
                p-5
                "
              >
                <Tab.Panel className="focus:bg-none focus:outline-none">
                  <SwapInput
                    tokenName="STEP"
                    tokenUrl={stepTokenImgUrl}
                    label="You stake"
                    balance={stepBalance?.uiAmount}
                    onHalfClick={() => console.log("half click")}
                    onMaxClick={() => console.log("max click")}
                  />
                  <ArrowSeparator />
                  <SwapInput
                    tokenName="xSTEP"
                    tokenUrl={xStepTokenImgUrl}
                    label="You stake"
                    balance={xStepBalance?.uiAmount}
                  />
                </Tab.Panel>
                <Tab.Panel>
                  <SwapInput
                    tokenName="xSTEP"
                    tokenUrl={xStepTokenImgUrl}
                    label="You stake"
                    balance={xStepBalance?.uiAmount}
                  />
                  <ArrowSeparator />
                  <SwapInput
                    tokenName="STEP"
                    tokenUrl={stepTokenImgUrl}
                    label="You stake"
                    balance={stepBalance?.uiAmount}
                  />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
            <button
              disabled
              className="
              bg-step-paper
              disabled:bg-step-disabled
              mt-6
              h-[60px] w-full
              p-[10px]
              disabled:cursor-not-allowed
              "
            >
              <span className="font-bold disabled:text-red-800">
                Enter an amount
              </span>
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
