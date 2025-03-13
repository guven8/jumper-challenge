import express from 'express';
import { z } from 'zod';
import { Alchemy, Network, Utils } from 'alchemy-sdk';

const tokenRouter = express.Router();

const alchemy = new Alchemy({
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
});

const addressSchema = z.object({
  address: z.string(),
});

// Fetch ERC20 token balances
tokenRouter.get('/:address', async (req, res) => {
  try {
    const { address } = addressSchema.parse(req.params);
    const balances = await alchemy.core.getTokenBalances(address);

    // const formattedTokens = balances.tokenBalances.map((token) => ({
    //   contractAddress: token.contractAddress,
    //   balance: token.tokenBalance,
    // }));

    const tokens = await Promise.all(
      balances.tokenBalances.map(async (token) => {
        const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);
        return {
          contractAddress: token.contractAddress,
          name: metadata.name || 'Unknown',
          symbol: metadata.symbol || '???',
          balance: Utils.formatUnits(token.tokenBalance!, metadata.decimals || 18), // Convert hex balance
        };
      })
    );

    return res.json({ tokens: tokens });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch token balances' });
  }
});

export { tokenRouter };
