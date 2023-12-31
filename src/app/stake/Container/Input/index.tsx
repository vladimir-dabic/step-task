import React, {
  useMemo,
  type ChangeEventHandler,
  type MouseEventHandler,
  type FocusEventHandler,
} from "react";
import Image from "next/image";
import BigNumber from "bignumber.js";

import { HalfMaxButton } from "../../components";

type Props = {
  tokenName: string;
  tokenUrl: string;
  label: string;
  balance: number | null | undefined;
  amount: string;
  price: string;
  onBlur: FocusEventHandler<HTMLInputElement>;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onHalfClick?: MouseEventHandler<HTMLButtonElement>;
  onMaxClick?: MouseEventHandler<HTMLButtonElement>;
};

const StakeInput = ({
  tokenName,
  tokenUrl,
  label,
  amount,
  price,
  balance,
  onHalfClick,
  onMaxClick,
  onChange,
  onBlur,
}: Props) => {
  const calculatedValue = useMemo(() => {
    const result = new BigNumber(price).times(amount).toFixed(2);
    return +result ? `$${result}` : `< $0.01`;
  }, [amount, price]);

  return (
    <div className="flex flex-col">
      <div className="mb-3 flex justify-between">
        <span className="text-sm">{label}</span>
        <div className="flex gap-1">
          <span className="text-sm text-step-label">
            Balance: <span className="font-mono">{balance ?? 0}</span>
          </span>
          {onHalfClick && <HalfMaxButton text="HALF" onClick={onHalfClick} />}
          {onMaxClick && <HalfMaxButton text="MAX" onClick={onMaxClick} />}
        </div>
      </div>
      <div className="flex h-[64px] w-full items-center rounded-md bg-black p-3">
        <div className="flex items-center">
          <Image src={tokenUrl} alt="step token" height={30} width={30} />
          <span className="ml-2 mr-2 text-sm font-semibold">{tokenName}</span>
        </div>
        <div className="flex flex-grow">
          <div className="flex w-full flex-col items-center">
            <div className="flex w-full">
              <input
                onBlur={onBlur}
                value={amount}
                onChange={onChange}
                className="
                  ml-2
                  h-[28px]
                  w-full
                  bg-black
                  text-right
                  font-mono
                  text-[18px]
                  font-bold
                  selection:bg-step-dimmedAccent
                  placeholder:text-step-label
                  focus:bg-none
                  focus:outline-none
                  "
                placeholder="0.00"
              />
            </div>
            {+amount ? (
              <div className="flex w-full justify-end text-[12px] ">
                <span className="font-mono text-step-label">
                  {calculatedValue}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakeInput;
