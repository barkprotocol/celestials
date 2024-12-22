import { NextApiRequest, NextApiResponse } from 'next';
import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, Token } from '@solana/spl-token';
import { prisma } from '@/lib/prisma';
import { SOLANA_RPC_URL, MERCHANT_WALLET_ADDRESS, USDC_MINT_ADDRESS, BARK_MINT_ADDRESS } from '@/config/configs';

const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

const processPayment = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { token, amount, userWallet } = req.body;

  if (!token || !amount || !userWallet) {
    return res.status(400).json({ success: false, message: 'Missing required fields (token, amount, userWallet)' });
  }

  try {
    let transactionSignature;

    if (token === 'SOL') {
      // SOL transfer logic
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(userWallet),
          toPubkey: new PublicKey(MERCHANT_WALLET_ADDRESS),
          lamports: Math.floor(amount * 1e9), // Convert SOL to lamports
        })
      );

      transactionSignature = await connection.sendTransaction(transaction, [], {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
      });

    } else if (token === 'USDC' || token === 'BARK') {
      // SPL Token transfer logic
      const tokenMintAddress = token === 'USDC' ? USDC_MINT_ADDRESS : BARK_MINT_ADDRESS;

      const userTokenAccount = await connection.getTokenAccountsByOwner(
        new PublicKey(userWallet),
        { mint: new PublicKey(tokenMintAddress) }
      );

      if (userTokenAccount.value.length === 0) {
        throw new Error('No token account found for user.');
      }

      const transaction = new Transaction().add(
        Token.createTransferInstruction(
          TOKEN_PROGRAM_ID,
          userTokenAccount.value[0].pubkey,
          new PublicKey(MERCHANT_WALLET_ADDRESS),
          new PublicKey(userWallet),
          [],
          Math.floor(amount * 1e6) // Assuming tokens have 6 decimal places
        )
      );

      transactionSignature = await connection.sendTransaction(transaction, [], {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
      });

    } else {
      return res.status(400).json({ success: false, message: 'Unsupported token type' });
    }

    // Save payment record in the database
    await prisma.payment.create({
      data: {
        token,
        amount,
        userWallet,
        status: 'success',
        transactionId: transactionSignature,
        createdAt: new Date(),
      },
    });

    return res.status(200).json({ success: true, transactionSignature, message: 'Payment successfully processed' });
  } catch (error) {
    console.error('Error processing payment:', error);
    return res.status(500).json({
      success: false,
      message: 'Payment processing failed',
      error: error.message,
    });
  }
};

export default processPayment;
