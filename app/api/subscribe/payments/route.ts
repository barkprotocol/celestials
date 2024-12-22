import { NextApiRequest, NextApiResponse } from 'next';
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, Token } from '@solana/spl-token';
import { prisma } from '@/lib/prisma'; // Prisma for saving payment records
import { SECRET_KEY, MERCHANT_WALLET_ADDRESS } from '@/config/configs';

// Set up Solana connection
const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

// Main payment handler function
const createPayment = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed. Use POST.' });
  }

  const { token, amount, userWallet } = req.body;

  // Validate required fields
  if (!token || !amount || !userWallet) {
    return res.status(400).json({ success: false, message: 'Missing required fields (token, amount, userWallet)' });
  }

  try {
    // SOL payment logic
    if (token === 'SOL') {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(userWallet),
          toPubkey: new PublicKey(MERCHANT_WALLET_ADDRESS),
          lamports: amount * 1e9, // Convert SOL to lamports
        })
      );

      await connection.sendTransaction(transaction, [], { skipPreflight: false, preflightCommitment: 'confirmed' });

    } else if (token === 'USDC' || token === 'BARK') {
      // SPL Token payment logic
      const tokenMintAddress = token === 'USDC' ? process.env.USDC_MINT_ADDRESS : process.env.BARK_MINT_ADDRESS;

      if (!tokenMintAddress) {
        return res.status(400).json({ success: false, message: 'Token mint address is not configured.' });
      }

      const userTokenAccount = await getTokenAccount(userWallet, tokenMintAddress);

      const transaction = new Transaction().add(
        Token.createTransferInstruction(
          TOKEN_PROGRAM_ID,
          userTokenAccount.address,
          new PublicKey(MERCHANT_WALLET_ADDRESS),
          new PublicKey(userWallet),
          [],
          amount * 1e6 // Convert amount to token decimals (e.g., 6 for USDC)
        )
      );

      await connection.sendTransaction(transaction, [], { skipPreflight: false, preflightCommitment: 'confirmed' });

    } else {
      return res.status(400).json({ success: false, message: 'Unsupported token' });
    }

    // Record payment in the database
    await prisma.payment.create({
      data: {
        token,
        amount,
        userWallet,
        status: 'success',
        createdAt: new Date(),
      },
    });

    return res.status(200).json({ success: true, message: 'Payment successfully processed' });
  } catch (error) {
    console.error('Payment failed:', error);

    // Log failure in the database
    await prisma.payment.create({
      data: {
        token,
        amount,
        userWallet,
        status: 'failed',
        createdAt: new Date(),
        error: error.message,
      },
    });

    return res.status(500).json({ success: false, message: 'Payment processing failed', error: error.message });
  }
};

// Helper function to get the user's token account for the specified mint address
async function getTokenAccount(userWallet: string, mintAddress: string) {
  const publicKey = new PublicKey(userWallet);
  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
    mint: new PublicKey(mintAddress),
  });

  if (tokenAccounts.value.length === 0) {
    throw new Error('No token account found for this user');
  }

  return tokenAccounts.value[0].account;
}

export default createPayment;
