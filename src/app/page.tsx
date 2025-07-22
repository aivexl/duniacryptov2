"use client";
import React, { useState } from "react";
import CryptoTicker from "../components/CryptoTicker";
import CryptoTable from "../components/CryptoTable";
import MarketOverview from "../components/MarketOverview";
import NewsFeed from "../components/NewsFeed";
import DailyRecap from "../components/DailyRecap";
import Mindshare from "../components/Mindshare";
import NewsSlider from "../components/NewsSlider";
import { CoinGeckoProvider } from "../components/CoinGeckoContext";

interface PopupProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function Popup({ open, onClose, children }: PopupProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-duniacrypto-panel text-white rounded-lg px-6 py-4 shadow-lg" onClick={e => e.stopPropagation()}>
        {children}
        <button className="mt-4 px-4 py-1 bg-duniacrypto-green text-black rounded" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default function Home() {
  const [popup, setPopup] = useState("");
  return (
    <CoinGeckoProvider>
      {/* Ticker */}
      <CryptoTicker />
      {/* Main Layout */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-4 md:py-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 flex-1 w-full">
        <section className="col-span-1 xl:col-span-2 space-y-4 md:space-y-6">
          <NewsSlider />
          <DailyRecap />
          <NewsFeed />
        </section>
        <aside className="col-span-1 space-y-4 md:space-y-6">
          <MarketOverview />
          <CryptoTable />
          <Mindshare />
        </aside>
      </main>
      <Popup open={popup==='academy'} onClose={()=>setPopup('')}>Academy Coming Soon</Popup>
      <Popup open={popup==='kamus'} onClose={()=>setPopup('')}>Kamus WEB3 Coming Soon</Popup>
    </CoinGeckoProvider>
  );
}
