import React from "react";
import Image from "next/image";

type Props = {
  tokenName: string;
  tokenUrl: string;
  label: string;
};

const SwapInput = ({ tokenName, tokenUrl, label }: Props) => {
  return (
    <div className="flex flex-col">
      <div className="mb-3 flex justify-between">
        <span className="text-sm">{label}</span>
        <span className="text-step-label text-sm">Balance:</span>
      </div>
      <div className="flex w-full items-center rounded-md bg-black p-3">
        <div className="flex items-center">
          <Image src={tokenUrl} alt="step token" height={30} width={30} />
          <span className="ml-2 mr-2">{tokenName}</span>
        </div>
        <div className="flex flex-grow">
          <input
            className="placeholder:text-step-label ml-2 h-[28px] w-full bg-black text-right focus:bg-none focus:outline-none"
            placeholder="0.00"
          />
        </div>
      </div>
    </div>
  );
};

export default SwapInput;
