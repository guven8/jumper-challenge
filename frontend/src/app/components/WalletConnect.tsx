"use client";

import { useEffect, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BACKEND_URL } from "@/lib/config";

export default function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [tokens, setTokens] = useState<any[]>([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);
  const [error, setError] = useState<string | null>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isSigning, setIsSigning] = useState(false);

  async function handleSignIn() {
    if (!address) return;

    setIsSigning(true);
    setError(null);
    setSuccess(false);

    try {
      const message = `Signing in to ERC20 Token Explorer as ${address}`;
      const signature = await signMessageAsync({ message });

      const res = await fetch(`${BACKEND_URL}/api/auth`, {
        method: "POST",
        body: JSON.stringify({ address, signature }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      console.log("User authenticated!");
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong during authentication."
      );
    } finally {
      setIsSigning(false);
    }
  }

  // Fetch tokens automatically after successful authentication
  useEffect(() => {
    if (success && address) {
      setIsLoadingTokens(true);
      setError(null);

      fetch(`${BACKEND_URL}/api/tokens/${address}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) throw new Error(data.error);
          setTokens(data.tokens);
        })
        .catch((err) => setError(err.message))
        .finally(() => setIsLoadingTokens(false));
    }
  }, [success, address]);

  return (
    <div className="p-4">
      <ConnectButton />
      {isConnected && (
        <div className="mt-4">
          <p className="text-sm sm:text-base">Connected Address: {address}</p>
          <button
            className="bg-blue-500 text-white p-2 rounded mt-2"
            onClick={handleSignIn}
            disabled={isSigning}
          >
            {isSigning ? "Signing..." : "Verify Ownership"}
          </button>

          {error && <p className="text-red-500 mt-2">{error}</p>}
          {success && (
            <p className="text-green-500 mt-2">
              ✅ Wallet successfully validated!
            </p>
          )}

          {isLoadingTokens && (
            <p className="mt-2">🔄 Fetching ERC20 tokens...</p>
          )}

          {tokens.length > 0 && (
            <ul className="mt-4 text-left">
              {tokens.map((token, index) => (
                <li key={index} className="border-b border-gray-700 py-2">
                  <p>
                    <strong>
                      {token.name} ({token.symbol})
                    </strong>
                  </p>
                  <p>Balance: {token.balance}</p>
                  <p className="text-gray-400 text-xs">
                    Contract: {token.contractAddress}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
