// /workspace/celestials/components/Hero.tsx

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PaymentForm } from '@/components/payments/payment-form';

const BACKGROUND_URL = "https://ucarecdn.com/f6029e68-9768-49db-80a9-64e41e70acff/waveblack.png";

export function Hero() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0">
        <Image
          src={BACKGROUND_URL}
          alt="Background"
          fill
          priority
          className="object-cover"
          quality={85}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      </div>
      <div className="relative z-10 text-white text-center px-4 sm:px-6 lg:px-8 w-full max-w-4xl mx-auto">
        {/* Badge */}
        <span className="text-lg font-bold text-sand-500 bg-sand-800 px-4 py-2 rounded-full mb-4 inline-block">
          Secure Payments with Solana, USDC, and BARK
        </span>
        
        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 drop-shadow-[0_4px_4px_rgba(0,0,0,0.9), 0_8px_6px_rgba(0,0,0,0.7)]">
          Effortless Payments, Instant Transactions
        </h1>
        
        {/* Description */}
        <p className="text-lg sm:text-xl md:text-2xl mb-8 text-gray-200 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] max-w-3xl mx-auto">
          Pay securely with Solana, USDC, or BARK. Our payment system ensures that your transactions are processed instantly and with minimal fees. Choose your preferred token and start transacting today!
        </p>
        
        {/* Payment Form Integration */}
        <div className="mb-8">
          <PaymentForm />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button asChild className="bg-gradient-to-r from-[#D0C8B9] to-[#E5DFD3] text-gray-900 hover:from-[#E5DFD3] hover:to-[#D0C8B9] px-8 py-3 text-lg">
            <Link href="/payments">Make a Payment</Link>
          </Button>
          <Button asChild variant="outline" className="border-white text-black hover:bg-white hover:text-gray-900 px-8 py-3 text-lg">
            <Link href="/airdrop">Check Eligibility</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
