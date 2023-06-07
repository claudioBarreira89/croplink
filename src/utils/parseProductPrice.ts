import { ethers } from "ethers";

export const parseEthToWei = (val: number) => {
  if (!val) return 0;
  return ethers.parseUnits(val.toString(), 18);
};

export const parseWeiToEth = (val: number) => {
  if (!val) return "0";
  return ethers.formatEther(val.toString());
};
