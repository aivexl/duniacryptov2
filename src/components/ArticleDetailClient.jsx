"use client";

import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id';
import SubscribeContainer from './SubscribeContainer';
import { CoinGeckoProvider } from './CoinGeckoContext';

// Configure dayjs
dayjs.extend(relativeTime);
dayjs.locale('id');

export default function ArticleDetailClient({ article, relatedArticles = [] }) {
  return (
    <CoinGeckoProvider>
      <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-4 md:py-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 flex-1 w-full">
        {/* Main Content */}
        <section className="col-span-1 xl:col-span-2 space-y-4 md:space-y-6">
          {/* Article Header */}
          <div className="bg-duniacrypto-panel rounded-lg shadow overflow-hidden">
            {/* Featured Image */}
            <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80">
              <img
                src={article.imageUrl || '/Asset/duniacrypto.png'}
                alt={article.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/Asset/duniacrypto.png';
                }}
              />
              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className={`inline-block px-3 py-1 rounded-full text-white font-bold text-sm tracking-wide ${
                  article.category === 'newsroom' ? 'bg-blue-700' : 'bg-blue-500'
                }`}>
                  {article.category === 'newsroom' ? 'News' : 'Academy'}
                </span>
              </div>
              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 md:p-6">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white line-clamp-2 drop-shadow-lg mb-2 md:mb-4">
                  {article.title}
                </h1>
                <div className="text-xs sm:text-sm text-gray-200 flex gap-2 items-center">
                  <span>{article.source || 'Dunia Crypto'}</span>
                  <span>•</span>
                  <span>{article.publishedAt ? dayjs(article.publishedAt).format('DD MMM YYYY HH:mm') : 'Baru saja'}</span>
                </div>
              </div>
            </div>
            
            {/* Article Excerpt */}
            {article.excerpt && (
              <div className="p-4 md:p-6 border-b border-gray-700">
                <div className="text-gray-200 text-base md:text-lg leading-relaxed">{article.excerpt}</div>
              </div>
            )}
          </div>
          
          {/* Article Content */}
          <div className="bg-duniacrypto-panel rounded-lg shadow p-4 md:p-6">
            <div className="text-gray-200 whitespace-pre-line leading-relaxed text-sm md:text-base">
              {article.content}
            </div>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="bg-duniacrypto-panel rounded-lg shadow p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6">Artikel Terkait</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {relatedArticles.slice(0, 4).map((relatedArticle) => (
                  <a
                    key={relatedArticle._id}
                    href={`/${relatedArticle.category === 'newsroom' ? 'newsroom' : 'academy'}/${relatedArticle.slug.current}`}
                    className="block group hover:bg-white/10 rounded-lg p-3 md:p-4 transition cursor-pointer no-underline hover:no-underline focus:no-underline active:no-underline border border-gray-700 hover:border-gray-600"
                  >
                    <div className="flex gap-3 md:gap-4">
                      <img
                        src={relatedArticle.imageUrl || '/Asset/duniacrypto.png'}
                        alt={relatedArticle.title}
                        className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg flex-shrink-0"
                        onError={(e) => {
                          e.target.src = '/Asset/duniacrypto.png';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold text-sm md:text-base line-clamp-2 group-hover:text-blue-300 transition mb-2 leading-tight">
                          {relatedArticle.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span className={`inline-block px-2 py-1 rounded text-white font-medium ${
                            relatedArticle.category === 'newsroom' ? 'bg-blue-700' : 'bg-blue-500'
                          }`}>
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
          {/* Subscribe for Crypto Updates - Same as homepage */}
          <SubscribeContainer />
        </aside>
      </main>
    </CoinGeckoProvider>
  );
} 