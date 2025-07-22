"use client";

import React from "react";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id';

// Configure dayjs
dayjs.extend(relativeTime);
dayjs.locale('id');

export default function ArticleDetailClient({ article }) {
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
        {/* Article Header with Full-Size Image */}
        <div className="bg-duniacrypto-panel rounded-lg shadow overflow-hidden">
          {/* Hero Image - Same size as slider */}
          <div className="relative w-full" style={{height: '400px'}}>
            <img
              src={article.imageUrl || '/Asset/duniacrypto.png'}
              alt={article.image?.alt || article.title}
              className="w-full h-full object-cover bg-black/30"
              onError={(e) => {
                e.target.src = '/Asset/duniacrypto.png';
              }}
            />
            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className={`inline-block px-3 py-1.5 rounded-full text-white font-bold text-sm tracking-wide shadow-lg ${
                article.category === 'newsroom' ? 'bg-blue-700' : 'bg-blue-500'
              }`}>
                {article.category === 'newsroom' ? 'News' : 'Academy'}
              </span>
            </div>
            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white line-clamp-2 drop-shadow-lg mb-4">
                {article.title}
              </h1>
              <div className="text-sm text-gray-200 flex gap-2 items-center">
                <span>{article.source || 'Dunia Crypto'}</span>
                <span>•</span>
                <span>{article.publishedAt ? dayjs(article.publishedAt).format('DD MMM YYYY HH:mm') : 'Baru saja'}</span>
              </div>
            </div>
          </div>
          
          {/* Article Excerpt */}
          {article.excerpt && (
            <div className="p-6 border-b border-gray-700">
              <div className="text-gray-200 text-lg leading-relaxed">{article.excerpt}</div>
            </div>
          )}
        </div>
        
        {/* Article Content */}
        <div className="bg-duniacrypto-panel rounded-lg shadow p-6">
          <div className="text-gray-200 whitespace-pre-line leading-relaxed text-base">
            {article.content}
          </div>
        </div>
      </div>
    </main>
  );
} 