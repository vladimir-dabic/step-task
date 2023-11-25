import BigNumber from "bignumber.js";
import { STEP_DECIMALS } from "./constants";

/**
 * Checks if a string representation of a number has valid amount of decimals.
 *
 * @param num - The number as a string.
 * @param decimals - The maximum number of valid decimals.
 * @returns `true` if the number has valid amount of decimals, `false` otherwise.
 */
const hasValidDecimals = (num: string, decimals: number) => {
  const decimalPartLength = num.split(".")[1]?.length;
  if (!decimalPartLength) return true;

  return decimals >= decimalPartLength;
};

/**
 * Checks if the given input is a valid positive number.
 * @param input The input to be checked.
 * @returns True if the input is a valid positive number, false otherwise.
 */
const isValidPositiveNumber = (input: string): boolean => {
  const numberAmount = Number(input);
  const notValidAmount = isNaN(numberAmount) || numberAmount < 0;

  if (notValidAmount) {
    return false;
  }
  return true;
};

const resolveAmountInput = (inputValue: string, decimals: number) => {
  /* trim and replace input value */
  const value = inputValue.includes(",")
    ? inputValue.replace(",", ".")
    : inputValue.trim();

  const isValid = isValidPositiveNumber(value);

  /* automatically convert . */
  if (value === "." || value === ",") {
    return "0.";
  }

  /* 👇 Do not allow input more decimals than token should have  */
  if (!hasValidDecimals(value, decimals) || !isValid) {
    throw new Error("More decimals then allowed or input is not valid.");
  }

  return value;
};

/**
 * Converts a number to a regular decimal format with the specified number of decimal places.
 * Trailing and starting zeros are removed from the result.
 * @param num - The number to be converted.
 * @param decimals - The number of decimal places to display if number is < 1.
 * @returns The converted number as a string without trailing zeros.
 */
const convertToRegularNum = (
  num: string | number | BigNumber,
  decimals = STEP_DECIMALS,
) => {
  return new BigNumber(num).toFixed(decimals).replace(/\.?0+$/, "");
};

/**
 * Converts an amount represented as a string, number, or BigNumber from decimal to token format.
 *
 * @param input - The decimal value to convert.
 * @param decimals - The number of decimal places used in the input value.
 * @returns The converted value as a string.
 */
const convertDecimalsToAmount = (
  input: string | number | BigNumber,
  decimals = STEP_DECIMALS,
) => {
  const powerOfTen = new BigNumber(10).pow(decimals);
  return new BigNumber(input)
    .times(powerOfTen)
    .toFixed(0, BigNumber.ROUND_FLOOR);
};

export {
  convertDecimalsToAmount,
  hasValidDecimals,
  isValidPositiveNumber,
  resolveAmountInput,
  convertToRegularNum,
};
