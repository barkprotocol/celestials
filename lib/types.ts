import { PublicKey } from '@solana/web3.js';

// Define the structure of payment data
export interface PaymentDetails {
  amount: number; // Amount to be paid
  recipient: string; // Recipient wallet address
  sender: string; // Sender wallet address
  tokenType: 'SOL' | 'USDC' | 'BARK'; // Type of token (SOL, USDC, BARK)
  currencySymbol: string; // Symbol for currency (e.g., 'SOL', 'USDC', 'BARK')
}

// Response structure for payment confirmation
export interface PaymentResponse {
  success: boolean; // Whether the payment was successful
  txId?: string; // Transaction ID (if available)
  error?: string; // Error message if the payment failed
}

// Token transfer data
export interface TokenTransferData {
  tokenAddress: PublicKey; // The address of the token (mint address)
  amount: number; // Amount of the token to be transferred
  sender: string; // Sender's wallet address
  recipient: string; // Recipient's wallet address
  tokenSymbol: string; // Symbol for the token (e.g., SOL, USDC)
}

// Price data for displaying token prices
export interface TokenPriceData {
  token: string; // Token symbol (SOL, USDC, BARK)
  price: number; // Current price of the token
}
