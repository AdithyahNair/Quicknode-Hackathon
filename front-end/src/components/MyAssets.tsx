import { useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { ethers } from "ethers";
import {
  useNFTCollectionAddress,
  usePYNFTCollectionAddress,
} from "../hooks/tokenAddress";
import NFT_ABI from "../abi/NFTCollection.json"; // Assuming both contracts share the same ABI
import PY_NFT_ABI from "../abi/PYNFT.json";
interface Asset {
  tokenId: number;
  imageUrl: string;
  name: string;
  description: string;
}

export default function MyAssets() {
  const { isConnected, address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const nftCollectionAddress = useNFTCollectionAddress();
  const pynftCollectionAddress = usePYNFTCollectionAddress();

  const [assets, setAssets] = useState<Asset[]>([]);
  const [status, setStatus] = useState<string>("");

  const fetchUserAssets = async () => {
    if (!walletClient || !address) {
      setStatus("Wallet not connected or address unavailable.");
      return;
    }

    try {
      setStatus("Loading your assets...");

      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();

      const contracts = [
        new ethers.Contract(nftCollectionAddress, NFT_ABI.abi, signer),
      ];

      let userAssets: Asset[] = [];

      for (const contract of contracts) {
        const totalIssued = await contract.totalIssued();
        console.log(totalIssued);
        for (let i = 0; i < totalIssued; i++) {
          const owner = await contract.ownerOf(i);
          const tokenURI = await contract.tokenURI(i);
          console.log(tokenURI);
          const metadata = await fetch(tokenURI).then((res) => res.json());
          console.log("meta: ", metadata);
          if (owner == address)
            userAssets.push({
              tokenId: i,
              imageUrl: metadata.image,
              name: metadata.name,
              description: metadata.description,
            });
          console.log(userAssets);
        }
      }
      console.log(userAssets);
      console.log("userAssets: ", userAssets);
      setAssets(userAssets);
      setStatus("");
    } catch (error) {
      console.error("Error fetching assets:", error);
      setStatus("Failed to load assets.");
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchUserAssets();
    }
  }, [isConnected]);

  return (
    <div className="bg-[#1A202C] p-10 rounded-lg shadow-lg max-w-xxl mx-auto mt-10 text-white">
      <h1 className="text-3xl font-bold text-center mb-6">My Assets</h1>

      {status && <p className="text-center text-gray-400">{status}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {assets.map((asset) => (
          <div
            key={asset.tokenId}
            className="bg-gray-800 p-4 rounded-lg shadow-lg text-center"
          >
            <img
              src={asset.imageUrl}
              alt={asset.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{asset.name}</h2>
            <p className="text-gray-300 mb-2">{asset.description}</p>
            <p className="text-gray-500">Token ID: {asset.tokenId}</p>
          </div>
        ))}
      </div>

      {!assets.length && !status && (
        <p className="text-center text-gray-400 mt-6">
          No assets found. Mint an NFT to see it here.
        </p>
      )}
    </div>
  );
}
