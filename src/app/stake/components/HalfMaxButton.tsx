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
      focus:border-step-accent
      flex
      h-[20px]
      items-center
      p-[5px]
      text-[10px]
      font-bold
      transition
      duration-200
      ease-in-out
      focus:border
      focus:outline-none
      "
    // focus:outline-step-accent
    // focus:border-red-400
    // focus:outline-offset-0
    // focus:ring
    // focus:ring-offset-0
    // focus:outline-none
    // focus:bg-black
  >
    <span>{text}</span>
  </button>
);

export default HalfMaxButton;
