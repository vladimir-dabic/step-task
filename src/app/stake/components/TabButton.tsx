import React, { type MouseEventHandler, type FC } from "react";
import clsx from "clsx";
import { type SvgComponentProps } from "./SvgComponents";

type Props = {
  title: string;
  selected: boolean;
  SvgComponent: FC<SvgComponentProps>;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

const accentColor = "#08d69f";
const dimmedTextColor = "#7d7d7d";

const TabButton = ({ title, selected, SvgComponent, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        { ["text-step-accent"]: selected },
        { ["bg-step-dimmedPaper"]: !selected },
        { ["text-step-label"]: !selected },
        "bg-step-paper",
        "w-[150px]",
        "hover:text-step-accent",
        "rounded-t-lg",
        "p-3",
        "text-sm",
        "font-bold",
        "focus:outline-none",
        "transition-colors",
        "ease-in-out",
        "duration-150",
      )}
    >
      <div className="flex items-center justify-center">
        <SvgComponent fill={selected ? accentColor : dimmedTextColor} />
        <span className="ml-[15px] font-bold">{title}</span>
      </div>
    </button>
  );
};

export default TabButton;
