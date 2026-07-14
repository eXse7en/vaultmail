'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Code2, Globe, Menu, Shield, Wrench, ShoppingCart, MessageCircle } from 'lucide-react';

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
          <div className="rounded-xl border border-white/10 bg-black/40 p-4 mb-6">
            <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold uppercase tracking-wider mb-2">
              <Globe className="h-4 w-4" />
              Default Domain
            </div>
            <p className="font-mono text-sm text-white">
              exse7en.dpdns.org
            </p>
            <p className="text-xs text-white/50 mt-1">
              Gunakan domain ini langsung. Atau minta admin menambahkan domain kustom.
              <br />
              <span className="text-white/30">Use this domain directly, or ask the admin to add a custom domain.</span>
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-black/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                {t.apiAccessEndpointsTitle}
              </p>
              <ul className="mt-3 space-y-2 text-xs font-mono text-blue-100 break-all">
                <li>GET /api/inbox?address=nama@exse7en.dpdns.org</li>
                <li className="break-all">GET /api/download?address=nama@exse7en.dpdns.org&amp;emailId=uuid&amp;type=email</li>
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

          {/* Tutorial Custom Domain */}
          <div className="mt-6 rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-900/20 via-green-900/10 to-emerald-900/20 p-5 md:p-6">
            <div className="flex items-center gap-2 text-white mb-4">
              <Globe className="h-5 w-5 text-emerald-400 shrink-0" />
              <h2 className="text-lg md:text-xl font-semibold">🌐 Custom Domain Guide</h2>
            </div>
            <p className="text-sm text-emerald-200/80 mb-4 leading-relaxed">
              Ingin pakai domain sendiri untuk alamat email sementara? Ikuti panduan sesuai peran kamu.
              <br />
              Want to use your own domain for temporary email addresses? Follow the guide for your role.
            </p>

            {/* Tab Selector */}
            <div className="flex flex-wrap gap-2 mb-6">
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-300">
                👑 Admin / Pemilik Server
              </div>
              <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-300">
                👤 User Biasa
              </div>
            </div>

            {/* ========== ADMIN SECTION ========== */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 text-sm">👑</span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Untuk Admin / Pemilik Server</h3>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">
                Kamu punya akses ke Cloudflare Dashboard dan bisa deploy worker.
                Ikuti langkah-langkah ini agar domain bisa menerima email.
              </p>

              <div className="space-y-3">
                <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">1</span>
                    <div className="space-y-1 min-w-0">
                      <p className="text-sm font-semibold text-white">Add domain to Cloudflare</p>
                      <p className="text-xs text-white/60 leading-relaxed">
                        Daftarkan domain ke Cloudflare dan arahkan nameserver-nya.
                        <br />
                        <span className="text-white/40">Register your domain on Cloudflare and point its nameservers.</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">2</span>
                    <div className="space-y-1 min-w-0">
                      <p className="text-sm font-semibold text-white">Enable Email Routing</p>
                      <p className="text-xs text-white/60 leading-relaxed">
                        Cloudflare Dashboard → <span className="text-emerald-300">Email</span> → <span className="text-emerald-300">Email Routing</span>, aktifkan.
                        <br />
                        <span className="text-white/40">Enable Email Routing in Cloudflare Dashboard.</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">3</span>
                    <div className="space-y-2 min-w-0">
                      <p className="text-sm font-semibold text-white">Verify MX Records</p>
                      <p className="text-xs text-white/60 leading-relaxed">
                        Pastikan MX Record domain sudah sesuai:
                      </p>
                      <div className="rounded-lg bg-black/60 p-3 font-mono text-xs text-blue-100 space-y-1 overflow-x-auto">
                        <p className="whitespace-nowrap">Type: <span className="text-emerald-300">MX</span> | Name: <span className="text-emerald-300">@</span> | Priority: <span className="text-emerald-300">10</span> → mx1.cloudflare.net</p>
                        <p className="whitespace-nowrap">Type: <span className="text-emerald-300">MX</span> | Name: <span className="text-emerald-300">@</span> | Priority: <span className="text-emerald-300">20</span> → mx2.cloudflare.net</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">4</span>
                    <div className="space-y-1 min-w-0">
                      <p className="text-sm font-semibold text-white">Deploy Cloudflare Worker</p>
                      <p className="text-xs text-white/60 leading-relaxed">
                        Deploy worker dari folder <span className="font-mono text-emerald-300">worker/</span> dengan <span className="font-mono text-emerald-300">WEBHOOK_URL</span> mengarah ke <span className="font-mono text-emerald-300">https://appkamu.vercel.app/api/webhook</span>.
                        <br />
                        <span className="text-white/40">Deploy the worker from the worker/ directory with WEBHOOK_URL pointing to your webhook endpoint.</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">5</span>
                    <div className="space-y-1 min-w-0">
                      <p className="text-sm font-semibold text-white">Create Catch-All Route → Worker</p>
                      <p className="text-xs text-white/60 leading-relaxed">
                        Cloudflare Email Routing → <span className="text-emerald-300">Routes</span> → buat <span className="text-emerald-300">Catch-All</span> → action <span className="text-emerald-300">Send to Worker</span> → pilih worker kamu.
                        <br />
                        <span className="text-white/40">Create a Catch-All route and set action to Send to Worker.</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">6</span>
                    <div className="space-y-1 min-w-0">
                      <p className="text-sm font-semibold text-white">Add domain to Admin Dashboard</p>
                      <p className="text-xs text-white/60 leading-relaxed">
                        Buka <span className="text-purple-300">Admin Dashboard (/admin)</span> → <span className="text-purple-300">Manajemen Domain</span> → tambahkan domain kamu. Dengan ini, domain tersedia untuk <strong>semua user</strong>.
                        <br />
                        <span className="text-white/40">Go to Admin Dashboard → Manajemen Domain → add your domain. This makes it available to all users.</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ========== USER SECTION ========== */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-blue-400 text-sm">👤</span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Untuk User Biasa</h3>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">
                Kamu tidak punya akses ke worker milik admin. Ada beberapa opsi:
                <br />
                <span className="text-white/40">You don't have access to the admin's worker. Here are your options:</span>
              </p>

              <div className="grid gap-3 md:grid-cols-2">
                {/* Opsi A */}
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-400">A</span>
                    <p className="text-sm font-semibold text-white">Gunakan domain yang sudah tersedia</p>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Domain default <span className="font-mono text-emerald-300">exse7en.dpdns.org</span> sudah siap pakai. Cukup pilih dari dropdown, buat alamat kamu, dan mulai menerima email. <strong>Tidak perlu setup apapun.</strong>
                    <br />
                    <span className="text-white/40">The default domain <span className="font-mono">exse7en.dpdns.org</span> is ready to use. Just select it from the dropdown, create your address, and start receiving emails. No setup needed.</span>
                  </p>
                </div>

                {/* Opsi B */}
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-400">B</span>
                    <p className="text-sm font-semibold text-white">Forward ke Email + IMAP (jika tersedia)</p>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Jika admin sudah mengaktifkan IMAP Fetch, kamu bisa arahkan email dari domain kamu ke alamat IMAP yang dikonfigurasi. Caranya:
                  </p>
                  <ol className="mt-2 space-y-1 text-xs text-white/50 list-decimal list-inside">
                    <li>Add domain ke Cloudflare, aktifkan Email Routing</li>
                    <li>Buat Catch-All Route → action <span className="text-emerald-300">Send to Email</span></li>
                    <li>Masukkan alamat email IMAP yang sudah disetup admin</li>
                    <li>Email akan otomatis masuk ke inbox aplikasi via IMAP sync</li>
                  </ol>
                </div>
              </div>

              {/* Opsi C */}
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-400">C</span>
                  <div className="space-y-1 min-w-0">
                    <p className="text-sm font-semibold text-white">Minta Admin untuk menambahkan domain kamu</p>
                    <p className="text-xs text-white/60 leading-relaxed">
                      Cara paling mudah. Hubungi admin dan minta domain kamu ditambahkan ke <span className="text-purple-300">Admin Dashboard</span>. 
                      Setelah itu, kamu tinggal pilih domain dari dropdown dan langsung bisa pakai — tanpa perlu setup teknis apapun.
                      <br />
                      <span className="text-white/40">The easiest way. Ask the admin to add your domain to the Admin Dashboard. Once added, you can select it from the dropdown without any technical setup.</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Note */}
            <div className="mt-6 rounded-xl border border-amber-400/20 bg-amber-500/10 p-4">
              <div className="flex items-start gap-3">
                <span className="text-amber-400 text-sm shrink-0 mt-0.5">⚠️</span>
                <div className="space-y-1 text-xs text-amber-200/80 leading-relaxed">
                  <p className="font-semibold text-amber-200">Penting / Important:</p>
                  <p>
                    Menambahkan domain di aplikasi ini <strong>hanya</strong> membuat domain muncul di dropdown. 
                    Agar email bisa masuk, domain harus punya MX Record yang benar dan Email Routing yang aktif — terlepas dari siapapun yang melakukan setup.
                  </p>
                  <p className="text-amber-200/60">
                    Adding a domain to this app <strong>only</strong> makes it appear in the dropdown.
                    For emails to arrive, the domain must have correct MX records and active Email Routing — regardless of who sets it up.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
