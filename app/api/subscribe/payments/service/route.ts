import { NextApiRequest, NextApiResponse } from 'next';
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, Token } from '@solana/spl-token';
import { prisma } from '@/lib/prisma'; // Prisma for database operations
import { SOLANA_RPC_URL, MERCHANT_WALLET_ADDRESS, USDC_MINT_ADDRESS, BARK_MINT_ADDRESS } from '@/config/configs';

const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

/**
 * Handles payment processing for SOL and SPL tokens.
 * Supports tokens such as SOL, USDC, and BARK.
 */
const handlePayment = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed. Use POST.' });
  }

  const { token, amount, userWallet } = req.body;

  if (!token || !amount || !userWallet) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields (token, amount, userWallet)',
    });
  }

  try {
    // Determine the token type and handle accordingly
    if (token === 'SOL') {
      await processSolTransaction(userWallet, amount);
    } else if (token === 'USDC' || token === 'BARK') {
      const tokenMintAddress = token === 'USDC' ? USDC_MINT_ADDRESS : BARK_MINT_ADDRESS;
      if (!tokenMintAddress) {
        throw new Error(`${token} mint address is not configured.`);
      }
      await processSplTokenTransaction(userWallet, tokenMintAddress, amount);
    } else {
      throw new Error('Unsupported token type.');
    }

    // Log the transaction in the database
    await prisma.payment.create({
      data: {
        token,
        amount,
        userWallet,
        status: 'success',
        createdAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Payment successfully processed',
    });
  } catch (error) {
    console.error('Payment failed:', error);

    // Record failed transaction in the database
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

    return res.status(500).json({
      success: false,
      message: 'Payment processing failed',
      error: error.message,
    });
  }
};

/**
 * Processes a SOL transfer transaction.
 */
const processSolTransaction = async (userWallet: string, amount: number) => {
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: new PublicKey(userWallet),
      toPubkey: new PublicKey(MERCHANT_WALLET_ADDRESS),
      lamports: amount * 1e9, // Convert SOL to lamports
    })
  );

  await connection.sendTransaction(transaction, [], {
    skipPreflight: false,
    preflightCommitment: 'confirmed',
  });
};

/**
 * Processes an SPL token transfer transaction (e.g., USDC, BARK).
 */
const processSplTokenTransaction = async (userWallet: string, mintAddress: string, amount: number) => {
  const userTokenAccount = await getTokenAccount(userWallet, mintAddress);

  const transaction = new Transaction().add(
    Token.createTransferInstruction(
      TOKEN_PROGRAM_ID,
      userTokenAccount.address,
      new PublicKey(MERCHANT_WALLET_ADDRESS),
      new PublicKey(userWallet),
      [],
      amount * 1e6 // Convert amount to token decimals (e.g., 6 decimals for USDC)
    )
  );

  await connection.sendTransaction(transaction, [], {
    skipPreflight: false,
    preflightCommitment: 'confirmed',
  });
};

/**
 * Retrieves the user's token account for a specific mint address.
 */
const getTokenAccount = async (userWallet: string, mintAddress: string) => {
  const publicKey = new PublicKey(userWallet);
  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
    mint: new PublicKey(mintAddress),
  });

  if (tokenAccounts.value.length === 0) {
    throw new Error('No token account found for this user.');
  }

  return tokenAccounts.value[0].account;
};

export default handlePayment;
