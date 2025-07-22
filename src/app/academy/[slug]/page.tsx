const dummyArticles = Array.from({ length: 30 }, (_, i) => ({
  slug: `artikel-${i + 1}`,
  title: `Tips Web3 #${i + 1}`,
  content: `Ini adalah isi lengkap dari artikel Web3 nomor ${i + 1}. Anda bisa mengisi dengan konten edukasi Web3, blockchain, crypto, keamanan, dan topik lain sesuai kebutuhan.`,
  date: new Date(Date.UTC(2024, 6, 22, 10, 0, 0) + i * 86400000).toISOString(),
}));

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" });
}

export default function Page({ params }: { params: { slug: string } }) {
  const article = dummyArticles.find(a => a.slug === params.slug);
  if (!article) return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Artikel tidak ditemukan</h1>
      <p className="text-gray-300">Artikel dengan slug "{params.slug}" tidak ditemukan.</p>
    </div>
  );
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">Academy</span>
        <span className="text-xs text-gray-400">{formatDate(article.date)}</span>
      </div>
      <h1 className="text-3xl font-bold mb-6">{article.title}</h1>
      <div className="bg-duniacrypto-panel p-6 rounded-lg shadow text-gray-200 whitespace-pre-line">
        {article.content}
      </div>
    </div>
  );
} 