"use client";

import React from "react";
import CryptoTicker from "./CryptoTicker";
import CryptoTable from "./CryptoTable";
import MarketOverview from "./MarketOverview";
import DailyRecap from "./DailyRecap";
import Mindshare from "./Mindshare";
import NewsSlider from "./NewsSlider";
import { CoinGeckoProvider } from "./CoinGeckoContext";
import NewsFeedServer from "./NewsFeedServer";

export default function HomeClient({ articles = [] }) {
  return (
    <CoinGeckoProvider>
      {/* Ticker */}
      <CryptoTicker />
      {/* Main Layout */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-4 md:py-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 flex-1 w-full">
        <section className="col-span-1 xl:col-span-2 space-y-4 md:space-y-6">
          <NewsSlider articles={articles} />
          <DailyRecap />
          <NewsFeedServer articles={articles} />
        </section>
        <aside className="col-span-1 space-y-4 md:gap-6">
          <MarketOverview />
          <CryptoTable />
          <Mindshare />
        </aside>
      </main>
    </CoinGeckoProvider>
  );
} 