'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Define the type for the payment form data
type PaymentFormData = {
  token: string;
  amount: number;
  userWallet: string;
};

export const SubscriptionForm: React.FC = () => {
  const [formData, setFormData] = useState<PaymentFormData>({
    token: '',
    amount: 0,
    userWallet: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/subscribe/payments/model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Payment subscription created successfully!');
        router.push('/thank-you'); // Redirect to a success page
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error('An error occurred while processing your payment');
      console.error('Error: ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn('max-w-lg mx-auto p-4')}>
      <h2 className="text-2xl font-bold text-center mb-4">Subscribe to Payment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Token Input */}
        <div>
          <label htmlFor="token" className="block text-sm font-semibold mb-1">
            Token
          </label>
          <Input
            type="text"
            id="token"
            name="token"
            value={formData.token}
            onChange={handleChange}
            placeholder="Enter your token"
            required
          />
        </div>

        {/* Amount Input */}
        <div>
          <label htmlFor="amount" className="block text-sm font-semibold mb-1">
            Amount
          </label>
          <Input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter the amount"
            required
            min={0.01}
          />
        </div>

        {/* Wallet Input */}
        <div>
          <label htmlFor="userWallet" className="block text-sm font-semibold mb-1">
            Wallet Address
          </label>
          <Input
            type="text"
            id="userWallet"
            name="userWallet"
            value={formData.userWallet}
            onChange={handleChange}
            placeholder="Enter your wallet address"
            required
          />
        </div>

        {/* Submit Button */}
        <div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Processing...' : 'Subscribe Now'}
          </Button>
        </div>
      </form>
    </div>
  );
};
