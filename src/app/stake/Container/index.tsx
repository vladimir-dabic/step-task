"use client";

import React, {
  type ChangeEvent,
  type FocusEvent,
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
import { toast } from "react-hot-toast";
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
  stepTokenImgUrl,
  xStepTokenImgUrl,
} from "~/app/constants";
import {
  convertDecimalsToAmount,
  convertToRegularNum,
  resolveAmountInput,
} from "~/app/utils";
import StakeInput from "./Input";
import {
  StakeHeaderAndDescription,
  StakeButton,
  StakeDownArrow,
  UnstakeUpArrow,
  ArrowSeparator,
  TabButton,
  ApproveFromWalletNotification,
  ErrorNotification,
  SuccessStakingNotification,
  SuccessUnstakingNotification,
  YouAreStakingNotification,
} from "../components";
import { type IParsedAccountData, type StakeButtonTextType } from "~/app/types";

import idl from "~/app/step_staking.json";
import AccountListener from "./AccountListener";
import StepLoader from "./StepLoader";

type StepLookupType = "step" | "xstep";

type RpcTokensResponse = {
  pubkey: PublicKey;
  account: AccountInfo<IParsedAccountData>;
};

const programId = new PublicKey("Stk5NCWomVN3itaFjLu382u9ibb5jMSHEsh6CuhaGjB");
const stepMintPubkey = new PublicKey(STEP_MINT_PUBKEY);
const xStepMintPubkey = new PublicKey(XSTEP_MINT_PUBKEY);

