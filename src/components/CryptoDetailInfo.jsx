"use client";

import React from 'react';

// Utility functions
const formatPrice = (price) => {
  if (!price || price === 0) return '$0.00';
  return '$' + price.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const formatMarketCap = (marketCap) => {
  if (!marketCap || marketCap === 0) return '0';
  if (marketCap >= 1e12) return (marketCap / 1e12).toFixed(2) + 'T';
  if (marketCap >= 1e9) return (marketCap / 1e9).toFixed(2) + 'B';
  if (marketCap >= 1e6) return (marketCap / 1e6).toFixed(2) + 'M';
  if (marketCap >= 1e3) return (marketCap / 1e3).toFixed(2) + 'K';
  return marketCap.toString();
};

const formatPercentage = (percentage) => {
  if (!percentage && percentage !== 0) return '0.00%';
  const value = parseFloat(percentage);
  if (isNaN(value)) return '0.00%';
  const isPositive = value >= 0;
  return (
    <span className={isPositive ? 'text-green-400' : 'text-red-400'}>
      {isPositive ? '+' : ''}{value.toFixed(2)}%
    </span>
  );
};

const formatNumber = (num) => {
  if (!num) return '0';
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toLocaleString();
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const calculateAge = (dateString) => {
  if (!dateString) return 'N/A';
  const birthDate = new Date(dateString);
  const today = new Date();
  const diffInMs = today - birthDate;
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

export default function CryptoDetailInfo({ 
  coinData, 
  detailedData, 
  showOverview = true,
  showPerformance = true,
  showSupplyInfo = true,
  showAbout = true,
  className = ""
}) {
  if (!coinData) return null;

  return (
    <div className={`space-y-4 pb-8 ${className}`}>
      {/* Overview Section */}
      {showOverview && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-600/30 p-4 shadow-lg">
          <h3 className="text-sm font-semibold text-gray-300 mb-4 tracking-wide uppercase">Overview</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 min-w-0">
              <p className="text-gray-400 text-xs truncate font-medium">Current Price</p>
              <p className="text-white font-bold text-base truncate">
                {formatPrice(coinData.current_price)}
              </p>
              <div className="text-xs">
                {formatPercentage(coinData.price_change_percentage_24h)}
              </div>
            </div>
            
            <div className="space-y-1 min-w-0">
              <p className="text-gray-400 text-xs truncate font-medium">Market Cap</p>
              <p className="text-white font-bold text-sm truncate">
                ${formatMarketCap(coinData.market_cap)}
              </p>
              <p className="text-gray-400 text-xs truncate">Rank #{coinData.market_cap_rank}</p>
            </div>
            
            <div className="space-y-1 min-w-0">
              <p className="text-gray-400 text-xs truncate font-medium">24h Volume</p>
              <p className="text-white font-bold text-sm truncate">
                ${formatMarketCap(coinData.total_volume)}
              </p>
            </div>
            
            <div className="space-y-1 min-w-0">
              <p className="text-gray-400 text-xs truncate font-medium">Circulating Supply</p>
              <p className="text-white font-bold text-sm truncate">
                {formatNumber(coinData.circulating_supply)} {coinData.symbol?.toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      {showPerformance && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-600/30 p-4 shadow-lg">
          <h3 className="text-sm font-semibold text-gray-300 mb-4 tracking-wide uppercase">Performance</h3>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-gray-700/50 rounded-lg min-w-0 backdrop-blur-sm">
              <p className="text-gray-400 text-xs mb-1 truncate font-medium">1h</p>
              <div className="font-semibold text-xs truncate">
                {formatPercentage(coinData.price_change_percentage_1h_in_currency)}
              </div>
            </div>
            
            <div className="text-center p-3 bg-gray-700/50 rounded-lg min-w-0 backdrop-blur-sm">
              <p className="text-gray-400 text-xs mb-1 truncate font-medium">24h</p>
              <div className="font-semibold text-xs truncate">
                {formatPercentage(coinData.price_change_percentage_24h_in_currency)}
              </div>
            </div>
            
            <div className="text-center p-3 bg-gray-700/50 rounded-lg min-w-0 backdrop-blur-sm">
              <p className="text-gray-400 text-xs mb-1 truncate font-medium">7d</p>
              <div className="font-semibold text-xs truncate">
                {formatPercentage(coinData.price_change_percentage_7d_in_currency)}
              </div>
            </div>
            
            <div className="text-center p-3 bg-gray-700/50 rounded-lg min-w-0 backdrop-blur-sm">
              <p className="text-gray-400 text-xs mb-1 truncate font-medium">30d</p>
              <div className="font-semibold text-xs truncate">
                {formatPercentage(coinData.price_change_percentage_30d_in_currency)}
              </div>
            </div>
            
            <div className="text-center p-3 bg-gray-700/50 rounded-lg min-w-0 backdrop-blur-sm">
              <p className="text-gray-400 text-xs mb-1 truncate font-medium">1y</p>
              <div className="font-semibold text-xs truncate">
                {formatPercentage(coinData.price_change_percentage_1y_in_currency)}
              </div>
            </div>
            
            <div className="text-center p-3 bg-gray-700/50 rounded-lg min-w-0 backdrop-blur-sm">
              <p className="text-gray-400 text-xs mb-1 truncate font-medium">ATH</p>
              <div className="font-semibold text-xs text-red-400 truncate">
                {detailedData?.market_data?.ath_change_percentage?.usd ? 
                  `${detailedData.market_data.ath_change_percentage.usd.toFixed(2)}%` : 
                  'N/A'
                }
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Supply Information */}
      {showSupplyInfo && detailedData && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-600/30 p-4 shadow-lg">
          <h3 className="text-sm font-semibold text-gray-300 mb-4 tracking-wide uppercase">Supply Information</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-600/30">
              <span className="text-gray-400 text-xs font-medium">Circulating Supply</span>
              <span className="text-white font-semibold text-xs">
                {formatNumber(detailedData.market_data?.circulating_supply || coinData.circulating_supply)} {coinData.symbol?.toUpperCase()}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-600/30">
              <span className="text-gray-400 text-xs font-medium">Total Supply</span>
              <span className="text-white font-semibold text-xs">
                {(detailedData.market_data?.total_supply || coinData.total_supply) ? 
                  `${formatNumber(detailedData.market_data?.total_supply || coinData.total_supply)} ${coinData.symbol?.toUpperCase()}` : 
                  'Unlimited'
                }
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-600/30">
              <span className="text-gray-400 text-xs font-medium">Max Supply</span>
              <span className="text-white font-semibold text-xs">
                {(detailedData.market_data?.max_supply || coinData.max_supply) ? 
                  `${formatNumber(detailedData.market_data?.max_supply || coinData.max_supply)} ${coinData.symbol?.toUpperCase()}` : 
                  'Unlimited'
                }
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-600/30">
              <span className="text-gray-400 text-xs font-medium">Volume/Market Cap</span>
              <span className="text-white font-semibold text-xs">
                {coinData.total_volume && coinData.market_cap ? 
                  `${(coinData.total_volume / coinData.market_cap * 100).toFixed(2)}%` : 
                  'N/A'
                }
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-600/30">
              <span className="text-gray-400 text-xs font-medium">Fully Diluted Valuation</span>
              <span className="text-white font-semibold text-xs">
                {detailedData.market_data?.fully_diluted_valuation?.usd ? 
                  `$${formatMarketCap(detailedData.market_data.fully_diluted_valuation.usd)}` : 
                  'N/A'
                }
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-600/30">
              <span className="text-gray-400 text-xs font-medium">Age of Coin</span>
              <span className="text-white font-semibold text-xs">
                {detailedData.genesis_date ? 
                  calculateAge(detailedData.genesis_date) : 
                  'N/A'
                }
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-600/30">
              <span className="text-gray-400 text-xs font-medium">Platform</span>
              <span className="text-white font-semibold text-xs">
                {detailedData.asset_platform_id ? 
                  detailedData.asset_platform_id.toUpperCase() : 
                  'Native'
                }
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400 text-xs font-medium">Category</span>
              <span className="text-white font-semibold text-xs">
                {detailedData.categories?.[0] || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* About Section */}
      {showAbout && detailedData?.description?.en && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-600/30 p-4 shadow-lg">
          <h3 className="text-sm font-semibold text-gray-300 mb-4 tracking-wide uppercase">About {coinData.name}</h3>
          <div className="text-gray-300 text-xs leading-relaxed">
            {detailedData.description.en}
          </div>
        </div>
      )}
    </div>
  );
} 