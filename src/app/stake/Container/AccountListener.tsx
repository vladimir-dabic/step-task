import { useEffect } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { type AccountChangeCallback, type PublicKey } from "@solana/web3.js";

type Props = {
  onAccountChange: AccountChangeCallback;
  stepAccount: PublicKey | undefined;
  xStepAccount: PublicKey | undefined;
};

const AccountListener = ({ onAccountChange, stepAccount }: Props) => {
  const { connection } = useConnection();

  /* Step streaming */
  useEffect(() => {
    let id: number;
    if (stepAccount) {
      id = connection.onAccountChange(
        stepAccount,
        onAccountChange,
        "finalized",
      );
    }

    return () => {
      if (id) void connection.removeAccountChangeListener(id);
    };
  }, [connection, onAccountChange, stepAccount]);

  return null;
};

export default AccountListener;
