import { ethers } from "ethers";

export const parseEthToWei = (val: number) => {
  if (!val) return 0;
  return val * 10 ** 18;
};

export const parseWeiToEth = (val: number) => {
  if (!val) return "0";
  return ethers.utils.formatEther(val.toString());
};
