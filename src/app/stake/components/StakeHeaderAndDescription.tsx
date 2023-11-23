import React from "react";
import Image from "next/image";
import { xStepTokenImgUrl } from "~/app/constants";

const StakeHeaderAndDescription = () => {
  return (
    <>
      <div className="mb-[30px] mt-[30px] flex justify-center">
        <Image
          src="/up-down-arrow-icon.svg"
          width={32}
          height={32}
          alt="stake icon"
        />
        <span className="ml-5 text-[28px] font-semibold">Stake STEP</span>
      </div>
      <div className="text-step-description mb-[36px] flex justify-center text-sm font-thin">
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
            <span className="ml-3 text-sm font-bold">xSTEP staking APY</span>
          </div>
          <span className="font-mono text-sm font-semibold">14.20%</span>
        </div>
        <div className="mt-[32px]">
          <p className="mb-[10px] text-sm font-bold">{`"Where is my staking reward?"`}</p>
          <p className="text-step-description text-sm font-extralight leading-[25px]">
            {`xSTEP is a yield bearing asset. This means it is automatically worth
            more STEP over time. You don't need to claim any rewards, or do
            anything other than hold your xSTEP to benefit from this. Later,
            when you unstake your xSTEP you will receive more STEP than you
            initially deposited.`}
          </p>
        </div>
      </div>
    </>
  );
};

export default StakeHeaderAndDescription;
