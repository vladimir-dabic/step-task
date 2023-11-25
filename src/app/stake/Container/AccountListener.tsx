import React, { useEffect } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { AccountChangeCallback, PublicKey } from "@solana/web3.js";

type Props = {
  onAccountChange: AccountChangeCallback;
  stepAccount: PublicKey | undefined;
  xStepAccount: PublicKey | undefined;
};

const AccountListener = ({
  onAccountChange,
  stepAccount,
  xStepAccount,
}: Props) => {
  const { connection } = useConnection();

  /* Step streaming */
  useEffect(() => {
    let id: number;
    if (stepAccount) {
      id = connection.onAccountChange(stepAccount, onAccountChange);
    }

    return () => {
      connection.removeAccountChangeListener(id);
    };
  }, [stepAccount]);

  /* xStep streaming */
  // useEffect(() => {
  //   let id: number;
  //   if (xStepAccount) {
  //     id = connection.onAccountChange(xStepAccount, onAccountChange);
  //   }

  //   return () => {
  //     connection.removeAccountChangeListener(id);
  //   };
  // }, [stepAccount]);

  return null;
};

export default AccountListener;
