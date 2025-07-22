"use client";

import React from "react";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id';
import StarBorder from './StarBorder';

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
    <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-4 md:py-6 grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
      {/* Main Content */}
      <section className="col-span-1 xl:col-span-2 space-y-4 md:space-y-6">
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
      </section>

      {/* Sidebar */}
      <aside className="col-span-1 space-y-4 md:gap-6">
        {/* Subscribe for Crypto Updates */}
        <StarBorder as="div" color="cyan" speed="8s" thickness={1} className="relative bg-duniacrypto-panel rounded-lg shadow p-4 flex flex-col items-center gap-3 w-full max-w-full mt-0 mb-8">
          <h3 className="text-base font-bold mb-3 text-white">Subscribe for Crypto Updates</h3>
          <form className="w-full flex flex-col sm:flex-row gap-2 items-center justify-center mt-2">
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="w-full sm:w-auto flex-1 px-3 py-2 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-duniacrypto-green text-sm"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded bg-duniacrypto-green text-black font-bold hover:bg-green-400 transition text-sm"
            >
              Subscribe
            </button>
          </form>
        </StarBorder>
      </aside>
    </main>
  );
} 