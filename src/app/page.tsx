import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-[#D94C00] to-[#108AB2] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Step Finance Coding Task
        </h1>
        <div className="grid grid-cols-1 gap-4  md:gap-8">
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-[white]/10 p-4 text-white hover:bg-[white]/20"
            href="/stake"
          >
            <h3 className="text-2xl font-bold">Go to task →</h3>
            <div className="text-lg">
              Create a Next.js application which allows a user to connect their
              Solana wallet and perform stake and unstake of the STEP token to
              the Step Staking program.
              <div className="flex justify-center">
                <Image
                  src="https://app.step.finance/static/media/step-disconnected-logo.e20a4f8b7497afdf9784416de8ed9862.svg"
                  alt="Step finance logo"
                  width={40}
                  height={40}
                />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
