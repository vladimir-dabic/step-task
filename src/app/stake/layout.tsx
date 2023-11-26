import React from "react";
import { ContextProvider } from "../contexts";
import { Toaster } from "react-hot-toast";

export default function StakeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ContextProvider>
      <main
        className="
        mt-[75px]
        flex
        h-screen
        flex-col
        items-center
        justify-start
        "
      >
        {children}
      </main>
      <Toaster
        position="bottom-left"
        toastOptions={{
          duration: 6000,
        }}
      />
    </ContextProvider>
  );
}
