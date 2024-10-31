import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NOVES_API_KEY = "YOUR_NOVES_API_KEY"; // Replace with your actual API key

export default function TransactionAnalyzer() {
  const [txHash, setTxHash] = useState<string>("");
  const [accountAddress, setAccountAddress] = useState<string>("");
  const [chain, setChain] = useState<string>("eth");
  const [transactionDetails, setTransactionDetails] = useState<any>(null);
  const [transactionDescription, setTransactionDescription] = useState<
    string | null
  >(null);
  const [tokenBalances, setTokenBalances] = useState<any>(null);

  // Authenticate Noves API
  axios.defaults.headers.common["apiKey"] = NOVES_API_KEY;

  // Fetch a classified description of the transaction
  const classifyTransaction = async () => {
    try {
      const response = await axios.get(
        `https://translate.noves.fi/evm/${chain}/describeTx/${txHash}`
      );
      setTransactionDescription(response.data.description);
    } catch (error) {
      console.error("Error classifying transaction:", error);
    }
  };

  // Fetch transaction details
  const fetchTransactionDetails = async () => {
    try {
      const response = await axios.get(
        `https://translate.noves.fi/evm/${chain}/tx/${txHash}`
      );
      setTransactionDetails(response.data);
    } catch (error) {
      console.error("Error fetching transaction details:", error);
    }
  };

  // Fetch token balances
  const fetchTokenBalances = async () => {
    try {
      const response = await axios.post(
        `https://translate.noves.fi/evm/${chain}/tokens/balancesOf/${accountAddress}`
      );
      setTokenBalances(response.data);
    } catch (error) {
      console.error("Error fetching token balances:", error);
    }
  };

  return (
    <div className="transaction-analyzer bg-[#1A202C] p-10 rounded-lg shadow-lg max-w-2xl mx-auto mt-10 text-white">
      <h2 className="text-3xl font-bold text-center mb-6">
        Transaction Analyzer
      </h2>

      <div className="mb-4">
        <label>Chain:</label>
        <input
          type="text"
          value={chain}
          onChange={(e) => setChain(e.target.value)}
          placeholder="e.g., eth, bsc"
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label>Transaction Hash:</label>
        <input
          type="text"
          value={txHash}
          onChange={(e) => setTxHash(e.target.value)}
          placeholder="Enter transaction hash"
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label>Account Address:</label>
        <input
          type="text"
          value={accountAddress}
          onChange={(e) => setAccountAddress(e.target.value)}
          placeholder="Enter account address"
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="buttons mt-4 flex justify-between">
        <button
          onClick={classifyTransaction}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Classify Transaction
        </button>
        <button
          onClick={fetchTransactionDetails}
          className="bg-green-500 text-white py-2 px-4 rounded"
        >
          Get Transaction Details
        </button>
        <button
          onClick={fetchTokenBalances}
          className="bg-purple-500 text-white py-2 px-4 rounded"
        >
          Get Token Balances
        </button>
      </div>

      {/* Display Results */}
      {transactionDescription && (
        <div className="result mt-6">
          <h3 className="text-xl font-semibold">Transaction Description:</h3>
          <p>{transactionDescription}</p>
        </div>
      )}

      {transactionDetails && (
        <div className="result mt-6">
          <h3 className="text-xl font-semibold">Transaction Details:</h3>
          <pre>{JSON.stringify(transactionDetails, null, 2)}</pre>
        </div>
      )}

      {tokenBalances && (
        <div className="result mt-6">
          <h3 className="text-xl font-semibold">Token Balances:</h3>
          <pre>{JSON.stringify(tokenBalances, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
