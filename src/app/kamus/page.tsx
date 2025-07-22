const kamusWeb3 = [
  { term: "Airdrop", desc: "Distribusi token atau koin gratis ke dompet pengguna sebagai promosi atau reward." },
  { term: "Blockchain", desc: "Teknologi buku besar terdistribusi yang menjadi dasar dari cryptocurrency dan Web3." },
  { term: "DAO", desc: "Decentralized Autonomous Organization, organisasi yang dijalankan oleh smart contract tanpa otoritas terpusat." },
  { term: "DeFi", desc: "Decentralized Finance, ekosistem layanan keuangan tanpa perantara terpusat." },
  { term: "DApp", desc: "Decentralized Application, aplikasi yang berjalan di atas blockchain." },
  { term: "Gas Fee", desc: "Biaya transaksi yang dibayarkan untuk memproses transaksi di blockchain." },
  { term: "Hash", desc: "Output dari fungsi hash, digunakan untuk keamanan dan identifikasi data di blockchain." },
  { term: "ICO", desc: "Initial Coin Offering, metode penggalangan dana dengan menjual token baru." },
  { term: "NFT", desc: "Non-Fungible Token, aset digital unik yang mewakili kepemilikan barang digital atau fisik." },
  { term: "Node", desc: "Komputer yang terhubung ke jaringan blockchain dan membantu memvalidasi transaksi." },
  { term: "Private Key", desc: "Kunci rahasia yang digunakan untuk mengakses dan mengelola aset kripto." },
  { term: "Public Key", desc: "Kunci publik yang digunakan untuk menerima aset kripto." },
  { term: "Smart Contract", desc: "Kontrak digital yang berjalan otomatis di blockchain sesuai kode yang ditulis." },
  { term: "Staking", desc: "Menyimpan aset kripto dalam jaringan untuk mendukung operasi blockchain dan mendapatkan reward." },
  { term: "Token", desc: "Aset digital yang dibangun di atas blockchain tertentu." },
  { term: "Wallet", desc: "Dompet digital untuk menyimpan, menerima, dan mengirim aset kripto." },
  // Tambahkan istilah lain sesuai kebutuhan
];

const kamusSorted = kamusWeb3.sort((a, b) => a.term.localeCompare(b.term));

export default function KamusPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Kamus WEB3</h1>
      <div className="bg-duniacrypto-panel p-6 rounded-lg shadow">
        <ul className="divide-y divide-gray-700">
          {kamusSorted.map(({ term, desc }) => (
            <li key={term} className="py-4">
              <span className="font-bold text-blue-400 text-lg">{term}</span>
              <div className="text-gray-200 mt-1">{desc}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 