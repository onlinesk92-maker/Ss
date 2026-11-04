import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Clock, Check, AlertCircle } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
  language: Language;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  language,
}) => {
  const t = translations[language];
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);

  // Initialize camera stream when modal opens
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedImage(null);
      setCameraError(null);
      return;
    }

    startCamera(cameraFacing);

    return () => {
      stopCamera();
    };
  }, [isOpen, cameraFacing]);

  const startCamera = async (facing: 'user' | 'environment') => {
    stopCamera();
    setCameraError(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError(t.camera.cameraError);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const switchCamera = () => {
    setCameraFacing((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const triggerCapture = () => {
    if (!videoRef.current) return;

    // Flash simulation
    setFlash(true);
    setTimeout(() => setFlash(false), 200);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 960;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Mirror user camera so it feels natural
    if (cameraFacing === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setCapturedImage(dataUrl);
    stopCamera();
  };

  const startCountdown = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          triggerCapture();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const retake = () => {
    setCapturedImage(null);
    startCamera(cameraFacing);
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="px-4 py-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white tracking-tight">{t.camera.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder area */}
        <div className="relative aspect-[3/4] bg-black flex items-center justify-center overflow-hidden">
          {flash && <div className="absolute inset-0 bg-white z-30 pointer-events-none animate-pulse" />}

          {countdown !== null && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none">
              <span className="text-7xl font-extrabold text-amber-400 drop-shadow-lg animate-ping">
                {countdown}
              </span>
            </div>
          )}

          {cameraError ? (
            <div className="p-6 text-center text-slate-300 max-w-xs">
              <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
              <p className="text-xs text-slate-300 mb-4">{cameraError}</p>
              <button
                type="button"
                onClick={() => startCamera(cameraFacing)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg"
              >
                Try Again
              </button>
            </div>
          ) : capturedImage ? (
            <img
              src={capturedImage}
              alt="Captured Portrait"
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                playsInline
                muted
                className={`w-full h-full object-cover ${cameraFacing === 'user' ? '-scale-x-100' : ''}`}
              />

              {/* Passport Biometric Oval Guide Overlay */}
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                {/* Oval shape */}
                <div className="w-[68%] h-[68%] rounded-[50%/60%] border-2 border-dashed border-amber-400/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)] relative flex items-center justify-center">
                  {/* Eye line */}
                  <div className="absolute top-[42%] left-0 right-0 border-t border-sky-400/70" />
                  <span className="absolute top-[36%] right-2 text-[9px] font-bold text-sky-400 uppercase tracking-wider">
                    Eye Level
                  </span>

                  {/* Chin line */}
                  <div className="absolute bottom-[16%] left-[20%] right-[20%] border-t border-rose-400/70" />
                  <span className="absolute bottom-[18%] text-[9px] font-bold text-rose-400 uppercase tracking-wider">
                    Chin
                  </span>
                </div>

                <div className="absolute bottom-3 text-center px-4 py-1.5 rounded-md bg-slate-950/80 backdrop-blur-sm text-[11px] text-amber-300 font-medium">
                  {t.camera.alignFace}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Controls footer */}
        <div className="p-4 bg-slate-950/90 border-t border-slate-800">
          {capturedImage ? (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={retake}
                className="h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{t.camera.retake}</span>
              </button>
              <button
                type="button"
                onClick={confirmPhoto}
                className="h-11 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-500/20"
              >
                <Check className="w-4 h-4" />
                <span>{t.camera.useThis}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={switchCamera}
                className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title={t.camera.switchCamera}
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={triggerCapture}
                className="h-13 px-8 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 active:scale-95 transition-all"
              >
                <div className="w-4 h-4 rounded-full bg-slate-950" />
                <span>{t.camera.takePhoto}</span>
              </button>

              <button
                type="button"
                onClick={startCountdown}
                className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 flex items-center justify-center transition-colors"
                title={t.camera.countdown}
              >
                <Clock className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
