"use client";

import React, { useState, useEffect, useRef } from "react";

const DexScreenerTokenTransactions = ({ pair, chainId }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTransactionIds, setNewTransactionIds] = useState(new Set());
  const [pairData, setPairData] = useState(null);
  const [tableHeight, setTableHeight] = useState(400); // Default height
  const pollInterval = useRef(null);
  const tableRef = useRef(null);
  const resizeRef = useRef(null);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

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

  const isSolana = chainId === "solana";

  // Initialize resize functionality
  useEffect(() => {
    const resizeHandle = resizeRef.current;
    if (!resizeHandle) return;

    const onMouseDown = (e) => {
      startYRef.current = e.clientY;
      startHeightRef.current = tableHeight;
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e) => {
      const deltaY = startYRef.current - e.clientY;
      const newHeight = Math.max(200, startHeightRef.current + deltaY);
      setTableHeight(newHeight);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    resizeHandle.addEventListener("mousedown", onMouseDown);

    return () => {
      resizeHandle.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [tableHeight]);

  // Set up polling when component mounts and clean up on unmount
  useEffect(() => {
    fetchTransactions();

    // Set up polling interval for real-time updates
    pollInterval.current = setInterval(fetchNewTransactions, 10000); // Poll every 10 seconds

    return () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
      }
    };
  }, [pair, chainId]);

  // Fetch initial transactions
  const fetchTransactions = async () => {
    if (!pair || !pair.baseToken?.address) {
      console.log("Missing pair or address:", { pair, address: pair?.baseToken?.address });
      setError("No valid token address available for this coin");
      setLoading(false);
      return;
    }

    console.log("Fetching transactions for:", {
      symbol: pair.baseToken.symbol,
      address: pair.baseToken.address,
      chainId: chainId
    });

    setLoading(true);
    setError(null);
    
    try {
      // Determine chain from chainId
      let chain = 'bsc'; // Default to BSC for better compatibility
      if (chainId === '0x1' || chainId === '1') chain = 'ethereum';
      else if (chainId === '0x38' || chainId === '56') chain = 'bsc';
      else if (chainId === '0x89' || chainId === '137') chain = 'polygon';
      else if (chainId === '0xa86a' || chainId === '43114') chain = 'avalanche';
      else if (chainId === '0xa4b1' || chainId === '42161') chain = 'arbitrum';
      else if (chainId === '0xa' || chainId === '10') chain = 'optimism';
      
      // Force BSC for specific tokens that we know are on BSC
      const symbol = pair.baseToken.symbol?.toLowerCase();
      if (symbol === 'doge' || symbol === 'dogecoin' || symbol === 'cake' || symbol === 'bnb') {
        chain = 'bsc';
        console.log(`Forcing BSC chain for ${symbol}`);
      }
      
      console.log(`Using ${chain} chain for ${symbol} (chainId: ${chainId})`);
      
      // Use Real Blockchain API for real-time transaction data
      console.log("Fetching real-time data from Blockchain API...");
      
      const blockchainApis = [
        `/api/goldrush/transfers/${pair.baseToken.address}/${chain}`,
        `/api/goldrush/transactions/${pair.baseToken.address}/${chain}`,
        `/api/goldrush/info/${pair.baseToken.address}/${chain}`
      ];
      
      for (const apiUrl of blockchainApis) {
        try {
          console.log(`Trying Blockchain API: ${apiUrl}`);
          const response = await fetch(apiUrl);
          
          if (response.ok) {
            const data = await response.json();
            console.log("Blockchain API response:", data);
            
            if (data.transactions && data.transactions.length > 0) {
              setTransactions(data.transactions);
              setPairData({
                baseToken: { symbol: pair.baseToken.symbol || "TOKEN" },
                quoteToken: { symbol: "USD" },
                pairLabel: `${pair.baseToken.symbol}/USD`,
              });
              console.log(`Blockchain transactions loaded from ${data.source}`);
              setLoading(false);
              return;
            } else if (data.error) {
              console.log(`Blockchain API error: ${data.error}`);
              setError(data.error);
              setLoading(false);
              return;
            }
          }
        } catch (error) {
          console.log(`Blockchain API failed: ${apiUrl}`, error.message);
        }
      }
      
      // If all APIs fail, show error
      console.log("All Blockchain APIs failed, showing error");
      setError("Failed to load real-time transactions from Blockchain API");
      setLoading(false);
      
    } catch (error) {
      console.error("Blockchain API error:", error);
      setError("Failed to load transactions from Blockchain API");
      setLoading(false);
    }
  };

  // Fetch new transactions for real-time updates
  const fetchNewTransactions = async () => {
    if (!pair || !pair.baseToken?.address) return;

    try {
      // Determine chain from chainId
      let chain = 'bsc';
      if (chainId === '0x1' || chainId === '1') chain = 'ethereum';
      else if (chainId === '0x38' || chainId === '56') chain = 'bsc';
      else if (chainId === '0x89' || chainId === '137') chain = 'polygon';
      else if (chainId === '0xa86a' || chainId === '43114') chain = 'avalanche';
      else if (chainId === '0xa4b1' || chainId === '42161') chain = 'arbitrum';
      else if (chainId === '0xa' || chainId === '10') chain = 'optimism';
      
      // Force BSC for specific tokens
      const symbol = pair.baseToken.symbol?.toLowerCase();
      if (symbol === 'doge' || symbol === 'dogecoin' || symbol === 'cake' || symbol === 'bnb') {
        chain = 'bsc';
      }

      // Use Blockchain API for new transactions
      const url = `/api/goldrush/transfers/${pair.baseToken.address}/${chain}`;
      const response = await fetch(url);

      if (!response.ok) {
        console.error(`Blockchain API error during polling: ${response.status}`);
        return;
      }

      const data = await response.json();

      if (data && data.transactions && data.transactions.length > 0) {
        // Check if there are new transactions
        const currentTransactionIds = new Set(
          transactions.map((tx) => tx.transaction_hash || tx.transactionHash)
        );

        const newTxs = data.transactions.filter(
          (tx) => !currentTransactionIds.has(tx.transaction_hash || tx.transactionHash)
        );

        if (newTxs.length > 0) {
          console.log("New Blockchain transactions found:", newTxs.length);
          setTransactions((prev) => [...newTxs, ...prev]);
          
          // Highlight new transactions
          const newIds = new Set(newTxs.map((tx) => tx.transaction_hash || tx.transactionHash));
          setNewTransactionIds(newIds);
          
          // Remove highlight after 5 seconds
          setTimeout(() => {
            setNewTransactionIds(new Set());
          }, 5000);
        }
      }
    } catch (err) {
      console.error("Error polling for new Blockchain transactions:", err);
    }
  };

  // Format time ago
  const formatTimeAgo = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();

    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    // Calculate years, months, and days more accurately
    const years = Math.floor(diffDay / 365.25);
    const remainingDaysAfterYears = diffDay % 365.25;
    const months = Math.floor(remainingDaysAfterYears / 30.44);
    const days = Math.floor(remainingDaysAfterYears % 30.44);
    
    // For very short periods, show seconds/minutes/hours
    if (diffSec < 60) return `${diffSec}s`;
    if (diffMin < 60) return `${diffMin}m`;
    if (diffHour < 24) return `${diffHour}h`;
    if (diffDay < 30) return `${diffDay}d`;
    
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

  // Format numbers with commas
  const formatNumber = (num, decimals = 0) => {
    if (num === undefined || num === null) return "0";

    const parsedNum = parseFloat(num);
    return parsedNum.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  // Format prices with appropriate decimal places
  const formatPrice = (price) => {
    if (!price) return "$0.00";

    const numPrice = typeof price === "string" ? parseFloat(price) : price;

    if (numPrice < 0.0001) {
      return "$" + numPrice.toFixed(8);
    } else if (numPrice < 1) {
      return "$" + numPrice.toFixed(6);
    } else if (numPrice < 10000) {
      return "$" + numPrice.toFixed(5);
    } else {
      return (
        "$" +
        numPrice.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
    }
  };

  // Get explorer URL for the transaction
  const getExplorerUrl = (txHash) => {
    const explorer = blockExplorers[chainId] || "";

    if (!explorer) return "#";

    if (isSolana) {
      return `${explorer}/tx/${txHash}`;
    } else {
      return `${explorer}/tx/${txHash}`;
    }
  };

  // Get wallet explorer URL
  const getWalletExplorerUrl = (walletAddress) => {
    const explorer = blockExplorers[chainId] || "";

    if (!explorer) return "#";

    if (isSolana) {
      return `${explorer}/account/${walletAddress}`;
    } else {
      return `${explorer}/address/${walletAddress}`;
    }
  };

  // Format wallet address (truncate)
  const formatWalletAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Get transaction direction text and color
  const getTransactionType = (type) => {
    if (!type) return { text: "Unknown", color: "text-gray-500" };

    switch (type.toLowerCase()) {
      case "buy":
        return { text: "Buy", color: "text-green-500" };
      case "sell":
        return { text: "Sell", color: "text-red-500" };
      case "addliquidity":
        return { text: "Add Liquidity", color: "text-green-500" };
      case "removeliquidity":
        return { text: "Remove Liquidity", color: "text-red-500" };
      default:
        return {
          text: type.charAt(0).toUpperCase() + type.slice(1),
          color: "text-gray-500",
        };
    }
  };

  // Get value for base token column
  const getBaseTokenValue = (tx) => {
    if (!tx.baseTokenAmount) return { value: 0, symbol: "" };

    const value = parseFloat(tx.baseTokenAmount);
    const symbol = pairData?.baseToken?.symbol || pair?.baseToken?.symbol || "";

    return { value, symbol };
  };

  // Get value for quote token column
  const getQuoteTokenValue = (tx) => {
    if (!tx.quoteTokenAmount) return { value: 0, symbol: "" };

    const value = parseFloat(tx.quoteTokenAmount);
    const absValue = Math.abs(value);
    const symbol =
      pairData?.quoteToken?.symbol || pair?.quoteToken?.symbol || "";

    return { value: absValue, symbol };
  };

  // Format price with appropriate color
  const formatPriceWithColor = (price) => {
    if (!price) return { text: "-", color: "text-gray-500" };

    const formattedPrice = formatPrice(price);
    return {
      text: formattedPrice,
      color: "text-gray-200", // Default color
    };
  };

  // Format value with color based on transaction type
  const formatValueWithColor = (value, txType) => {
    if (!value) return { text: "-", color: "text-gray-500" };

    const formattedValue = formatNumber(value, 2);
    const color =
      txType.toLowerCase() === "buy" ? "text-green-500" : "text-red-500";

    return {
      text: formattedValue,
      color,
    };
  };

  if (!pair) {
    return (
      <div className="p-4 text-center text-dex-text-secondary">
        No pair data available
      </div>
    );
  }

  if (loading && transactions.length === 0) {
    return (
      <div className="p-4 text-center text-dex-text-secondary">
        Loading transactions...
      </div>
    );
  }

  if (error && transactions.length === 0) {
    return (
      <div className="p-4 text-center text-dex-text-secondary">
        <div className="mb-4">
          <div className="text-2xl mb-2">⚠️</div>
          <div className="text-lg font-medium mb-2">Failed to load transactions</div>
          <div className="text-sm opacity-75 mb-4">{error}</div>
          <button
            onClick={fetchTransactions}
            className="px-4 py-2 bg-dex-blue text-white rounded hover:bg-dex-blue/80 transition-colors"
          >
            Retry
          </button>
        </div>
        <div className="text-xs opacity-50 space-y-1">
          <div>Token: {pair?.baseToken?.symbol || 'Unknown'}</div>
          <div>Address: {pair?.baseToken?.address || 'No address'}</div>
          <div>Chain: {chainId || 'Unknown'}</div>
          <div className="mt-2 text-xs">
            <div>💡 Tips:</div>
            <div>• Check if the token has trading activity on this chain</div>
            <div>• Verify the token contract address is correct</div>
            <div>• CoinCap API might be temporarily unavailable</div>
          </div>
        </div>
      </div>
    );
  }

  if (transactions.length === 0 && !loading && !error) {
    return (
      <div className="p-4 text-center text-dex-text-secondary">
        <div className="mb-4">
          <div className="text-2xl mb-2">📊</div>
          <div className="text-lg font-medium mb-2">No transactions found</div>
          <div className="text-sm opacity-75 mb-4">
            No recent transactions for this token on the selected chain.
          </div>
          <button
            onClick={fetchTransactions}
            className="px-4 py-2 bg-dex-blue text-white rounded hover:bg-dex-blue/80 transition-colors"
          >
            Refresh
          </button>
        </div>
        <div className="text-xs opacity-50 space-y-1">
          <div>Token: {pair?.baseToken?.symbol || 'Unknown'}</div>
          <div>Address: {pair?.baseToken?.address || 'No address'}</div>
          <div>Chain: {chainId || 'Unknown'}</div>
          <div className="mt-2 text-xs">
            <div>💡 Possible reasons:</div>
            <div>• Token has no recent trading activity</div>
            <div>• Token is not traded on this blockchain</div>
            <div>• Contract address might be incorrect</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      
      <div
        className="overflow-auto border border-dex-border bg-dex-bg-primary"
        style={{ height: `${tableHeight}px` }}
      >
        <table
          ref={tableRef}
          className="w-full text-sm text-left border-collapse"
        >
          <thead className="text-xs uppercase bg-dex-bg-secondary sticky top-0 z-10">
            <tr className="border-b border-dex-border">
              <th className="px-4 py-3 whitespace-nowrap">DATE</th>
              <th className="px-4 py-3 whitespace-nowrap">TYPE</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">USD</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">
                {pairData?.baseToken?.symbol ||
                  pair?.baseToken?.symbol ||
                  "TOKEN"}
              </th>
              <th className="px-4 py-3 text-right whitespace-nowrap">
                {pairData?.quoteToken?.symbol ||
                  pair?.quoteToken?.symbol ||
                  "QUOTE"}
              </th>
              <th className="px-4 py-3 text-right whitespace-nowrap">PRICE</th>
              <th className="px-4 py-3 whitespace-nowrap">MAKER</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">TXN</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => {
              // Handle both API response formats (snake_case and camelCase)
              const txHash = tx.transaction_hash || tx.transactionHash;
              const walletAddress = tx.wallet_address || tx.walletAddress;
              const txType = tx.transaction_type || tx.transactionType;
              const baseTokenAmount = tx.base_token_amount || tx.baseTokenAmount;
              const quoteTokenAmount = tx.quote_token_amount || tx.quoteTokenAmount;
              const totalValueUsd = tx.total_value_usd || tx.totalValueUsd;
              const baseTokenPriceUsd = tx.base_token_price_usd || tx.baseTokenPriceUsd;
              const blockTimestamp = tx.block_timestamp || tx.blockTimestamp;

              const transactionType = getTransactionType(txType);
              const baseToken = getBaseTokenValue({ baseTokenAmount });
              const quoteToken = getQuoteTokenValue({ quoteTokenAmount });
              const usdValue = formatValueWithColor(totalValueUsd, txType);
              const price = formatPriceWithColor(baseTokenPriceUsd);
              const isNew = newTransactionIds.has(txHash);

              // Create a unique key using transaction hash and index
              const uniqueKey = `${txHash}_${index}`;

              return (
                <tr
                  key={uniqueKey}
                  className={`border-b border-dex-border hover:bg-dex-bg-secondary/50 ${
                    isNew ? "animate-slide-in bg-dex-bg-highlight" : ""
                  }`}
                >
                  <td className="px-4 py-3 text-dex-text-secondary whitespace-nowrap">
                    {formatTimeAgo(blockTimestamp)}
                  </td>
                  <td
                    className={`px-4 py-3 ${transactionType.color} font-medium whitespace-nowrap`}
                  >
                    {transactionType.text}
                  </td>
                  <td
                    className={`px-4 py-3 text-right ${usdValue.color} whitespace-nowrap`}
                  >
                    {usdValue.text}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {baseToken.value ? formatNumber(baseToken.value, 4) : "-"}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {quoteToken.value ? formatNumber(quoteToken.value, 4) : "-"}
                  </td>
                  <td
                    className={`px-4 py-3 text-right ${price.color} whitespace-nowrap`}
                  >
                    {price.text}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <a
                      href={getWalletExplorerUrl(walletAddress)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono hover:text-dex-blue flex items-center"
                    >
                      <span className="bg-dex-bg-tertiary text-dex-text-primary px-1 rounded mr-1">
                        🦊
                      </span>
                      {formatWalletAddress(walletAddress)}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <a
                      href={getExplorerUrl(txHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-dex-text-secondary hover:text-dex-blue"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Resize handle */}
      <div
        ref={resizeRef}
        className="h-2 bg-dex-bg-secondary hover:bg-dex-blue cursor-ns-resize flex items-center justify-center"
      >
        <div className="w-10 h-1 bg-gray-600 rounded-full"></div>
      </div>
    </div>
  );
};

export default DexScreenerTokenTransactions;