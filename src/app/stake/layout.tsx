import React from "react";
import { ContextProvider } from "../contexts/WalletProvider";

export default function StakeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ContextProvider>
      <main className="mb-10 flex flex-col items-center justify-start">
        {children}
      </main>
    </ContextProvider>
  );
}
