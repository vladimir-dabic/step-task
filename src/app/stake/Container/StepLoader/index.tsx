import Image from "next/image";
import React from "react";
import { stepChartImgUrl } from "~/app/constants";

const StepLoader = ({ connecting }: { connecting: boolean }) => {
  return (
    <div className="flex h-[60vh] flex-col justify-center">
      <div className="flex flex-col items-center">
        <Image
          src={stepChartImgUrl}
          alt="Step finance logo"
          width={160}
          height={160}
        />
        <span className="mt-[40px] text-[20px]">
          {!connecting ? "Please connect wallet" : "Connecting your wallet..."}
        </span>
      </div>
    </div>
  );
};

export default StepLoader;
