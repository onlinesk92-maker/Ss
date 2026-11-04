import React from 'react';
import { Download, X, Smartphone, CheckCircle, ExternalLink, HelpCircle } from 'lucide-react';
import { usePWAInstall } from '../usePWAInstall';

interface ApkGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkGuideModal: React.FC<ApkGuideModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, triggerInstall, isAndroid } = usePWAInstall();

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base">SAIYAD PHOTO - Mobile App (APK)</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-sm text-slate-700 max-h-[80vh] overflow-y-auto">
          {isInstalled ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-semibold text-xs">
                SAIYAD PHOTO ऐप आपके फोन में पहले से इन्स्टॉल है!
              </span>
            </div>
          ) : isInstallable ? (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
              <p className="font-bold text-amber-900 text-xs">
                📲 1-क्लिक में अपने फ़ोन पर ऐप इनस्टॉल करें:
              </p>
              <button
                type="button"
                onClick={async () => {
                  await triggerInstall();
                  onClose();
                }}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>फोन में इनस्टॉल करें (Install APK / App)</span>
              </button>
            </div>
          ) : null}

          {/* Android step-by-step instructions */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <span>Android Phone में सीधे इनस्टॉल कैसे करें:</span>
            </h4>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  1
                </span>
                <span>अपने मोबाइल के <b>Chrome Browser</b> में यह लिंक खोलें।</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  2
                </span>
                <span>ऊपर दाएँ कोने में <b>3 डॉट्स (⋮)</b> पर क्लिक करें।</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  <b>"Install app"</b> या <b>"Add to Home screen"</b> (होम स्क्रीन में जोड़ें) पर दबाएं।
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  ✓
                </span>
                <span className="text-emerald-700 font-semibold">
                  आपके फ़ोन की स्क्रीन पर <b>SAIYAD PHOTO</b> का आइकन बन जाएगा और यह असली APK ऐप की तरह काम करेगा!
                </span>
              </div>
            </div>
          </div>

          {/* Standalone APK File Builder Option */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-900">Direct .APK File डाउनलोड करना:</span>
              <span className="text-[10px] text-blue-700 bg-blue-200/80 px-2 py-0.5 rounded font-mono font-bold">
                PWABuilder (Free)
              </span>
            </div>
            <p className="text-blue-800 text-[11px] leading-relaxed">
              अगर आपको अपने मोबाइल या दोस्तों को भेजने के लिए असली <b>.apk फाइल</b> चाहिए:
            </p>
            <ol className="list-decimal pl-4 space-y-1 text-[11px] text-blue-900">
              <li>नीचे दिया गया ऐप लिंक कॉपी करें।</li>
              <li><b>PWABuilder.com</b> पर जाएं और लिंक पेस्ट करके <b>"Generate APK"</b> पर क्लिक करें।</li>
              <li>आपको तुरंत डाउनलोड करने के लिए साइन्ड <b>.apk फाइल</b> मिल जाएगी!</li>
            </ol>
            <div className="pt-2 flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(currentUrl);
                  alert('App Link copied: ' + currentUrl);
                }}
                className="py-1.5 px-3 bg-white border border-blue-300 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold"
              >
                📋 कॉपी लिंक (Copy URL)
              </button>
              <a
                href={`https://www.pwabuilder.com?url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
              >
                <span>PWABuilder से APK बनाएं</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg"
          >
            बंद करें (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
