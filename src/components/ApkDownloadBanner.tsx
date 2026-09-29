import React from 'react';
import { Smartphone, Download, CheckCircle, ShieldCheck, X } from 'lucide-react';

interface ApkDownloadBannerProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'te' | 'en';
}

export const ApkDownloadBanner: React.FC<ApkDownloadBannerProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  if (!isOpen) return null;
  const isTe = language === 'te';

  const handleDownload = () => {
    window.location.href = '/download/telugu-panchangam-2027.apk';
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-emerald-700/60 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden font-telugu animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 border-b border-emerald-800/40 flex items-center justify-between text-emerald-200">
          <div className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base">
              {isTe ? 'ఆండ్రాయిడ్ యాప్ (APK) డౌన్‌లోడ్' : 'Download Android App (APK)'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs md:text-sm text-slate-200">
          <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/50 flex items-start space-x-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-emerald-300 text-sm">
                Telugu Panchangam 2027 (.apk)
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {isTe
                  ? 'ఇంటర్నెట్ లేకపోయినా పనిచేసేలా 2027 పూర్తి పంచాంగ సమాచారంతో రూపొందించబడిన పూర్తి ఆఫ్‌లైన్ యాప్.'
                  : 'Standalone offline Android package pre-bundled with complete 2027 Panchangam calculations.'}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-amber-300 text-xs uppercase tracking-wider">
              {isTe ? 'ఇన్‌స్టాలేషన్ విధానం:' : 'Installation Steps:'}
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-300">
              <li>
                {isTe
                  ? 'క్రింద ఉన్న "APK డౌన్‌లోడ్ చేయండి" బటన్‌పై నొక్కండి.'
                  : 'Click the "Download APK File" button below.'}
              </li>
              <li>
                {isTe
                  ? 'డౌన్‌లోడ్ పూర్తయిన తర్వాత ఫైల్‌ను ఓపెన్ చేసి "Install" ఎంచుకోండి.'
                  : 'Open the downloaded file on your Android device and tap Install.'}
              </li>
              <li>
                {isTe
                  ? 'ఒకవేళ "Unknown Sources" ప్రాంప్ట్ వస్తే అనుమతించండి.'
                  : 'Allow installation from this source if prompted by Android.'}
              </li>
              <li>
                {isTe
                  ? 'ప్రత్యామ్నాయంగా, Chrome బ్రౌజర్‌లో "Add to Home Screen" ద్వారా కూడా యాప్‌గా ఇన్‌స్టాల్ చేసుకోవచ్చు!'
                  : 'Alternatively, install instantly via Chrome menu: "Add to Home screen / Install app"!'}
              </li>
            </ol>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isTe ? 'APK డౌన్‌లోడ్ చేయండి (.apk)' : 'Download APK File (.apk)'}</span>
            </button>
            <button
              onClick={onClose}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              {isTe ? 'మూసివేయి' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
