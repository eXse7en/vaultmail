'use client';

import { InboxInterface } from "@/components/inbox-interface";
import { Menu, Shield, Zap, Globe, Code2, Wrench } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  DEFAULT_LOCALE,
  getRetentionOptions,
  getTranslations,
  Locale,
  SUPPORTED_LOCALES,
} from "@/lib/i18n";
import { DEFAULT_APP_NAME } from "@/lib/branding";

interface HomePageProps {
  initialAddress?: string;
}

const STORAGE_KEY = 'vaultmail_locale';

export function HomePage({ initialAddress }: HomePageProps) {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);
  const [showMenu, setShowMenu] = useState(false);
  const [retentionSeconds, setRetentionSeconds] = useState(86400);
  const [customAppName, setCustomAppName] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LOCALES.includes(stored as Locale)) {
      setLocale(stored as Locale);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const t = useMemo(() => getTranslations(locale), [locale]);
  const retentionOptions = useMemo(() => getRetentionOptions(locale), [locale]);
  const resolvedAppName = customAppName || t.appName;
  const retentionLabel =
    retentionOptions.find((option) => option.value === retentionSeconds)
      ?.label || retentionOptions[2]?.label || "24 Hours";

  useEffect(() => {
    const loadRetention = async () => {
      try {
        const response = await fetch("/api/retention");
        if (!response.ok) return;
        const data = (await response.json()) as { seconds?: number };
        if (data?.seconds) {
          setRetentionSeconds(data.seconds);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadRetention();
  }, []);

  useEffect(() => {
    const loadBranding = async () => {
      try {
        const response = await fetch("/api/branding");
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

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return t.greetingMorning;
    if (hour >= 12 && hour < 15) return t.greetingAfternoon;
    if (hour >= 15 && hour < 19) return t.greetingEvening;
    return t.greetingNight;
  }, [t]);

  const hasShownGreeting = useRef(false);

  useEffect(() => {
    if (hasShownGreeting.current) return;
    const timer = setTimeout(() => {
      toast.info(greeting);
      hasShownGreeting.current = true;
    }, 300);
    return () => clearTimeout(timer);
  }, [greeting]);

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_36%),radial-gradient(circle_at_85%_18%,_rgba(16,185,129,0.14),_transparent_32%),linear-gradient(180deg,rgba(2,6,23,1)_0%,rgba(2,10,26,1)_55%,rgba(2,6,23,1)_100%)]">
      {/* Background Blobs */}
      <div className="pointer-events-none absolute left-1/4 top-0 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-cyan-200/10 bg-slate-950/60 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-500 shadow-[0_10px_26px_-12px_rgba(34,211,238,0.95)]">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span>{resolvedAppName}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowMenu((prev) => !prev)}
                className={cn("h-12 w-12 rounded-full border border-cyan-200/20 bg-white/10 text-white", showMenu && "bg-white/15")}
              >
                <Menu className="h-5 w-5 text-cyan-100" />
              </Button>

              <AnimatePresence>
                {showMenu && (
                  <>
                    <button
                      type="button"
                      aria-label="Close menu"
                      className="fixed inset-0 z-40"
                      onClick={() => setShowMenu(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-white/10 bg-slate-900/90 shadow-2xl overflow-hidden"
                    >
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
                        <a
                          href="/admin"
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/10"
                          onClick={() => setShowMenu(false)}
                        >
                          <Shield className="h-4 w-4 text-purple-300" />
                          Admin Dashboard
                        </a>
                        <a
                          href="/api-access"
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/10"
                          onClick={() => setShowMenu(false)}
                        >
                          <Code2 className="h-4 w-4 text-blue-300" />
                          {t.menuApiAccess}
                        </a>
                        <a
                          href="/tools"
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/10"
                          onClick={() => setShowMenu(false)}
                        >
                          <Wrench className="h-4 w-4 text-orange-300" />
                          {t.menuTools}
                        </a>
                        <a
                          href="https://github.com/eXse7en"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/10"
                          onClick={() => setShowMenu(false)}
                        >
                          <Shield className="h-4 w-4 text-green-300" />
                          {t.github}
                        </a>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>
      
      {/* Content */}
          <div className="flex-1 py-10 md:py-14">
         <div className="mb-12 mx-auto max-w-3xl space-y-5 px-4 text-center md:mb-14">
            <h1 className="bg-gradient-to-r from-slate-100 via-cyan-100 to-emerald-100 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-6xl">
              {t.heroTitle} <br/> {t.heroTitleSuffix}
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
              {t.heroSubtitle}
            </p>
         </div>

         <InboxInterface
           initialAddress={initialAddress}
           locale={locale}
           retentionLabel={retentionLabel}
         />

         {/* Features Grid */}
         <div className="mx-auto mt-24 grid max-w-6xl gap-8 px-4 md:grid-cols-3">
            <Feature 
                icon={<Zap className="h-6 w-6 text-cyan-200" />}
                title={t.featureInstantTitle}
                desc={t.featureInstantDesc}
            />
            <Feature 
                icon={<Shield className="h-6 w-6 text-emerald-200" />}
                title={t.featurePrivacyTitle}
                desc={t.featurePrivacyDesc}
            />
            <Feature 
                icon={<Globe className="h-6 w-6 text-cyan-200" />}
                title={t.featureCustomTitle}
                desc={t.featureCustomDesc}
            />
         </div>

      </div>

      <footer className="mt-12 border-t border-white/10 py-8 text-center text-sm text-slate-300">
        <p>© 2026 {resolvedAppName}. Created with ❤️</p>
      </footer>
    </main>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="fitroh-card rounded-2xl p-6 transition-colors hover:bg-white/[0.08]">
            <div className="mb-4 w-fit rounded-full border border-cyan-100/20 bg-cyan-300/10 p-3">
                {icon}
            </div>
            <h3 className="mb-2 text-lg font-bold text-slate-100">{title}</h3>
            <p className="leading-relaxed text-slate-300">{desc}</p>
        </div>
    )
}
