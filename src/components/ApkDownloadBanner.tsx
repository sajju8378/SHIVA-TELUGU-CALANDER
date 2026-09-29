import React, { useState } from 'react';
import { Smartphone, Download, ShieldCheck, Check, X, AlertCircle } from 'lucide-react';

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
  const [downloadTriggered, setDownloadTriggered] = useState(false);

  const handleDownload = () => {
    setDownloadTriggered(true);

    // Try downloading the static asset with relative path
    const link = document.createElement('a');
    link.href = './downloads/telugu-panchangam-2027.apk';
    link.download = 'TeluguPanchangam2027.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setDownloadTriggered(false), 3000);
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
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-start space-x-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-emerald-300 text-sm">
                Telugu Panchangam 2027 (.apk)
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {isTe
                  ? 'పూర్తిగా ఆఫ్‌లైన్‌లో పనిచేసేలా రూపొందించబడిన స్వతంత్ర ఆండ్రాయిడ్ అప్లికేషన్ ప్యాకేజీ (APK). ఇంటర్నెట్ లేకపోయినా 2027 పంచాంగం లభిస్తుంది.'
                  : 'Standalone offline Android package pre-bundled with complete 2027 astronomical Panchangam calculations.'}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-amber-300 text-xs uppercase tracking-wider">
              {isTe ? 'ఇన్‌స్టాలేషన్ విధానం:' : 'Installation Instructions:'}
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-300">
              <li>
                {isTe
                  ? 'క్రింద ఉన్న "APK డౌన్‌లోడ్ చేయండి" బటన్‌పై నొక్కండి.'
                  : 'Click the "Download APK File" button below.'}
              </li>
              <li>
                {isTe
                  ? 'డౌన్‌లోడ్ పూర్తయిన తర్వాత మీ ఫోన్ Notifications లేదా Files లో ఫైల్‌ను ఓపెన్ చేయండి.'
                  : 'Open the downloaded file in your phone notifications or Files app.'}
              </li>
              <li>
                {isTe
                  ? 'ఒకవేళ "Install unknown apps" అనుమతి అడిగితే Enable చేయండి.'
                  : 'Enable "Install from this source / Unknown apps" permission if prompted.'}
              </li>
              <li>
                {isTe
                  ? 'వెంటనే మీ హోమ్ స్క్రీన్‌పై తెలుగు పంచాంగం 2027 యాప్ సిద్ధమవుతుంది!'
                  : 'The Telugu Panchangam 2027 app icon will appear on your home screen!'}
              </li>
            </ol>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
            >
              {downloadTriggered ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              <span>
                {downloadTriggered
                  ? (isTe ? 'డౌన్‌లోడ్ ప్రారంభమైంది...' : 'Download Started...')
                  : (isTe ? 'APK డౌన్‌లోడ్ చేయండి (.apk)' : 'Download APK File (.apk)')}
              </span>
            </button>
            <button
              onClick={onClose}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              {isTe ? 'మూసివేయి' : 'Close'}
            </button>
          </div>

          {/* Direct Link Fallback */}
          <div className="text-center pt-1 text-[11px] text-slate-400">
            {isTe ? 'డౌన్‌లోడ్ కాకపోతే:' : 'If direct download does not start:'}{' '}
            <a
              href="./downloads/telugu-panchangam-2027.apk"
              download="TeluguPanchangam2027.apk"
              className="text-amber-400 underline hover:text-amber-300 font-semibold"
            >
              {isTe ? 'ఇక్కడ నొక్కి నేరుగా సేవ్ చేయండి' : 'Click here to save directly'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
