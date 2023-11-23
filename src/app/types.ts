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
