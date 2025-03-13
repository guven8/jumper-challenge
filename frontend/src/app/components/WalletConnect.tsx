"use client";

import { useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignIn() {
    try {
      const message = `Signing in to ERC20 Token Explorer as ${address}`;
      const signature = await signMessageAsync({ message });

      const res = await fetch("/api/auth", {
        method: "POST",
        body: JSON.stringify({ address, signature }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Authentication failed");
      console.log("User authenticated!");
    } catch (error) {
      console.error("Error signing in:", error);
    }
  }

  async function fetchTokens() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/tokens/${address}`);
      if (!res.ok) throw new Error("Failed to fetch tokens");
      const data = await res.json();
      setTokens(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">ERC20 Token Explorer</h1>
        <ConnectButton />
        {isConnected && (
          <>
            <p className="mt-4 text-sm">Connected Address: {address}</p>
            <button
              onClick={handleSignIn}
              className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
            >
              Verify Ownership
            </button>
            <button
              onClick={fetchTokens}
              className="mt-2 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
            >
              Fetch ERC20 Tokens
            </button>
            {loading && (
              <div className="mt-4 animate-spin border-4 border-white border-t-transparent rounded-full w-6 h-6 mx-auto"></div>
            )}
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {tokens.length > 0 && (
              <ul className="mt-4 text-left">
                {tokens.map((token, index) => (
                  <li key={index} className="border-b border-gray-700 py-2">
                    {token.name} ({token.symbol}): {token.balance}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
