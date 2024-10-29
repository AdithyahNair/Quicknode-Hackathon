import React, { useState, ChangeEvent, useEffect } from "react";
import axios from "axios";
import { useAccount, useWalletClient } from "wagmi";
import { useMintNFT } from "../hooks/useMintNFT";
import {
  usePYUSDTokenAddress,
  usePYNFTCollectionAddress,
} from "../hooks/tokenAddress";
import { ethers } from "ethers";

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY!;
const PINATA_SECRET_API_KEY = import.meta.env.VITE_PINATA_SECRET_API_KEY!;

export default function MintWithPYUSD() {
  const [prompt, setPrompt] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [nftName, setNftName] = useState<string>("");
  const [nftDescription, setNftDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [approved, setApproved] = useState<boolean>(false);
  const [mintPrice, setMintPrice] = useState<string>("");

  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const nftCollectionAddress = usePYNFTCollectionAddress();
  const pyusdTokenAddress = usePYUSDTokenAddress();

  const { mintNFT, status: mintingStatus } = useMintNFT(nftCollectionAddress);

  // Convert mint price to the appropriate format without parseUnits
  const convertMintPriceToWei = (price: string) => {
    const decimals = 6; // Assuming 6 decimals for PYUSD
    return BigInt(price) * BigInt(10 ** decimals);
  };

  useEffect(() => {
    const checkApproval = async () => {
      if (!walletClient || !mintPrice) return;

      try {
        const provider = new ethers.BrowserProvider(walletClient);
        const signer = await provider.getSigner();
        const pyusdToken = new ethers.Contract(
          pyusdTokenAddress,
          [
            "function allowance(address owner, address spender) view returns (uint256)",
          ],
          signer
        );

        const allowance = await pyusdToken.allowance(
          await signer.getAddress(),
          nftCollectionAddress
        );
        setApproved(allowance >= convertMintPriceToWei(mintPrice));
      } catch (error) {
        console.error("Error checking approval:", error);
      }
    };

    if (isConnected && walletClient) {
      checkApproval();
    }
  }, [
    isConnected,
    walletClient,
    nftCollectionAddress,
    pyusdTokenAddress,
    mintPrice,
  ]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);

    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        setImageUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateImage = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        "https://api.openai.com/v1/images/generations",
        {
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );

      setImageUrl(response.data.data[0].url);
      setLoading(false);
    } catch (error) {
      console.error("Error generating image:", error);
      setLoading(false);
    }
  };

  const uploadImageToIPFS = async () => {
    if (!imageFile) throw new Error("No image file selected");
    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: Infinity,
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_API_KEY,
          },
        }
      );
      const ipfsHash = res.data.IpfsHash;
      return `https://pink-absolute-catshark-415.mypinata.cloud/ipfs/${ipfsHash}`;
    } catch (error) {
      console.error("Error uploading image to IPFS:", error);
      throw error;
    }
  };

  const handleApprovePYUSD = async () => {
    if (!walletClient) {
      console.error("Wallet not connected");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const pyusdToken = new ethers.Contract(
        pyusdTokenAddress,
        [
          "function approve(address spender, uint256 amount) public returns (bool)",
        ],
        signer
      );

      const mintPriceInWei = convertMintPriceToWei(mintPrice); // Convert mintPrice manually
      const tx = await pyusdToken.approve(nftCollectionAddress, mintPriceInWei);
      await tx.wait();
      setApproved(true);
      console.log("PYUSD approved for NFT minting");
    } catch (error) {
      console.error("Error approving PYUSD:", error);
    }
  };

  const handleMintNFTWithPYUSD = async () => {
    let imageToUpload = imageUrl;
    if (imageFile) {
      try {
        imageToUpload = await uploadImageToIPFS();
      } catch (error) {
        console.error("Error during IPFS upload:", error);
        return;
      }
    }

    await mintNFT(imageToUpload, nftName, nftDescription, prompt);
  };

  return (
    <div className="bg-[#1A202C] p-10 rounded-lg shadow-lg max-w-2xl mx-auto mt-10 text-white">
      <h1 className="text-3xl font-bold text-center mb-6 text-gradient">
        Mint Your NFT with PYUSD
      </h1>

      {isConnected && (
        <div>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">NFT Name</label>
            <input
              type="text"
              value={nftName}
              onChange={(e) => setNftName(e.target.value)}
              placeholder="Enter NFT Name"
              className="w-full p-3 border border-gray-600 rounded-lg bg-[#2D3748] text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 mb-2">NFT Description</label>
            <textarea
              value={nftDescription}
              onChange={(e) => setNftDescription(e.target.value)}
              placeholder="Enter NFT Description"
              className="w-full p-3 border border-gray-600 rounded-lg bg-[#2D3748] text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 mb-2">AI Image Prompt</label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter a prompt for AI image"
              className="w-full p-3 border border-gray-600 rounded-lg bg-[#2D3748] text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 mb-2">
              Mint Price (PYUSD)
            </label>
            <input
              type="number"
              value={mintPrice}
              onChange={(e) => setMintPrice(e.target.value)}
              placeholder="Enter Mint Price"
              className="w-full p-3 border border-gray-600 rounded-lg bg-[#2D3748] text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-6 text-center">
            <button
              onClick={generateImage}
              disabled={loading}
              className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition-colors duration-200 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Generating..." : "Generate AI Image"}
            </button>
          </div>

          <div className="mb-6">
            <p className="block text-gray-300 mb-2">OR Upload Your Own Image</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-2 border border-gray-600 rounded-lg bg-[#2D3748] text-gray-200"
            />
          </div>

          {imageUrl && (
            <div className="mb-6 text-center">
              <img
                src={imageUrl}
                alt="NFT Preview"
                className="w-64 h-64 object-cover mx-auto rounded-lg shadow-lg"
              />
            </div>
          )}

          <div className="mb-6 text-center">
            {approved ? (
              <button
                onClick={handleMintNFTWithPYUSD}
                disabled={!imageUrl && !imageFile}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg transition-colors duration-200"
              >
                Mint NFT with PYUSD
              </button>
            ) : (
              <button
                onClick={handleApprovePYUSD}
                className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-6 rounded-lg transition-colors duration-200"
              >
                Approve PYUSD
              </button>
            )}
          </div>

          <p className="mt-4 text-center text-gray-400">{mintingStatus}</p>
        </div>
      )}
    </div>
  );
}
