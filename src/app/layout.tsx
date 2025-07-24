import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ErrorBoundary from "../components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Handle browser extension errors
              window.addEventListener('error', function(e) {
                if (e.message.includes('runtime.lastError') || 
                    e.message.includes('message port closed') ||
                    e.filename.includes('chrome-extension') ||
                    e.filename.includes('moz-extension')) {
                  e.preventDefault();
                  return false;
                }
              });
              
              // Handle unhandled promise rejections
              window.addEventListener('unhandledrejection', function(e) {
                if (e.reason && e.reason.message && 
                    (e.reason.message.includes('runtime.lastError') || 
                     e.reason.message.includes('message port closed'))) {
                  e.preventDefault();
                  return false;
                }
              });
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <Navbar />
          <div className="min-h-screen flex flex-col">
            {children}
          </div>
          <Footer />
        </ErrorBoundary>
      </body>
    </html>
  );
}
