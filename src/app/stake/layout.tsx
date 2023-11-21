import React from "react";
import { ContextProvider } from "../_contexts/WalletProvider";

export default function StakeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ContextProvider>
      <main className="flex flex-col items-center justify-start">
        {children}
      </main>
    </ContextProvider>
  );
}
