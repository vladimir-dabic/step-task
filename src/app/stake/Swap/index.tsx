"use client";

import React, {
  type ChangeEvent,
  useEffect,
  useState,
  useMemo,
  Fragment,
} from "react";
import { Tab } from "@headlessui/react";
import {
  useConnection,
  useWallet,
  useAnchorWallet,
} from "@solana/wallet-adapter-react";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { type AccountInfo, type TokenAmount, PublicKey } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import Image from "next/image";
import {
  type Idl,
  type Provider,
  AnchorProvider,
  Program,
  BN,
  setProvider,
  web3,
  getProvider,
} from "@coral-xyz/anchor";

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
import StakeHeaderAndDescription from "../components/StakeHeaderAndDescription";
import { type IParsedAccountData, type StakeButtonTextType } from "~/app/types";
import StakeButton from "../components/StakeButton";
import {
  StakeDownArrow,
  UnstakeUpArrow,
  ArrowSeparator,
} from "../components/SvgComponents";
import TabButton from "../components/TabButton";

import idl from "~/app/step_staking.json";

type StepLookupType = "step" | "xstep";

type RpcTokensResponse = {
  pubkey: PublicKey;
  account: AccountInfo<IParsedAccountData>;
};

const programId = new PublicKey("Stk5NCWomVN3itaFjLu382u9ibb5jMSHEsh6CuhaGjB");
const stepMintPubkey = new PublicKey(STEP_MINT_PUBKEY);
const xStepMintPubkey = new PublicKey(XSTEP_MINT_PUBKEY);

const Swap = ({ price }: { price: string }) => {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const [program, setProgram] = useState<Program<Idl>>();
  const [vaultPubkey, setVaultPubkey] = useState<PublicKey>();
  const [vaultBump, setVaultBump] = useState<number>();
  const [stepToken, setStepToken] = useState<RpcTokensResponse | undefined>();
  const [xStepToken, setXstepToken] = useState<RpcTokensResponse | undefined>();
  const [stepAmount, setStepAmount] = useState("");
  const [xStepAmount, setXstepAmount] = useState("");
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const stepBalance = useMemo<TokenAmount | undefined>(
    () => stepToken?.account.data.parsed.info.tokenAmount,
    [stepToken],
  );

  const xStepBalance = useMemo<TokenAmount | undefined>(
    () => xStepToken?.account.data.parsed.info.tokenAmount,
    [xStepToken],
  );

  const buttonType = useMemo<StakeButtonTextType>(() => {
    if (!+stepAmount) {
      return "enterAmount";
    }
    if (new BigNumber(stepAmount).isGreaterThan(stepBalance?.uiAmount ?? 0)) {
      return "insufficientStep";
    }
    return "stake";
  }, [stepAmount, stepBalance?.uiAmount]);

  const amountLookup = {
    step: { get: stepAmount, set: setStepAmount },
    xstep: { get: xStepAmount, set: setXstepAmount },
  };

  const balanceLookup = {
    step: stepBalance,
    xstep: xStepBalance,
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
      )) as RpcTokensResponse[];

      const step = accounts.find(
        (item) => item.account.data.parsed.info.mint === STEP_MINT_PUBKEY,
      );

      if (step) setStepToken(step);

      const xStep = accounts.find(
        (item) => item.account.data.parsed.info.mint === XSTEP_MINT_PUBKEY,
      );
      console.log({ step, xStep });

      if (xStep) setXstepToken(xStep);
    } catch (err) {
      console.error(err);
    }
  };

  const setupAnchorAndEmitPrice = async () => {
    if (!wallet) return;

    let provider: Provider;
    try {
      provider = getProvider();
    } catch {
      provider = new AnchorProvider(connection, wallet, {});
      setProvider(provider);
    }

    const program = new Program(idl as Idl, programId);
    setProgram(program);

    // TODO: fix deprecated
    try {
      const [_vaultPubkey, _vaultBump] =
        await web3.PublicKey.findProgramAddress(
          [stepMintPubkey.toBuffer()],
          program.programId,
        );
      setVaultPubkey(_vaultPubkey);
      setVaultBump(_vaultBump);

      /* @ts-expect-error  because! :D */
      const res = await program.simulate.emitPrice({
        accounts: {
          tokenMint: stepMintPubkey,
          xTokenMint: xStepMintPubkey,
          tokenVault: vaultPubkey,
        },
      });
      if (res) {
        const price = res.events[0]?.data;
        console.log({ price });
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
    const result = new BigNumber(balanceLookup[type]?.uiAmount ?? 0)
      .dividedBy(2)
      .toString();

    amountLookup[type].set(convertToRegularNum(result, STEP_DECIMALS));
  };

  const handleMaxClick = (type: StepLookupType) => {
    const result = convertToRegularNum(
      balanceLookup[type]?.uiAmount ?? 0,
      STEP_DECIMALS,
    );

    amountLookup[type].set(convertToRegularNum(result, STEP_DECIMALS));
  };

  const handleAnchor = async () => {
    if (!wallet || !program || !stepToken || !xStepToken) return;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const txAmount = new BN(5_000_000_000);

    try {
      /* @ts-expect-error  because! :D */
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await program.rpc.stake(vaultBump, txAmount, {
        accounts: {
          tokenMint: stepMintPubkey,
          xTokenMint: xStepMintPubkey,
          tokenFrom: stepToken.pubkey,
          tokenFromAuthority: wallet.publicKey,
          tokenVault: vaultPubkey,
          xTokenTo: xStepToken.pubkey,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
      });
    } catch (err) {
      console.log("Handle Anchor Error:", err);
    }
  };

  useEffect(() => {
    if (!wallet || !publicKey) return;

    void getTokensInfo();

    void setupAnchorAndEmitPrice();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey]);

  return (
    <div className="">
      {/* Swap */}
      {connected ? (
        <div className="mt-4">
          <StakeHeaderAndDescription />
          <div className="mt-[20px] w-[450px]">
            <Tab.Group selectedIndex={selectedTabIndex}>
              <Tab.List>
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <TabButton
                      onClick={() => setSelectedTabIndex(0)}
                      title="Stake"
                      selected={selected}
                      SvgComponent={StakeDownArrow}
                    />
                  )}
                </Tab>
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <TabButton
                      onClick={() => setSelectedTabIndex(1)}
                      title="Unstake"
                      selected={selected}
                      SvgComponent={UnstakeUpArrow}
                    />
                  )}
                </Tab>
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
              onClick={() => {
                handleAnchor().catch((err) => console.error(err));
                console.log("stake");
              }}
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
