import React from 'react';
import { Grid, Scissors, Layers, Check, SlidersHorizontal } from 'lucide-react';
import { CountryPreset, SheetPreset, SheetSettings, Language } from '../types';
import { COUNTRY_PRESETS, SHEET_PRESETS } from '../constants/presets';
import { translations } from '../translations';

interface SheetLayoutConfigProps {
  country: CountryPreset;
  onSelectCountry: (c: CountryPreset) => void;
  sheet: SheetPreset;
  onSelectSheet: (s: SheetPreset) => void;
  settings: SheetSettings;
  onChangeSettings: (fn: (prev: SheetSettings) => SheetSettings) => void;
  language: Language;
}

export const SheetLayoutConfig: React.FC<SheetLayoutConfigProps> = ({
  country,
  onSelectCountry,
  sheet,
  onSelectSheet,
  settings,
  onChangeSettings,
  language,
}) => {
  const t = translations[language];

  const handleSheetChange = (preset: SheetPreset) => {
    onSelectSheet(preset);
    onChangeSettings((prev) => ({
      ...prev,
      sheetPresetId: preset.id,
      cols: preset.defaultCols,
      rows: preset.defaultRows,
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Paper Sheet Preset & Grid Columns/Rows */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white">{t.layout.paperSize}</h3>
        </div>

        {/* Paper presets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {SHEET_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleSheetChange(p)}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                sheet.id === p.id
                  ? 'border-amber-400 bg-amber-500/10'
                  : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white truncate">{p.name}</span>
                {sheet.id === p.id && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="font-mono text-amber-400/90">
                  {p.widthInches}" x {p.heightInches}"
                </span>
                <span aria-hidden="true">·</span>
                <span>{p.defaultCols * p.defaultRows} photos</span>
              </div>
            </button>
          ))}
        </div>

        {/* Custom Columns & Rows Grid Settings */}
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Grid className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.layout.customGrid}</span>
            </span>
            <span className="font-mono text-amber-400 font-bold">
              {settings.cols * settings.rows} {language === 'hi' ? 'फोटो' : 'Photos Total'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Columns */}
            <div className="flex items-center justify-between bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-400">{language === 'hi' ? 'कॉलम' : 'Columns'}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onChangeSettings((prev) => ({
                      ...prev,
                      cols: Math.max(1, prev.cols - 1),
                    }))
                  }
                  className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center"
                >
                  -
                </button>
                <span className="font-mono text-xs font-bold text-white w-4 text-center">
                  {settings.cols}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onChangeSettings((prev) => ({
                      ...prev,
                      cols: Math.min(8, prev.cols + 1),
                    }))
                  }
                  className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Rows */}
            <div className="flex items-center justify-between bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-400">{language === 'hi' ? 'पंक्तियां' : 'Rows'}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onChangeSettings((prev) => ({
                      ...prev,
                      rows: Math.max(1, prev.rows - 1),
                    }))
                  }
                  className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center"
                >
                  -
                </button>
                <span className="font-mono text-xs font-bold text-white w-4 text-center">
                  {settings.rows}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onChangeSettings((prev) => ({
                      ...prev,
                      rows: Math.min(10, prev.rows + 1),
                    }))
                  }
                  className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Country Passport Standards & Cutting Guides */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Scissors className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white">{t.layout.countrySpec}</h3>
        </div>

        {/* Country selector */}
        <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1">
          {COUNTRY_PRESETS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                onSelectCountry(c);
                onChangeSettings((prev) => ({ ...prev, countryPresetId: c.id }));
              }}
              className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                country.id === c.id
                  ? 'border-amber-400 bg-amber-500/10'
                  : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">{c.flag}</span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">
                    {language === 'hi' ? c.nameHi : c.name}
                  </span>
                  <span className="text-[10px] text-slate-400">{c.description}</span>
                </div>
              </div>
              <span className="font-mono text-xs text-amber-400 font-medium shrink-0">
                {c.widthMm}x{c.heightMm}mm
              </span>
            </button>
          ))}
        </div>

        {/* Cutting border guidelines */}
        <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
          <span className="text-xs font-semibold text-slate-300">{t.layout.borderStyle}</span>
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-950/70 rounded-xl border border-slate-800">
            {(['none', 'hairline', 'dashed', 'corners'] as const).map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => onChangeSettings((prev) => ({ ...prev, cutBorder: b }))}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all capitalize ${
                  settings.cutBorder === b
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {b === 'none'
                  ? t.layout.borderNone
                  : b === 'hairline'
                  ? 'Hairline'
                  : b === 'dashed'
                  ? 'Dashed'
                  : 'Corners'}
              </button>
            ))}
          </div>
        </div>

        {/* Studio Branding header watermark on sheet */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-200">
              {t.layout.studioBrandMark}
            </span>
            <span className="text-[10px] text-slate-400">
              "SAIYAD PHOTO STUDIO · 300 DPI ULTRA HD"
            </span>
          </div>
          <input
            type="checkbox"
            checked={settings.includeStudioWatermark}
            onChange={(e) =>
              onChangeSettings((prev) => ({
                ...prev,
                includeStudioWatermark: e.target.checked,
              }))
            }
            className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
