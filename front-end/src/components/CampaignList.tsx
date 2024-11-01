// import React, { useEffect, useState } from "react";
// import { ethers } from "ethers";
// import { useWalletClient } from "wagmi";
// import { useBetterCauseAddress } from "../hooks/tokenAddress";
// import BetterCauseABI from "../abi/BetterCause.json";

// interface Campaign {
//   id: number;
//   title: string;
//   description: string;
//   image?: string;
//   owner: string;
//   deadline: bigint;
//   amountCollected: bigint;
// }

// const CampaignList: React.FC = () => {
//   const [campaigns, setCampaigns] = useState<Campaign[]>([]);
//   const [donationAmount, setDonationAmount] = useState<{
//     [id: number]: string;
//   }>({});
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [status, setStatus] = useState<string>("");

//   const { data: walletClient } = useWalletClient();
//   const betterCauseContractAddress = useBetterCauseAddress();

// const fetchCampaigns = async () => {
//   setLoading(true);
//   setError(null);

//   if (!walletClient) {
//     setError("Wallet not connected.");
//     setLoading(false);
//     return;
//   }

//   try {
//     const provider = new ethers.BrowserProvider(walletClient);
//     const signer = await provider.getSigner();
//     const contract = new ethers.Contract(
//       betterCauseContractAddress,
//       BetterCauseABI.abi,
//       signer
//     );

//     const campaignCount = await contract.campaignCount();
//     const campaignsData: Campaign[] = [];

//     for (let i = 0; i < campaignCount; i++) {
//       const campaignData = await contract.getCampaignById(i);
//       campaignsData.push({
//         id: i,
//         title: campaignData.title,
//         description: campaignData.description,
//         image: campaignData.imageHash,
//         owner: campaignData.owner,
//         deadline: campaignData.deadline,
//         amountCollected: campaignData.amountCollected,
//       });
//     }

//     setCampaigns(campaignsData);
//   } catch (error) {
//     console.error("Error fetching campaigns:", error);
//     setError("Failed to load campaigns.");
//   } finally {
//     setLoading(false);
//   }
// };

//   const donateToCampaign = async (campaignId: number) => {
//     if (
//       !donationAmount[campaignId] ||
//       parseFloat(donationAmount[campaignId]) <= 0
//     ) {
//       alert("Please enter a valid donation amount.");
//       return;
//     }

//     if (!walletClient) {
//       setStatus("Wallet not connected.");
//       return;
//     }

//     try {
//       setStatus("Processing donation...");
//       const provider = new ethers.BrowserProvider(walletClient);
//       const signer = await provider.getSigner();

//       const contract = new ethers.Contract(
//         betterCauseContractAddress,
//         BetterCauseABI.abi,
//         signer
//       );
//       const donationValue = ethers.parseEther(donationAmount[campaignId]);

//       const transaction = await contract.donateToCampaign(campaignId, {
//         value: donationValue,
//       });
//       setStatus("Waiting for transaction confirmation...");
//       await transaction.wait();

//       setStatus("Donation successful!");
//       fetchCampaigns(); // Refresh campaigns to update amount collected
//     } catch (error) {
//       console.error("Donation failed", error);
//       setStatus("Donation failed.");
//     }
//   };

//   // Helper function to convert wei to ether without using ethers.utils
//   const formatEtherManual = (wei: bigint) => {
//     return (Number(wei) / 10 ** 18).toFixed(4); // Convert wei to ether and format it to 4 decimal places
//   };

//   useEffect(() => {
//     fetchCampaigns();
//   }, [walletClient, betterCauseContractAddress]);

//   return (
//     <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
//       <h2 className="text-3xl font-bold mb-4 text-center">Active Campaigns</h2>

//       {loading && (
//         <p className="text-center text-gray-400">Loading campaigns...</p>
//       )}
//       {error && <p className="text-center text-red-500">{error}</p>}
//       <p className="text-center text-gray-400">{status}</p>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//         {campaigns.map((campaign) => (
//           <div
//             key={campaign.id}
//             className="bg-gray-700 p-4 rounded-lg shadow-md"
//           >
// {campaign.image && (
//   <img
//     src={campaign.image}
//     alt={campaign.title}
//     className="w-full h-32 object-cover rounded-lg mb-4"
//   />
// )}
//             <h3 className="text-xl font-bold mb-2">{campaign.title}</h3>
//             <p className="text-gray-300 mb-4">{campaign.description}</p>
//             <p className="text-sm text-gray-400">
//               Owner: {campaign.owner.slice(0, 6)}...{campaign.owner.slice(-4)}
//             </p>
//             <p className="text-sm text-gray-400">
//               Deadline:{" "}
//               {new Date(Number(campaign.deadline) * 1000).toLocaleDateString()}
//             </p>
//             <p className="text-sm text-gray-400">
//               Amount Collected: {formatEtherManual(campaign.amountCollected)}{" "}
//               ETH
//             </p>

//             {/* Donation Input and Button */}
//             <div className="mt-4">
//               <input
//                 type="number"
//                 placeholder="Enter donation amount (ETH)"
//                 value={donationAmount[campaign.id] || ""}
//                 onChange={(e) =>
//                   setDonationAmount({
//                     ...donationAmount,
//                     [campaign.id]: e.target.value,
//                   })
//                 }
//                 className="w-full p-2 bg-gray-600 text-white rounded-md mb-2"
//               />
//               <button
//                 onClick={() => donateToCampaign(campaign.id)}
//                 className="w-full py-2 rounded-md text-white font-bold bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 transition-all"
//               >
//                 Donate Now
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CampaignList;

