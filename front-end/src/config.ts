import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { Address, Chain, http } from "viem";
import { sepolia, localhost, skaleNebulaTestnet } from "viem/chains";

export function pyusdTokenAddress(chain: Chain | undefined): Address {
  if (!chain) {
    throw new Error("Chain is undefined. Please connect to a valid network.");
  }

  switch (chain) {
    case sepolia:
    case localhost:
    case skaleNebulaTestnet:
      // PYUSD Sepolia
      return "0xE3cfc35657847542FFa634eECDE25586ECF0FB74";
    default:
      throw new Error(
        `Payment token address not configured for chain ${chain.name}`
      );
  }
}

export function pynftCollectionAddress(chain: Chain | undefined): Address {
  if (!chain) {
    throw new Error("Chain is undefined. Please connect to a valid network.");
  }

  switch (chain) {
    case sepolia:
    case localhost:
    case skaleNebulaTestnet:
      return "0x9c252EB3103E7c0d560E83224E78FaAd5177b11c";
    default:
      throw new Error(
        `NFT collection address not configured for chain ${chain.name}`
      );
  }
}
export function nftCollectionAddress(chain: Chain | undefined): Address {
  if (!chain) {
    throw new Error("Chain is undefined. Please connect to a valid network.");
  }

  switch (chain) {
    case sepolia:
    case localhost:
    case skaleNebulaTestnet:
      return "0x197f1BBD362e13A4f64a35ca8e8a888113d7a80f";
    default:
      throw new Error(
        `NFT collection address not configured for chain ${chain.name}`
      );
  }
}

export function stakeAddress(chain: Chain | undefined): Address {
  if (!chain) {
    throw new Error("Chain is undefined. Please connect to a valid network.");
  }

  switch (chain) {
    case sepolia:
    case localhost:
    case skaleNebulaTestnet:
      return "0xe25E49d9C5BbAf5DB4ee49EF2c7caC24d5bD0536";
    default:
      throw new Error(`Stake address not configured for chain ${chain.name}`);
  }
}

if (!import.meta.env.VITE_WALLETCONNECT_PROJECT_ID) {
  throw new Error("VITE_WALLETCONNECT_PROJECT_ID is not set");
}

if (!import.meta.env.VITE_SEPOLIA_RPC_URL) {
  console.warn("VITE_SEPOLIA_RPC_URL is not set, using public RPC URL");
}

export const wagmiConfig = getDefaultConfig({
  appName: "hackathon",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  chains: [sepolia, localhost, skaleNebulaTestnet], // Ensure these are correctly imported and configured
  transports: {
    [localhost.id]: http("http://localhost:8545"),
    [sepolia.id]: http(import.meta.env.VITE_SEPOLIA_RPC_URL || ""),
    [skaleNebulaTestnet.id]: http(
      "https://testnet.skalenodes.com/v1/lanky-ill-funny-testnet"
    ),
  },
});
