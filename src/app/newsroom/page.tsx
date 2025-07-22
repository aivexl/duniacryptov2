"use client";
import Link from "next/link";
import { useState } from "react";

const logoUrl = "/Asset/duniacrypto.png";
const dummyNews = Array.from({ length: 30 }, (_, i) => ({
  slug: `news-${i + 1}`,
  title: `Berita Crypto #${i + 1}`,
  excerpt: `Update terbaru dunia crypto ke-${i + 1}, mulai dari regulasi, harga, hingga inovasi blockchain dan Web3.`,
  content: `Ini adalah isi lengkap dari berita crypto nomor ${i + 1}. Anda bisa mengisi dengan konten berita, analisis, atau update industri crypto dan blockchain.`
}));

export default function NewsroomPage() {
  const [visible, setVisible] = useState(9);
  const news = dummyNews.slice(0, visible);
  const hasMore = visible < dummyNews.length;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Newsroom</h1>
      <div className="space-y-6">
        {news.map((item) => (
          <Link
            key={item.slug}
            href={`/newsroom/${item.slug}`}
            className="flex items-center bg-duniacrypto-panel rounded-lg shadow hover:ring-2 hover:ring-blue-400 transition-all group cursor-pointer overflow-hidden"
          >
            <div className="flex-shrink-0 w-20 h-20 bg-gray-800 flex items-center justify-center">
              <img
                src={logoUrl}
                alt="Logo Dunia Crypto"
                className="object-contain w-14 h-14 group-hover:scale-105 transition-transform"
                loading="lazy"
              />
            </div>
            <div className="flex-1 flex flex-col p-4 min-w-0">
              <h2 className="text-lg font-semibold mb-1 truncate">{item.title}</h2>
              <p className="text-gray-200 text-sm line-clamp-2">{item.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex justify-center mt-10">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded"
          onClick={() => setVisible(v => Math.min(v + 3, dummyNews.length))}
          disabled={!hasMore}
        >
          Load More
        </button>
      </div>
    </div>
  );
} 