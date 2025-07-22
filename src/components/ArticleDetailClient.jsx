"use client";

import React from "react";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id';

// Configure dayjs
dayjs.extend(relativeTime);
dayjs.locale('id');

export default function ArticleDetailClient({ article, relatedArticles = [] }) {
  if (!article) {
    return (
      <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-4 md:py-6">
        <div className="bg-duniacrypto-panel rounded-lg shadow p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Artikel Tidak Ditemukan</h1>
          <p className="text-gray-400">Artikel yang Anda cari tidak ditemukan.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-4 md:py-6">
      <div className="space-y-4 md:space-y-6">
        {/* Article Header */}
        <div className="bg-duniacrypto-panel rounded-lg shadow p-6">
          <div className="flex gap-6 items-start">
            <img
              src={article.imageUrl || '/Asset/duniacrypto.png'}
              alt={article.image?.alt || article.title}
              className="w-32 h-32 rounded-md object-cover bg-black/30 flex-shrink-0 hover:scale-105 transition-transform"
              onError={(e) => {
                e.target.src = '/Asset/duniacrypto.png';
              }}
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
          <div className="text-gray-200 whitespace-pre-line leading-relaxed text-base">
            {article.content}
          </div>
        </div>

        {/* Email Subscription */}
        <div className="bg-duniacrypto-panel rounded-lg shadow p-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-2">Berlangganan Newsletter</h3>
            <p className="text-gray-400 mb-4">Dapatkan update terbaru seputar cryptocurrency dan blockchain langsung ke email Anda</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Masukkan email Anda"
                className="flex-1 px-4 py-2 rounded-lg bg-duniacrypto-card border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-duniacrypto-green"
              />
              <button className="px-6 py-2 bg-duniacrypto-green text-white font-semibold rounded-lg hover:bg-duniacrypto-green/80 transition-colors">
                Berlangganan
              </button>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="bg-duniacrypto-panel rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-white mb-4">Artikel Terkait</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedArticles.slice(0, 6).map((relatedArticle) => (
                <a
                  key={relatedArticle._id}
                  href={`/${relatedArticle.category === 'newsroom' ? 'newsroom' : 'academy'}/${relatedArticle.slug.current}`}
                  className="block group hover:bg-white/10 rounded-lg p-3 transition cursor-pointer no-underline hover:no-underline focus:no-underline active:no-underline"
                >
                  <div className="flex gap-3">
                    <img
                      src={relatedArticle.imageUrl || '/Asset/duniacrypto.png'}
                      alt={relatedArticle.title}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        e.target.src = '/Asset/duniacrypto.png';
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-semibold line-clamp-2 group-hover:text-blue-300 transition">
                        {relatedArticle.title}
                      </h4>
                      <div className="text-xs text-gray-400 mt-1">
                        <span className="inline-block px-2 py-1 bg-blue-600 rounded text-white mr-2">
                          {relatedArticle.category === 'newsroom' ? 'News' : 'Academy'}
                        </span>
                        <span suppressHydrationWarning={true}>
                          {dayjs(relatedArticle.publishedAt).fromNow()}
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 