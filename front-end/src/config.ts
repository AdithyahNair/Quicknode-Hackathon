import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { Address, Chain, http } from "viem";
import {
  sepolia,
  localhost,
  skaleNebulaTestnet,
  polygonAmoy,
} from "viem/chains";

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
      return "0xB74D3F25EE0B718bb80F657381b81c81E13Df4d0";
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
    case polygonAmoy:
      return "0xACEBf59C1bF0FdA1e5B936034aE6b57fB82ab770";
    case skaleNebulaTestnet:
      return "0x7C476D3335E187606c4323e2c55C188Bf9B37D25";
    default:
      throw new Error(
        `NFT collection address not configured for chain ${chain.name}`
      );
  }
}

export function betterCauseAddress(chain: Chain | undefined): Address {
  if (!chain) {
    throw new Error("Chain is undefined. Please connect to a valid network.");
  }

  switch (chain) {
    case sepolia:
    case localhost:
    case polygonAmoy:
      return "0x823e797e0942801361bE2710e5D230Ed93AFB450";
    case skaleNebulaTestnet:
      return "0xC36De8D9CE34Cc32C7F411F7785e84eF94f881a1";
    default:
      throw new Error(
        `NFT collection address not configured for chain ${chain.name}`
      );
  }
}
// Skale: 0xC36De8D9CE34Cc32C7F411F7785e84eF94f881a1
// Amoy: 0x823e797e0942801361bE2710e5D230Ed93AFB450

// NFTCollection deployed to: 0xACEBf59C1bF0FdA1e5B936034aE6b57fB82ab770
// RewardToken deployed to: 0x391371AC48F31fb5136ecC14B27d1aB547326d40
// NFTStaking deployed to: 0xbd88E8CDAE3b6EcfD9513182288c5A95271d2386

export function stakeAddress(chain: Chain | undefined): Address {
  if (!chain) {
    throw new Error("Chain is undefined. Please connect to a valid network.");
  }

  switch (chain) {
    case sepolia:
    case localhost:
    case polygonAmoy:
      return "0xbd88E8CDAE3b6EcfD9513182288c5A95271d2386";
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
  chains: [sepolia, localhost, skaleNebulaTestnet, polygonAmoy], // Ensure these are correctly imported and configured
  transports: {
    [localhost.id]: http("http://localhost:8545"),
    [sepolia.id]: http(import.meta.env.VITE_SEPOLIA_RPC_URL || ""),
    [skaleNebulaTestnet.id]: http(
      "https://testnet.skalenodes.com/v1/lanky-ill-funny-testnet"
    ),
    [polygonAmoy.id]: http("https://polygon-amoy.drpc.org"),
  },
});
