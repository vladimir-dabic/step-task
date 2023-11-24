"use client";

import React, { useMemo, type ReactNode } from "react";
import Image from "next/image";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
import {
  UnsafeBurnerWalletAdapter,
  SolflareWalletAdapter,
  LedgerWalletAdapter,
  TorusWalletAdapter,
  Coin98WalletAdapter,
  SolongWalletAdapter,
  MathWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

import { env } from "~/env.mjs";
import { AutoConnectProvider, useAutoConnect } from "./AutoConnectProvider";
import { stepLogoImgUrl } from "../constants";
import "./layout.css";

// require("@solana/wallet-adapter-react-ui/styles.css");

const WalletContextProvider = ({ children }: { children: ReactNode }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Mainnet;
  const { autoConnect } = useAutoConnect();

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new SolflareWalletAdapter(),
      new UnsafeBurnerWalletAdapter(),
      new LedgerWalletAdapter(),
      new TorusWalletAdapter(),
      /*TODO: Install (no link) */
      new Coin98WalletAdapter(),
      new SolongWalletAdapter(),
      new MathWalletAdapter(),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network],
  );

  return (
    <ConnectionProvider endpoint={env.NEXT_PUBLIC_SOLANA_RPC_URL}>
      <WalletProvider wallets={wallets} autoConnect={autoConnect}>
        <WalletModalProvider>
          <nav className="flex justify-between p-5">
            <Image
              src={stepLogoImgUrl}
              alt="Step finance name and logo"
              width={110}
              height={40}
            />
            <WalletMultiButton />
          </nav>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AutoConnectProvider>
      <WalletContextProvider>{children}</WalletContextProvider>
    </AutoConnectProvider>
  );
};
