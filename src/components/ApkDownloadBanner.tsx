import React, { useState, useEffect } from 'react';
import { Smartphone, Download, ShieldCheck, Check, X, ExternalLink, Sparkles, Layers, AlertCircle } from 'lucide-react';

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
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handlePwaInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback instruction for browsers without active prompt
      alert(
        isTe
          ? 'మీ బ్రౌజర్ మెనూ (పైన 3 చుక్కలు ⋮) నొక్కి "Install app" లేదా "Add to Home screen" ఎంచుకోండి.'
          : 'Tap browser menu (3 dots ⋮) and select "Install app" or "Add to Home screen".'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-emerald-700/60 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden font-telugu animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 border-b border-emerald-800/40 flex items-center justify-between text-emerald-200">
          <div className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base">
              {isTe ? 'ఆండ్రాయిడ్ యాప్ & APK డౌన్‌లోడ్' : 'Android App & APK Download'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs md:text-sm text-slate-200 max-h-[80vh] overflow-y-auto">
          {/* OPTION 1: 1-Click Native Phone App Install (PWA) - ZERO ERROR GUARANTEED */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-600/50 space-y-2.5">
            <div className="flex items-center space-x-2 text-amber-300 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isTe ? 'సిఫార్సు: హోమ్ స్క్రీన్‌పై 1-క్లిక్ ఇన్‌స్టాల్' : 'Recommended: 1-Click Phone Install'}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isTe
                ? 'ఏ విధమైన APK డౌన్‌లోడ్ లేదా "Parse Error" సమస్య లేకుండా, మీ ఫోన్ హోమ్ స్క్రీన్‌పై అధికారిక యాప్‌గా తక్షణమే ఇన్‌స్టాల్ అవుతుంది. ఇంటర్నెట్ లేకపోయినా 100% ఆఫ్‌లైన్‌లో పనిచేస్తుంది.'
                : 'Installs directly on your mobile home screen with 0 parse errors and no file extraction. 100% offline ready.'}
            </p>
            <button
              onClick={handlePwaInstall}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>
                {isInstalled
                  ? (isTe ? 'యాప్ ఇప్పటికే ఇన్‌స్టాల్ చేయబడింది ✓' : 'App Already Installed ✓')
                  : (isTe ? 'ఫోన్‌లో నేరుగా ఇన్‌స్టాల్ చేయండి' : 'Install Direct to Phone Home Screen')}
              </span>
            </button>
          </div>

          {/* OPTION 2: GITHUB ACTIONS REAL APK COMPILATION */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-700/60 space-y-3">
            <div className="flex items-center space-x-2 text-emerald-300 font-bold text-sm">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>{isTe ? 'నిజమైన ఆండ్రాయిడ్ APK ఫైల్ (GitHub)' : 'Official Android APK (GitHub)'}</span>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              {isTe
                ? 'GitHub Actions లో Gradle ద్వారా సంపూర్ణ ఆండ్రాయిడ్ APK (~15 MB) స్వయంచాలకంగా బిల్డ్ చేయబడుతుంది. క్రింది బటన్ ద్వారా నేరుగా Releases లేదా Actions Artifacts నుండి పొందవచ్చు.'
                : 'Built directly via GitHub Actions CI/CD using Android Gradle (~15 MB). Download the full package from GitHub Releases or Artifacts.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href="https://github.com/sajju8378/SHIVA-TELUGU-CALANDER/releases"
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-md transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isTe ? 'GitHub Releases నుండి APK డౌన్‌లోడ్' : 'Download APK from Releases'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://github.com/sajju8378/SHIVA-TELUGU-CALANDER/actions"
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-700/50 font-semibold text-xs transition-colors"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isTe ? 'GitHub Actions ఆర్టిఫాక్ట్' : 'Actions Artifacts'}</span>
              </a>
            </div>
          </div>

          {/* PARSE ERROR EXPLANATION & FIX */}
          <div className="space-y-1.5 text-xs text-amber-200/90 bg-amber-950/40 p-3 rounded-xl border border-amber-700/50">
            <div className="font-semibold text-amber-300 flex items-center space-x-1.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{isTe ? '"Parsing Error" ఎందుకు వచ్చింది?' : 'Why did "Parsing Error" happen?'}</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-300">
              {isTe
                ? 'మునుపటి డౌన్‌లోడ్ ఫైల్ కేవలం 1.7 KB మాత్రమే ఉన్నందున ఆండ్రాయిడ్ "Problem parsing package" చూపించింది. నిజమైన APK కనీసం 10-15 MB ఉంటుంది. అలాగే GitHub Actions ఆర్టిఫాక్ట్ .zip రూపంలో డౌన్‌లోడ్ అయితే, దానిని Extract చేసిన తర్వాత లోపలి .apk ఫైల్‌ను ఇన్‌స్టాల్ చేయాలి.'
                : 'The previous mock file was only 1.7 KB, causing Android to report "Problem parsing package". A genuine APK is ~15 MB. Also note: GitHub Actions artifact downloads are in .zip format; unzip on your phone to install the .apk.'}
            </p>
          </div>

          <div className="pt-1 flex justify-end">
            <button
              onClick={onClose}
              className="py-2 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              {isTe ? 'మూసివేయి' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
