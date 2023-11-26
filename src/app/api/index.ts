import { env } from "~/env.mjs";
import { type ResponseCoinPrice } from "../types";

const stepUUID = "n9lqqcJddG";

export const getPrice = async () => {
  const options = {
    headers: {
      "x-access-token": env.COIN_RANKING_API_KEY,
    },
  };

  try {
    const res = await fetch(
      `https://api.coinranking.com/v2/coin/${stepUUID}`,
      options,
    );

    if (!res.ok) {
      throw new Error("Something went wrong");
    }

    const result = (await res.json()) as ResponseCoinPrice;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result;
  } catch (err) {
    // HARDCODE, sorry :)
    return { data: { coin: { price: "0.03429868910591864" } } };
  }
};
