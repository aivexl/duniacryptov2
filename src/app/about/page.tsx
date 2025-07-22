export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">About Dunia Crypto</h1>
      <div className="mb-8 bg-duniacrypto-panel p-6 rounded-lg shadow">
        <p className="mb-4">Dunia Crypto adalah platform edukasi dan informasi seputar dunia cryptocurrency, blockchain, dan web3 untuk masyarakat Indonesia.</p>
        <h2 className="text-xl font-semibold mb-2">Visi</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Meningkatkan literasi dan pemahaman masyarakat tentang teknologi blockchain dan aset kripto.</li>
          <li>Menjadi sumber informasi terpercaya dan terdepan di bidang crypto di Indonesia.</li>
        </ul>
        <h2 className="text-xl font-semibold mb-2">Misi</h2>
        <ul className="list-disc pl-6">
          <li>Menyediakan konten edukasi yang mudah dipahami dan up-to-date.</li>
          <li>Membangun komunitas yang aktif, inklusif, dan suportif.</li>
          <li>Mendorong adopsi teknologi blockchain secara positif dan bertanggung jawab.</li>
        </ul>
      </div>
      <div className="bg-duniacrypto-panel p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Info Singkat</h2>
        <p>Didirikan tahun 2024, Dunia Crypto berkomitmen menjadi jembatan antara teknologi baru dan masyarakat luas.</p>
      </div>
    </div>
  );
} 