import { PublicKey } from '@solana/web3.js';

// Token-related constants
export const BARK_TOKEN_MINT = new PublicKey('2NTvEssJ2i998V2cMGT4Fy3JhyFnAzHFonDo9dbAkVrg');
export const BARK_TOKEN_DECIMALS = 9;

// Blockchain-related constants
export const SOLANA_NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta';
export const RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com';

// API endpoints
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.barkprotocol.com';
export const ELIGIBILITY_ENDPOINT = `${API_BASE_URL}/api/eligibility`;
export const CLAIM_ENDPOINT = `${API_BASE_URL}/api/claim`;
export const STATS_ENDPOINT = `${API_BASE_URL}/api/stats`;

// Airdrop-related constants
export const AIRDROP_TOTAL_SUPPLY = BigInt('18446744073');
export const AIRDROP_ALLOCATION = BigInt('500000000');
export const AIRDROP_START_DATE = new Date('2025-02-15T00:00:00Z');
export const AIRDROP_END_DATE = new Date('2025-02-29T23:59:59Z');

// Claim-related constants
export const MIN_CLAIM_AMOUNT = BigInt('100000000'); // 100 BARK
export const MAX_CLAIM_AMOUNT = BigInt('10000000000'); // 10,000 BARK

// UI-related constants
export const BARK_LOGO_URL = 'https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp';
export const BACKGROUND_IMAGE_URL = 'https://ucarecdn.com/f6029e68-9768-49db-80a9-64e41e70acff/waveblack.png';

// Wallet-related constants
export const WALLET_ADAPTER_NETWORK = SOLANA_NETWORK;

// Error messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet to continue.',
  INELIGIBLE_WALLET: 'This wallet is not eligible for the BARK token airdrop.',
  CLAIM_FAILED: 'Failed to claim BARK tokens. Please try again later.',
  INSUFFICIENT_BALANCE: 'Insufficient balance to complete the transaction.',
  SUBSCRIPTION_FAILED: 'Failed to subscribe. Please try again later.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  CLAIM_SUCCESS: 'Successfully claimed BARK tokens!',
  SUBSCRIPTION_SUCCESS: 'Successfully subscribed to the newsletter!',
};

// Airdrop categories
export const AIRDROP_CATEGORIES = [
  { id: 'early-supporter', name: 'Early Supporter' },
  { id: 'community-contributor', name: 'Community Contributor' },
  { id: 'developer', name: 'Developer' },
  { id: 'partner', name: 'Partner' },
];

// Pagination
export const DEFAULT_PAGE_SIZE = 10;

// Timeouts
export const API_TIMEOUT = 30000; // 30 seconds

// Feature flags
export const FEATURES = {
  ENABLE_CLAIMS: process.env.NEXT_PUBLIC_ENABLE_CLAIMS === 'true',
  SHOW_TESTNET_WARNING: process.env.NEXT_PUBLIC_SHOW_TESTNET_WARNING === 'true',
};
