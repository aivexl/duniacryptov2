"use client";

import React from "react";
import CryptoTicker from "./CryptoTicker";
import CryptoTable from "./CryptoTable";
import MarketOverview from "./MarketOverview";
import Mindshare from "./Mindshare";
import { CoinGeckoProvider } from "./CoinGeckoContext";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id';

// Configure dayjs
dayjs.extend(relativeTime);
dayjs.locale('id');

export default function ArticleDetailClient({ article }) {
  if (!article) {
    return (
      <CoinGeckoProvider>
        <CryptoTicker />
        <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-4 md:py-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 flex-1 w-full">
          <section className="col-span-1 xl:col-span-2 space-y-4 md:space-y-6">
            <div className="bg-duniacrypto-panel rounded-lg shadow p-8 text-center">
              <h1 className="text-2xl font-bold text-white mb-4">Artikel Tidak Ditemukan</h1>
              <p className="text-gray-400">Artikel yang Anda cari tidak ditemukan.</p>
            </div>
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

  return (
    <CoinGeckoProvider>
      {/* Ticker */}
      <CryptoTicker />
      {/* Main Layout */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-4 md:py-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 flex-1 w-full">
        <section className="col-span-1 xl:col-span-2 space-y-4 md:space-y-6">
          {/* Article Header */}
          <div className="bg-duniacrypto-panel rounded-lg shadow p-6">
            <div className="flex gap-6 items-start">
              <img
                src={article.imageUrl || '/Asset/duniacrypto.png'}
                alt={article.image?.alt || article.title}
                className="w-32 h-32 rounded-md object-cover bg-black/30 flex-shrink-0 hover:scale-105 transition-transform"
              />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white mb-2">{article.title}</h1>
                <div className="text-xs text-gray-400 mb-2 flex gap-2 items-center">
                  <span>{article.source || 'Dunia Crypto'}</span>
                  <span>•</span>
                  <span>{article.publishedAt ? dayjs(article.publishedAt).format('DD MMM YYYY HH:mm') : 'Baru saja'}</span>
                  <span>•</span>
                  <span className={
                    article.category === 'newsroom'
                      ? 'inline-block px-2 py-0.5 rounded bg-blue-700 text-white font-bold text-[10px] tracking-wide'
                      : 'inline-block px-2 py-0.5 rounded bg-blue-500 text-white font-bold text-[10px] tracking-wide'
                  }>
                    {article.category === 'newsroom' ? 'News' : 'Academy'}
                  </span>
                </div>
                {article.excerpt && (
                  <div className="text-gray-200 mb-2 whitespace-pre-line">{article.excerpt}</div>
                )}
              </div>
            </div>
          </div>
          
          {/* Article Content */}
          <div className="bg-duniacrypto-panel rounded-lg shadow p-6">
            <div className="text-gray-200 whitespace-pre-line leading-relaxed">
              {article.content}
            </div>
          </div>
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