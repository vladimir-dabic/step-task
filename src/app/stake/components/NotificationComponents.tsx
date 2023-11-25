import React, { MouseEventHandler, ReactNode } from "react";
import {
  XCircleIcon,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";

type TemplateProps = {
  title: string;
  type: "info" | "progress" | "error" | "success";
  children?: ReactNode;
  sig?: string;
};

const IconOptions = {
  height: 34,
  width: 34,
};

const NotificationTemplate = ({
  title,
  children,
  type,
  // LeftIcon,
  sig, // onViewOnSolscanClick,
}: TemplateProps) => {
  return (
    <div
      className="
        bg-step-paper
        min-w-[384px]
        rounded-lg
        p-[20px]
        shadow-lg
        "
    >
      <div className="flex h-full">
        <div className="flex items-center">
          {type === "error" && (
            <XCircleIcon width={22} height={22} className="mr-4 fill-red-500" />
          )}
          {type === "success" && (
            <CheckCircleIcon
              width={22}
              height={22}
              className="mr-4 fill-green-500"
            />
          )}
          {(type === "progress" || type === "info") && (
            <EllipsisHorizontalIcon
              width={32}
              height={32}
              className="mr-4 fill-blue-500"
            />
          )}
        </div>
        <div className="flex w-full flex-col justify-between gap-3">
          <span className="w-full font-bold">{title}</span>
          {children}
          {/* <span className="text-step-label">Transaction rejected</span> */}
          {sig && (
            <div className="flex justify-end ">
              <button
                className="
                border-step-disabled
                flex
                items-center
                gap-3
                border
                p-1
                px-3
                "
              >
                <span className="text-step-accent text-sm font-thin">
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
    <span className="text-step-label text-sm">Transaction rejected</span>
  </NotificationTemplate>
);

const ApproveFromWalletNotification = () => (
  <NotificationTemplate
    title="Approve transactions from your wallet"
    type="info"
  />
);

const YouAreStakingNotification = ({ sig }: { sig: string }) => (
  <NotificationTemplate title="You are staking" type="progress" sig={sig}>
    <span className="text-step-label text-sm">Confirmation is in progress</span>
  </NotificationTemplate>
);

export {
  ErrorNotification,
  ApproveFromWalletNotification,
  YouAreStakingNotification,
};
