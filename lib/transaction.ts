import { Connection, PublicKey, Transaction, SystemProgram, Keypair, TransactionSignature } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, AccountLayout, Token } from '@solana/spl-token';
import { SOLANA_RPC_URL } from './constants';

// Setup connection to Solana network (devnet, testnet, or mainnet)
const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

// Helper function to send SOL from one account to another
export async function sendSolTransaction(
  senderKeypair: Keypair, // Sender's Keypair (private key)
  recipientAddress: string, // Recipient's public address
  amount: number // Amount of SOL to transfer
): Promise<TransactionSignature> {
  try {
    const recipient = new PublicKey(recipientAddress);
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderKeypair.publicKey,
        toPubkey: recipient,
        lamports: amount * 10 ** 9, // Convert SOL to lamports (1 SOL = 10^9 lamports)
      })
    );

    // Sign and send the transaction
    const signature = await connection.sendTransaction(transaction, [senderKeypair]);
    await connection.confirmTransaction(signature);
    console.log(`SOL transaction successful. Signature: ${signature}`);
    return signature;
  } catch (error) {
    console.error('Error sending SOL transaction:', error);
    throw new Error('Failed to send SOL transaction');
  }
}

// Helper function to send SPL tokens (e.g., USDC, BARK)
export async function sendSPLTokenTransaction(
  senderKeypair: Keypair, // Sender's Keypair (private key)
  recipientAddress: string, // Recipient's public address
  mintAddress: string, // SPL Token Mint Address (USDC or BARK)
  amount: number // Amount of tokens to transfer
): Promise<TransactionSignature> {
  try {
    const recipient = new PublicKey(recipientAddress);
    const mint = new PublicKey(mintAddress);
    const token = new Token(connection, mint, TOKEN_PROGRAM_ID, senderKeypair);

    // Get associated token addresses for sender and recipient
    const senderTokenAccount = await token.getOrCreateAssociatedAccountInfo(senderKeypair.publicKey);
    const recipientTokenAccount = await token.getOrCreateAssociatedAccountInfo(recipient);

    // Create transaction to transfer SPL tokens
    const transaction = new Transaction().add(
      Token.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        senderTokenAccount.address,
        recipientTokenAccount.address,
        senderKeypair.publicKey,
        [],
        amount * 10 ** 9
      )
    );

    // Sign and send the transaction
    const signature = await connection.sendTransaction(transaction, [senderKeypair]);
    await connection.confirmTransaction(signature);
    console.log(`SPL Token transaction successful. Signature: ${signature}`);
    return signature;
  } catch (error) {
    console.error('Error sending SPL token transaction:', error);
    throw new Error('Failed to send SPL token transaction');
  }
}
