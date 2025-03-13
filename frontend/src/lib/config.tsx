"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";

const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const requiredEnvVars = {
  NEXT_PUBLIC_PROJECT_ID: PROJECT_ID,
  NEXT_PUBLIC_BACKEND_URL: BACKEND_URL,
};

Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    console.warn(
      `⚠️ Warning: ${key} is not set. Please check your .env.local file.`
    );
  }
});

if (!PROJECT_ID) {
  console.warn(
    "⚠️ Warning: NEXT_PUBLIC_PROJECT_ID is not set. Please check your .env.local file."
  );
}

export const config = getDefaultConfig({
  appName: "ERC20 Token Explorer",
  projectId: PROJECT_ID!,
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true,
});
