import PriceDisplay from '@/components/price-display';

export default function Home() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Price Dashboard</h1>
      <div className="flex flex-col items-center space-y-4">
        <PriceDisplay token="SOL" />
        <PriceDisplay token="USDC" />
        <PriceDisplay token="BARK" />
      </div>
    </div>
  );
}
