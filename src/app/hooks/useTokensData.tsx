import { useCallback, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { type RpcTokensResponse } from "../types";
import { STEP_MINT_PUBKEY, XSTEP_MINT_PUBKEY } from "../constants";

const useTokensData = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const [stepToken, setStepToken] = useState<RpcTokensResponse | undefined>();
  const [xStepToken, setXstepToken] = useState<RpcTokensResponse | undefined>();

  const getTokensInfo = useCallback(async () => {
    if (!publicKey) return;

    try {
      const accounts = (await connection.getParsedProgramAccounts(
        TOKEN_PROGRAM_ID,
        {
          filters: [
            {
              dataSize: 165, // number of bytes
            },
            {
              memcmp: {
                offset: 32, // number of bytes
                bytes: publicKey?.toBase58(),
              },
            },
          ],
        },
      )) as RpcTokensResponse[];

      const step = accounts.find(
        (item) => item.account.data.parsed.info.mint === STEP_MINT_PUBKEY,
      );

      if (step) setStepToken(step);

      const xStep = accounts.find(
        (item) => item.account.data.parsed.info.mint === XSTEP_MINT_PUBKEY,
      );

      if (xStep) setXstepToken(xStep);
    } catch (err) {
      console.error(err);
    }
  }, [connection, publicKey]);

  return { getTokensInfo, stepToken, xStepToken };
};

export { useTokensData };
