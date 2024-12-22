import { prisma } from '@/lib/prisma';
import { createSolanaPaymentTransaction, confirmSolanaTransaction } from '@/lib/solana-utils';

interface PaymentRequest {
  token: string;
  amount: number;
  userWallet: string;
  paymentMethod: string;
}

// Function to create a payment and transaction
export async function createPayment(payload: PaymentRequest) {
  try {
    // Make a POST request to your backend to create the payment
    const response = await fetch('/api/subscribe/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create payment');
    }

    return data;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw new Error('Error creating payment');
  }
}

// Function to confirm a payment by transaction ID
export async function confirmPayment(transactionId: string, paymentStatus: string, transactionStatus: string) {
  try {
    // Make a PUT request to confirm the payment on the backend
    const response = await fetch('/api/subscribe/payments', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ transactionId, paymentStatus, transactionStatus }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to confirm payment');
    }

    return data;
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw new Error('Error confirming payment');
  }
}

// Utility function to handle creating Solana payment transactions
export async function createSolanaTransaction(userWallet: string, amount: number) {
  try {
    // Call the Solana utility function to create the transaction
    const { transactionId, signature } = await createSolanaPaymentTransaction(userWallet, amount);
    return { transactionId, signature };
  } catch (error) {
    console.error('Error creating Solana transaction:', error);
    throw new Error('Error creating Solana transaction');
  }
}

// Utility function to confirm the Solana transaction
export async function confirmSolanaTransactionStatus(transactionId: string) {
  try {
    // Confirm the transaction on Solana network
    const status = await confirmSolanaTransaction(transactionId);
    return status;
  } catch (error) {
    console.error('Error confirming Solana transaction:', error);
    throw new Error('Error confirming Solana transaction');
  }
}
