// hooks/useMintNFT.ts
import { useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import NFTCollection from "../abi/NFTCollection.json";
import { useWalletClient } from "wagmi";

export function useMintNFT(paymentToken: string) {
  const { data: walletClient } = useWalletClient();
  const [status, setStatus] = useState<string>("");

  const mintNFT = async (
    imageUrl: string,
    nftName: string,
    nftDescription: string,
    prompt: string
  ) => {
    if (!walletClient) {
      setStatus("Wallet not connected. Please connect your wallet.");
      return;
    }

    try {
      setStatus("Minting...");

      const metadata = {
        name: nftName || "AI NFT",
        description:
          nftDescription || `An AI-generated NFT based on: ${prompt}`,
        image: imageUrl,
      };
      console.log("metadata", metadata);

      const metadataResponse = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        metadata,
        {
          headers: {
            pinata_api_key: import.meta.env.VITE_PINATA_API_KEY!,
            pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_API_KEY!,
          },
        }
      );
      console.log("metadataResponse", metadataResponse.data);

      const ipfsHash = metadataResponse.data.IpfsHash;
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        paymentToken,
        NFTCollection.abi,
        signer
      );

      const transaction = await contract.publicMint(
        `https://pink-absolute-catshark-415.mypinata.cloud/ipfs/${ipfsHash}`
      );
      setStatus(`Minting in progress... Transaction Hash: ${transaction.hash}`);
      await transaction.wait();
      setStatus(`Minted successfully! Transaction Hash: ${transaction.hash}`);
    } catch (error) {
      console.error("Error minting NFT:", error);
      setStatus("Minting failed.");
    }
  };

  return { mintNFT, status };
}
