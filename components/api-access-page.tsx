'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Code2, Globe, Menu, Shield, Wrench, ShoppingCart, MessageCircle, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getTranslations } from '@/lib/i18n';
import { DEFAULT_APP_NAME } from '@/lib/branding';

const STORAGE_KEY = 'vaultmail_locale';

export function ApiAccessPage() {
  const [showMenu, setShowMenu] = useState(false);
  const [locale, setLocale] = useState<'en' | 'id'>('en');
  const [customAppName, setCustomAppName] = useState<string | null>(null);

  useEffect(() => {
    const storedLocale = localStorage.getItem(STORAGE_KEY);
    if (storedLocale === 'en' || storedLocale === 'id') {
      setLocale(storedLocale);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const t = useMemo(() => getTranslations(locale), [locale]);
  const resolvedAppName = customAppName || t.appName;

  useEffect(() => {
    const loadBranding = async () => {
      try {
        const response = await fetch('/api/branding');
        if (!response.ok) return;
        const data = (await response.json()) as { appName?: string };
        const value = data?.appName?.trim();
        setCustomAppName(value || DEFAULT_APP_NAME);
      } catch (error) {
        console.error(error);
      }
    };

    loadBranding();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/50 relative overflow-hidden flex flex-col">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <header className="border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span>{resolvedAppName}</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowMenu((prev) => !prev)}
                className={cn(
                  'h-12 w-12 rounded-full border border-white/10 bg-white/10 text-white',
                  showMenu && 'bg-white/10'
                )}
              >
                <Menu className="h-5 w-5 text-blue-200" />
              </Button>

              {showMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-white/10 bg-slate-900/90 shadow-2xl overflow-hidden">
                    <div className="p-2 space-y-2">
                      <div className="px-3 pt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                        Menu
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setLocale(locale === 'id' ? 'en' : 'id');
                          setShowMenu(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/10"
                      >
                        <Globe className="h-4 w-4 text-blue-300" />
                        {locale === 'id' ? t.languageEnglish : t.languageIndonesian}
                      </button>
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/10"
                        onClick={() => setShowMenu(false)}
                      >
                        <Shield className="h-4 w-4 text-purple-300" />
                        Admin Dashboard
                      </Link>
                      <Link
                        href="/api-access"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/10"
                        onClick={() => setShowMenu(false)}
                      >
                        <Code2 className="h-4 w-4 text-blue-300" />
                        {t.menuApiAccess}
                      </Link>
                      <Link
                        href="/tools"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/10"
                        onClick={() => setShowMenu(false)}
                      >
                        <Wrench className="h-4 w-4 text-orange-300" />
                        {t.menuTools}
                      </Link>
                      <a
                        href="https://store.exse7en.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/10"
                        onClick={() => setShowMenu(false)}
                      >
                        <ShoppingCart className="h-4 w-4 text-emerald-300" />
                        Store
                      </a>
                      <a
                        href="https://t.me/exse7en_bot"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/10"
                        onClick={() => setShowMenu(false)}
                      >
                        <MessageCircle className="h-4 w-4 text-sky-300" />
                        Order Bot
                      </a>
                      <Link
                        href="https://github.com/eXse7en"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/10"
                        onClick={() => setShowMenu(false)}
                      >
                        <Shield className="h-4 w-4 text-green-300" />
                        {t.github}
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <section className="w-full px-4 py-10 md:py-16 max-w-6xl mx-auto">
        <div className="glass-card rounded-2xl border border-white/10 bg-white/5 p-5 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white">
                <Code2 className="h-5 w-5 text-blue-300 shrink-0" />
                <h1 className="text-xl md:text-2xl font-semibold">{t.apiAccessTitle}</h1>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t.apiAccessSubtitle}
              </p>
            </div>
            <Link
              href="https://github.com/eXse7en"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20 self-start"
            >
              {t.apiAccessCta}
            </Link>
          </div>

          {/* Cara Kerja */}
          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">
              <div className="flex items-center gap-2 text-white mb-3">
                <Mail className="h-4 w-4 text-blue-400 shrink-0" />
                <h3 className="text-sm font-bold uppercase tracking-wider">📥 Cara Kerja API / How It Works</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider">Flow Inbox (Read)</p>
                  <ol className="space-y-1.5 text-xs text-white/70 list-decimal list-inside leading-relaxed">
                    <li>Buat alamat email di halaman utama, misal <span className="font-mono text-blue-200">user@domain.com</span></li>
                    <li>Gunakan alamat itu untuk menerima email di mana pun</li>
                    <li>Panggil <span className="font-mono text-blue-200">GET /api/inbox?address=user@domain.com</span> untuk lihat email masuk</li>
                    <li>Email otomatis terhapus sesuai durasi retensi (default 24 jam)</li>
                  </ol>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Flow Webhook (Write)</p>
                  <ol className="space-y-1.5 text-xs text-white/70 list-decimal list-inside leading-relaxed">
                    <li>Email dikirim ke alamat <span className="font-mono text-emerald-200">user@domain.com</span></li>
                    <li>Cloudflare Email Routing menerima email</li>
                    <li>Email diteruskan ke worker Cloudflare</li>
                    <li>Worker mengirim <span className="font-mono text-emerald-200">POST /api/webhook</span> ke app ini</li>
                    <li>Email tersimpan di database dan muncul di inbox</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-black/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                {t.apiAccessEndpointsTitle}
              </p>
              <ul className="mt-3 space-y-2 text-xs font-mono text-blue-100 break-all">
                <li>GET /api/inbox?address=nama@domain.com</li>
                <li className="break-all">GET /api/download?address=nama@domain.com&amp;emailId=uuid&amp;type=email</li>
                <li>GET /api/retention</li>
              </ul>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                {t.apiAccessWebhookTitle}
              </p>
              <p className="mt-3 text-sm text-white/80 font-mono">
                POST /api/webhook
              </p>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                {t.apiAccessWebhookHint}
              </p>
            </div>
          </div>
        </div>
      </div>
      </section>
    </main>
  );
}
