import type { Metadata, Viewport } from 'next';
import './globals.css';
import { StoreProvider } from '@/context/StoreContext';
import { CartProvider } from '@/context/CartContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';
import { InstallPwaBanner } from '@/components/InstallPwaBanner';

export const metadata: Metadata = {
  title: 'Shree Balaji Electronics & Electricals | Durga Puja Mega Electronics Sale',
  description:
    'Shop smartphones, 4K Smart TVs, inverter refrigerators, ACs, washing machines, audio systems, and electrical fittings at special Durga Puja festival discount prices. Store pickup and local home delivery available.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
  openGraph: {
    title: 'Shree Balaji Electronics & Electricals | Durga Puja Mega Electronics Sale',
    description: 'Buy Before Durga Puja & Save Up To 20% on authentic electronics with brand warranty.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#9a3412',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Shree Balaji" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <StoreProvider>
          <CartProvider>
            <Header />
            <main className="flex-1 pb-16 sm:pb-0">{children}</main>
            <Footer />
            <BottomNav />
            <InstallPwaBanner />
          </CartProvider>
        </StoreProvider>

        {/* PWA Service Worker Registration Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('PWA ServiceWorker registered with scope: ', registration.scope);
                    },
                    function(err) {
                      console.log('PWA ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
