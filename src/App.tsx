import React, { useState, useRef, useEffect } from 'react';
import { Download, Camera, Printer, Smartphone, RefreshCw, Sparkles, User, Calendar } from 'lucide-react';
import { ApkGuideModal } from './components/ApkGuideModal';
import { CameraCaptureModal } from './components/CameraCaptureModal';
import { usePWAInstall } from './usePWAInstall';
import { generateSamplePortraitDataUrl } from './constants/presets';

export default function App() {
  const [loadedImg, setLoadedImg] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState<number>(1.0);
  const [headOffsetY, setHeadOffsetY] = useState<number>(0.25); // Default 0.25 (keeps head up slightly)
  const [bgColor, setBgColor] = useState<string>('original'); // 'original', '#ffffff', '#c5d8ea'
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string>('');

  // Modals
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);

  // Optional Name & Date strip
  const [showNameDate, setShowNameDate] = useState(false);
  const [candidateName, setCandidateName] = useState('');
  const [photoDate, setPhotoDate] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { isInstallable, triggerInstall } = usePWAInstall();

  // Load image from URL / File
  const handleImageLoad = (src: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setLoadedImg(img);
      setIsGenerated(true);
      // Automatically render sheet right after image is loaded
      renderSheet(img, zoom, headOffsetY, bgColor, showNameDate, candidateName, photoDate);
    };
    img.src = src;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        handleImageLoad(event.target.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Re-render sheet function
  const renderSheet = (
    img = loadedImg,
    zoomFactor = zoom,
    headOffset = headOffsetY,
    bg = bgColor,
    enableName = showNameDate,
    name = candidateName,
    date = photoDate
  ) => {
    if (!img) return;

    // 4x6 inches Landscape @ 300 DPI (1800 x 1200 px)
    const sheetWidth = 1800;
    const sheetHeight = 1200;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = sheetWidth;
    canvas.height = sheetHeight;

    // Sheet Background (Pure White)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, sheetWidth, sheetHeight);

    // Passport photo frame size: 380px x 480px (Standard 3.5cm x 4.5cm ratio)
    const photoWidth = 380;
    const photoHeight = 480;
    const cols = 4;
    const rows = 2;

    // Margins for 4x6 sheet distribution
    const marginX = (sheetWidth - photoWidth * cols) / (cols + 1);
    const marginY = (sheetHeight - photoHeight * rows) / (rows + 1);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = marginX + c * (photoWidth + marginX);
        const y = marginY + r * (photoHeight + marginY);

        // Fill photo background if custom color
        if (bg !== 'original') {
          ctx.fillStyle = bg;
          ctx.fillRect(x, y, photoWidth, photoHeight);
        }

        // Crop & Scale Logic with Zoom control
        const baseScale = Math.max(photoWidth / img.width, photoHeight / img.height);
        const scale = baseScale * zoomFactor;
        const drawWidth = img.width * scale;
        const drawHeight = img.height * scale;

        // Centering photo inside photo frame
        const offsetX = x + (photoWidth - drawWidth) / 2;
        const offsetY = y + (photoHeight - drawHeight) * headOffset;

        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, photoWidth, photoHeight);
        ctx.clip();

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        // Name & Date Strip at bottom of each photo if enabled
        if (enableName && (name || date)) {
          const stripH = 58;
          const stripY = y + photoHeight - stripH;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x, stripY, photoWidth, stripH);
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, stripY, photoWidth, stripH);

          ctx.fillStyle = '#000000';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.font = 'bold 18px sans-serif';

          if (name && date) {
            ctx.fillText(name.toUpperCase(), x + photoWidth / 2, stripY + 20);
            ctx.font = 'bold 14px sans-serif';
            ctx.fillText(`DOB/DOP: ${date}`, x + photoWidth / 2, stripY + 42);
          } else if (name) {
            ctx.fillText(name.toUpperCase(), x + photoWidth / 2, stripY + stripH / 2);
          } else if (date) {
            ctx.fillText(`DATE: ${date}`, x + photoWidth / 2, stripY + stripH / 2);
          }
        }

        ctx.restore();

        // Cutting border around each photo (matching original HTML spec: #aaaaaa, width 3)
        ctx.strokeStyle = '#aaaaaa';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, photoWidth, photoHeight);
      }
    }

    // Generate high-resolution PNG data URL
    const url = canvas.toDataURL('image/png', 1.0);
    setDownloadUrl(url);
    setIsGenerated(true);
  };

  // Re-render when controls change
  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom);
    if (loadedImg) {
      renderSheet(loadedImg, newZoom, headOffsetY, bgColor, showNameDate, candidateName, photoDate);
    }
  };

  const handleHeadOffsetChange = (newOffset: number) => {
    setHeadOffsetY(newOffset);
    if (loadedImg) {
      renderSheet(loadedImg, zoom, newOffset, bgColor, showNameDate, candidateName, photoDate);
    }
  };

  const handleBgColorChange = (newBg: string) => {
    setBgColor(newBg);
    if (loadedImg) {
      renderSheet(loadedImg, zoom, headOffsetY, newBg, showNameDate, candidateName, photoDate);
    }
  };

  const handleGenerateClick = () => {
    if (!loadedImg) {
      alert('Pehle ek photo upload karein!');
      return;
    }
    renderSheet(loadedImg, zoom, headOffsetY, bgColor, showNameDate, candidateName, photoDate);
  };

  const handlePrint = () => {
    if (!downloadUrl) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>SAIYAD PHOTO - 4x6 Sheet Print</title>
          <style>
            @page { size: 6in 4in landscape; margin: 0; }
            body { margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; background: #fff; }
            img { width: 100%; height: 100%; object-fit: contain; }
          </style>
        </head>
        <body>
          <img src="${downloadUrl}" onload="window.print();window.close();" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-[#eef2f5] text-slate-800 font-sans flex flex-col items-center py-6 px-3 sm:px-6">
      {/* Top Mobile Bar with App Name & APK Button */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow">
            SP
          </div>
          <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
            SAIYAD <span className="text-emerald-600">PHOTO</span>
          </span>
        </div>

        {/* APK / Install App Button */}
        <button
          type="button"
          onClick={() => {
            if (isInstallable) {
              triggerInstall();
            } else {
              setIsApkModalOpen(true);
            }
          }}
          className="h-9 px-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95"
          title="Install SAIYAD PHOTO APK on your mobile"
        >
          <Smartphone className="w-4 h-4 text-amber-400" />
          <span>📱 Install App (APK)</span>
        </button>
      </div>

      {/* Main Container - Exactly matches user's HTML design */}
      <div className="w-full max-w-3xl bg-white p-5 sm:p-8 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.08)] border border-slate-200/80 text-center">
        {/* App Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-1">
          SAIYAD PHOTO (4x6 Landscape - 8 Photos)
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          High-Resolution 300 DPI Passport Photo Sheet (1800 × 1200 px)
        </p>

        {/* 1-Click Mobile App (APK) Banner */}
        <div className="mb-6 p-3.5 bg-emerald-50/90 border border-emerald-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📲</span>
            <div>
              <p className="font-bold text-xs text-emerald-950">
                Android फोन ऐप (APK) इनस्टॉल करें
              </p>
              <p className="text-[11px] text-emerald-800">
                सीधे अपने मोबाइल के ऐप ड्रॉअर और होम स्क्रीन पर जोड़ें
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (isInstallable) {
                triggerInstall();
              } else {
                setIsApkModalOpen(true);
              }
            }}
            className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow transition-all active:scale-95 whitespace-nowrap text-center"
          >
            {isInstallable ? 'अभी इनस्टॉल करें (Install APK)' : 'APK इनस्टॉल गाइड (Install Guide)'}
          </button>
        </div>

        {/* Controls Section */}
        <div className="flex flex-col items-center gap-3.5 max-w-xl mx-auto mb-6">
          {/* File Input & Camera Option */}
          <div className="flex items-center justify-center gap-2 flex-wrap w-full">
            <input
              ref={fileInputRef}
              type="file"
              id="imageInput"
              accept="image/*"
              onChange={handleFileChange}
              className="text-xs text-slate-600 file:mr-2 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
            />

            <button
              type="button"
              onClick={() => setIsCameraOpen(true)}
              className="py-1.5 px-3 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 border border-slate-300 transition-colors"
            >
              <Camera className="w-3.5 h-3.5 text-slate-600" />
              <span>Camera</span>
            </button>

            <button
              type="button"
              onClick={() => handleImageLoad(generateSamplePortraitDataUrl('male'))}
              className="py-1.5 px-3 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 border border-slate-300 transition-colors"
              title="Test immediately with a sample photo"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Sample Photo</span>
            </button>
          </div>

          {/* Slider Box (Zoom/Head Space) - Exactly matching HTML */}
          {loadedImg && (
            <div className="w-full flex flex-col gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="zoomRange" className="font-bold text-slate-700">
                  Adjust Photo Fit (Zoom/Head Space):
                </label>
                <span className="font-mono font-bold text-emerald-700">
                  {Math.round(zoom * 100)}%
                </span>
              </div>
              <input
                type="range"
                id="zoomRange"
                min="0.5"
                max="2.0"
                step="0.05"
                value={zoom}
                onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded cursor-pointer accent-emerald-600"
              />

              {/* Extra Fine Tuning: Head Height Offset */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                <span>Head Height (Up / Down):</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleHeadOffsetChange(Math.max(0.1, headOffsetY - 0.05))}
                    className="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-bold hover:bg-slate-100"
                  >
                    ↑ Up
                  </button>
                  <button
                    type="button"
                    onClick={() => handleHeadOffsetChange(Math.min(0.5, headOffsetY + 0.05))}
                    className="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-bold hover:bg-slate-100"
                  >
                    ↓ Down
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Optional Name & Date strip toggle */}
          {loadedImg && (
            <div className="w-full flex flex-col gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-left">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showNameDate}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setShowNameDate(checked);
                    if (loadedImg) {
                      renderSheet(loadedImg, zoom, headOffsetY, bgColor, checked, candidateName, photoDate);
                    }
                  }}
                  className="w-4 h-4 rounded text-emerald-600"
                />
                <span>Add Candidate Name & Date (NEET / SSC / Govt Exam)</span>
              </label>

              {showNameDate && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Candidate Name (e.g. AMIT SHARMA)"
                    value={candidateName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCandidateName(val);
                      if (loadedImg) {
                        renderSheet(loadedImg, zoom, headOffsetY, bgColor, showNameDate, val, photoDate);
                      }
                    }}
                    className="p-1.5 text-xs border border-slate-300 rounded uppercase bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Date (DD/MM/YYYY)"
                    value={photoDate}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPhotoDate(val);
                      if (loadedImg) {
                        renderSheet(loadedImg, zoom, headOffsetY, bgColor, showNameDate, candidateName, val);
                      }
                    }}
                    className="p-1.5 text-xs border border-slate-300 rounded bg-white"
                  />
                </div>
              )}
            </div>
          )}

          {/* Green Button: Generate 4x6 Sheet (Exact color #28a745) */}
          <button
            type="button"
            id="convertBtn"
            onClick={handleGenerateClick}
            className="w-full sm:w-auto px-6 py-3 bg-[#28a745] hover:bg-[#218838] text-white font-bold text-base rounded-md cursor-pointer transition-colors shadow-sm active:scale-95"
          >
            Generate 4x6 Sheet
          </button>
        </div>

        {/* Output Canvas - Exact layout from HTML */}
        <div className="w-full flex flex-col items-center justify-center my-4">
          <canvas
            ref={canvasRef}
            id="outputCanvas"
            className={`border-2 border-slate-300 bg-white max-w-full h-auto shadow-md ${
              isGenerated ? 'block' : 'hidden'
            }`}
          />
        </div>

        {/* Download & Print Buttons (Exact Blue Button #007bff from HTML) */}
        {isGenerated && downloadUrl && (
          <div className="flex items-center justify-center gap-3 flex-wrap mt-4 pt-4 border-t border-slate-200">
            <a
              id="downloadLink"
              href={downloadUrl}
              download="passport_4x6_studio.png"
              className="inline-block"
            >
              <button
                type="button"
                className="px-6 py-3 bg-[#007bff] hover:bg-[#0056b3] text-white font-bold text-base rounded-md cursor-pointer transition-colors shadow-sm flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                <span>Download High-Res Print Sheet</span>
              </button>
            </a>

            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold text-base rounded-md cursor-pointer transition-colors shadow-sm flex items-center gap-2"
            >
              <Printer className="w-5 h-5" />
              <span>Print (Ctrl+P)</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center text-xs text-slate-500 space-y-1">
        <p className="font-semibold text-slate-700">SAIYAD PHOTO STUDIO</p>
        <p>4x6 Landscape Sheet · 8 Photos · 300 DPI (1800 × 1200 px) · Ready for Print</p>
      </div>

      {/* APK Guide Modal */}
      <ApkGuideModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(dataUrl) => {
          handleImageLoad(dataUrl);
          setIsCameraOpen(false);
        }}
        language="hi"
      />
    </div>
  );
}
