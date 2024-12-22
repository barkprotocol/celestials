// /workspace/celestials/lib/constants.ts

// Solana Network RPC URLs
export const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';

// Solana Token Mint Addresses (for USDC and BARK tokens)
export const USDC_MINT_ADDRESS = process.env.NEXT_PUBLIC_USDC_MINT_ADDRESS || 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
export const SOL_MINT_ADDRESS = process.env.NEXT_PUBLIC_SOL_MINT_ADDRESS || 'So11111111111111111111111111111111111111112';
export const BARK_MINT_ADDRESS = process.env.NEXT_PUBLIC_BARK_MINT_ADDRESS || '2NTvEssJ2i998V2cMGT4Fy3JhyFnAzHFonDo9dbAkVrg';

// Solana Network Environment
export const SOLANA_NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet'; // Can be 'mainnet', 'devnet', or 'testnet'

// Payment Constants
export const PAYMENT_SUCCESS_MESSAGE = 'Payment was successful!';
export const PAYMENT_FAILURE_MESSAGE = 'There was an error processing your payment. Please try again.';
export const PAYMENT_PENDING_MESSAGE = 'Your payment is pending. Please wait for confirmation.';

// Token Precision for USDC or SPL Tokens
export const USDC_DECIMALS = 6; // USDC uses 6 decimals
export const BARK_DECIMALS = 6; // Assuming BARK also uses 6 decimals; adjust as necessary

// Default Transaction Fee (can vary depending on network conditions)
export const TRANSACTION_FEE_SOL = 0.000005; // Transaction fee in SOL (example, adjust as needed)

// Confirmation Timeout
export const TRANSACTION_CONFIRMATION_TIMEOUT = 30 * 1000; // 30 seconds for confirmation

// Database Table Names (if using Supabase or Prisma)
export const TRANSACTIONS_TABLE = 'transactions'; // Name of the transactions table
