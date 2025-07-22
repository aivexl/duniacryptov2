import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { CoinAPI, Global, Coin, CoinGeckoContextType } from './CoinGeckoTypes';
import { COINS_URL, GLOBAL_URL } from './CoinGeckoTypes';

const CoinGeckoContext = createContext<CoinGeckoContextType | undefined>(undefined);

export const CoinGeckoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [coins, setCoins] = useState<Coin[] | null>(null);
  const [global, setGlobal] = useState<Global | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [coinsRes, globalRes] = await Promise.all([
        fetch(COINS_URL),
        fetch(GLOBAL_URL),
      ]);
      if (!coinsRes.ok || !globalRes.ok) throw new Error('Failed to fetch CoinGecko data. Please try again later.');
      const coinsData = await coinsRes.json();
      const globalData = await globalRes.json();
      const transformedCoins = coinsData.map((coin: CoinAPI, index: number) => ({
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        image: `https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`,
        current_price: parseFloat(String(coin.current_price)),
        market_cap: parseFloat(String(coin.market_cap)),
        market_cap_rank: index + 1,
        price_change_percentage_24h: parseFloat(String(coin.price_change_percentage_24h)),
        total_volume: parseFloat(String(coin.total_volume)),
      }));
      setCoins(transformedCoins);
      setGlobal(globalData.data);
    } catch {
      setError('Failed to fetch CoinGecko data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <CoinGeckoContext.Provider value={{ coins, global, loading, error, refresh: fetchAll }}>
      {children}
    </CoinGeckoContext.Provider>
  );
};

export function useCoinGecko() {
  const ctx = useContext(CoinGeckoContext);
  if (!ctx) throw new Error('useCoinGecko must be used within a CoinGeckoProvider');
  return ctx;
} 