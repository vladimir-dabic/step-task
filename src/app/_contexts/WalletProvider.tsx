"use client";

import React, { useMemo, type ReactNode } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
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
import { clusterApiUrl } from "@solana/web3.js";
import Image from "next/image";
import "./layout.css";
import { AutoConnectProvider, useAutoConnect } from "./AutoConnectProvider";
import { stepLogoImgUrl } from "../constants";

// require("@solana/wallet-adapter-react-ui/styles.css");

const WalletContextProvider = ({ children }: { children: ReactNode }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;
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
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={autoConnect}>
        <WalletModalProvider>
          {/* <div className="flex flex-col"> */}
          <nav className="flex justify-between p-5">
            <Image
              src={stepLogoImgUrl}
              alt="Step finance name and logo"
              width={100}
              height={40}
            />
            <WalletMultiButton />
          </nav>
          {children}
          {/* </div> */}
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
