import { useEffect } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { type AccountChangeCallback, type PublicKey } from "@solana/web3.js";

type Props = {
  onAccountChangeConfirmed: AccountChangeCallback;
  stepAccount: PublicKey | undefined;
  xStepAccount: PublicKey | undefined;
};

const AccountListener = ({ onAccountChangeConfirmed, stepAccount }: Props) => {
  const { connection } = useConnection();

  /* Step streaming | Confirmed */
  useEffect(() => {
    let id: number;

    if (stepAccount) {
      id = connection.onAccountChange(
        stepAccount,
        onAccountChangeConfirmed,
        "confirmed",
      );
    }

    return () => {
      if (id) void connection.removeAccountChangeListener(id);
    };
  }, [connection, onAccountChangeConfirmed, stepAccount]);

  return null;
};

export default AccountListener;
