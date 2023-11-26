import { useEffect, useState } from "react";
import {
  AnchorProvider,
  getProvider,
  setProvider,
  Program,
  type Provider,
  type Idl,
  web3,
} from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import idl from "~/app/idl/step_staking.json";
import { STEP_MINT_PUBKEY, XSTEP_MINT_PUBKEY } from "../constants";
import BigNumber from "bignumber.js";

const programId = new PublicKey("Stk5NCWomVN3itaFjLu382u9ibb5jMSHEsh6CuhaGjB");
const stepMintPubkey = new PublicKey(STEP_MINT_PUBKEY);
const xStepMintPubkey = new PublicKey(XSTEP_MINT_PUBKEY);

const useAnchorData = ({ price }: { price: string }) => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  const [program, setProgram] = useState<Program<Idl>>();
  const [vaultPubkey, setVaultPubkey] = useState<PublicKey>();
  const [vaultBump, setVaultBump] = useState<number>();
  const [stepPerXstepRatio, setStepPerXstepRatio] = useState<string>();
  const [xPrice, setXPrice] = useState("");

  const setupAnchorAndEmitPrice = async () => {
    if (!wallet) return;

    let provider: Provider;
    try {
      provider = getProvider();
    } catch {
      provider = new AnchorProvider(connection, wallet, {
        commitment: "processed",
      });
      setProvider(provider);
    }

    const program = new Program(idl as Idl, programId);
    setProgram(program);

    // TODO: fix deprecated
    try {
      const [_vaultPubkey, _vaultBump] =
        await web3.PublicKey.findProgramAddress(
          [stepMintPubkey.toBuffer()],
          program.programId,
        );
      setVaultPubkey(_vaultPubkey);
      setVaultBump(_vaultBump);

      /* @ts-expect-error  because! :D */
      const res = await program.simulate.emitPrice({
        accounts: {
          tokenMint: stepMintPubkey,
          xTokenMint: xStepMintPubkey,
          tokenVault: _vaultPubkey,
        },
      });
      if (res) {
        const ratio = res.events[0]?.data.stepPerXstep as string;
        setStepPerXstepRatio(ratio);
        const _xPrice = new BigNumber(price).times(ratio).toString();
        setXPrice(_xPrice);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    void setupAnchorAndEmitPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet]);

  return { program, vaultBump, vaultPubkey, stepPerXstepRatio, xPrice };
};

export { useAnchorData };
