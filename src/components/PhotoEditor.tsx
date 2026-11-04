import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  FlipHorizontal,
  Crosshair,
  Sliders,
  Sparkles,
  Calendar,
  User,
  Eye,
  RotateCcw,
} from 'lucide-react';
import { CountryPreset, PhotoAdjustments, Language } from '../types';
import { translations } from '../translations';
import { renderProcessedPhoto, drawBiometricGuides } from '../utils/imageProcessing';

interface PhotoEditorProps {
  sourceImg: HTMLImageElement | null;
  country: CountryPreset;
  adjustments: PhotoAdjustments;
  onChangeAdjustments: (fn: (prev: PhotoAdjustments) => PhotoAdjustments) => void;
  language: Language;
}

export const PhotoEditor: React.FC<PhotoEditorProps> = ({
  sourceImg,
  country,
  adjustments,
  onChangeAdjustments,
  language,
}) => {
  const t = translations[language];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeSubTab, setActiveSubTab] = useState<'fit' | 'filters' | 'examTag'>('fit');

  // Preview canvas dimensions calculated based on country aspect ratio
  const previewWidth = 360;
  const previewHeight = Math.round(previewWidth / (country.widthMm / country.heightMm));

  // Render on adjustments change
  useEffect(() => {
    if (!canvasRef.current || !sourceImg) return;
    const canvas = canvasRef.current;
    canvas.width = previewWidth;
    canvas.height = previewHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw the processed photo
    const processed = renderProcessedPhoto(sourceImg, previewWidth, previewHeight, adjustments);
    ctx.clearRect(0, 0, previewWidth, previewHeight);
    ctx.drawImage(processed, 0, 0);

    // Draw biometric guides if toggled
    if (adjustments.showGuides) {
      drawBiometricGuides(ctx, previewWidth, previewHeight);
    }
  }, [sourceImg, adjustments, country, previewWidth, previewHeight]);

  // Mouse & Touch pan handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - adjustments.panX, y: e.clientY - adjustments.panY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const newPanX = e.clientX - dragStart.x;
    const newPanY = e.clientY - dragStart.y;
    onChangeAdjustments((prev) => ({
      ...prev,
      panX: newPanX,
      panY: newPanY,
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - adjustments.panX,
        y: e.touches[0].clientY - adjustments.panY,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging || e.touches.length !== 1) return;
    const newPanX = e.touches[0].clientX - dragStart.x;
    const newPanY = e.touches[0].clientY - dragStart.y;
    onChangeAdjustments((prev) => ({
      ...prev,
      panX: newPanX,
      panY: newPanY,
    }));
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const centerPhoto = () => {
    onChangeAdjustments((prev) => ({
      ...prev,
      panX: 0,
      panY: 0,
      rotation: 0,
    }));
  };

  const applyAutoEnhance = () => {
    onChangeAdjustments((prev) => ({
      ...prev,
      brightness: 12,
      contrast: 15,
      saturation: 8,
      sharpness: 4,
    }));
  };

  const resetFilters = () => {
    onChangeAdjustments((prev) => ({
      ...prev,
      brightness: 0,
      contrast: 0,
      saturation: 0,
      sharpness: 0,
      grayscale: false,
    }));
  };

  const setTodayDate = () => {
    const today = new Date();
    const formatted = `${String(today.getDate()).padStart(2, '0')}/${String(
      today.getMonth() + 1
    ).padStart(2, '0')}/${today.getFullYear()}`;
    onChangeAdjustments((prev) => ({
      ...prev,
      photoDate: formatted,
    }));
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 items-start">
      {/* Visual Canvas Preview Box (Column 1) */}
      <div className="w-full lg:col-span-6 flex flex-col items-center">
        <div className="w-full bg-slate-950/70 rounded-2xl border border-slate-800 p-4 sm:p-6 flex flex-col items-center shadow-lg">
          {/* Passport standard header info */}
          <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-3">
            <span className="font-semibold text-slate-200">
              {country.flag} {country.name.split('(')[0]}
            </span>
            <span className="font-mono text-amber-400">
              {country.widthMm} x {country.heightMm} mm
            </span>
          </div>

          {/* Interactive Canvas */}
          <div className="relative group cursor-grab active:cursor-grabbing select-none rounded-xl overflow-hidden shadow-2xl border-2 border-slate-700 bg-white">
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="max-w-full h-auto block touch-none"
              style={{ maxHeight: '420px' }}
            />

            {/* Floating helper hint */}
            <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-sm text-slate-300 text-[10px] px-2 py-1 rounded pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity flex items-center gap-1">
              <Crosshair className="w-3 h-3 text-amber-400" />
              <span>{t.controls.panHelp}</span>
            </div>
          </div>

          {/* Quick canvas action buttons */}
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            <button
              type="button"
              onClick={() =>
                onChangeAdjustments((prev) => ({
                  ...prev,
                  showGuides: !prev.showGuides,
                }))
              }
              className={`h-9 px-3 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border ${
                adjustments.showGuides
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{t.controls.guidelines}</span>
            </button>

            <button
              type="button"
              onClick={() =>
                onChangeAdjustments((prev) => ({
                  ...prev,
                  flipHorizontal: !prev.flipHorizontal,
                }))
              }
              className="h-9 px-3 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <FlipHorizontal className="w-3.5 h-3.5" />
              <span>{t.controls.flipH}</span>
            </button>

            <button
              type="button"
              onClick={centerPhoto}
              className="h-9 px-3 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>{t.controls.resetPos}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor Controls Panel (Column 2) */}
      <div className="w-full lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col gap-5">
        {/* Sub-tab navigation */}
        <div className="flex items-center gap-1 p-1 bg-slate-950/80 rounded-xl border border-slate-800/80">
          <button
            type="button"
            onClick={() => setActiveSubTab('fit')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === 'fit'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.controls.zoom}
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('filters')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === 'filters'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'hi' ? 'रंग व चमक' : 'Lighting & Studio'}
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('examTag')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === 'examTag'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'hi' ? 'नाम व तारीख' : 'Name & Date Tag'}
          </button>
        </div>

        {/* Tab 1: Fit & Alignment (Zoom & Tilt) */}
        {activeSubTab === 'fit' && (
          <div className="flex flex-col gap-5">
            {/* Zoom Slider with direct quick step buttons */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="zoom-slider" className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <ZoomIn className="w-4 h-4 text-amber-400" />
                  <span>{t.controls.zoom}</span>
                </label>
                <span className="font-mono text-amber-400 text-xs">
                  {Math.round(adjustments.zoom * 100)}%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    onChangeAdjustments((prev) => ({
                      ...prev,
                      zoom: Math.max(0.5, prev.zoom - 0.1),
                    }))
                  }
                  className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center shrink-0"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <input
                  id="zoom-slider"
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.05"
                  value={adjustments.zoom}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    onChangeAdjustments((prev) => ({ ...prev, zoom: val }));
                  }}
                  className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() =>
                    onChangeAdjustments((prev) => ({
                      ...prev,
                      zoom: Math.min(3.0, prev.zoom + 0.1),
                    }))
                  }
                  className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center shrink-0"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Rotation / Tilt Slider */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="tilt-slider" className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <RotateCw className="w-4 h-4 text-amber-400" />
                  <span>{t.controls.rotation}</span>
                </label>
                <span className="font-mono text-amber-400 text-xs">{adjustments.rotation}°</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="tilt-slider"
                  type="range"
                  min="-30"
                  max="30"
                  step="1"
                  value={adjustments.rotation}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    onChangeAdjustments((prev) => ({ ...prev, rotation: val }));
                  }}
                  className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => onChangeAdjustments((prev) => ({ ...prev, rotation: 0 }))}
                  className="px-2 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded shrink-0"
                >
                  0°
                </button>
              </div>
            </div>

            {/* Passport compliance checklist tips */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
              <p className="font-semibold text-slate-300">
                {language === 'hi' ? 'पासपोर्ट फोटो गाइड:' : 'Biometric Placement Tip:'}
              </p>
              <p>
                {language === 'hi'
                  ? '• चेहरा अंडाकार गाइड में बीच में रखें और दोनों आंखें नीली लाइन पर सीधी रखें।'
                  : '• Align head inside oval; eyes on blue line and chin on red line.'}
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Lighting, Filters & Auto-Enhance */}
        {activeSubTab === 'filters' && (
          <div className="flex flex-col gap-4">
            {/* Quick Action One-tap presets */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={applyAutoEnhance}
                className="py-2.5 px-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.controls.autoEnhance}</span>
              </button>

              <button
                type="button"
                onClick={resetFilters}
                className="py-2.5 px-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.controls.resetAdjustments}</span>
              </button>
            </div>

            {/* Brightness */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">{t.controls.brightness}</span>
                <span className="font-mono text-amber-400">{adjustments.brightness}</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={adjustments.brightness}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  onChangeAdjustments((prev) => ({ ...prev, brightness: val }));
                }}
                className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Contrast */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">{t.controls.contrast}</span>
                <span className="font-mono text-amber-400">{adjustments.contrast}</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={adjustments.contrast}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  onChangeAdjustments((prev) => ({ ...prev, contrast: val }));
                }}
                className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Saturation */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">{t.controls.saturation}</span>
                <span className="font-mono text-amber-400">{adjustments.saturation}</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                disabled={adjustments.grayscale}
                value={adjustments.saturation}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  onChangeAdjustments((prev) => ({ ...prev, saturation: val }));
                }}
                className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer disabled:opacity-40"
              />
            </div>

            {/* Black & White toggle */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-200">{t.controls.grayscale}</span>
                <p className="text-[10px] text-slate-400">
                  {language === 'hi'
                    ? 'काले-सफेद फोटो वाले सरकारी फॉर्म हेतु'
                    : 'For official documents requiring B&W photos'}
                </p>
              </div>
              <input
                type="checkbox"
                checked={adjustments.grayscale}
                onChange={(e) =>
                  onChangeAdjustments((prev) => ({ ...prev, grayscale: e.target.checked }))
                }
                className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Official Candidate Name & Date Strip */}
        {activeSubTab === 'examTag' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <div>
                <h4 className="text-xs font-bold text-white">{t.controls.nameDateTitle}</h4>
                <p className="text-[11px] text-slate-400">{t.controls.nameDateHelp}</p>
              </div>
              <input
                type="checkbox"
                checked={adjustments.enableNameDate}
                onChange={(e) =>
                  onChangeAdjustments((prev) => ({ ...prev, enableNameDate: e.target.checked }))
                }
                className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
              />
            </div>

            {adjustments.enableNameDate && (
              <div className="flex flex-col gap-3 p-3 bg-slate-950/40 rounded-xl border border-slate-800/80">
                {/* Candidate Name Input */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="cand-name" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.controls.candidateName}</span>
                  </label>
                  <input
                    id="cand-name"
                    type="text"
                    placeholder="e.g. RAHUL SHARMA"
                    value={adjustments.candidateName}
                    onChange={(e) => {
                      const val = e.target.value;
                      onChangeAdjustments((prev) => ({ ...prev, candidateName: val }));
                    }}
                    className="h-10 px-3 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs uppercase placeholder:normal-case placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Date of Photo Input */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor="photo-date" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t.controls.photoDate}</span>
                    </label>
                    <button
                      type="button"
                      onClick={setTodayDate}
                      className="text-[10px] text-amber-400 hover:underline font-medium"
                    >
                      {language === 'hi' ? 'आज की तारीख' : 'Set Today'}
                    </button>
                  </div>
                  <input
                    id="photo-date"
                    type="text"
                    placeholder="DD/MM/YYYY"
                    value={adjustments.photoDate}
                    onChange={(e) => {
                      const val = e.target.value;
                      onChangeAdjustments((prev) => ({ ...prev, photoDate: val }));
                    }}
                    className="h-10 px-3 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
