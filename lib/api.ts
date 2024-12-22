import { PaymentDetails, PaymentResponse, TokenTransferData } from './types';
import { sendSolTransaction, sendSPLTokenTransaction } from './transaction';
import { PAYMENT_SUCCESS_MESSAGE, PAYMENT_FAILURE_MESSAGE } from './constants';
import { Keypair } from '@solana/web3.js';

// Function to handle payment and transfer tokens
export async function transferTokens(transferData: TokenTransferData): Promise<PaymentResponse> {
  const { tokenAddress, amount, sender, recipient, tokenSymbol } = transferData;

  try {
    if (tokenSymbol === 'SOL') {
      // Send SOL
      const senderKeypair = Keypair.fromSecretKey(new Uint8Array(JSON.parse(sender))); // Convert the sender's private key from string
      const txId = await sendSolTransaction(senderKeypair, recipient, amount);
      return {
        success: true,
        txId,
      };
    } else if (tokenSymbol === 'USDC' || tokenSymbol === 'BARK') {
      // Send SPL Token (USDC, BARK, etc.)
      const senderKeypair = Keypair.fromSecretKey(new Uint8Array(JSON.parse(sender)));
      const txId = await sendSPLTokenTransaction(senderKeypair, recipient, tokenAddress, amount);
      return {
        success: true,
        txId,
      };
    } else {
      return {
        success: false,
        error: PAYMENT_FAILURE_MESSAGE,
      };
    }
  } catch (error) {
    console.error('Error transferring tokens:', error);
    return {
      success: false,
      error: PAYMENT_FAILURE_MESSAGE,
    };
  }
}
