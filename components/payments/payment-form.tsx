'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/router';

const PaymentForm = () => {
  const [token, setToken] = useState('SOL'); // Default token is SOL
  const [amount, setAmount] = useState('');
  const [userWallet, setUserWallet] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!amount || !userWallet) {
      setError('Amount and Wallet address are required');
      return;
    }
    
    if (parseFloat(amount) <= 0) {
      setError('Amount must be greater than zero');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          amount: parseFloat(amount),
          userWallet,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('Payment processed successfully!');
        setAmount('');
        setUserWallet('');
      } else {
        setError(data.message || 'Payment processing failed');
      }
    } catch (err) {
      setError('An error occurred while processing the payment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Payment Form</h2>
      
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {successMessage && <div className="text-green-600 mb-4">{successMessage}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Token Selection */}
        <div>
          <label htmlFor="token" className="block text-sm font-medium text-gray-700">Token</label>
          <select
            id="token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-400 focus:border-gray-500 sm:text-sm"
          >
            <option value="SOL">SOL</option>
            <option value="USDC">USDC</option>
            <option value="BARK">BARK</option>
          </select>
        </div>
        
        {/* Amount Input */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
          <Input
            id="amount"
            type="number"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="mt-1"
          />
        </div>

        {/* Wallet Address Input */}
        <div>
          <label htmlFor="wallet" className="block text-sm font-medium text-gray-700">Your Wallet Address</label>
          <Input
            id="wallet"
            type="text"
            value={userWallet}
            onChange={(e) => setUserWallet(e.target.value)}
            required
            className="mt-1"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r from-[#D0C8B9] to-[#E5DFD3] text-gray-900 hover:from-[#E5DFD3] hover:to-[#D0C8B9] px-8 py-3 text-lg w-full"
          >
            {isLoading ? 'Processing...' : 'Pay Now'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;