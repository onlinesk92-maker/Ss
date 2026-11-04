import React from 'react';
import { X, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface HelpGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const HelpGuideModal: React.FC<HelpGuideModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const t = translations[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="px-5 py-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">{t.guide.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-300">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-[11px] leading-relaxed">
            {language === 'hi'
              ? 'SAIYAD Photo स्टूडियो अंतरराष्ट्रीय ICAO और भारत सरकार के पासपोर्ट, वीज़ा और सरकारी परीक्षाओं के नियमों का पूरी तरह पालन करता है।'
              : 'SAIYAD Photo Studio complies with ICAO Doc 9303, Passport Seva India, and US State Dept biometric standards.'}
          </div>

          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-100 flex items-center gap-1.5 text-xs">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>{language === 'hi' ? 'ज़रूरी नियम (Do\'s)' : 'Mandatory Guidelines'}</span>
            </h4>
            <ul className="space-y-2 pl-2">
              <li className="flex items-start gap-2 text-slate-300">
                <span className="text-emerald-400">✓</span>
                <span>{t.guide.rule1}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <span className="text-emerald-400">✓</span>
                <span>{t.guide.rule2}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <span className="text-emerald-400">✓</span>
                <span>{t.guide.rule3}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <span className="text-emerald-400">✓</span>
                <span>{t.guide.rule4}</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2.5 pt-3 border-t border-slate-800">
            <h4 className="font-bold text-slate-100 flex items-center gap-1.5 text-xs">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>{language === 'hi' ? 'क्या न करें (Don\'ts)' : 'Avoid These Mistakes'}</span>
            </h4>
            <ul className="space-y-1.5 pl-2 text-slate-400">
              <li>• {language === 'hi' ? 'काले चश्मे या रंगीन लेंस न पहनें।' : 'No dark sunglasses, tinted lenses, or eye glare.'}</li>
              <li>• {language === 'hi' ? 'सिर को झुकाएं नहीं, सीधा सामने देखें।' : 'Do not tilt head up, down or sideways.'}</li>
              <li>• {language === 'hi' ? 'चेहरे पर बाल न आने दें, माथा व कान खुले रखें।' : 'Keep hair away from face, eyes, and eyebrows.'}</li>
              <li>• {language === 'hi' ? 'मुस्कुराएं नहीं, मुंह बंद और सामान्य रखें।' : 'Neutral expression with closed mouth (no smiling or frowning).'}</li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            {language === 'hi' ? 'समझ गया' : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  );
};
