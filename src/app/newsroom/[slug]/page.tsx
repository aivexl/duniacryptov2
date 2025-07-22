const dummyNews = Array.from({ length: 30 }, (_, i) => ({
  slug: `news-${i + 1}`,
  title: `Berita Crypto #${i + 1}`,
  excerpt: `Update terbaru dunia crypto ke-${i + 1}, mulai dari regulasi, harga, hingga inovasi blockchain dan Web3.`,
  content: `Ini adalah isi lengkap dari berita crypto nomor ${i + 1}. Anda bisa mengisi dengan konten berita, analisis, atau update industri crypto dan blockchain.`,
  date: new Date(Date.UTC(2024, 6, 22, 10, 0, 0) + i * 86400000).toISOString(),
}));

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" });
}

export default function Page({ params }: { params: { slug: string } }) {
  const news = dummyNews.find(a => a.slug === params.slug);
  if (!news) return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Berita tidak ditemukan</h1>
      <p className="text-gray-300">Berita dengan slug "{params.slug}" tidak ditemukan.</p>
    </div>
  );
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">News</span>
        <span className="text-xs text-gray-400">{formatDate(news.date)}</span>
      </div>
      <h1 className="text-3xl font-bold mb-6">{news.title}</h1>
      <div className="bg-duniacrypto-panel p-6 rounded-lg shadow text-gray-200 whitespace-pre-line">
        {news.content}
      </div>
    </div>
  );
} 