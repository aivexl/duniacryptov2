"use client";
import Link from "next/link";
import { useState } from "react";

const logoUrl = "/Asset/duniacrypto.png";
const dummyArticles = Array.from({ length: 30 }, (_, i) => ({
  slug: `artikel-${i + 1}`,
  title: `Tips Web3 #${i + 1}`,
  excerpt: `Pelajari topik Web3 menarik ke-${i + 1}, mulai dari blockchain, NFT, hingga DeFi dan keamanan digital.`,
  content: `Ini adalah isi lengkap dari artikel Web3 nomor ${i + 1}. Anda bisa mengisi dengan konten edukasi Web3, blockchain, crypto, keamanan, dan topik lain sesuai kebutuhan.`
}));

export default function AcademyPage() {
  const [visible, setVisible] = useState(9);
  const articles = dummyArticles.slice(0, visible);
  const hasMore = visible < dummyArticles.length;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Academy</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/academy/${article.slug}`}
            className="bg-duniacrypto-panel rounded-lg shadow flex flex-col overflow-hidden hover:ring-2 hover:ring-blue-400 transition-all group cursor-pointer"
          >
            <div className="w-full aspect-[4/3] bg-gray-800 flex items-center justify-center">
              <img
                src={logoUrl}
                alt="Logo Dunia Crypto"
                className="object-contain w-28 h-28 mx-auto my-6 group-hover:scale-105 transition-transform"
                loading="lazy"
              />
            </div>
            <div className="flex-1 flex flex-col p-4">
              <h2 className="text-lg font-semibold mb-2 line-clamp-2 min-h-[48px]">{article.title}</h2>
              <p className="text-gray-200 mb-2 line-clamp-3 min-h-[60px]">{article.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex justify-center mt-10">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded"
          onClick={() => setVisible(v => Math.min(v + 3, dummyArticles.length))}
          disabled={!hasMore}
        >
          Load More
        </button>
      </div>
    </div>
  );
} 