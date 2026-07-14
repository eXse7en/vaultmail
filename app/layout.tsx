import type { Metadata } from 'next';
import './globals.css';
import { DEFAULT_LOCALE } from '@/lib/i18n';
import { Toaster } from 'sonner';
import AdsenseScript from '@/components/AdsenseScript';
import { getStoredAppName, getStoredHeaderTitle } from '@/lib/branding-settings';

export async function generateMetadata(): Promise<Metadata> {
  const [appName, headerTitle] = await Promise.all([
    getStoredAppName(),
    getStoredHeaderTitle(),
  ]);
  const title = headerTitle || appName || 'eXse7en';
  return {
    title: `${title} - Secure Disposable Email`,
    description: 'Secure disposable email service. Privacy first, spam free.',
    openGraph: {
      title: `${title} - Secure Disposable Email`,
      description: 'Secure disposable email service. Privacy first, spam free.',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${title} - Secure Disposable Email`,
      description: 'Secure disposable email service.',
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={DEFAULT_LOCALE} className="dark">
      <body className="font-sans">
        <AdsenseScript />
        {children}
        <Toaster
          position="top-center"
          theme="dark"
          duration={2000}
          visibleToasts={1}
          toastOptions={{
            style: {
              fontSize: '13px',
              padding: '8px 14px',
              width: 'auto',
              maxWidth: '320px',
              textAlign: 'center',
              left: '50%',
              transform: 'translateX(-50%)',
            },
          }}
        />
      </body>
    </html>
  );
}
