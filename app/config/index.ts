import { config } from 'dotenv';
import { PublicKey } from '@solana/web3.js';

// Load environment variables
config();

// Ensure required environment variables are set
if (!process.env.SECRET_KEY || !process.env.DATABASE_URL) {
  throw new Error('Missing required environment variables: SECRET_KEY or DATABASE_URL.');
}

// Solana configuration
export const SOLANA_CLUSTER_URL = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
export const SOLANA_NETWORK = process.env.SOLANA_NETWORK || 'devnet';

// Sensitive keys
export const SECRET_KEY = process.env.SECRET_KEY;

// Token mint addresses
export const USDC_MINT_ADDRESS = (() => {
  try {
    return new PublicKey(process.env.USDC_MINT_ADDRESS || 'USDC_DEFAULT_MINT_ADDRESS');
  } catch {
    throw new Error('Invalid USDC_MINT_ADDRESS.');
  }
})();

export const BARK_MINT_ADDRESS = (() => {
  try {
    return new PublicKey(process.env.BARK_MINT_ADDRESS || 'BARK_DEFAULT_MINT_ADDRESS');
  } catch {
    throw new Error('Invalid BARK_MINT_ADDRESS.');
  }
})();

// Database configuration
export const DATABASE_URL = process.env.DATABASE_URL;

// External APIs
export const PRICES_API_URL = process.env.PRICES_API_URL || 'https://api.barkprotocol.net/get-price';

// Payment processing configuration
export const MERCHANT_FEE_PERCENTAGE = parseFloat(process.env.MERCHANT_FEE_PERCENTAGE || '2.5');

// Solana program IDs
export const TOKEN_PROGRAM_ID = (() => {
  try {
    return new PublicKey(process.env.TOKEN_PROGRAM_ID || 'TokenkegQfeZyiNwAJbNbGKPFXkQd5J8X8wnF8MPzYx');
  } catch {
    throw new Error('Invalid TOKEN_PROGRAM_ID.');
  }
})();

// Exported function for centralized access
export const getConfig = () => ({
  solanaClusterUrl: SOLANA_CLUSTER_URL,
  solanaNetwork: SOLANA_NETWORK,
  secretKey: SECRET_KEY,
  usdcMintAddress: USDC_MINT_ADDRESS,
  barkMintAddress: BARK_MINT_ADDRESS,
  databaseUrl: DATABASE_URL,
  pricesApiUrl: PRICES_API_URL,
  merchantFeePercentage: MERCHANT_FEE_PERCENTAGE,
  tokenProgramId: TOKEN_PROGRAM_ID,
});