import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { MaxUint256, formatEther, formatUnits } from "ethers";
import { useWalletClient } from "wagmi";
import {
  useBetterCauseAddress,
  usePYUSDTokenAddress,
} from "../hooks/tokenAddress";
import BetterCauseABI from "../abi/BetterCause.json";
import PYUSD_ABI from "../abi/PYUSD.json";

interface Campaign {
  id: number;
  title: string;
  description: string;
  image?: string;
  owner: string;
  deadline: bigint;
  amountCollectedETH: bigint;
  amountCollectedPYUSD: bigint;
}

const CampaignList: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [donationAmount, setDonationAmount] = useState<{
    [id: number]: string;
  }>({});
  const [paymentMethod, setPaymentMethod] = useState<"ETH" | "PYUSD">("ETH");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");

  const { data: walletClient } = useWalletClient();
  const betterCauseContractAddress = useBetterCauseAddress();
  const pyusdTokenAddress = usePYUSDTokenAddress();

  const fetchCampaigns = async () => {
    setLoading(true);
    setError(null);

    if (!walletClient) {
      setError("Wallet not connected.");
      setLoading(false);
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        betterCauseContractAddress,
        BetterCauseABI.abi,
        signer
      );

      const campaignCount = await contract.campaignCount();
      const campaignsData: Campaign[] = [];

      for (let i = 0; i < campaignCount; i++) {
        const campaignData = await contract.campaigns(i);

        campaignsData.push({
          id: i,
          title: campaignData.title,
          description: campaignData.description,
          image: campaignData.imageHash,
          owner: campaignData.owner,
          deadline: campaignData.deadline,
          amountCollectedETH: campaignData.amountCollectedETH, // updated to use ETH amount
          amountCollectedPYUSD: campaignData.amountCollectedPYUSD, // updated to use PYUSD amount
        });
      }

      console.log(campaignsData);

      setCampaigns(campaignsData);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      setError("Failed to load campaigns.");
    } finally {
      setLoading(false);
    }
  };

  const checkApproval = async () => {
    if (!walletClient) return;
    const provider = new ethers.BrowserProvider(walletClient);
    const signer = await provider.getSigner();
    const pyusdToken = new ethers.Contract(
      pyusdTokenAddress,
      PYUSD_ABI.abi,
      signer
    );

    const allowance = await pyusdToken.allowance(
      await signer.getAddress(),
      betterCauseContractAddress
    );
    return BigInt(allowance.toString()) > 0;
  };

  const approvePYUSD = async () => {
    if (!walletClient) return;

    try {
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const pyusdToken = new ethers.Contract(
        pyusdTokenAddress,
        PYUSD_ABI.abi,
        signer
      );

      setStatus("Approving PYUSD...");
      const tx = await pyusdToken.approve(
        betterCauseContractAddress,
        MaxUint256
      );
      await tx.wait();
      setStatus("PYUSD approved successfully.");
    } catch (error) {
      console.error("Approval failed", error);
      setStatus("Approval failed.");
    }
  };

  const donateToCampaign = async (campaignId: number) => {
    if (
      !donationAmount[campaignId] ||
      parseFloat(donationAmount[campaignId]) <= 0
    ) {
      alert("Please enter a valid donation amount.");
      return;
    }

    if (!walletClient) {
      setStatus("Wallet not connected.");
      return;
    }

    try {
      setStatus("Processing donation...");
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        betterCauseContractAddress,
        BetterCauseABI.abi,
        signer
      );

      if (paymentMethod === "ETH") {
        const donationValue = ethers.parseEther(donationAmount[campaignId]);
        const transaction = await contract.donateWithETH(campaignId, {
          value: donationValue,
        });
        await transaction.wait();
      } else {
        const donationValue = ethers.parseUnits(donationAmount[campaignId], 18);
        const approved = await checkApproval();
        if (!approved) {
          await approvePYUSD();
        }
        const transaction = await contract.donateWithPYUSD(
          campaignId,
          donationValue
        );
        await transaction.wait();
      }

      setStatus("Donation successful!");
      fetchCampaigns(); // Refresh campaigns to update amount collected
    } catch (error) {
      console.error("Donation failed", error);
      setStatus("Donation failed.");
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [walletClient, betterCauseContractAddress]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-4 text-center">Active Campaigns</h2>

      {loading && (
        <p className="text-center text-gray-400">Loading campaigns...</p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}
      <p className="text-center text-gray-400">{status}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-gray-700 p-4 rounded-lg shadow-md"
          >
            {campaign.image && (
              <img
                src={campaign.image}
                alt={campaign.title}
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
            )}
            <h3 className="text-xl font-bold mb-2">{campaign.title}</h3>
            <p className="text-gray-300 mb-4">{campaign.description}</p>
            <p className="text-sm text-gray-400">
              Amount Collected: {formatEther(campaign.amountCollectedETH)} ETH /{" "}
              {formatUnits(campaign.amountCollectedPYUSD, 18)} PYUSD
            </p>

            <div className="mt-4">
              <select
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(e.target.value as "ETH" | "PYUSD")
                }
                className="w-full p-2 mb-2 bg-gray-600 text-white rounded-md"
              >
                <option value="ETH">Donate with ETH</option>
                <option value="PYUSD">Donate with PYUSD</option>
              </select>

              <input
                type="number"
                placeholder="Enter donation amount"
                value={donationAmount[campaign.id] || ""}
                onChange={(e) =>
                  setDonationAmount({
                    ...donationAmount,
                    [campaign.id]: e.target.value,
                  })
                }
                className="w-full p-2 bg-gray-600 text-white rounded-md mb-2"
              />
              <button
                onClick={() => donateToCampaign(campaign.id)}
                className="w-full py-2 rounded-md text-white font-bold bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 transition-all"
              >
                Donate Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignList;