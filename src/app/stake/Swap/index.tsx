"use client";

import React, { type ChangeEvent, useEffect, useState, useMemo } from "react";
import { Tab } from "@headlessui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  type AccountInfo,
  type TokenAmount,
  type PublicKey,
} from "@solana/web3.js";
import BigNumber from "bignumber.js";
import Image from "next/image";

import {
  STEP_DECIMALS,
  STEP_MINT_PUBKEY,
  XSTEP_MINT_PUBKEY,
  stepChartImgUrl,
  stepTokenImgUrl,
  xStepTokenImgUrl,
} from "~/app/constants";
import { convertToRegularNum, resolveAmountInput } from "~/app/utils";
import SwapInput from "./Input";
import ArrowSeparator from "../components/ArrowSeparator";
import StakeHeaderAndDescription from "../components/StakeHeaderAndDescription";
import { type IParsedAccountData, type StakeButtonTextType } from "~/app/types";
import StakeButton from "../components/StakeButton";
import { DownArrow, UpArrow } from "../components/SvgComponents";

type StepLookupType = "step" | "xstep";

const Swap = ({ price }: { price: string }) => {
  console.log({ price });

  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();

  const [stepBalance, setStepBalance] = useState<TokenAmount>();
  const [xStepBalance, setXstepBalance] = useState<TokenAmount>();
  const [stepAmount, setStepAmount] = useState("");
  const [xStepAmount, setXstepAmount] = useState("");

  const amountLookup = {
    step: { get: stepAmount, set: setStepAmount },
    xstep: { get: xStepAmount, set: setXstepAmount },
  };

  const balanceLookup = {
    step: { get: stepBalance, set: setStepBalance },
    xstep: { get: xStepBalance, set: setXstepBalance },
  };

  const getTokensInfo = async () => {
    if (!publicKey) return;

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
                bytes: publicKey?.toBase58(),
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
      console.log({ step });

      if (step) {
        setStepBalance(step.account.data.parsed.info.tokenAmount);
      }

      const xStep = accounts.find(
        (item) => item.account.data.parsed.info.mint === XSTEP_MINT_PUBKEY,
      );

      if (xStep) {
        setXstepBalance(xStep.account.data.parsed.info.tokenAmount);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAmountChange = (
    event: ChangeEvent<HTMLInputElement>,
    type: StepLookupType,
  ) => {
    try {
      const amount = resolveAmountInput(event.target.value, STEP_DECIMALS);
      amountLookup[type].set(amount);
    } catch (err) {
      console.log(err);
    }
  };

  const handleHalfClick = (type: StepLookupType) => {
    const result = new BigNumber(balanceLookup[type].get?.uiAmount ?? 0)
      .dividedBy(2)
      .toString();

    amountLookup[type].set(convertToRegularNum(result, STEP_DECIMALS));
  };

  const handleMaxClick = (type: StepLookupType) => {
    const result = convertToRegularNum(
      balanceLookup[type].get?.uiAmount ?? 0,
      STEP_DECIMALS,
    );

    amountLookup[type].set(convertToRegularNum(result, STEP_DECIMALS));
  };

  const buttonType = useMemo<StakeButtonTextType>(() => {
    if (!+stepAmount) {
      return "enterAmount";
    }
    if (new BigNumber(stepAmount).isGreaterThan(stepBalance?.uiAmount ?? 0)) {
      return "insufficientStep";
    }
    return "stake";
  }, [stepAmount, stepBalance?.uiAmount]);

  useEffect(() => {
    if (publicKey) {
      getTokensInfo().catch((err) => console.error(err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                {[
                  {
                    title: "Stake",
                    src: "/down-stake-icon.svg",
                    svg: <DownArrow />,
                  },
                  {
                    title: "Unstake",
                    src: "/up-stake-icon.svg",
                    svg: <UpArrow />,
                  },
                ].map((item) => {
                  return (
                    <Tab
                      key={item.title}
                      className="
                        bg-step-paper
                        ui-not-selected:opacity-20
                        ui-selected:text-step-accent
                        w-[150px]
                        rounded-t-lg
                        p-3
                        text-sm
                        font-bold
                        transition-all
                        duration-150
                        focus:outline-none
                      "
                    >
                      <div className="flex items-center justify-center">
                        {item.svg}
                        <span className="ml-[15px] font-bold">
                          {item.title}
                        </span>
                      </div>
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
                {/* STAKE */}
                <Tab.Panel className="focus:bg-none focus:outline-none">
                  <SwapInput
                    tokenName="STEP"
                    amount={stepAmount}
                    price={price}
                    tokenUrl={stepTokenImgUrl}
                    label="You stake"
                    balance={stepBalance?.uiAmount}
                    onChange={(event) => handleAmountChange(event, "step")}
                    onHalfClick={() => handleHalfClick("step")}
                    onMaxClick={() => handleMaxClick("step")}
                  />
                  <ArrowSeparator />
                  <SwapInput
                    tokenName="xSTEP"
                    amount={xStepAmount}
                    price={price}
                    tokenUrl={xStepTokenImgUrl}
                    label="You stake"
                    balance={xStepBalance?.uiAmount}
                    onChange={(event) => handleAmountChange(event, "xstep")}
                    onHalfClick={() => handleHalfClick("xstep")}
                    onMaxClick={() => handleMaxClick("xstep")}
                  />
                </Tab.Panel>
                {/* UNSTAKE */}
                <Tab.Panel>
                  <SwapInput
                    tokenName="xSTEP"
                    amount={stepAmount}
                    price={price}
                    tokenUrl={xStepTokenImgUrl}
                    label="You stake"
                    balance={xStepBalance?.uiAmount}
                    onChange={(event) => handleAmountChange(event, "step")}
                    onHalfClick={() => handleHalfClick("step")}
                    onMaxClick={() => handleMaxClick("step")}
                  />
                  <ArrowSeparator />
                  <SwapInput
                    tokenName="STEP"
                    amount={xStepAmount}
                    price={price}
                    tokenUrl={stepTokenImgUrl}
                    label="You stake"
                    balance={stepBalance?.uiAmount}
                    onChange={(event) => handleAmountChange(event, "step")}
                    onHalfClick={() => handleHalfClick("xstep")}
                    onMaxClick={() => handleMaxClick("xstep")}
                  />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
            <StakeButton
              textType={buttonType}
              onClick={() => console.log("stake")}
            />
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
