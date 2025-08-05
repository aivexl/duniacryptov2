"use client";

import React, { useEffect, useRef, useState } from 'react';

export default function KaikoChart({ 
  symbol, 
  coinData, 
  className = "",
  height = '100%',
  width = '100%'
}) {
  const chartContainerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [timeRange, setTimeRange] = useState('1d');

  const timeRanges = [
    { label: '1H', value: '1h' },
    { label: '1D', value: '1d' },
    { label: '1W', value: '1w' },
    { label: '1M', value: '1m' },
    { label: '3M', value: '3m' },
    { label: '1Y', value: '1y' }
  ];

  // Kaiko API configuration
  const KAIKO_BASE_URL = '/api/kaiko';

  useEffect(() => {
    fetchKaikoData();
  }, [symbol, timeRange]);

  const fetchKaikoData = async () => {
    if (!symbol) return;

    setIsLoading(true);
    try {
      // Convert symbol to Kaiko format (e.g., BTC -> btc-usd)
      const kaikoSymbol = `${symbol.toLowerCase()}-usd`;
      
      // Calculate start time based on timeRange
      const now = new Date();
      let startTime;
      switch (timeRange) {
        case '1h':
          startTime = new Date(now.getTime() - 60 * 60 * 1000);
          break;
        case '1d':
          startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '1w':
          startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '1m':
          startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '3m':
          startTime = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case '1y':
          startTime = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      }

      const url = `${KAIKO_BASE_URL}/data/trades.v1/spot_direct_exchange_rate/${kaikoSymbol}`;
      const params = new URLSearchParams({
        start_time: startTime.toISOString(),
        end_time: now.toISOString(),
        interval: timeRange === '1h' ? '1m' : timeRange === '1d' ? '5m' : '1h',
        page_size: '1000'
      });

      const response = await fetch(`${url}?${params}`, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Kaiko API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.data) {
        const formattedData = data.data.map(item => ({
          time: new Date(item.timestamp).getTime(),
          price: parseFloat(item.price),
          volume: parseFloat(item.volume || 0)
        }));
        setChartData(formattedData);
      }
    } catch (error) {
      console.error('Error fetching Kaiko data:', error);
      // Fallback to mock data for demo
      generateMockData();
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockData = () => {
    const now = Date.now();
    const data = [];
    const interval = timeRange === '1h' ? 60000 : timeRange === '1d' ? 300000 : 3600000;
    const points = timeRange === '1h' ? 60 : timeRange === '1d' ? 288 : 168;
    
    let basePrice = 0.1; // Starting price for DOGE
    
    for (let i = 0; i < points; i++) {
      const time = now - (points - i) * interval;
      const change = (Math.random() - 0.5) * 0.02; // ±1% change
      basePrice = basePrice * (1 + change);
      
      data.push({
        time,
        price: basePrice,
        volume: Math.random() * 1000000
      });
    }
    
    setChartData(data);
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }).format(value);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    if (timeRange === '1h') {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } else if (timeRange === '1d') {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const date = new Date(label);
      const formattedDate = date.toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm">{formattedDate}</p>
          <p className="text-aqua font-semibold text-lg">
            {formatPrice(data.price)}
          </p>
          {data.volume && (
            <p className="text-gray-500 text-sm">
              Volume: {new Intl.NumberFormat().format(data.volume)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Chart Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-duniacrypto-panel border-b border-gray-700 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {coinData?.image && (
              <img
                src={coinData.image}
                alt={coinData?.name}
                className="w-6 h-6 rounded-full"
              />
            )}
            <div>
              <h2 className="text-white font-bold text-lg">{coinData?.name || symbol}</h2>
              <p className="text-gray-400 text-sm">Kaiko Chart - {symbol}</p>
            </div>
          </div>
          
          {/* Time Range Selector */}
          <div className="flex bg-gray-800 rounded-lg p-1">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                  timeRange === range.value
                    ? 'bg-aqua text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
          
          <div className="text-right">
            <div className="text-sm font-semibold text-aqua">Beluga</div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-duniacrypto-panel z-5">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aqua mx-auto mb-4"></div>
            <p className="text-gray-400">Loading Kaiko Chart...</p>
          </div>
        </div>
      )}

      {/* Chart Container */}
      <div 
        ref={chartContainerRef}
        className="w-full h-full"
        style={{ paddingTop: '60px' }} // Account for header
      >
        {!isLoading && chartData.length > 0 && (
          <div className="h-full p-4">
            <div className="h-full bg-duniacrypto-panel rounded-lg p-4">
              {/* Simple Chart Display */}
              <div className="h-full flex flex-col">
                <div className="flex-1 relative">
                  {/* Price Chart */}
                  <div className="h-full">
                    <svg className="w-full h-full" viewBox={`0 0 800 400`}>
                      <defs>
                        <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#00D4FF" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      
                      {/* Grid Lines */}
                      <g className="text-gray-600">
                        {[0, 1, 2, 3, 4].map(i => (
                          <line
                            key={i}
                            x1="0"
                            y1={i * 80}
                            x2="800"
                            y2={i * 80}
                            stroke="#374151"
                            strokeWidth="1"
                            opacity="0.3"
                          />
                        ))}
                      </g>
                      
                      {/* Price Line */}
                      {chartData.length > 1 && (
                        <g>
                          <path
                            d={chartData.map((point, index) => {
                              const x = (index / (chartData.length - 1)) * 800;
                              const minPrice = Math.min(...chartData.map(d => d.price));
                              const maxPrice = Math.max(...chartData.map(d => d.price));
                              const y = 400 - ((point.price - minPrice) / (maxPrice - minPrice)) * 400;
                              return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                            }).join(' ')}
                            stroke="#00D4FF"
                            strokeWidth="2"
                            fill="none"
                          />
                          
                          {/* Area Fill */}
                          <path
                            d={chartData.map((point, index) => {
                              const x = (index / (chartData.length - 1)) * 800;
                              const minPrice = Math.min(...chartData.map(d => d.price));
                              const maxPrice = Math.max(...chartData.map(d => d.price));
                              const y = 400 - ((point.price - minPrice) / (maxPrice - minPrice)) * 400;
                              return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                            }).join(' ') + ` L 800 400 L 0 400 Z`}
                            fill="url(#priceGradient)"
                          />
                        </g>
                      )}
                    </svg>
                  </div>
                  
                  {/* Price Info */}
                  <div className="absolute top-4 left-4 bg-black bg-opacity-50 rounded-lg p-2">
                    <div className="text-aqua font-bold text-lg">
                      {chartData.length > 0 ? formatPrice(chartData[chartData.length - 1].price) : 'N/A'}
                    </div>
                    <div className="text-gray-400 text-xs">
                      Powered by Kaiko
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Beluga Branding Overlay */}
      <div className="absolute top-4 right-4 z-20 pointer-events-none">
        <div className="beluga-branding">
          <span className="beluga-text">Beluga</span>
        </div>
      </div>

      {/* Custom CSS for Beluga Branding */}
      <style jsx>{`
        .beluga-branding {
          background: linear-gradient(135deg, rgba(0, 212, 255, 0.9), rgba(0, 212, 255, 0.7));
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 212, 255, 0.3);
          border-radius: 8px;
          padding: 4px 8px;
          box-shadow: 0 4px 20px rgba(0, 212, 255, 0.3);
          animation: belugaGlow 3s ease-in-out infinite alternate;
        }

        .beluga-text {
          color: #ffffff;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-weight: 600;
          font-size: 11px;
          letter-spacing: 0.5px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          white-space: nowrap;
        }

        @keyframes belugaGlow {
          0% {
            box-shadow: 0 4px 20px rgba(0, 212, 255, 0.3);
          }
          100% {
            box-shadow: 0 4px 30px rgba(0, 212, 255, 0.5);
          }
        }
      `}</style>
    </div>
  );
} 