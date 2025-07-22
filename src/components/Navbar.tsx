"use client";
import { useState } from "react";
import Link from "next/link";
import GradientText from "./GradientText";

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-duniacrypto-panel border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-3 group">
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
        {/* Desktop nav */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="text-white font-bold transition block hover:text-blue-400" style={{borderRadius: 16, textDecoration: 'none'}}>Home</Link>
          <Link href="/newsroom" className="text-white font-bold transition block hover:text-blue-400" style={{borderRadius: 16, textDecoration: 'none'}}>Newsroom</Link>
          <Link href="/academy" className="text-white font-bold transition block hover:text-blue-400" style={{borderRadius: 16, textDecoration: 'none'}}>Academy</Link>
          <Link href="/kamus" className="text-white font-bold transition block hover:text-blue-400" style={{borderRadius: 16, textDecoration: 'none'}}>Kamus WEB3</Link>
          <Link href="/about" className="text-white font-bold transition block hover:text-blue-400" style={{borderRadius: 16, textDecoration: 'none'}}>About</Link>
          <Link href="/contact" className="text-white font-bold transition block hover:text-blue-400" style={{borderRadius: 16, textDecoration: 'none'}}>Contact</Link>
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
              className="absolute top-4 right-4 text-3xl leading-none text-white bg-gray-800 bg-opacity-60 rounded-full w-10 h-10 flex items-center justify-center z-50 focus:outline-none hover:bg-duniacrypto-green/80 hover:text-black transition-colors"
              onClick={() => setNavOpen(false)}
              aria-label="Close menu"
            >
              &times;
            </button>
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