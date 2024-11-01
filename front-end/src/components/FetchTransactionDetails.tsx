import React, { useState, useEffect } from "react";
import axios from "axios";
import { useBaseURL } from "../hooks/tokenAddress";

interface TransactionDetails {
  timestamp: string;
  fee: { type: string; value: string };
  gas_limit: string;
  block: number;
  status: string;
  method: string;
  to: { hash: string; is_contract: boolean };
  from: { hash: string; is_contract: boolean };
  gas_used: string;
  hash: string;
  nonce: number;
  result: string;
  tx_burnt_fee: string;
  value: string;
  token_transfers: any[];
}

interface FetchTransactionDetailsProps {
  txHash: string;
}

const FetchTransactionDetails: React.FC<FetchTransactionDetailsProps> = ({
  txHash,
}) => {
  const [transactionDetails, setTransactionDetails] =
    useState<TransactionDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const skaleBaseUrl = useBaseURL(); // URL based on chain from tokenAddress hook

  useEffect(() => {
    console.log("Fetching transaction details for hash:", txHash);

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      setTransactionDetails(null);

      if (!txHash) {
        setError("No transaction hash provided.");
        setLoading(false);
        return;
      }

      try {
        // Construct the URL for the transaction
        const url = `${await skaleBaseUrl}${txHash}`;
        console.log("Requesting URL:", url);

        const response = await axios.get(url, {
          headers: { accept: "application/json" },
          maxBodyLength: Infinity,
        });

        // Open details in new tab after fetching
        const transactionData = response.data;
        setTransactionDetails(transactionData);

        // Format the data for display
        const detailsHTML = `
          <html>
            <head><title>Transaction Details</title></head>
            <body style="font-family: Arial, sans-serif; background-color: #2d2d2d; color: #ffffff; padding: 20px;">
              <h2>Transaction Details</h2>
              <p><strong>Timestamp:</strong> ${transactionData.timestamp}</p>
              <p><strong>Block:</strong> ${transactionData.block}</p>
              <p><strong>Status:</strong> ${transactionData.status}</p>
              <p><strong>From:</strong> ${transactionData.from.hash} (${
          transactionData.from.is_contract ? "Contract" : "EOA"
        })</p>
              <p><strong>To:</strong> ${transactionData.to.hash} (${
          transactionData.to.is_contract ? "Contract" : "EOA"
        })</p>
              <p><strong>Value:</strong> ${transactionData.value}</p>
              <p><strong>Gas Limit:</strong> ${transactionData.gas_limit}</p>
              <p><strong>Gas Used:</strong> ${transactionData.gas_used}</p>
              <p><strong>Fee:</strong> ${transactionData.fee.value} (Type: ${
          transactionData.fee.type
        })</p>
              <p><strong>Transaction Hash:</strong> ${transactionData.hash}</p>
              <p><strong>Nonce:</strong> ${transactionData.nonce}</p>
            </body>
          </html>`;

        const newWindow = window.open();
        if (newWindow) {
          newWindow.document.write(detailsHTML);
        }
      } catch (err: any) {
        console.error("Error fetching transaction details:", err);
        setError(
          err.response?.data?.message || "Failed to fetch transaction details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [txHash, skaleBaseUrl]);

  return null; // No need to render anything in this component
};

export default FetchTransactionDetails;
