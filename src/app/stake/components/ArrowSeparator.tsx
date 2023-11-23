import React from "react";
import Image from "next/image";

const ArrowSeparator = () => (
  <div className="my-3 flex justify-center">
    <Image src="/down-arrow.svg" width={28} height={28} alt="down arrow" />
  </div>
);

export default ArrowSeparator;
