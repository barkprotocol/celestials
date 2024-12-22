import { Connection, Keypair, Transaction, SystemProgram, PublicKey } from '@solana/web3.js';
import { prisma } from './prisma';

const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
const connection = new Connection(SOLANA_RPC_URL);

/**
 * Creates a Solana payment transaction.
 * @param userWallet - The recipient's wallet address (Base58 string).
 * @param amount - The amount of SOL to send (in SOL, not lamports).
 * @returns An object containing the transactionId and transaction signature.
 */
export async function createSolanaPaymentTransaction(userWallet: string, amount: number) {
  // Validate the recipient's wallet address
  let recipientPublicKey: PublicKey;
  try {
    recipientPublicKey = new PublicKey(userWallet);
  } catch (error) {
    throw new Error('Invalid wallet address provided');
  }

  // Generate a unique transaction ID for tracking
  const transactionId = `txn_${Math.random().toString(36).substr(2, 9)}`;

  // Replace with your actual sender keypair
  const senderKeypair = Keypair.generate(); // Use a secure key management solution for production

  // Create the transaction
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: senderKeypair.publicKey,
      toPubkey: recipientPublicKey,
      lamports: amount * 1e9, // Convert SOL to lamports
    })
  );

  try {
    // Sign and send the transaction
    const signature = await connection.sendTransaction(transaction, [senderKeypair], {
      skipPreflight: false,
    });

    return { transactionId, signature };
  } catch (error) {
    console.error('Error creating Solana payment transaction:', error);
    throw new Error('Failed to create payment transaction');
  }
}

/**
 * Confirms the status of a Solana transaction.
 * @param transactionId - The transaction signature to confirm.
 * @returns The transaction confirmation status: 'CONFIRMED' or 'FAILED'.
 */
export async function confirmSolanaTransaction(transactionId: string) {
  try {
    const status = await connection.getSignatureStatuses([transactionId]);

    if (status.value && status.value[0]?.confirmationStatus === 'confirmed') {
      return 'CONFIRMED';
    }

    return 'FAILED';
  } catch (error) {
    console.error('Error confirming Solana transaction:', error);
    return 'FAILED';
  }
}
