import { type AccountInfo, type PublicKey } from "@solana/web3.js";

export interface IParsedAccountData {
  parsed: Parsed;
  program: string;
  space: number;
}

export interface Parsed {
  info: Info;
  type: string;
}

export interface Info {
  isNative: boolean;
  mint: string;
  owner: string;
  state: string;
  tokenAmount: TokenAmount;
}

export interface TokenAmount {
  amount: string;
  decimals: number;
  uiAmount: number;
  uiAmountString: string;
}

export interface ResponseCoinPrice {
  status: string;
  data: Data;
}

export interface Data {
  coin: Coin;
}

export interface Coin {
  uuid: string;
  symbol: string;
  name: string;
  description: string;
  color: string;
  iconUrl: string;
  websiteUrl: string;
  marketCap: string;
  fullyDilutedMarketCap: string;
  price: string;
  btcPrice: string;
  priceAt: number;
  change: string;
  rank: number;
  sparkline: Array<null | string>;
  coinrankingUrl: string;
  tier: number;
}

export type StakeButtonTextType =
  | "insufficientStep"
  | "insufficientXstep"
  | "enterAmount"
  | "approveFromWallet"
  | "stake"
  | "unstake";

export type RpcTokensResponse = {
  pubkey: PublicKey;
  account: AccountInfo<IParsedAccountData>;
};
