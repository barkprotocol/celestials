import { NextApiRequest, NextApiResponse } from 'next';
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, Token } from '@solana/spl-token';
import { getPrice } from '@/lib/price-api'; // Optional: to get real-time prices if needed
import { prisma } from '@/lib/prisma'; // Prisma for saving payment records
import { SECRET_KEY, MERCHANT_WALLET_ADDRESS } from '@/config'; // Store merchant wallet and secret key in environment variables

const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

// Helper function to get the user's token account (ensure they have an associated token account)
async function getTokenAccount(userWallet: string, mintAddress: string) {
  const publicKey = new PublicKey(userWallet);
  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, { mint: new PublicKey(mintAddress) });

  if (tokenAccounts.value.length === 0) {
    throw new Error('No token account found for this user');
  }

  return tokenAccounts.value[0].account;
}

// Payment creation function
const createPayment = async (req: NextApiRequest, res: NextApiResponse) => {
  const { token, amount, userWallet } = req.body;

  if (!token || !amount || !userWallet) {
    return res.status(400).json({ success: false, message: 'Missing required fields (token, amount, userWallet)' });
  }

  try {
    // Fetch price if needed (Optional)
    let convertedAmount = amount;
    if (token !== 'SOL') {
      const price = await getPrice(token); // Assuming getPrice fetches price in USD or other token
      if (price) {
        convertedAmount = amount * price; // Convert to USD or required unit if needed
      }
    }

    // Determine the token and its associated transfer logic
    if (token === 'SOL') {
      // SOL Transfer logic
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(userWallet),
          toPubkey: new PublicKey(MERCHANT_WALLET_ADDRESS),
          lamports: amount * 1e9, // Convert SOL to lamports (1 SOL = 1e9 lamports)
        })
      );
      // Send the transaction (you'll need a signer in a real use case)
      // Since you don't seem to be using a signer here, make sure you are calling it correctly in your client app.
      await connection.sendTransaction(transaction, [], { skipPreflight: false, preflightCommitment: 'confirmed' });

    } else if (token === 'USDC' || token === 'BARK') {
      // SPL Token (USDC, BARK) Transfer logic
      const tokenMintAddress = token === 'USDC' ? process.env.USDC_MINT_ADDRESS : process.env.BARK_MINT_ADDRESS;
      const userTokenAccount = await getTokenAccount(userWallet, tokenMintAddress); // Ensure user has token account

      const transaction = new Transaction().add(
        Token.createTransferInstruction(
          TOKEN_PROGRAM_ID,
          userTokenAccount.address,
          new PublicKey(MERCHANT_WALLET_ADDRESS),
          new PublicKey(userWallet),
          [],
          amount * 1e6 // Convert token to appropriate decimals (6 decimals for USDC)
        )
      );
      // Send the transaction
      await connection.sendTransaction(transaction, [], { skipPreflight: false, preflightCommitment: 'confirmed' });

    } else {
      return res.status(400).json({ success: false, message: 'Unsupported token' });
    }

    // Optionally store payment details in the database (use Prisma)
    await prisma.payment.create({
      data: {
        token,
        amount: convertedAmount,
        userWallet,
        status: 'success',
        createdAt: new Date(),
      },
    });

    return res.status(200).json({ success: true, message: 'Payment successfully processed' });

  } catch (error) {
    console.error('Payment failed:', error);
    return res.status(500).json({ success: false, message: 'Payment processing failed', error: error.message });
  }
};

export default createPayment;
