// "use client";

import React from "react";

import Swap from "./Container";
import { getPrice } from "../api";

const Stake = async () => {
  const price = await getPrice();
  return <Swap price={price.data.coin.price} />;
};

export default Stake;
