import React from "react";
import Image from "next/image";
import { xStepTokenImgUrl } from "~/app/constants";

const StakeHeaderAndDescription = () => {
  return (
    <>
      <div className="mb-8 text-3xl font-bold">Stake STEP</div>
      <div className="text-step-description mb-8 font-thin">
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
            <span className="ml-3">xSTEP staking APY</span>
          </div>
          <span>14.43%</span>
        </div>
        <div className="mt-[32px]">
          <p className="mb-[10px] font-bold">{`"Where is my staking reward?"`}</p>
          <p className="text-step-description">
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
