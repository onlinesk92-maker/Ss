import React from 'react';
import { Camera, Globe, Moon, Sun, HelpCircle, RotateCcw } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isDark: boolean;
  onThemeToggle: () => void;
  onOpenHelp: () => void;
  onResetAll: () => void;
  onGenerateSheet: () => void;
  hasImage: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  isDark,
  onThemeToggle,
  onOpenHelp,
  onResetAll,
  onGenerateSheet,
  hasImage,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Camera className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-lg tracking-tight text-white whitespace-nowrap">
              SAIYAD <span className="text-amber-400">PHOTO</span>
            </span>
            <span className="text-[10px] text-slate-400 hidden sm:block tracking-wide -mt-0.5">
              300 DPI Passport Studio
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links / Trust badges (Quiet unboxed text) */}
        <div className="hidden md:flex items-center gap-6 text-xs text-slate-400 font-medium">
          <span className="text-slate-300">4x6 Landscape (8 Photos)</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>India & Global Specs</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>True 300 DPI Export</span>
        </div>

        {/* Zone 3: Primary Action & Utilities */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Help trigger */}
          <button
            type="button"
            onClick={onOpenHelp}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Passport Photo Guide & Rules"
            aria-label="Passport Rules"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Language Switch */}
          <button
            type="button"
            onClick={() => onLanguageChange(language === 'en' ? 'hi' : 'en')}
            className="h-9 px-2.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700/60"
            title="Toggle English / हिंदी"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'en' ? 'हिंदी' : 'EN'}</span>
          </button>

          {/* Theme Switch */}
          <button
            type="button"
            onClick={onThemeToggle}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700/60"
            title="Toggle Dark / Light"
            aria-label="Theme Toggle"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Primary Action Button */}
          {hasImage && (
            <button
              type="button"
              onClick={onGenerateSheet}
              className="h-9 px-4 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold transition-all shadow-sm active:scale-95 whitespace-nowrap"
            >
              {language === 'hi' ? '4x6 शीट देखें' : 'Generate 4x6 Sheet'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
