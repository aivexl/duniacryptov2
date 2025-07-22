import { dummyNews } from '../../../data/dummyNews';
import dayjs from 'dayjs';
import { notFound } from 'next/navigation';

export default function NewsDetailPage({ params }: { params: { slug: string } }) {
  const news = dummyNews.find(n => n.slug === params.slug);
  if (!news) return notFound();
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-duniacrypto-panel rounded-lg shadow p-6 flex gap-6 items-center">
        <img
          src={news.image}
          alt="news"
          className="w-32 h-32 rounded-md object-cover bg-black/30 flex-shrink-0 hover:scale-105 transition-transform"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{news.title}</h1>
          <div className="text-xs text-gray-400 mb-2">{news.source?.name || 'Unknown'} • {dayjs(news.publishedAt).format('DD MMM YYYY HH:mm')}</div>
          <div className="text-gray-200 mb-2 whitespace-pre-line">{news.excerpt}</div>
        </div>
      </div>
      <div className="bg-duniacrypto-panel rounded-lg shadow p-6 mt-6 text-gray-200 whitespace-pre-line">
        {news.content}
      </div>
    </div>
  );
} 