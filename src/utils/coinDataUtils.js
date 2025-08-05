/**
 * Utility functions for coin data operations
 * Reusable across CEX and DEX applications
 */

// Fetch detailed coin data from CoinGecko API
export const fetchDetailedCoinData = async (coinId) => {
  try {
    const response = await fetch(`/api/coingecko/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=true&sparkline=false`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching detailed coin data:", error);
    return null;
  }
};

// Get accurate launch date from multiple sources
export const getLaunchDate = (detailedCoinData, basicCoinData) => {
  // Priority 1: Use genesis_date from detailed CoinGecko data (most accurate)
  if (detailedCoinData?.genesis_date) {
    return detailedCoinData.genesis_date;
  }
  
  // Priority 2: Use asset_platform_id creation date if available
  if (detailedCoinData?.asset_platform_id?.created_at) {
    return detailedCoinData.asset_platform_id.created_at;
  }
  
  // Priority 3: Use community_data creation date if available
  if (detailedCoinData?.community_data?.created_at) {
    return detailedCoinData.community_data.created_at;
  }
  
  // Priority 4: Use market_data creation date if available
  if (detailedCoinData?.market_data?.created_at) {
    return detailedCoinData.market_data.created_at;
  }
  
  // Priority 5: Use developer_data creation date if available
  if (detailedCoinData?.developer_data?.created_at) {
    return detailedCoinData.developer_data.created_at;
  }
  
  // Priority 6: Use public_interest_score creation date if available
  if (detailedCoinData?.public_interest_score?.created_at) {
    return detailedCoinData.public_interest_score.created_at;
  }
  
  // Fallback to basic coinData
  if (basicCoinData?.genesis_date) {
    return basicCoinData.genesis_date;
  }
  
  // Final fallback: Use a reasonable default date (1 year ago)
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  return oneYearAgo.toISOString();
};

// Get contract address from platforms
export const getContractAddress = (coinData, symbol) => {
  // Try platforms first
  if (coinData?.platforms) {
    const address = coinData.platforms.ethereum || 
                   coinData.platforms.binance || 
                   coinData.platforms.polygon ||
                   coinData.platforms.arbitrum ||
                   coinData.platforms.optimism ||
                   coinData.platforms.base ||
                   coinData.platforms.avalanche ||
                   coinData.platforms.fantom;
    
    if (address) return address;
  }
  
  // If no platform address, try contract_address
  if (coinData?.contract_address) {
    return coinData.contract_address;
  }
  
  // Fallback to known addresses for major coins
  const knownAddresses = {
    'usdc': '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC on Ethereum
    'usdt': '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT on Ethereum
    'btc': '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', // WBTC on Ethereum
    'bitcoin': '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    'eth': '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH on Ethereum
    'ethereum': '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    'doge': '0x3832d2f059e55934220881f831be501d180671a7', // Dogecoin on BSC
    'dogecoin': '0x3832d2f059e55934220881f831be501d180671a7',
    'bnb': '0xbb4CdB9CBd36B01bD1cBaEF2aBc8c3d2b3c3c3c3', // BNB on BSC
    'binancecoin': '0xbb4CdB9CBd36B01bD1cBaEF2aBc8c3d2b3c3c3c3',
    'busd': '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', // BUSD on BSC
    'ada': '0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47', // Cardano on BSC
    'cardano': '0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47',
    'sol': '0x570A5D26f7765Ecb712C0924E4De545B89fD43dF', // Solana on BSC
    'solana': '0x570A5D26f7765Ecb712C0924E4De545B89fD43dF',
    'dot': '0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402', // Polkadot on BSC
    'polkadot': '0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402',
    'link': '0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD', // Chainlink on BSC
    'chainlink': '0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD',
    'uni': '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1', // Uniswap on BSC
    'uniswap': '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
    'cake': '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82', // PancakeSwap on BSC
    'pancakeswap': '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
  };
  
  const symbolLower = symbol?.toLowerCase();
  return knownAddresses[symbolLower] || null;
};

// Determine chain ID based on contract address and platforms
export const getChainId = (coinData, contractAddress, symbol) => {
  // Check if we have platform-specific addresses
  if (coinData?.platforms) {
    if (coinData.platforms.binance) {
      return "0x38"; // BSC
    } else if (coinData.platforms.polygon) {
      return "0x89"; // Polygon
    } else if (coinData.platforms.arbitrum) {
      return "0xa4b1"; // Arbitrum
    } else if (coinData.platforms.optimism) {
      return "0xa"; // Optimism
    } else if (coinData.platforms.avalanche) {
      return "0xa86a"; // Avalanche
    } else if (coinData.platforms.ethereum) {
      return "0x1"; // Ethereum
    }
  }
  
  // For known addresses, set the correct chain
  if (contractAddress) {
    const bscAddresses = [
      '0x3832d2f059e55934220881f831be501d180671a7', // Dogecoin on BSC
      '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82', // CAKE on BSC
      '0xbb4cdb9cbd36b01bd1cbaef2af088b3b3c3c3c3c', // WBNB on BSC
      '0xe9e7cea3dedca5984780bafc599bd69add087d56', // BUSD on BSC
      '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', // USDC on BSC
      '0x55d398326f99059ff775485246999027b3197955', // USDT on BSC
    ];
    
    const ethereumAddresses = [
      '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', // WBTC on Ethereum
      '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH on Ethereum
      '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT on Ethereum
      '0xa0b86a33e6441b8c4c8c0b8c4c8c0b8c4c8c0b8', // USDC on Ethereum
    ];
    
    if (bscAddresses.includes(contractAddress.toLowerCase())) {
      return "0x38"; // BSC
    } else if (ethereumAddresses.includes(contractAddress.toLowerCase())) {
      return "0x1"; // Ethereum
    }
  }
  
  // For specific symbols, override chain detection
  const symbolLower = symbol?.toLowerCase();
  if (symbolLower === 'doge' || symbolLower === 'dogecoin') {
    return "0x38"; // Force BSC for Dogecoin
  } else if (symbolLower === 'cake' || symbolLower === 'pancakeswap') {
    return "0x38"; // Force BSC for PancakeSwap
  } else if (symbolLower === 'bnb' || symbolLower === 'binancecoin') {
    return "0x38"; // Force BSC for BNB
  }
  
  return "0x1"; // Default to Ethereum
};

// Create standardized pair data for any coin
export const createPairData = (coinData, detailedCoinData, symbol) => {
  const contractAddress = getContractAddress(coinData, symbol);
  const chainId = getChainId(coinData, contractAddress, symbol);
  const launchDate = getLaunchDate(detailedCoinData, coinData);

  return {
    pairAddress: contractAddress || "0x0000000000000000000000000000000000000000",
    chainId: chainId,
    exchangeName: "Binance",
    exchangeLogo: "/images/exchanges/default-exchange.svg",
    pairLabel: `${symbol}/USDT`,
    volume24hrUsd: coinData?.market_data?.total_volume?.usd || 1000000,
    liquidityUsd: coinData?.market_data?.market_cap?.usd || 5000000,
    priceUsd: coinData?.market_data?.current_price?.usd || 0,
    priceNative: coinData?.market_data?.current_price?.usd || 0,
    quoteToken: "USDT",
    pairCreatedAt: launchDate,
    baseToken: {
      symbol: symbol,
      name: coinData?.name || symbol,
      address: contractAddress,
    },
    pair: [
      {
        pairTokenType: "token0",
        symbol: symbol,
        name: coinData?.name || symbol,
      },
      {
        pairTokenType: "token1",
        symbol: "USDT",
        name: "Tether USD",
      },
    ],
  };
}; 