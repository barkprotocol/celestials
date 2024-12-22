import React from 'react';
import WalletProvider from '@/components/providers/wallet-providers';
import type { AppProps } from 'next/app';

function PaymentApp({ Component, pageProps }: AppProps) {
  return (
    <WalletProvider>
      <Component {...pageProps} />
    </WalletProvider>
  );
}

export default PaymentApp;