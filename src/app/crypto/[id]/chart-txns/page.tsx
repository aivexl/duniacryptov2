import DexScreenerChartTxnsLayout from '@/components/DexScreenerChartTxnsLayout';

interface ChartTxnsPageProps {
  params: Promise<{ id: string }>;
}

async function fetchCoinData(id: string) {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&x_cg_demo_api_key=CG-jrJUt1cGARECPAnb9TUeCdqE`,
      { next: { revalidate: 60 } }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch coin data: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching coin data:', error);
    return null;
  }
}

export default async function ChartTxnsPage({ params }: ChartTxnsPageProps) {
  const { id } = await params;
  const coinData = await fetchCoinData(id);
  
  return (
    <div className="min-h-screen bg-dex-bg-primary">
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="bg-dex-bg-secondary border-b border-dex-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={coinData?.image?.small || "/images/token-default.svg"}
                alt={id}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <h1 className="text-xl font-bold text-dex-text-primary">
                  {coinData?.name || id.charAt(0).toUpperCase() + id.slice(1)}
                </h1>
                <p className="text-sm text-dex-text-secondary">
                  {coinData?.symbol?.toUpperCase() || id.toUpperCase()} • Chart & Transactions
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-dex-text-primary">
                ${coinData?.market_data?.current_price?.usd?.toLocaleString() || "0.00"}
              </div>
              <div className={`text-sm ${coinData?.market_data?.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {coinData?.market_data?.price_change_percentage_24h?.toFixed(2) || "0.00"}%
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4">
          <DexScreenerChartTxnsLayout
            coinData={coinData}
            symbol={coinData?.symbol || id}
          />
          {/* Debug info */}
          <div className="text-xs text-gray-500 mt-2">
            Debug: ID={id}, Symbol={coinData?.symbol}, Name={coinData?.name}
          </div>
        </div>
      </div>
    </div>
  );
} 