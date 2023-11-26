import React, { type ReactNode } from "react";
import {
  XCircleIcon,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  EllipsisHorizontalIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { stepTokenImgUrl, xStepTokenImgUrl } from "~/app/constants";
import Image from "next/image";

type TemplateProps = {
  title: string;
  type: "info" | "progress" | "error" | "success";
  children?: ReactNode;
  sig?: string;
};

const defaultIconSize = {
  height: 22,
  width: 22,
};

const NotificationTemplate = ({
  title,
  children,
  type,
  sig,
}: TemplateProps) => {
  return (
    <div
      className="
        min-w-[384px]
        rounded-lg
        bg-step-paper
        p-[20px]
        shadow-lg
        "
    >
      <div className="flex h-full">
        <div className="mr-5 flex items-center">
          {type === "error" && (
            <XCircleIcon {...defaultIconSize} className="fill-red-500" />
          )}
          {type === "success" && (
            <CheckCircleIcon
              {...defaultIconSize}
              className="fill-step-accent"
            />
          )}
          {(type === "progress" || type === "info") && (
            <EllipsisHorizontalIcon
              width={32}
              height={32}
              className="fill-blue-500"
            />
          )}
        </div>
        <div className="flex w-full flex-col justify-between gap-3">
          <span className="w-full font-bold">{title}</span>
          {children}
          {sig && (
            <div className="flex justify-end ">
              <button
                className="
                flex
                items-center
                gap-3
                border
                border-step-disabled
                p-1
                px-3
                "
              >
                <span className="text-sm font-thin text-step-accent">
                  <a
                    target="_blank"
                    href={`https://explorer.solana.com/tx/${sig}`}
                  >
                    View on Solscan
                  </a>
                </span>
                <ArrowTopRightOnSquareIcon
                  height={16}
                  width={16}
                  className="fill-step-label"
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ErrorNotification = () => (
  <NotificationTemplate title="Transaction rejected" type="error">
    <span className="text-sm text-step-label">Transaction rejected</span>
  </NotificationTemplate>
);

const ApproveFromWalletNotification = () => (
  <NotificationTemplate
    title="Approve transactions from your wallet"
    type="info"
  />
);

const YouAreStakingNotification = ({
  sig,
  text,
}: {
  sig: string;
  text: string;
}) => (
  <NotificationTemplate title={text} type="progress" sig={sig}>
    <span className="text-sm text-step-label">Confirmation is in progress</span>
  </NotificationTemplate>
);

type StakedDataRowProps = {
  text: string;
  Icon: ReactNode;
  imageUrl: string;
  amount: string;
  thicker: string;
};

const StakedDataRow = ({
  Icon,
  imageUrl,
  amount,
  thicker,
  text,
}: StakedDataRowProps) => (
  <div className="mb-3 mt-3 flex flex-col gap-5">
    <span className="text-sm text-step-label">{text}</span>
    <div className="flex gap-3 text-step-label">
      {Icon}
      <Image src={imageUrl} alt="step token" height={30} width={30} />
      <span>{amount}</span>
      <span className="font-semibold">{thicker}</span>
    </div>
  </div>
);

type SuccessNProps = {
  sig: string;
  minusAmount: string;
  plusAmount: string;
};

const SuccessStakingNotification = ({
  sig,
  minusAmount,
  plusAmount,
}: SuccessNProps) => (
  <NotificationTemplate title="You staked STEP" type="success" sig={sig}>
    <StakedDataRow
      text="You stake:"
      amount={minusAmount}
      Icon={<MinusIcon {...defaultIconSize} className="fill-step-accent" />}
      imageUrl={stepTokenImgUrl}
      thicker="STEP"
    />
    <StakedDataRow
      text="You received:"
      amount={plusAmount}
      Icon={<PlusIcon {...defaultIconSize} className="fill-step-accent" />}
      imageUrl={xStepTokenImgUrl}
      thicker="xSTEP"
    />
  </NotificationTemplate>
);

const SuccessUnstakingNotification = ({
  minusAmount,
  plusAmount,
  sig,
}: SuccessNProps) => (
  <NotificationTemplate title="You unstaked xSTEP" type="success" sig={sig}>
    <StakedDataRow
      text="You unstaked:"
      amount={minusAmount}
      Icon={<MinusIcon {...defaultIconSize} className="fill-step-accent" />}
      imageUrl={xStepTokenImgUrl}
      thicker="xSTEP"
    />
    <StakedDataRow
      text="You received:"
      amount={plusAmount}
      Icon={<PlusIcon {...defaultIconSize} className="fill-step-accent" />}
      imageUrl={stepTokenImgUrl}
      thicker="STEP"
    />
  </NotificationTemplate>
);

export {
  ErrorNotification,
  ApproveFromWalletNotification,
  YouAreStakingNotification,
  SuccessStakingNotification,
  SuccessUnstakingNotification,
};
