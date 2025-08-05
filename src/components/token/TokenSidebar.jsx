"use client";
import React, { useState, useEffect } from "react";

const TokenSidebar = ({ token, pair, timeFrame, chainId }) => {
  const [pairStats, setPairStats] = useState(null);
  const [tokenMetadata, setTokenMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("24h");

  // Block explorer URLs by chain
  const blockExplorers = {
    "0x1": "https://etherscan.io",
    "0x38": "https://bscscan.com",
    "0x89": "https://polygonscan.com",
    "0xa4b1": "https://arbiscan.io",
    "0xa": "https://optimistic.etherscan.io",
    "0x2105": "https://basescan.org",
    "0xa86a": "https://snowtrace.io",
    "0xe708": "https://lineascan.build",
    "0xfa": "https://ftmscan.com",
    "0x171": "https://scan.pulsechain.com",
    "0x7e4": "https://app.roninchain.com",
    solana: "https://solscan.io",
  };

  // Map UI timeframes to API timeframes
  const timeFrameMap = {
    "5m": "5min",
    "1h": "1h",
    "4h": "4h",
    "24h": "24h",
  };

  // Mock data for when API fails
  const getMockPairStats = () => ({
    "5min": {
      priceChange: 0.5,
      buys: 150,
      sells: 120,
      totalVolume: 2500000,
      buyVolume: 1400000,
      sellVolume: 1100000,
      buyers: 45,
      sellers: 38,
    },
    "1h": {
      priceChange: 1.2,
      buys: 450,
      sells: 380,
      totalVolume: 7500000,
      buyVolume: 4200000,
      sellVolume: 3300000,
      buyers: 120,
      sellers: 95,
    },
    "4h": {
      priceChange: -0.8,
      buys: 1200,
      sells: 1350,
      totalVolume: 18000000,
      buyVolume: 8500000,
      sellVolume: 9500000,
      buyers: 280,
      sellers: 320,
    },
    "24h": {
      priceChange: 2.5,
      buys: 8500,
      sells: 7200,
      totalVolume: 125000000,
      buyVolume: 68000000,
      sellVolume: 57000000,
      buyers: 1200,
      sellers: 980,
    },
  });

  // Fetch token metadata
  useEffect(() => {
    const fetchTokenMetadata = async () => {
      if (!token || !token.address || token.address === "0x0000000000000000000000000000000000000000") {
        setLoading(false);
        return;
      }

      // Check if Moralis API key is available
      const moralisApiKey = process.env.NEXT_PUBLIC_MORALIS_API_KEY;
      if (!moralisApiKey) {
        console.warn("Moralis API key not found, using mock metadata");
        setTokenMetadata({
          name: token.name,
          symbol: token.symbol,
          logo: token.logo,
          website: null,
          twitter: null,
          telegram: null,
          discord: null,
        });
        setLoading(false);
        return;
      }

      try {
        let url;
        const isSolana = chainId === "solana";

        if (isSolana) {
          url = `https://solana-gateway.moralis.io/token/mainnet/${token.address}/metadata`;
        } else {
          url = `https://deep-index.moralis.io/api/v2.2/erc20/metadata?chain=${chainId}&addresses[0]=${token.address}`;
        }

        const response = await fetch(url, {
          headers: {
            accept: "application/json",
            "X-API-Key": moralisApiKey,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            console.warn("Moralis API key is invalid or expired, using mock metadata");
            setTokenMetadata({
              name: token.name,
              symbol: token.symbol,
              logo: token.logo,
              website: null,
              twitter: null,
              telegram: null,
              discord: null,
            });
            setLoading(false);
            return;
          }
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        // Handle different response formats
        if (isSolana) {
          setTokenMetadata(data);
        } else {
          // EVM response is an array, take first item
          setTokenMetadata(
            Array.isArray(data) && data.length > 0 ? data[0] : null
          );
        }
      } catch (err) {
        console.error("Error fetching token metadata:", err);
        // Use mock metadata when API fails
        setTokenMetadata({
          name: token.name,
          symbol: token.symbol,
          logo: token.logo,
          website: null,
          twitter: null,
          telegram: null,
          discord: null,
        });
      }
    };

    fetchTokenMetadata();
  }, [token, chainId]);

  // Fetch pair stats
  useEffect(() => {
    const fetchPairStats = async () => {
      if (!pair || !pair.pairAddress || pair.pairAddress === "0x0000000000000000000000000000000000000000") {
        // Use mock data when no pair address
        setPairStats(getMockPairStats());
        setLoading(false);
        return;
      }

      // Check if Moralis API key is available
      const moralisApiKey = process.env.NEXT_PUBLIC_MORALIS_API_KEY;
      if (!moralisApiKey) {
        console.warn("Moralis API key not found, using mock data");
        setPairStats(getMockPairStats());
        setLoading(false);
        return;
      }

      try {
        let url;
        const isSolana = chainId === "solana";

        if (isSolana) {
          url = `https://solana-gateway.moralis.io/token/mainnet/pairs/${pair.pairAddress}/stats`;
        } else {
          url = `https://deep-index.moralis.io/api/v2.2/erc20/${pair.pairAddress}/stats?chain=${chainId}`;
        }

        const response = await fetch(url, {
          headers: {
            accept: "application/json",
            "X-API-Key": moralisApiKey,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            console.warn("Moralis API key is invalid or expired, using mock data");
            setPairStats(getMockPairStats());
            setLoading(false);
            return;
          }
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        setPairStats(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching pair stats:", err);
        // Use mock data when API fails
        setPairStats(getMockPairStats());
        setLoading(false);
      }
    };

    fetchPairStats();
  }, [pair, chainId]);

  const handleTimeFrameChange = (timeFrame) => {
    setSelectedTimeFrame(timeFrame);
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return "$0.00";
    
    if (price < 0.000001) {
      return `$${price.toExponential(2)}`;
    } else if (price < 0.01) {
      return `$${price.toFixed(6)}`;
    } else if (price < 1) {
      return `$${price.toFixed(4)}`;
    } else if (price < 1000) {
      return `$${price.toFixed(2)}`;
    } else {
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  };

  const formatTokenPrice = (price, symbol) => {
    if (!price || price === 0) return `0 ${symbol}`;
    
    if (price < 0.000001) {
      return `${price.toExponential(2)} ${symbol}`;
    } else if (price < 0.01) {
      return `${price.toFixed(6)} ${symbol}`;
    } else if (price < 1) {
      return `${price.toFixed(4)} ${symbol}`;
    } else if (price < 1000) {
      return `${price.toFixed(2)} ${symbol}`;
    } else {
      return `${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${symbol}`;
    }
  };

  const formatNumber = (num) => {
    if (!num || num === 0) return "0";
    
    if (num >= 1e9) {
      return (num / 1e9).toFixed(1) + "B";
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(1) + "M";
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(1) + "K";
    } else {
      return num.toLocaleString();
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Unknown";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    // Calculate years, months, and days more accurately
    const years = Math.floor(diffInDays / 365.25);
    const remainingDaysAfterYears = diffInDays % 365.25;
    const months = Math.floor(remainingDaysAfterYears / 30.44);
    const days = Math.floor(remainingDaysAfterYears % 30.44);
    
    // For very short periods, show seconds/minutes/hours
    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInDays < 30) return `${diffInDays}d`;
    
    // For periods less than a year, show months and days
    if (years === 0) {
      if (months === 0) return `${days}d`;
      if (days === 0) return `${months}m`;
      return `${months}m ${days}d`;
    }
    
    // For periods of a year or more, show years, months, and days
    if (months === 0 && days === 0) return `${years}y`;
    if (days === 0) return `${years}y ${months}m`;
    return `${years}y ${months}m ${days}d`;
  };

  const formatPercentChange = (value) => {
    if (!value && value !== 0) return "0.00%";
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  const calculateRatio = (a, b) => {
    if (a === 0 && b === 0) return 0.5;
    return a / (a + b);
  };

  const getTimePeriodData = (period) => {
    if (!pairStats) return { priceChange: 0, buys: 0, sells: 0, totalVolume: 0, buyVolume: 0, sellVolume: 0, buyers: 0, sellers: 0 };
    
    const periodData = pairStats[timeFrameMap[period]] || {};
    return {
      priceChange: periodData.priceChange || 0,
      buys: periodData.buys || 0,
      sells: periodData.sells || 0,
      totalVolume: periodData.totalVolume || 0,
      buyVolume: periodData.buyVolume || 0,
      sellVolume: periodData.sellVolume || 0,
      buyers: periodData.buyers || 0,
      sellers: periodData.sellers || 0,
    };
  };

  const getTokenLinks = () => {
    if (!tokenMetadata) return {};
    
    return {
      website: tokenMetadata.website || null,
      twitter: tokenMetadata.twitter || null,
      telegram: tokenMetadata.telegram || null,
      discord: tokenMetadata.discord || null,
    };
  };

  const getMarketCapOrFDV = (type = "fdv") => {
    if (!pair || !pair.priceUsd) return 0;
    
    const price = parseFloat(pair.priceUsd);
    const supply = type === "fdv" ? (tokenMetadata?.totalSupply || 0) : (tokenMetadata?.circulatingSupply || 0);
    
    return price * supply;
  };

  const shortenAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    // You can add a toast notification here
  };

  const getExplorerUrl = (address, type = "address") => {
    const explorer = blockExplorers[chainId];
    if (!explorer || !address) return "#";
    
    if (type === "token") {
      return `${explorer}/token/${address}`;
    }
    return `${explorer}/address/${address}`;
  };

  // Extract data from pair
  const usdPrice = pair?.priceUsd || 0;
  const nativePrice = pair?.priceNative || 0;
  const quoteToken = pair?.quoteToken || "USDT";
  const totalLiquidity = pair?.liquidityUsd || 0;
  const creationTime = pair?.pairCreatedAt;
  const currentPeriodData = getTimePeriodData(selectedTimeFrame);
  const tokenLinks = getTokenLinks();

  if (loading) {
    return (
      <div className="w-full lg:w-80 bg-gray-900 border-l border-gray-800 overflow-y-auto">
        <div className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-80 bg-gray-900 border-l border-gray-800 overflow-y-auto">
      {/* Token Header */}
      <div className="p-3 border-b border-gray-800">
        <div className="flex items-center mb-2">
          <img
            src={
              token.logo ||
              tokenMetadata?.logo ||
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwMCIgZmlsbD0iIzM0Mzk0NyIvPjwvc3ZnPg=="
            }
            alt={token.symbol}
            className="w-8 h-8 mr-2 rounded-full bg-gray-700"
            onError={(e) => {
              e.target.onError = null;
              e.target.src =
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwMCIgZmlsbD0iIzM0Mzk0NyIvPjwvc3ZnPg==";
            }}
          />
          <div>
            <h1 className="text-lg font-bold flex items-center">
              {tokenMetadata?.name || token.name}
              <span className="ml-2 text-sm text-gray-400">
                ({tokenMetadata?.symbol || token.symbol})
              </span>
            </h1>
            <div className="text-sm text-gray-400">
              {pair.pairLabel} on {pair.exchangeName}
            </div>
          </div>
        </div>

        {/* Watchlist & Alert Buttons (Minimalis & Modern) */}
        <div className="grid grid-cols-2 gap-2 mb-3 mt-2">
          {/* Watchlist Button */}
          <button className="flex justify-center items-center p-2 bg-transparent hover:bg-gray-800/50 rounded-lg text-xs text-gray-200 border border-gray-700 transition-all duration-200">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span className="font-bold">Watchlist</span>
          </button>

          {/* Alert Button (bell icon) */}
          <button className="flex justify-center items-center p-2 bg-transparent hover:bg-gray-800/50 rounded-lg text-xs text-gray-200 border border-gray-700 transition-all duration-200">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="font-bold">Alert</span>
          </button>
        </div>

        <div className="flex space-x-2 mt-3">
          {tokenLinks.website && (
            <a
              href={tokenLinks.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium text-center"
            >
              Website
            </a>
          )}
          {tokenLinks.twitter && (
            <a
              href={tokenLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium text-center"
            >
              Twitter
            </a>
          )}
          {tokenLinks.telegram && (
            <a
              href={tokenLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium text-center"
            >
              Telegram
            </a>
          )}
        </div>
      </div>

      {/* Price Information */}
      <div className="grid grid-cols-2 p-3 border-b border-gray-800">
        <div className="col-span-1">
          <div className="text-xs text-gray-400 mb-0.5">PRICE USD</div>
          <div className="text-sm font-medium">{formatPrice(usdPrice)}</div>
        </div>
        <div className="col-span-1">
          <div className="text-xs text-gray-400 mb-0.5">PRICE {quoteToken}</div>
          <div className="text-sm font-medium">
            {formatTokenPrice(nativePrice, quoteToken)}
          </div>
        </div>
      </div>

      {/* Liquidity & Volume */}
      <div className="grid grid-cols-3 p-3 border-b border-gray-800">
        <div className="col-span-1">
          <div className="text-xs text-gray-400 mb-0.5">LIQUIDITY</div>
          <div className="text-xs font-medium">${formatNumber(totalLiquidity)}</div>
        </div>
        <div className="col-span-1">
          <div className="text-xs text-gray-400 mb-0.5">FDV</div>
          <div className="text-xs font-medium">
            ${formatNumber(getMarketCapOrFDV("fdv"))}
          </div>
        </div>
        <div className="col-span-1">
          <div className="text-xs text-gray-400 mb-0.5">MKT CAP</div>
          <div className="text-xs font-medium">
            ${formatNumber(getMarketCapOrFDV("market_cap"))}
          </div>
        </div>
      </div>

      {/* Time Frame Selector */}
      <div className="grid grid-cols-4 border-b border-gray-800">
        {["5m", "1h", "4h", "24h"].map((period) => {
          const periodData = getTimePeriodData(period);
          const isActive = selectedTimeFrame === period;
          return (
            <div
              key={period}
              className={`col-span-1 p-2 text-center cursor-pointer ${
                isActive ? "bg-gray-800" : ""
              }`}
              onClick={() => handleTimeFrameChange(period)}
            >
              <div className="text-xs text-gray-400 mb-0.5">{period}</div>
              <div
                className={`text-sm font-medium ${
                  periodData.priceChange >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {formatPercentChange(periodData.priceChange)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats grid section */}
      <div className="grid grid-cols-3 border-b border-gray-800">
        {/* TXNS section */}
        <div className="col-span-1 border-r border-gray-800 p-2">
          <div className="text-xs text-gray-400 mb-0.5">TXNS</div>
          <div className="text-sm font-medium">
            {formatNumber(currentPeriodData.buys + currentPeriodData.sells)}
          </div>
        </div>

        {/* BUYS section */}
        <div className="col-span-2 p-2">
          <div className="grid grid-cols-2">
            <div className="col-span-1">
              <div className="text-xs text-gray-400 mb-0.5">BUYS</div>
              <div className="text-xs">{formatNumber(currentPeriodData.buys)}</div>
            </div>
            <div className="col-span-1 text-right">
              <div className="text-xs text-gray-400 mb-0.5">SELLS</div>
              <div className="text-xs">{formatNumber(currentPeriodData.sells)}</div>
            </div>
          </div>
          <div className="mt-1.5 h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div className="flex h-full">
              <div
                className="h-full bg-green-500"
                style={{
                  width: `${calculateRatio(currentPeriodData.buys, currentPeriodData.sells) * 100}%`,
                }}
              ></div>
              <div
                className="h-full bg-red-500"
                style={{
                  width: `${calculateRatio(currentPeriodData.sells, currentPeriodData.buys) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* VOLUME section */}
      <div className="grid grid-cols-3 border-b border-gray-800">
        <div className="col-span-1 border-r border-gray-800 p-2">
          <div className="text-xs text-gray-400 mb-0.5">VOLUME</div>
          <div className="text-sm font-medium">
            ${formatNumber(currentPeriodData.totalVolume)}
          </div>
        </div>

        <div className="col-span-2 p-2">
          <div className="grid grid-cols-2">
            <div className="col-span-1">
              <div className="text-xs text-gray-400 mb-0.5">BUY VOL</div>
              <div className="text-xs">${formatNumber(currentPeriodData.buyVolume)}</div>
            </div>
            <div className="col-span-1 text-right">
              <div className="text-xs text-gray-400 mb-0.5">SELL VOL</div>
              <div className="text-xs">${formatNumber(currentPeriodData.sellVolume)}</div>
            </div>
          </div>
          <div className="mt-1.5 h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div className="flex h-full">
              <div
                className="h-full bg-green-500"
                style={{
                  width: `${calculateRatio(currentPeriodData.buyVolume, currentPeriodData.sellVolume) * 100}%`,
                }}
              ></div>
              <div
                className="h-full bg-red-500"
                style={{
                  width: `${calculateRatio(currentPeriodData.sellVolume, currentPeriodData.buyVolume) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* MAKERS section */}
      <div className="grid grid-cols-3 border-b border-gray-800">
        <div className="col-span-1 border-r border-gray-800 p-2">
          <div className="text-xs text-gray-400 mb-0.5">MAKERS</div>
          <div className="text-sm font-medium">
            {formatNumber(currentPeriodData.buyers + currentPeriodData.sellers)}
          </div>
        </div>

        <div className="col-span-2 p-2">
          <div className="grid grid-cols-2">
            <div className="col-span-1">
              <div className="text-xs text-gray-400 mb-0.5">BUYERS</div>
              <div className="text-xs">{formatNumber(currentPeriodData.buyers)}</div>
            </div>
            <div className="col-span-1 text-right">
              <div className="text-xs text-gray-400 mb-0.5">SELLERS</div>
              <div className="text-xs">{formatNumber(currentPeriodData.sellers)}</div>
            </div>
          </div>
          <div className="mt-1.5 h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div className="flex h-full">
              <div
                className="h-full bg-green-500"
                style={{
                  width: `${calculateRatio(currentPeriodData.buyers, currentPeriodData.sellers) * 100}%`,
                }}
              ></div>
              <div
                className="h-full bg-red-500"
                style={{
                  width: `${calculateRatio(currentPeriodData.sellers, currentPeriodData.buyers) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Pair Details Section */}
      <div className="border-b border-gray-800">
        {creationTime && (
          <div className="p-2 border-b border-gray-800 flex justify-between items-center">
            <div className="text-xs text-gray-400">Age</div>
            <div className="text-xs">{formatTimeAgo(creationTime)}</div>
          </div>
        )}

        {/* Pair Address */}
        <div className="p-2 border-b border-gray-800">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-400">Pair</div>
            <div className="flex items-center space-x-1">
              <span className="font-mono text-xs">{shortenAddress(pair.pairAddress)}</span>
              <button
                onClick={() => handleCopy(pair.pairAddress)}
                className="px-1.5 py-0.5 text-xs bg-gray-800 rounded hover:bg-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
              <a
                href={getExplorerUrl(pair.pairAddress, "token")}
                target="_blank"
                rel="noopener noreferrer"
                className="px-1.5 py-0.5 text-xs bg-gray-800 rounded hover:bg-gray-700"
              >
                EXP
              </a>
            </div>
          </div>
        </div>

        {/* Token Address */}
        <div className="p-2">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-400">{token.symbol}</div>
            <div className="flex items-center space-x-1">
              <span className="font-mono text-xs">{shortenAddress(token.address)}</span>
              <button
                onClick={() => handleCopy(token.address)}
                className="px-1.5 py-0.5 text-xs bg-gray-800 rounded hover:bg-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
              <a
                href={getExplorerUrl(token.address, "token")}
                target="_blank"
                rel="noopener noreferrer"
                className="px-1.5 py-0.5 text-xs bg-gray-800 rounded hover:bg-gray-700"
              >
                EXP
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons - Minimalis & Modern */}
      <div className="p-3 grid grid-cols-2 gap-2">
        <a
          href={`https://twitter.com/intent/tweet?text=Check%20out%20${token.symbol}%20on%20DEXScreener&url=${encodeURIComponent(window.location.href)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center items-center p-2 bg-gray-900 hover:bg-gray-800 rounded-lg text-xs text-gray-200 border border-gray-700 transition-all duration-200 no-underline hover:no-underline"
        >
          <span className="mr-1">𝕏</span>
          <span>Share on X</span>
        </a>

        <a
          href="/asset"
          className="flex justify-center items-center p-2 bg-gray-900 hover:bg-gray-800 rounded-lg text-xs text-gray-200 border border-gray-700 transition-all duration-200 no-underline hover:no-underline"
        >
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>Other Pair</span>
        </a>
      </div>



      {/* Trading Buttons */}
      <div className="p-3 border-t border-gray-800">
        <div className="grid grid-cols-2 gap-3">
          {/* BUY Button */}
          <div className="relative group">
            <button 
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
              disabled
            >
              <span>BELI</span>
            </button>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>Coming Soon</span>
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
            </div>
          </div>

          {/* SELL Button */}
          <div className="relative group">
            <button 
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
              disabled
            >
              <span>JUAL</span>
            </button>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>Coming Soon</span>
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
            </div>
          </div>
        </div>

        {/* Beluga AI Button */}
        <div className="mt-3 relative group">
          <button 
            className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            disabled
          >
            <span>Beluga AI</span>
            <div className="relative">
              <img 
                src="/Asset/aistar.png" 
                alt="AI Star" 
                className="w-6 h-6 object-contain"
                style={{
                  filter: 'drop-shadow(0 0 12px rgba(147, 51, 234, 0.8)) brightness(0) saturate(100%) invert(1)',
                  background: 'linear-gradient(45deg, #40ffaa, #4079ff, #40ffaa, #4079ff, #40ffaa)',
                  backgroundSize: '300% 100%',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  animation: 'gradient 2s linear infinite'
                }}
              />
            </div>
          </button>
          
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
            <div className="flex items-center space-x-1">
              <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>Coming Soon - AI-powered trading insights</span>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenSidebar; 