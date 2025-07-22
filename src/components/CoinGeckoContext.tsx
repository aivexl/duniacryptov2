import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { CoinAPI, Global } from './CoinGeckoTypes';

type Coin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  total_volume: number;
};

type CoinGeckoContextType = {
  coins: Coin[] | null;
  global: Global | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

const CoinGeckoContext = createContext<CoinGeckoContextType | undefined>(undefined);

const COINS_URL = '/api/coingecko/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false';
const GLOBAL_URL = '/api/coingecko/api/v3/global';

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