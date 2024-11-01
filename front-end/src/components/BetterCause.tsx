import React, { useState } from "react";
import { ethers } from "ethers";
import { useWalletClient } from "wagmi";
import { useBetterCauseAddress } from "../hooks/tokenAddress";
import BetterCauseABI from "../abi/BetterCause.json";

const BetterCause: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const { data: walletClient } = useWalletClient();
  const betterCauseContractAddress = useBetterCauseAddress();

  const handleCreateCampaign = async () => {
    if (!title || !description || !image || !deadline) {
      alert("Please fill in all fields.");
      return;
    }

    if (!walletClient) {
      setStatus("Wallet not connected.");
      return;
    }

    try {
      setStatus("Processing campaign creation...");
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        betterCauseContractAddress,
        BetterCauseABI.abi,
        signer
      );

      const durationInDays = parseInt(deadline);
      const transaction = await contract.createCampaign(
        title,
        description,
        image,
        durationInDays
      );

      setStatus("Waiting for transaction confirmation...");
      await transaction.wait();

      setStatus("Campaign created successfully!");
      setTitle("");
      setDescription("");
      setImage("");
      setDeadline("");
    } catch (error) {
      console.error("Campaign creation failed", error);
      setStatus("Campaign creation failed.");
    }
  };

  return (
    <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-full max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Create a New Campaign
      </h1>

      {/* First Row: Campaign Title, Image URL, and Duration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-gray-400 mb-2">Campaign Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter campaign title"
            className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2">
            Image URL or IPFS Hash
          </label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Enter image URL or IPFS hash"
            className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2">
            Campaign Duration (days)
          </label>
          <input
            type="number"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            placeholder="Enter duration in days"
            className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Second Row: Description */}
      <div className="mb-6">
        <label className="block text-gray-400 mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter campaign description"
          className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        ></textarea>
      </div>

      {/* Third Row: Create Campaign Button */}
      <button
        onClick={handleCreateCampaign}
        className="w-full py-3 rounded-md text-white font-bold bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 transition-all"
      >
        Create Campaign
      </button>

      <p className="mt-4 text-center text-gray-400">{status}</p>
    </div>
  );
};

export default BetterCause;
