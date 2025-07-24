"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GradientText from "./GradientText";

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    } else {
      router.push('/search');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-duniacrypto-panel border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-3 group no-underline hover:no-underline focus:no-underline active:no-underline" style={{ textDecoration: 'none' }}>
            <img src="/Asset/duniacrypto.png" alt="Dunia Crypto Logo" className="h-10 w-10 object-contain group-hover:scale-105 transition-transform" style={{filter: 'drop-shadow(0 0 16px #22c5ff)'}} />
            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={3}
              showBorder={false}
              className="text-2xl font-bold tracking-tight font-sans"
            >
              Dunia Crypto
            </GradientText>
          </Link>
        </div>

        {/* Hamburger for mobile */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
          onClick={() => setNavOpen(!navOpen)}
          aria-label="Open navigation menu"
        >
          <span className={`block w-6 h-0.5 bg-white mb-1 transition-transform ${navOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white mb-1 transition-opacity ${navOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-transform ${navOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </button>

        {/* Desktop nav with search */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-white font-bold transition block hover:text-blue-400" style={{borderRadius: 16, textDecoration: 'none'}}>Home</Link>
          <Link href="/newsroom" className="text-white font-bold transition block hover:text-blue-400" style={{borderRadius: 16, textDecoration: 'none'}}>Newsroom</Link>
          <Link href="/academy" className="text-white font-bold transition block hover:text-blue-400" style={{borderRadius: 16, textDecoration: 'none'}}>Academy</Link>
          <Link href="/kamus" className="text-white font-bold transition block hover:text-blue-400" style={{borderRadius: 16, textDecoration: 'none'}}>Kamus WEB3</Link>
          <Link href="/about" className="text-white font-bold transition block hover:text-blue-400" style={{borderRadius: 16, textDecoration: 'none'}}>About</Link>
          <Link href="/contact" className="text-white font-bold transition block hover:text-blue-400" style={{borderRadius: 16, textDecoration: 'none'}}>Contact</Link>
          
          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 px-4 py-2 pl-10 pr-12 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              />
              {/* Search Icon */}
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {/* Search Button */}
              <button
                type="submit"
                onClick={handleSearchClick}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200"
                title="Search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
        </nav>
      </div>

      {/* Mobile nav overlay */}
      {navOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-60 md:hidden" onClick={() => setNavOpen(false)}>
          <nav
            className="absolute top-0 right-0 w-3/4 max-w-xs h-full bg-duniacrypto-panel shadow-lg flex flex-col py-8 px-6 space-y-6 animate-slide-in"
            onClick={e => e.stopPropagation()}
          >
            {/* Tombol Close */}
            <button
              className="absolute top-4 right-4 text-3xl leading-none text-white bg-gray-800 bg-opacity-60 rounded-full w-10 h-10 flex items-center justify-center z-50 focus:outline-none hover:bg-blue-500/80 hover:text-white transition-colors"
              onClick={() => setNavOpen(false)}
              aria-label="Close menu"
            >
              &times;
            </button>

            {/* Mobile Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-12 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                />
                {/* Search Icon */}
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {/* Search Button */}
                <button
                  type="submit"
                  onClick={() => {
                    handleSearchClick();
                    setNavOpen(false);
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200"
                  title="Search"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>

            <Link href="/" className="text-white text-lg font-bold transition block hover:text-blue-400" onClick={() => setNavOpen(false)} style={{borderRadius: 16, textDecoration: 'none'}}>Home</Link>
            <Link href="/newsroom" className="text-white text-lg font-bold transition block hover:text-blue-400" onClick={() => setNavOpen(false)} style={{borderRadius: 16, textDecoration: 'none'}}>Newsroom</Link>
            <Link href="/academy" className="text-white text-lg font-bold transition block hover:text-blue-400" onClick={() => setNavOpen(false)} style={{borderRadius: 16, textDecoration: 'none'}}>Academy</Link>
            <Link href="/kamus" className="text-white text-lg font-bold transition block hover:text-blue-400" onClick={() => setNavOpen(false)} style={{borderRadius: 16, textDecoration: 'none'}}>Kamus WEB3</Link>
            <Link href="/about" className="text-white text-lg font-bold transition block hover:text-blue-400" onClick={() => setNavOpen(false)} style={{borderRadius: 16, textDecoration: 'none'}}>About</Link>
            <Link href="/contact" className="text-white text-lg font-bold transition block hover:text-blue-400" onClick={() => setNavOpen(false)} style={{borderRadius: 16, textDecoration: 'none'}}>Contact</Link>
          </nav>
        </div>
      )}
    </header>
  );
} 