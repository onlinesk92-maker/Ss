import React from 'react';
import { Palette, Shirt, Sliders, Check } from 'lucide-react';
import { BACKGROUND_COLORS, SUIT_PRESETS } from '../constants/presets';
import { PhotoAdjustments, Language } from '../types';
import { translations } from '../translations';

interface BackgroundSelectorProps {
  adjustments: PhotoAdjustments;
  onChangeAdjustments: (fn: (prev: PhotoAdjustments) => PhotoAdjustments) => void;
  language: Language;
}

export const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  adjustments,
  onChangeAdjustments,
  language,
}) => {
  const t = translations[language];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Background Color Studio Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white">{t.background.title}</h3>
        </div>

        {/* Mode selector */}
        <div className="flex items-center gap-2 p-1 bg-slate-950/70 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() =>
              onChangeAdjustments((prev) => ({
                ...prev,
                bgMode: 'original',
              }))
            }
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              adjustments.bgMode === 'original'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.background.original}
          </button>
          <button
            type="button"
            onClick={() =>
              onChangeAdjustments((prev) => ({
                ...prev,
                bgMode: 'color',
              }))
            }
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              adjustments.bgMode === 'color'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.background.solidColor}
          </button>
        </div>

        {adjustments.bgMode === 'color' && (
          <div className="flex flex-col gap-4">
            {/* Color swatches */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-300">
                {language === 'hi' ? 'रंग चुनें' : 'Select Official Backdrop Color'}
              </span>
              <div className="grid grid-cols-3 gap-2">
                {BACKGROUND_COLORS.map((bg) => (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() =>
                      onChangeAdjustments((prev) => ({
                        ...prev,
                        bgColor: bg.hex,
                      }))
                    }
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-left ${
                      adjustments.bgColor.toLowerCase() === bg.hex.toLowerCase()
                        ? 'border-amber-400 bg-amber-500/10'
                        : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-full border border-slate-700 shadow-inner flex items-center justify-center"
                      style={{ backgroundColor: bg.hex }}
                    >
                      {adjustments.bgColor.toLowerCase() === bg.hex.toLowerCase() && (
                        <Check
                          className={`w-4 h-4 ${
                            bg.hex === '#FFFFFF' || bg.hex === '#F4F4F6'
                              ? 'text-slate-950'
                              : 'text-white'
                          }`}
                        />
                      )}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-200 text-center truncate w-full">
                      {bg.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Color Input */}
            <div className="flex items-center gap-3 p-2.5 bg-slate-950/50 rounded-xl border border-slate-800">
              <label htmlFor="custom-bg-color" className="text-xs font-medium text-slate-300">
                {t.background.customColor}:
              </label>
              <input
                id="custom-bg-color"
                type="color"
                value={adjustments.bgColor}
                onChange={(e) => {
                  const val = e.target.value;
                  onChangeAdjustments((prev) => ({ ...prev, bgColor: val }));
                }}
                className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
              />
              <span className="font-mono text-xs text-amber-400">{adjustments.bgColor}</span>
            </div>

            {/* Keying Sensitivity Sliders */}
            <div className="flex flex-col gap-3 pt-2 border-t border-slate-800">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">{t.background.tolerance}</span>
                  <span className="font-mono text-amber-400">{adjustments.bgTolerance}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={adjustments.bgTolerance}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    onChangeAdjustments((prev) => ({ ...prev, bgTolerance: val }));
                  }}
                  className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">{t.background.feather}</span>
                  <span className="font-mono text-amber-400">{adjustments.bgFeather}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={adjustments.bgFeather}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    onChangeAdjustments((prev) => ({ ...prev, bgFeather: val }));
                  }}
                  className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Formal Attire / Suit Overlay Studio Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Shirt className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white">{t.background.suitTitle}</h3>
        </div>

        <p className="text-xs text-slate-400">
          {language === 'hi'
            ? 'पासपोर्ट फोटो में फॉर्मल कोट, टाई या ब्लेज़र जोड़ने की लोकप्रिय सुविधा।'
            : 'Overlay official business attire, suit & tie or formal blazer over shoulders.'}
        </p>

        {/* Suit Options Grid */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() =>
              onChangeAdjustments((prev) => ({
                ...prev,
                suitOverlayId: null,
              }))
            }
            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 text-center transition-all ${
              adjustments.suitOverlayId === null
                ? 'border-amber-400 bg-amber-500/10 text-white'
                : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:text-white'
            }`}
          >
            <span className="text-xs font-semibold">{t.background.suitNone}</span>
          </button>

          {SUIT_PRESETS.map((suit) => (
            <button
              key={suit.id}
              type="button"
              onClick={() =>
                onChangeAdjustments((prev) => ({
                  ...prev,
                  suitOverlayId: suit.id,
                }))
              }
              className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                adjustments.suitOverlayId === suit.id
                  ? 'border-amber-400 bg-amber-500/10 text-white'
                  : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:text-white'
              }`}
            >
              <div
                className="w-10 h-7 rounded border border-slate-700 overflow-hidden bg-slate-950 flex items-center justify-center p-0.5"
                dangerouslySetInnerHTML={{ __html: suit.svgData }}
              />
              <span className="text-xs font-semibold text-center truncate w-full">
                {suit.name}
              </span>
            </button>
          ))}
        </div>

        {/* Suit position and scale adjusters if suit selected */}
        {adjustments.suitOverlayId && (
          <div className="flex flex-col gap-3 pt-3 border-t border-slate-800">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">{t.background.suitScale}</span>
                <span className="font-mono text-amber-400">
                  {Math.round(adjustments.suitScale * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.4"
                step="0.02"
                value={adjustments.suitScale}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onChangeAdjustments((prev) => ({ ...prev, suitScale: val }));
                }}
                className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">{t.background.suitOffset}</span>
                <span className="font-mono text-amber-400">{adjustments.suitOffsetY} px</span>
              </div>
              <input
                type="range"
                min="-60"
                max="60"
                step="2"
                value={adjustments.suitOffsetY}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  onChangeAdjustments((prev) => ({ ...prev, suitOffsetY: val }));
                }}
                className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
