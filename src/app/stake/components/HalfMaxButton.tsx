import React, { type MouseEventHandler } from "react";

type Props = {
  text: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

const HalfMaxButton = ({ text, onClick }: Props) => (
  <button
    onClick={onClick}
    className="
      bg-step-dimmedAccent
      hover:bg-step-accent
      text-step-accent
      hover:text-step-dimmedAccent
      focus:outline-step-accent
      flex
      h-[20px]
      items-center
      p-[5px]
      text-[10px]
      font-bold
      transition
      duration-200
      ease-in-out
      focus:border-none
      "
  >
    <span>{text}</span>
  </button>
);

export default HalfMaxButton;
