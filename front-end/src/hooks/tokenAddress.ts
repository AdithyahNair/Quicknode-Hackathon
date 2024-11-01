import { Address } from "viem";
import { useAccount } from "wagmi";
import {
  nftCollectionAddress,
  stakeAddress,
  pyusdTokenAddress,
  pynftCollectionAddress,
  betterCauseAddress,
  getBaseURL,
} from "../config";
import { base } from "viem/chains";

export function useNFTCollectionAddress(): Address {
  const { chain } = useAccount();
  return nftCollectionAddress(chain);
}

export function useStakeAddress(): Address {
  const { chain } = useAccount();
  return stakeAddress(chain);
}

export function usePYUSDTokenAddress(): Address {
  const { chain } = useAccount();
  return pyusdTokenAddress(chain);
}

export function usePYNFTCollectionAddress(): Address {
  const { chain } = useAccount();
  return pynftCollectionAddress(chain);
}

export function useBetterCauseAddress(): Address {
  const { chain } = useAccount();
  return betterCauseAddress(chain);
}

export function useBaseURL(): Promise<string> {
  const { chain } = useAccount();
  return getBaseURL(chain);
}
