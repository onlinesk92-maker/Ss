import React, { useRef, useEffect, useState } from 'react';
import {
  Download,
  Printer,
  Share2,
  X,
  FileImage,
  Sparkles,
  Check,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';
import { CountryPreset, SheetPreset, PhotoAdjustments, SheetSettings, Language } from '../types';
import { translations } from '../translations';
import { renderCompleteSheet, renderProcessedPhoto, downloadDataUrl } from '../utils/imageProcessing';

interface SheetPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceImg: HTMLImageElement | null;
  country: CountryPreset;
  sheet: SheetPreset;
  adjustments: PhotoAdjustments;
  settings: SheetSettings;
  language: Language;
}

export const SheetPreviewModal: React.FC<SheetPreviewModalProps> = ({
  isOpen,
  onClose,
  sourceImg,
  country,
  sheet,
  adjustments,
  settings,
  language,
}) => {
  const t = translations[language];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [renderedSheetCanvas, setRenderedSheetCanvas] = useState<HTMLCanvasElement | null>(null);
  const [isRendering, setIsRendering] = useState(true);
  const [previewZoom, setPreviewZoom] = useState(1);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [jpegTargetSize, setJpegTargetSize] = useState<'standard' | 'under100kb' | 'under50kb'>('standard');

  // Render sheet whenever modal opens or settings change
  useEffect(() => {
    if (!isOpen || !sourceImg) return;
    setIsRendering(true);

    const timer = setTimeout(() => {
      const sheetCanvas = renderCompleteSheet(sourceImg, country, sheet, adjustments, settings);
      setRenderedSheetCanvas(sheetCanvas);

      if (canvasRef.current) {
        const previewCanvas = canvasRef.current;
        previewCanvas.width = sheetCanvas.width;
        previewCanvas.height = sheetCanvas.height;
        const ctx = previewCanvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(sheetCanvas, 0, 0);
        }
      }
      setIsRendering(false);
    }, 50);

    return () => clearTimeout(timer);
  }, [isOpen, sourceImg, country, sheet, adjustments, settings]);

  if (!isOpen) return null;

  const handleDownloadPng = () => {
    if (!renderedSheetCanvas) return;
    const dataUrl = renderedSheetCanvas.toDataURL('image/png', 1.0);
    const filename = `SAIYAD_PHOTO_${sheet.id}_${settings.cols * settings.rows}photos_300dpi.png`;
    downloadDataUrl(dataUrl, filename);
    setDownloadSuccess('PNG Downloaded (True 300 DPI Lossless)');
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  const handleDownloadJpeg = () => {
    if (!renderedSheetCanvas) return;

    let quality = 0.95;
    if (jpegTargetSize === 'under100kb') quality = 0.65;
    if (jpegTargetSize === 'under50kb') quality = 0.45;

    const dataUrl = renderedSheetCanvas.toDataURL('image/jpeg', quality);
    const filename = `SAIYAD_PHOTO_${sheet.id}_300dpi.jpg`;
    downloadDataUrl(dataUrl, filename);
    setDownloadSuccess('JPEG Downloaded for print & upload');
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  const handleDownloadSingle = () => {
    if (!sourceImg) return;
    // Calculate 300 DPI single photo dimensions (e.g. 35mm -> 413px, 45mm -> 531px)
    const singleW = Math.round((country.widthMm / 25.4) * 300);
    const singleH = Math.round((country.heightMm / 25.4) * 300);

    const singleCanvas = renderProcessedPhoto(sourceImg, singleW, singleH, adjustments);
    const dataUrl = singleCanvas.toDataURL('image/png', 1.0);
    const filename = `SAIYAD_PHOTO_Single_${country.widthMm}x${country.heightMm}mm_300dpi.png`;
    downloadDataUrl(dataUrl, filename);
    setDownloadSuccess('Single Passport Photo Downloaded (300 DPI)');
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  const handleDirectPrint = () => {
    if (!renderedSheetCanvas) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }

    const dataUrl = renderedSheetCanvas.toDataURL('image/png', 1.0);
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Sheet - SAIYAD PHOTO STUDIO</title>
          <style>
            @page {
              size: ${sheet.widthInches}in ${sheet.heightInches}in;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #fff;
            }
            img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" onload="window.print();window.close();" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleShare = async () => {
    if (!renderedSheetCanvas || !navigator.share) return;
    try {
      renderedSheetCanvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'saiyad_passport_sheet.png', { type: 'image/png' });
        await navigator.share({
          title: 'SAIYAD PHOTO - 4x6 Passport Print Sheet',
          text: `4x6 Passport Photo Sheet with ${settings.cols * settings.rows} photos (300 DPI)`,
          files: [file],
        });
      }, 'image/png');
    } catch (err) {
      console.log('Share canceled or not supported:', err);
    }
  };

  const sheetPxW = Math.round(sheet.widthInches * sheet.dpi);
  const sheetPxH = Math.round(sheet.heightInches * sheet.dpi);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[96vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FileImage className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{sheet.name}</span>
                <span className="text-[11px] font-mono text-amber-400 font-normal">
                  ({sheetPxW} x {sheetPxH} px @ 300 DPI)
                </span>
              </h3>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span>{country.flag} {country.name.split('(')[0]}</span>
                <span aria-hidden="true">·</span>
                <span>{settings.cols * settings.rows} Photos</span>
                <span aria-hidden="true">·</span>
                <span>Cut: {settings.cutBorder}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom preview buttons */}
            <div className="hidden sm:flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/60">
              <button
                type="button"
                onClick={() => setPreviewZoom((z) => Math.max(0.5, z - 0.25))}
                className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono px-1.5 text-amber-400">
                {Math.round(previewZoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setPreviewZoom((z) => Math.min(2.5, z + 0.25))}
                className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success toast notification */}
        {downloadSuccess && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/40 px-4 py-2 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all">
            <Check className="w-4 h-4" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Scrollable Center Canvas View */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 bg-slate-950 flex items-center justify-center min-h-[320px]">
          {isRendering ? (
            <div className="flex flex-col items-center gap-3 text-slate-400">
              <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs">{t.export.generating}</span>
            </div>
          ) : (
            <div
              className="transition-transform duration-150 origin-center shadow-2xl rounded-sm border-4 border-slate-300 bg-white"
              style={{
                transform: `scale(${previewZoom})`,
                maxWidth: '100%',
              }}
            >
              <canvas
                ref={canvasRef}
                className="block max-w-full h-auto"
                style={{
                  maxHeight: '60vh',
                }}
              />
            </div>
          )}
        </div>

        {/* Footer Actions / Download Strip */}
        <div className="p-4 sm:p-5 bg-slate-950/90 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left info & JPEG quality */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="text-slate-300 font-semibold">{t.export.targetFileSize}:</span>
              <select
                value={jpegTargetSize}
                onChange={(e) => setJpegTargetSize(e.target.value as any)}
                className="bg-slate-800 text-white text-xs rounded-lg px-2 py-1 border border-slate-700 focus:outline-none"
              >
                <option value="standard">Max Print Quality (100%)</option>
                <option value="under100kb">Online Form (&lt; 100 KB)</option>
                <option value="under50kb">Govt Form (&lt; 50 KB)</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleDownloadSingle}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold underline decoration-amber-400/40"
            >
              {t.export.downloadSingle}
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap">
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                type="button"
                onClick={handleShare}
                className="h-10 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.export.shareSheet}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleDirectPrint}
              className="h-10 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span>{t.export.printSheet}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadJpeg}
              className="h-10 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <Download className="w-4 h-4 text-slate-300" />
              <span>JPG</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPng}
              className="h-10 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{language === 'hi' ? '300 DPI शीट डाउनलोड' : 'Download 4x6 PNG (300 DPI)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
