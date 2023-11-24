import React, { type MouseEventHandler } from "react";
import { type StakeButtonTextType } from "~/app/types";

type Props = {
  textType: StakeButtonTextType;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

const lookupText = {
  insufficientStep: "Insufficient STEP balance",
  insufficientXstep: "Insufficient xSTEP balance",
  enterAmount: "Enter an amount",
  stake: "Stake",
};

const StakeButton = ({ textType, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      disabled={textType !== "stake"}
      className="
      disabled:bg-step-disabled
      disabled:text-step-description
      bg-step-dimmedAccent
      hover:bg-step-accent
      text-step-accent
      hover:text-step-dimmedAccent
      focus:outline-step-accent
      mt-6
      h-[60px]
      w-full
      p-[10px]
      transition
      duration-200
      ease-in-out
      disabled:cursor-not-allowed
      "
    >
      <span className="font-bold ">{lookupText[textType]}</span>
    </button>
  );
};
export default StakeButton;
