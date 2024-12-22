import axios from 'axios';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

export async function getPrice(token: string): Promise<number | null> {
  try {
    let tokenId: string;
    let price: number | null = null;

    if (token === 'SOL') {
      tokenId = 'solana'; // Coingecko ID for Solana
    } else if (token === 'USDC') {
      tokenId = 'usd-coin'; // Coingecko ID for USDC
    } else if (token === 'BARK') {
      price = 0.000001; // Example static price for BARK (adjust as needed)
      return price;
    } else {
      return null; // For unsupported tokens
    }

    const response = await axios.get(`${COINGECKO_API_URL}/simple/price`, {
      params: {
        ids: tokenId,
        vs_currencies: 'usd', // Convert to USD
      },
    });

    price = response.data[tokenId]?.usd;
    return price || null;
  } catch (error) {
    console.error('Error fetching price from Coingecko:', error);
    return null;
  }
}
