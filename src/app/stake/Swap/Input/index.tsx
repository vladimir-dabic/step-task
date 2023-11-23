import React, { type MouseEventHandler } from "react";
import Image from "next/image";
import HalfMaxButton from "../../components/HalfMaxButton";

type Props = {
  tokenName: string;
  tokenUrl: string;
  label: string;
  balance: number | null | undefined;
  onHalfClick?: MouseEventHandler<HTMLButtonElement>;
  onMaxClick?: MouseEventHandler<HTMLButtonElement>;
};

const SwapInput = ({
  tokenName,
  tokenUrl,
  label,
  balance,
  onHalfClick,
  onMaxClick,
}: Props) => {
  return (
    <div className="flex flex-col">
      <div className="mb-3 flex justify-between">
        <span className="text-sm">{label}</span>
        <div className="flex gap-1">
          <span className="text-step-label text-sm">
            Balance: <span className="font-mono">{balance ?? 0}</span>
          </span>
          {onHalfClick && <HalfMaxButton text="HALF" onClick={onHalfClick} />}
          {onMaxClick && <HalfMaxButton text="MAX" onClick={onMaxClick} />}
        </div>
      </div>
      <div className="flex h-[64px] w-full items-center rounded-md bg-black p-3">
        <div className="flex items-center">
          <Image src={tokenUrl} alt="step token" height={30} width={30} />
          <span className="ml-2 mr-2">{tokenName}</span>
        </div>
        <div className="flex flex-grow">
          <input
            className="
              placeholder:text-step-label
              ml-2
              h-[28px]
              w-full
              bg-black
              text-right
              font-mono
              focus:bg-none
              focus:outline-none
              "
            placeholder="0.00"
          />
        </div>
      </div>
    </div>
  );
};

export default SwapInput;
