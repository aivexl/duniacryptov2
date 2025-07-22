"use client";

import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id';

// Configure dayjs
dayjs.extend(relativeTime);
dayjs.locale('id');

const PLACEHOLDER = '/Asset/duniacrypto.png';

const NewsFeedServer = React.memo(({ articles = [], noTitle = false, initialCount = 5 }) => {
  const displayArticles = useMemo(() => {
    return articles.slice(0, initialCount);
  }, [articles, initialCount]);

  if (!displayArticles.length) {
    return (
      <div className="bg-duniacrypto-panel rounded-lg shadow p-4">
        <div className="text-center text-gray-400">
          <p>Tidak ada artikel tersedia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-duniacrypto-panel rounded-lg shadow p-4">
      {!noTitle && (
        <h2 className="text-xl font-bold mb-4 text-white">Berita Terbaru</h2>
      )}
      <ul className="flex flex-col space-y-2">
        {displayArticles.map((article, index) => (
          <li key={article._id || index} className="border-b border-gray-700 last:border-b-0">
            <a 
              href={`/${article.category === 'newsroom' ? 'newsroom' : 'academy'}/${article.slug.current}`}
              className="block group hover:bg-white/10 rounded-lg px-2 py-2 transition cursor-pointer no-underline hover:no-underline focus:no-underline active:no-underline"
            >
              <div className="flex gap-3">
                <img
                  src={article.imageUrl || '/Asset/duniacrypto.png'}
                  alt={article.title}
                  className="w-16 h-16 object-cover rounded"
                  onError={(e) => {
                    e.target.src = '/Asset/duniacrypto.png';
                  }}
                />
                <div className="flex-1">
                  <h3 className="text-white font-semibold line-clamp-2 group-hover:text-blue-300 transition">
                    {article.title}
                  </h3>
                  <div className="text-xs text-gray-400 mt-1">
                    <span className="inline-block px-2 py-1 bg-blue-600 rounded text-white mr-2">
                      {article.category === 'newsroom' ? 'News' : 'Academy'}
                    </span>
                    <span suppressHydrationWarning={true}>
                      {dayjs(article.publishedAt).fromNow()}
                    </span>
                  </div>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
});

NewsFeedServer.displayName = 'NewsFeedServer';

export default NewsFeedServer; 