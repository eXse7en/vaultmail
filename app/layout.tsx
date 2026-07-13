import type { Metadata } from 'next';
import './globals.css';
import { DEFAULT_LOCALE } from '@/lib/i18n';
import { Toaster } from 'sonner';
import AdsenseScript from '@/components/AdsenseScript';
import { getStoredAppName } from '@/lib/branding-settings';

export async function generateMetadata(): Promise<Metadata> {
  const appName = await getStoredAppName();
  return {
    title: `${appName} - Secure Disposable Email`,
    description: 'Self Hosted Temporary email service with custom domains.'
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
          toastOptions={{
            style: {
              fontSize: '13px',
              padding: '10px 16px',
              width: 'auto',
              maxWidth: '360px',
            },
          }}
        />
      </body>
    </html>
  );
}
