import express from 'express';
import { verifyMessage } from 'ethers';
import { z } from 'zod';

const authRouter = express.Router();

// Schema validation
const authSchema = z.object({
  address: z.string(),
  signature: z.string(),
});

// Authentication endpoint
authRouter.post('/', async (req, res) => {
  try {
    const { address, signature } = authSchema.parse(req.body);
    const message = `Signing in to ERC20 Token Explorer as ${address}`;
    // Verify signature
    const recoveredAddress = verifyMessage(message, signature);
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    return res.json({ success: true, message: 'Authenticated' });
  } catch (error) {
    return res.status(400).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
});

export { authRouter };
