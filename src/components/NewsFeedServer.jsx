import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id';

// Configure dayjs
dayjs.extend(relativeTime);
dayjs.locale('id');

const PLACEHOLDER = '/Asset/duniacrypto.png';

export default function NewsFeedServer({ 
  articles = [],
  showThumbnails = false, 
  noTitle = false, 
  initialCount = 10
}) {
  const displayArticles = articles.slice(0, initialCount);

  if (articles.length === 0) {
    return (
      <div className="bg-duniacrypto-panel rounded-lg shadow p-4">
        {!noTitle && <h2 className="text-lg font-bold mb-4">Latest Crypto News</h2>}
        <div className="text-gray-400 text-center py-4">No articles found</div>
      </div>
    );
  }

  return (
    <div className="bg-duniacrypto-panel rounded-lg shadow p-4">
      {!noTitle && <h2 className="text-lg font-bold mb-4">Latest Crypto News</h2>}
      <ul className="flex flex-col gap-4">
        {displayArticles.map((article) => (
          <li key={article._id} className="border-b border-gray-800 pb-2 last:border-b-0 group transition">
            <a
              href={`/${article.category === 'newsroom' ? 'newsroom' : 'academy'}/${article.slug.current}`}
              className="block group-hover:bg-white/10 rounded-lg px-2 py-2 transition cursor-pointer no-underline hover:no-underline focus:no-underline active:no-underline"
            >
              <div className="flex gap-3 items-center">
                <img 
                  src={article.imageUrl || PLACEHOLDER} 
                  alt={article.image?.alt || article.title} 
                  className="w-16 h-16 rounded-md object-cover bg-black/30 flex-shrink-0 group-hover:scale-105 transition-transform" 
                />
                <div className="flex-1">
                  <h3 className="text-duniacrypto-green font-semibold no-underline hover:no-underline focus:no-underline active:no-underline">
                    {article.title}
                  </h3>
                  <div className="text-xs text-gray-400 mt-1 flex gap-2 items-center">
                    <span>{article.source || 'Dunia Crypto'}</span>
                    {/* Label News/Academy */}
                    <span className={
                      article.category === 'newsroom'
                        ? 'inline-block px-2 py-0.5 rounded bg-blue-700 text-white font-bold text-[10px] tracking-wide'
                        : 'inline-block px-2 py-0.5 rounded bg-blue-500 text-white font-bold text-[10px] tracking-wide'
                    }>
                      {article.category === 'newsroom' ? 'News' : 'Academy'}
                    </span>
                    <span>•</span>
                    <span suppressHydrationWarning={true}>
                      {article.publishedAt ? dayjs(article.publishedAt).fromNow() : 'Baru saja'}
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
} 