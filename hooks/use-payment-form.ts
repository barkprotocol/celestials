import { useState } from 'react';
import { validateWalletAddress, validateAmount } from '@/utils/validators';
import { createSolanaPaymentTransaction, confirmSolanaTransaction } from '@/api/payment';

interface PaymentFormState {
  walletAddress: string;
  amount: string;
  transactionId: string;
  transactionStatus: string;
  error: string | null;
}

export const usePaymentForm = () => {
  const [state, setState] = useState<PaymentFormState>({
    walletAddress: '',
    amount: '',
    transactionId: '',
    transactionStatus: '',
    error: null,
  });

  const handleInputChange = (field: keyof PaymentFormState, value: string) => {
    setState((prevState) => ({
      ...prevState,
      [field]: value,
      error: null, // Reset error when input changes
    }));
  };

  const handleSubmit = async () => {
    const { walletAddress, amount } = state;

    // Validate inputs
    if (!validateWalletAddress(walletAddress)) {
      setState((prevState) => ({
        ...prevState,
        error: 'Invalid wallet address.',
      }));
      return;
    }

    if (!validateAmount(amount)) {
      setState((prevState) => ({
        ...prevState,
        error: 'Invalid amount. Please enter a valid number.',
      }));
      return;
    }

    try {
      // Convert amount to number
      const numericAmount = parseFloat(amount);

      // Create payment transaction
      const { transactionId } = await createSolanaPaymentTransaction(walletAddress, numericAmount);

      setState((prevState) => ({
        ...prevState,
        transactionId,
        transactionStatus: 'PENDING',
      }));

      // Confirm the transaction
      const status = await confirmSolanaTransaction(transactionId);

      setState((prevState) => ({
        ...prevState,
        transactionStatus: status,
      }));
    } catch (error) {
      console.error('Payment submission error:', error);
      setState((prevState) => ({
        ...prevState,
        error: 'Failed to process the payment. Please try again later.',
      }));
    }
  };

  return {
    state,
    handleInputChange,
    handleSubmit,
  };
};
