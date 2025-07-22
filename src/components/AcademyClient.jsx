"use client";

import React, { useState } from "react";
import { CoinGeckoProvider } from "./CoinGeckoContext";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id';

// Configure dayjs
dayjs.extend(relativeTime);
dayjs.locale('id');

// Dummy articles for Academy
const dummyAcademyArticles = Array.from({ length: 20 }, (_, i) => ({
  _id: `academy-${i + 1}`,
  title: `Panduan Lengkap ${i + 1}: ${[
    'Memahami Blockchain dari Dasar',
    'Trading Crypto untuk Pemula',
    'Keamanan Wallet Digital',
    'DeFi: Keuangan Terdesentralisasi',
    'NFT: Token Non-Fungible',
    'Smart Contract Ethereum',
    'Mining Bitcoin dan Altcoin',
    'Staking dan Yield Farming',
    'Technical Analysis Crypto',
    'Fundamental Analysis',
    'Portfolio Management',
    'Risk Management Trading',
    'Web3 dan Metaverse',
    'Layer 2 Solutions',
    'Cross-chain Bridges',
    'DAO: Organisasi Otonom',
    'Privacy Coins',
    'Stablecoins dan DEX',
    'GameFi dan Play-to-Earn',
    'Regulasi Crypto Global'
  ][i % 20]}`,
  excerpt: `Artikel edukasi lengkap tentang ${[
    'blockchain dan teknologi yang mendasarinya',
    'cara memulai trading cryptocurrency dengan aman',
    'melindungi aset digital Anda dari ancaman keamanan',
    'memahami sistem keuangan terdesentralisasi',
    'dunia NFT dan koleksi digital',
    'membangun dan menggunakan smart contract',
    'proses mining dan validasi transaksi',
    'strategi staking untuk passive income',
    'analisis teknikal untuk trading crypto',
    'analisis fundamental untuk investasi jangka panjang',
    'mengelola portfolio crypto yang seimbang',
    'mengelola risiko dalam trading crypto',
    'masa depan internet dengan Web3',
    'solusi scaling untuk blockchain',
    'menghubungkan berbagai blockchain',
    'organisasi terdesentralisasi',
    'privasi dalam transaksi crypto',
    'stablecoin dan exchange terdesentralisasi',
    'gaming dan crypto',
    'regulasi cryptocurrency di berbagai negara'
  ][i % 20]}.`,
  content: `Ini adalah konten lengkap artikel edukasi nomor ${i + 1}. Artikel ini membahas secara mendalam tentang topik yang relevan dengan cryptocurrency dan blockchain. Pembaca akan mendapatkan pemahaman yang komprehensif tentang konsep, praktik terbaik, dan tips implementasi.`,
  slug: { current: `academy-article-${i + 1}` },
  category: 'academy',
  source: 'Dunia Crypto Academy',
  publishedAt: new Date(Date.now() - i * 86400000).toISOString(),
  imageUrl: `/Asset/duniacrypto.png`,
  featured: i < 3
}));

export default function AcademyClient({ articles = [] }) {
  const [displayCount, setDisplayCount] = useState(9);
  
  // Use dummy articles if no articles from Sanity
  const allArticles = articles.length > 0 ? articles : dummyAcademyArticles;
  const displayedArticles = allArticles.slice(0, displayCount);
  const hasMore = displayCount < allArticles.length;

  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + 3, allArticles.length));
  };

  return (
    <CoinGeckoProvider>
      {/* Main Layout - Full width like home page */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-4 md:py-6">
        {/* Header */}
        <div className="bg-duniacrypto-panel rounded-lg shadow p-6 mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">Academy</h1>
          <p className="text-gray-300 text-lg">
            Pelajari cryptocurrency dan blockchain dari dasar hingga lanjutan
          </p>
        </div>
        
        {/* Articles Grid - Improved proportions for 3x3 */}
        {displayedArticles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {displayedArticles.map((article) => (
                <a 
                  key={article._id}
                  href={`/academy/${article.slug.current}`}
                  className="block bg-duniacrypto-panel rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-800 cursor-pointer transform hover:scale-105 no-underline hover:no-underline focus:no-underline active:no-underline"
                >
                  {/* Article Image - Better proportions */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={article.imageUrl || '/Asset/duniacrypto.png'}
                      alt={article.image?.alt || article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="inline-block px-3 py-1.5 rounded-full bg-blue-500 text-white font-bold text-sm tracking-wide shadow-lg">
                        Academy
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Article Content - Better spacing */}
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-white mb-4 line-clamp-2 group-hover:text-duniacrypto-green transition-colors duration-300 leading-tight">
                      {article.title}
                    </h2>
                    
                    {article.excerpt && (
                      <p className="text-gray-300 text-sm mb-5 line-clamp-3 leading-relaxed">
                        {article.excerpt}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-800">
                      <span className="font-medium">{article.source || 'Dunia Crypto'}</span>
                      <span>{article.publishedAt ? dayjs(article.publishedAt).fromNow() : 'Baru saja'}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
            
            {/* Load More Button - Better styling */}
            {hasMore && (
              <div className="text-center">
                <button
                  onClick={handleLoadMore}
                  className="bg-duniacrypto-green hover:bg-green-600 text-white font-semibold py-4 px-10 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-duniacrypto-panel rounded-lg shadow p-12 text-center">
            <h3 className="text-2xl font-semibold text-white mb-4">
              Belum ada artikel Academy
            </h3>
            <p className="text-gray-400 text-lg">
              Artikel Academy akan muncul di sini setelah ditambahkan melalui Sanity Studio.
            </p>
          </div>
        )}
      </main>
    </CoinGeckoProvider>
  );
} 