const StakeContainer = ({ price }: { price: string }) => {
  const { connected, publicKey, connecting } = useWallet();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const [stepToken, setStepToken] = useState<RpcTokensResponse | undefined>();
  const [xStepToken, setXstepToken] = useState<RpcTokensResponse | undefined>();
  const [stepAmount, setStepAmount] = useState("");
  const [stepPerXstepRatio, setStepPerXstepRatio] = useState<string>();
  const [xStepAmount, setXstepAmount] = useState("");
  const [xPrice, setXPrice] = useState("");
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [txFlowInProgress, setTxFlowInProgress] = useState(false);
  /* Program state */
  const [signature, setSignature] = useState("");
  const [program, setProgram] = useState<Program<Idl>>();
  const [vaultPubkey, setVaultPubkey] = useState<PublicKey>();
  const [vaultBump, setVaultBump] = useState<number>();

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
    if (
      new BigNumber(stepAmount).isGreaterThan(stepBalance?.uiAmount ?? 0) &&
      selectedTabIndex === 0
    ) {
      return "insufficientStep";
    }

    if (
      new BigNumber(xStepAmount).isGreaterThan(xStepBalance?.uiAmount ?? 0) &&
      selectedTabIndex === 1
    ) {
      return "insufficientXstep";
    }

    if (txFlowInProgress) {
      return "approveFromWallet";
    }

    return selectedTabIndex ? "unstake" : "stake";
  }, [
    txFlowInProgress,
    selectedTabIndex,
    stepAmount,
    stepBalance?.uiAmount,
    xStepAmount,
    xStepBalance?.uiAmount,
  ]);

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
          tokenVault: _vaultPubkey,
        },
      });
      if (res) {
        const ratio = res.events[0]?.data.stepPerXstep as string;
        setStepPerXstepRatio(ratio);
        const _xPrice = new BigNumber(price).times(ratio).toString();
        setXPrice(_xPrice);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAmountChange = (
    event: ChangeEvent<HTMLInputElement>,
    type: StepLookupType,
  ) => {
    let amount = "";
    try {
      amount = resolveAmountInput(event.target.value, STEP_DECIMALS);
      amountLookup[type].set(amount);
    } catch (err) {
      console.log(`%c${err as string}`, "color: red; font-weight: bold;");
      return;
    }

    /* Update XSTEP amount */
    if (type === "step") {
      if (amount && stepPerXstepRatio) {
        const bnXStepAmount = new BigNumber(amount).dividedBy(
          stepPerXstepRatio,
        );
        setXstepAmount(convertToRegularNum(bnXStepAmount));
      } else {
        setXstepAmount("");
      }
    }
    /* Update STEP amount */
    if (type === "xstep") {
      if (amount && stepPerXstepRatio) {
        const bnStepAmount = new BigNumber(amount).times(stepPerXstepRatio);
        setStepAmount(convertToRegularNum(bnStepAmount));
      } else {
        setStepAmount("");
      }
    }
  };

  const handleOnBlurAmount = (
    event: FocusEvent<HTMLInputElement>,
    type: "step" | "xstep",
  ) => {
    const { value } = event.target;

    if (!value) return;

    if (type === "step") {
      setStepAmount(convertToRegularNum(value));
    }

    if (type === "xstep") {
      setXstepAmount(convertToRegularNum(value));
    }
  };

  const handleHalfMaxClick = (
    type: StepLookupType,
    divideType: "half" | "max",
  ) => {
    const result = new BigNumber(balanceLookup[type]?.uiAmount ?? 0).dividedBy(
      divideType === "half" ? 2 : 1,
    );

    const newAmount = convertToRegularNum(result);
    amountLookup[type].set(newAmount);

    /* Update XSTEP amount */
    if (type === "step") {
      if (stepPerXstepRatio) {
        const bnXStepAmount = new BigNumber(newAmount).dividedBy(
          stepPerXstepRatio,
        );
        setXstepAmount(convertToRegularNum(bnXStepAmount));
      }
    }

    /* Update STEP amount */
    if (type === "xstep") {
      if (stepPerXstepRatio) {
        const bnStepAmount = new BigNumber(newAmount).times(stepPerXstepRatio);
        setStepAmount(convertToRegularNum(bnStepAmount));
      }
    }
  };

  const handleStake = async () => {
    if (!wallet || !program || !stepToken || !xStepToken) return;

    const targetAmount = convertDecimalsToAmount(stepAmount);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const txAmount = new BN(targetAmount);
    setTxFlowInProgress(true);
    const toastId = toast.custom(<ApproveFromWalletNotification />);

    try {
      /* @ts-expect-error  because! :D */
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const sig = await program.rpc.stake(vaultBump, txAmount, {
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

      setSignature(sig);
      toast.custom(
        <YouAreStakingNotification sig={sig} text="You are staking STEP" />,
      );
    } catch (err) {
      toast.custom(<ErrorNotification />);
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleUnstake = async () => {
    if (!wallet || !program || !stepToken || !xStepToken) return;

    const targetAmount = convertDecimalsToAmount(xStepAmount);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const txAmount = new BN(targetAmount);
    setTxFlowInProgress(true);
    const toastId = toast.custom(<ApproveFromWalletNotification />);
    try {
      /* @ts-expect-error  because! :D */
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const sig = await program.rpc.unstake(vaultBump, txAmount, {
        accounts: {
          tokenMint: stepMintPubkey,
          xTokenMint: xStepMintPubkey,
          xTokenFrom: xStepToken.pubkey,
          xTokenFromAuthority: wallet.publicKey,
          tokenVault: vaultPubkey,
          tokenTo: stepToken.pubkey,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
      });

      setSignature(sig);
      toast.custom(
        <YouAreStakingNotification sig={sig} text="You are unstaking xSTEP" />,
      );
    } catch (err) {
      toast.custom(<ErrorNotification />);
    } finally {
      toast.dismiss(toastId);
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
          {txFlowInProgress && signature && (
            <AccountListener
              onAccountChange={() => {
                toast.custom(
                  selectedTabIndex ? (
                    <SuccessUnstakingNotification
                      sig={signature}
                      minusAmount={xStepAmount}
                      plusAmount={stepAmount}
                    />
                  ) : (
                    <SuccessStakingNotification
                      sig={signature}
                      minusAmount={stepAmount}
                      plusAmount={xStepAmount}
                    />
                  ),
                ),
                  void getTokensInfo();
                setTxFlowInProgress(false);
              }}
              stepAccount={stepToken?.pubkey}
              xStepAccount={xStepToken?.pubkey}
            />
          )}
          <StakeHeaderAndDescription />
          <div className="mt-[20px] w-[450px]">
            <Tab.Group selectedIndex={selectedTabIndex}>
              <Tab.List>
                {/* @ts-expect-error because of fragment*/}
                <Tab as={Fragment} disabled={txFlowInProgress}>
                  {({ selected }) => (
                    <TabButton
                      onClick={() => setSelectedTabIndex(0)}
                      title="Stake"
                      selected={selected}
                      SvgComponent={StakeDownArrow}
                    />
                  )}
                </Tab>
                {/* @ts-expect-error because of fragment*/}
                <Tab as={Fragment} disabled={txFlowInProgress}>
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
                  focus
                  rounded-bl-lg
                  rounded-br-lg
                  rounded-tr-lg
                  bg-step-paper
                  p-5
                  "
              >
                {/* STAKE */}
                <Tab.Panel className="focus:bg-none focus:outline-none">
                  <StakeInput
                    tokenName="STEP"
                    amount={stepAmount}
                    price={price}
                    tokenUrl={stepTokenImgUrl}
                    label="You stake"
                    balance={stepBalance?.uiAmount}
                    onChange={(event) => handleAmountChange(event, "step")}
                    onHalfClick={() => handleHalfMaxClick("step", "half")}
                    onMaxClick={() => handleHalfMaxClick("step", "max")}
                    onBlur={(event) => handleOnBlurAmount(event, "step")}
                  />
                  <ArrowSeparator />
                  <StakeInput
                    tokenName="xSTEP"
                    amount={xStepAmount}
                    price={xPrice}
                    tokenUrl={xStepTokenImgUrl}
                    label="You stake"
                    balance={xStepBalance?.uiAmount}
                    onChange={(event) => handleAmountChange(event, "xstep")}
                    onBlur={(event) => handleOnBlurAmount(event, "xstep")}
                  />
                </Tab.Panel>
                {/* UNSTAKE */}
                <Tab.Panel>
                  <StakeInput
                    tokenName="xSTEP"
                    amount={xStepAmount}
                    price={xPrice}
                    tokenUrl={xStepTokenImgUrl}
                    label="You stake"
                    balance={xStepBalance?.uiAmount}
                    onChange={(event) => handleAmountChange(event, "xstep")}
                    onHalfClick={() => handleHalfMaxClick("xstep", "half")}
                    onMaxClick={() => handleHalfMaxClick("xstep", "max")}
                    onBlur={(event) => handleOnBlurAmount(event, "xstep")}
                  />
                  <ArrowSeparator />
                  <StakeInput
                    tokenName="STEP"
                    amount={stepAmount}
                    price={price}
                    tokenUrl={stepTokenImgUrl}
                    label="You stake"
                    balance={stepBalance?.uiAmount}
                    onChange={(event) => handleAmountChange(event, "step")}
                    onBlur={(event) => handleOnBlurAmount(event, "step")}
                  />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
            <StakeButton
              textType={buttonType}
              onClick={() =>
                selectedTabIndex ? handleUnstake() : handleStake()
              }
            />
          </div>
        </div>
      ) : (
        <StepLoader connecting={connecting} />
      )}
    </div>
  );
};

export default StakeContainer;
