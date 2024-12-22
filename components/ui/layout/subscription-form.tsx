"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

export function SubscriptionForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement actual subscription logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      toast.success('Successfully subscribed!');
      setEmail('');
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex flex-col sm:flex-row">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-gray-800 text-white placeholder-gray-400 border-gray-700 focus:border-[#D0C8B9] mb-2 sm:mb-0 sm:mr-2"
        />
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-[#D0C8B9] text-black hover:bg-[#E5DFD3] transition-colors duration-200"
        >
          {isLoading ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </div>
    </form>
  );
}
