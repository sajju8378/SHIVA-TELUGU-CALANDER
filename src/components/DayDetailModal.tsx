import React from 'react';
import { PanchangamDay } from '../engine/types';
import {
  X,
  Sun,
  Sunset,
  Moon,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Share2,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { toTeluguNumber } from '../utils/teluguNumbers';

interface DayDetailModalProps {
  day: PanchangamDay;
  onClose: () => void;
  onPrevDay: () => void;
  onNextDay: () => void;
  language: 'te' | 'en';
  useTeluguNumerals: boolean;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  day,
  onClose,
  onPrevDay,
  onNextDay,
  language,
  useTeluguNumerals,
}) => {
  const isTe = language === 'te';

  // Format date display
  const dateParts = day.date.split('-');
  const y = parseInt(dateParts[0], 10);
  const m = parseInt(dateParts[1], 10);
  const d = parseInt(dateParts[2], 10);

  const displayDateStr = `${useTeluguNumerals ? toTeluguNumber(d) : d}-${useTeluguNumerals ? toTeluguNumber(m) : m}-${useTeluguNumerals ? toTeluguNumber(y) : y}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-amber-900/50 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="p-4 bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 border-b border-amber-900/40 flex items-center justify-between text-amber-200">
          <div className="flex items-center space-x-2">
            <button
              onClick={onPrevDay}
              className="p-1 rounded-lg hover:bg-amber-950/60 text-amber-300 transition-colors"
              title="Previous Day"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg md:text-xl font-bold font-serif-num text-slate-100">
                  {displayDateStr}
                </span>
                <span className="text-amber-400 font-telugu font-semibold">
                  ({isTe ? day.varaTelugu : day.varaEnglish})
                </span>
              </div>
              <p className="text-xs text-amber-300/80 font-telugu">{day.teluguDateDisplay}</p>
            </div>
            <button
              onClick={onNextDay}
              className="p-1 rounded-lg hover:bg-amber-950/60 text-amber-300 transition-colors"
              title="Next Day"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 md:p-6 space-y-6 overflow-y-auto font-telugu">
          {/* Festivals on this day banner */}
          {day.festivals && day.festivals.length > 0 && (
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/90 to-red-950/90 border border-amber-500/40 shadow-lg space-y-2">
              <div className="flex items-center space-x-2 text-amber-300 font-semibold text-sm">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{isTe ? 'నేటి పండుగలు & విశేషాలు' : 'Festivals & Special Observances'}</span>
              </div>
              <div className="space-y-2">
                {day.festivals.map((f) => (
                  <div key={f.id} className="border-t border-amber-900/40 pt-2 first:border-0 first:pt-0">
                    <div className="font-bold text-base text-amber-200">
                      {isTe ? f.nameTelugu : f.nameEnglish}
                    </div>
                    <div className="text-xs text-amber-300/80 mt-0.5">
                      <span className="font-medium text-amber-400">{isTe ? 'సూత్రం / నిర్ణయం:' : 'Rule:'} </span>
                      {isTe ? f.ruleDescriptionTelugu : f.ruleDescriptionEnglish}
                    </div>
                    {f.significanceTelugu && (
                      <div className="text-xs text-slate-300 mt-1">
                        {isTe ? f.significanceTelugu : f.significanceEnglish}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Good Time to Start / Shubha Samayam recommendation */}
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs md:text-sm space-y-1">
              <div className="font-bold text-emerald-300">
                {isTe ? 'శుభ సమయం / మంచి ముహూర్తం' : 'Good Time to Start Something (Shubha Samayam)'}
              </div>
              <div className="text-slate-200">
                {day.timings.abhijitMuhurtam ? (
                  <span>
                    {isTe ? 'అభిజిత్ ముహూర్తం:' : 'Abhijit Muhurtam:'}{' '}
                    <strong className="text-emerald-300">{day.timings.abhijitMuhurtam.formatted}</strong>
                  </span>
                ) : day.timings.amritaKalam ? (
                  <span>
                    {isTe ? 'అమృత ఘడియలు:' : 'Amrita Kalam:'}{' '}
                    <strong className="text-emerald-300">{day.timings.amritaKalam.formatted}</strong>
                  </span>
                ) : (
                  <span>{isTe ? 'సూర్యోదయ శుభ వేళలు' : 'Standard Daytime Auspicious Hours'}</span>
                )}
                {day.timings.brahmaMuhurtam && (
                  <span className="block text-slate-400 mt-0.5">
                    {isTe ? 'బ్రహ్మ ముహూర్తం (పూజకు శ్రేష్టం):' : 'Brahma Muhurtam (Best for Puja):'}{' '}
                    {day.timings.brahmaMuhurtam.formatted}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Pancha Angas (5 Limbs) Table Grid */}
          <div>
            <h3 className="text-sm font-bold text-amber-300 mb-3 flex items-center space-x-2">
              <span>🌟</span>
              <span>{isTe ? 'పంచాంగ విశేషాలు (పంచాంగాలు)' : 'Pancha Angas (Five Limbs)'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm">
              {/* Tithi Card */}
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                <div className="text-slate-400 text-xs">{isTe ? 'తిథి' : 'Tithi'}</div>
                <div className="font-bold text-amber-200 text-base">
                  {day.tithi.pakshaTelugu} {day.tithi.nameTelugu}
                </div>
                {day.tithi.endTime ? (
                  <div className="text-slate-300 text-xs">
                    {isTe ? 'ముగింపు సమయం:' : 'Ends at:'}{' '}
                    <span className="text-amber-400 font-medium">{day.tithi.endTime.formatted12}</span>
                  </div>
                ) : (
                  <div className="text-slate-400 text-xs">{isTe ? 'రోజంతా ఉంటుంది' : 'Full Day'}</div>
                )}
              </div>

              {/* Nakshatra Card */}
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                <div className="text-slate-400 text-xs">{isTe ? 'నక్షత్రం' : 'Nakshatra'}</div>
                <div className="font-bold text-amber-200 text-base">
                  {day.nakshatra.nameTelugu}{' '}
                  <span className="text-amber-400 text-xs font-normal">
                    ({isTe ? `${day.nakshatra.pada}వ పాదం` : `Pada ${day.nakshatra.pada}`})
                  </span>
                </div>
                {day.nakshatra.endTime ? (
                  <div className="text-slate-300 text-xs">
                    {isTe ? 'ముగింపు సమయం:' : 'Ends at:'}{' '}
                    <span className="text-amber-400 font-medium">{day.nakshatra.endTime.formatted12}</span>
                  </div>
                ) : (
                  <div className="text-slate-400 text-xs">{isTe ? 'రోజంతా ఉంటుంది' : 'Full Day'}</div>
                )}
              </div>

              {/* Yoga Card */}
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                <div className="text-slate-400 text-xs">{isTe ? 'యోగం' : 'Yoga'}</div>
                <div className="font-bold text-amber-200 text-base">{day.yoga.nameTelugu}</div>
                <div className="text-slate-400 text-xs">({day.yoga.nameEnglish})</div>
              </div>

              {/* Karana Card */}
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                <div className="text-slate-400 text-xs">{isTe ? 'కరణం' : 'Karana'}</div>
                <div className="font-bold text-amber-200 text-base">{day.karana.nameTelugu}</div>
                <div className="text-slate-400 text-xs">({day.karana.nameEnglish})</div>
              </div>
            </div>
          </div>

          {/* Sun & Moon Rasi / Astronomical Information */}
          <div>
            <h3 className="text-sm font-bold text-amber-300 mb-3 flex items-center space-x-2">
              <span>☀️</span>
              <span>{isTe ? 'సూర్య & చంద్ర సంచారం' : 'Solar & Lunar Positions'}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
                <div className="text-slate-400">{isTe ? 'సూర్యోదయం' : 'Sunrise'}</div>
                <div className="font-bold text-slate-100 mt-1 flex items-center space-x-1">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>{day.sunrise.formatted12}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
                <div className="text-slate-400">{isTe ? 'సూర్యాస్తమయం' : 'Sunset'}</div>
                <div className="font-bold text-slate-100 mt-1 flex items-center space-x-1">
                  <Sunset className="w-3.5 h-3.5 text-orange-400" />
                  <span>{day.sunset.formatted12}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
                <div className="text-slate-400">{isTe ? 'సూర్య రాశి' : 'Sun Sign'}</div>
                <div className="font-bold text-amber-200 mt-1">{day.sunSignTelugu}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
                <div className="text-slate-400">{isTe ? 'చంద్ర రాశి' : 'Moon Sign'}</div>
                <div className="font-bold text-amber-200 mt-1">{day.moonSignTelugu}</div>
              </div>
            </div>
          </div>

          {/* Muhurtam & Kalam Timings Breakdown */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-amber-300 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{isTe ? 'వర్జ్యం & రాహుకాలాలు (అశుభ / శుభ వేళలు)' : 'Auspicious & Inauspicious Timings'}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Inauspicious Card */}
              <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-900/30 space-y-2 text-xs">
                <div className="flex items-center space-x-1.5 text-red-400 font-bold">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{isTe ? 'అశుభ సమయాలు (వర్జ్యం చేయవలసినవి)' : 'Inauspicious Windows'}</span>
                </div>

                <div className="space-y-1.5 divide-y divide-red-950/50">
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-400">{isTe ? 'రాహుకాలం:' : 'Rahu Kalam:'}</span>
                    <span className="font-medium text-red-300">{day.timings.rahuKalam.formatted}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-400">{isTe ? 'యమగండం:' : 'Yamagandam:'}</span>
                    <span className="font-medium text-red-300">{day.timings.yamagandam.formatted}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-400">{isTe ? 'గుళికా కాలం:' : 'Gulika Kalam:'}</span>
                    <span className="font-medium text-slate-300">{day.timings.gulikaKalam.formatted}</span>
                  </div>
                  {day.timings.durmuhurtam.length > 0 && (
                    <div className="flex justify-between pt-1">
                      <span className="text-slate-400">{isTe ? 'దుర్ముహూర్తం:' : 'Durmuhurtam:'}</span>
                      <span className="font-medium text-red-300">
                        {day.timings.durmuhurtam.map((d) => d.formatted).join(', ')}
                      </span>
                    </div>
                  )}
                  {day.timings.varjyam.length > 0 && (
                    <div className="flex justify-between pt-1">
                      <span className="text-slate-400">{isTe ? 'వర్జ్యం:' : 'Varjyam:'}</span>
                      <span className="font-medium text-red-300">
                        {day.timings.varjyam.map((v) => v.formatted).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Auspicious Card */}
              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/30 space-y-2 text-xs">
                <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isTe ? 'శుభ సమయాలు' : 'Auspicious Windows'}</span>
                </div>

                <div className="space-y-1.5 divide-y divide-emerald-950/50">
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-400">{isTe ? 'అభిజిత్ ముహూర్తం:' : 'Abhijit Muhurtam:'}</span>
                    <span className="font-medium text-emerald-300">
                      {day.timings.abhijitMuhurtam ? day.timings.abhijitMuhurtam.formatted : (isTe ? 'బుధవారం వర్జ్యం' : 'Omitted on Wednesday')}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-400">{isTe ? 'అమృత కాలం:' : 'Amrita Kalam:'}</span>
                    <span className="font-medium text-emerald-300">
                      {day.timings.amritaKalam ? day.timings.amritaKalam.formatted : (isTe ? 'శుభ ఘడియలు' : 'Standard')}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-400">{isTe ? 'బ్రహ్మ ముహూర్తం:' : 'Brahma Muhurtam:'}</span>
                    <span className="font-medium text-emerald-300">{day.timings.brahmaMuhurtam.formatted}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location & Calculation Details Footer */}
          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
            <div>
              <span>{isTe ? 'ప్రాంతం:' : 'Location:'} </span>
              <strong className="text-slate-300">{day.location.cityName}</strong>
            </div>
            <div>
              <span>{isTe ? 'అయనాంశ:' : 'Ayanamsa:'} </span>
              <span className="text-slate-300">{day.settings.ayanamsa} ({day.settings.ayanamsaValueDeg}°)</span>
            </div>
            <div>
              <span>{isTe ? 'మాన పద్ధతి:' : 'System:'} </span>
              <span className="text-slate-300">{isTe ? 'అమాంత మానం (సూర్యోదయ వార గణన)' : 'Amanta (Sunrise Vara)'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
