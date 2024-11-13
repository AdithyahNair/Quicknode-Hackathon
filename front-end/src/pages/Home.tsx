import { useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { ethers, formatEther, parseEther } from "ethers";
import { useMarketPlaceAddress } from "../hooks/tokenAddress";
import NFTMarketPlaceABI from "../abi/NFTMarketPlace.json";
import CryptoDashboard from "../components/CryptoDashboard";
import ExchangeRateGraph from "../components/ExchangeRateGraph";
interface Asset {
  tokenId: number;
  imageUrl: string;
  name: string;
  description: string;
  price: string;
  seller: string;
}

export default function Home() {
  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const marketPlaceAddress = useMarketPlaceAddress();

  const [assets, setAssets] = useState<Asset[]>([]);
  const [status, setStatus] = useState<string>("");

  const fetchListedNFTs = async () => {
    if (!walletClient) {
      setStatus("Wallet not connected.");
      return;
    }

    try {
      setStatus("Loading NFTs available for sale...");
      const provider = new ethers.BrowserProvider(walletClient);
      const contract = new ethers.Contract(
        marketPlaceAddress,
        NFTMarketPlaceABI.abi,
        provider
      );

      const listingCount = await contract.getListingCount();
      let listedAssets: Asset[] = [];

      for (let i = 0; i < listingCount; i++) {
        const listing = await contract.getListingByIndex(i);
        const { seller, price, nftContract, tokenId } = listing;
        const tokenURI = await new ethers.Contract(
          nftContract,
          ["function tokenURI(uint256 tokenId) view returns (string)"],
          provider
        ).tokenURI(tokenId);

        const metadata = await fetch(tokenURI).then((res) => res.json());
        listedAssets.push({
          tokenId: Number(tokenId),
          imageUrl: metadata.image,
          name: metadata.name,
          description: metadata.description,
          price: formatEther(price),
          seller,
        });
      }

      setAssets(listedAssets);
      setStatus("");
    } catch (error) {
      console.error("Error fetching NFTs for sale:", error);
      setStatus("Failed to load NFTs.");
    }
  };

  const handleBuyNFT = async (tokenId: number, price: string) => {
    if (!walletClient) {
      setStatus("Wallet not connected.");
      return;
    }

    try {
      setStatus("Processing purchase...");
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        marketPlaceAddress,
        NFTMarketPlaceABI.abi,
        signer
      );

      const tx = await contract.buyNFT(marketPlaceAddress, tokenId, {
        value: parseEther(price),
      });
      await tx.wait();
      setStatus("Purchase successful!");
      fetchListedNFTs(); // Refresh the list after purchase
    } catch (error) {
      console.error("Error purchasing NFT:", error);
      setStatus("Purchase failed.");
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchListedNFTs();
    }
  }, [isConnected]);

  return (
    <div>
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 mt-10 text-white p-10">
        <div className="text-center mb-12 mt-20">
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-4 drop-shadow-lg">
            NFTVerse
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Discover and purchase exclusive NFTs. Connect your wallet to explore
            the collection and make purchases directly from the marketplace.
          </p>
        </div>
      </div>

      <CryptoDashboard />

      <ExchangeRateGraph />
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen text-white p-10">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-semibold text-white mb-6">
            NFTs Available for Sale
          </h2>
          {status && <p className="text-gray-400">{status}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {assets.map((asset) => (
            <div
              key={asset.tokenId}
              className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center transform transition duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-700"
            >
              <img
                src={asset.imageUrl}
                alt={asset.name}
                className="w-full h-48 object-cover rounded-lg mb-4 shadow-md"
              />
              <h3 className="text-2xl font-semibold mb-2 text-white">
                {asset.name}
              </h3>
              <p className="text-gray-300 mb-2 text-sm">{asset.description}</p>
              <p className="text-indigo-400 font-semibold mb-2">
                Price: {asset.price} ETH
              </p>
              <p className="text-gray-500 mb-4">Token ID: {asset.tokenId}</p>
              <button
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
                onClick={() => handleBuyNFT(asset.tokenId, asset.price)}
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>

        {!assets.length && !status && (
          <p className="text-center text-gray-400 mt-12">
            No NFTs are listed for sale at the moment.
          </p>
        )}
      </div>
    </div>
  );
}
