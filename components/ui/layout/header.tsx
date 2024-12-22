'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Logo } from '@/components/ui/layout/Logo';

export function Header() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-black text-white py-4 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Logo />
          <Link href="/" className="text-2xl font-semibold text-white">
            Celestials
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex space-x-8">
          <Link href="/about" className="text-lg hover:text-gray-400">
            About
          </Link>
          <Link href="/collection" className="text-lg hover:text-gray-400">
            Collection
          </Link>
          <Link href="/mint" className="text-lg hover:text-gray-400">
            Mint NFT
          </Link>
          <Link href="/roadmap" className="text-lg hover:text-gray-400">
            Roadmap
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-white">
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} bg-black text-white py-4`}
      >
        <nav className="space-y-4 text-center">
          <Link href="/about" className="text-lg hover:text-gray-400 block">
            About
          </Link>
          <Link href="/collection" className="text-lg hover:text-gray-400 block">
            Collection
          </Link>
          <Link href="/mint" className="text-lg hover:text-gray-400 block">
            Mint NFT
          </Link>
          <Link href="/roadmap" className="text-lg hover:text-gray-400 block">
            Roadmap
          </Link>
        </nav>
      </div>
    </header>
  );
}
