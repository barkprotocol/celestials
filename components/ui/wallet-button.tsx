'use client'

import { useState, useCallback, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from "@/components/ui/button"
import { Loader2, Wallet } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { toast } from 'react-hot-toast'
import { WalletName } from '@solana/wallet-adapter-base'

export function WalletButton() {
  const { publicKey, select, disconnect, connecting, wallets } = useWallet()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const buttonClasses = cn(
    "bg-white text-black",
    "border border-gray-700 dark:border-gray-200",
    "hover:bg-gray-100 dark:hover:bg-gray-800",
    "py-2 px-4",
    "text-sm font-semibold",
    "transition-colors duration-200"
  )

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect()
      setIsDropdownOpen(false)
      toast.success('Wallet disconnected')
    } catch (error) {
      console.error('Error disconnecting wallet:', error)
      toast.error('Failed to disconnect wallet')
    }
  }, [disconnect])

  const handleSelect = useCallback(async (walletName: WalletName) => {
    try {
      await select(walletName)
      setIsDropdownOpen(false)
    } catch (error) {
      console.error('Error selecting wallet:', error)
      toast.error('Failed to select wallet')
    }
  }, [select])

  const renderConnectedState = () => (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={buttonClasses}>
          <Wallet className="h-4 w-4 mr-2" />
          <span className="text-sm font-semibold">
            {publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-58 bg-background/80 backdrop-blur-sm">
        <DropdownMenuItem onSelect={handleDisconnect}>
          Disconnect
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span className="text-xs">{publicKey?.toBase58()}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  const renderConnectingState = () => (
    <Button variant="outline" className={buttonClasses} disabled>
      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      <span className="text-sm font-medium">Connecting</span>
    </Button>
  )

  const renderDisconnectedState = () => (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={buttonClasses}>
          <Wallet className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Connect</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-55 bg-background/80 backdrop-blur-sm">
        {wallets.map((wallet) => (
          <DropdownMenuItem
            key={wallet.adapter.name}
            onSelect={() => handleSelect(wallet.adapter.name as WalletName)}
          >
            {wallet.adapter.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )

  if (!mounted) return null
  if (publicKey) return renderConnectedState()
  if (connecting) return renderConnectingState()
  return renderDisconnectedState()
}