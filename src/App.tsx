import React, { useState, useEffect, useMemo } from 'react';
import { CityOption, FestivalItem, PanchangamDay } from './engine/types';
import { calculatePanchangamForDay, TELUGU_CITIES } from './engine/panchangam';
import { Header } from './components/Header';
import { CalendarGrid } from './components/CalendarGrid';
import { DayDetailModal } from './components/DayDetailModal';
import { FestivalList } from './components/FestivalList';
import { MuhurtamView } from './components/MuhurtamView';
import { LocationModal } from './components/LocationModal';
import { ApkDownloadBanner } from './components/ApkDownloadBanner';
import { DocsView } from './components/DocsView';
import { PrintCalendar } from './components/PrintCalendar';
import { DateConverterModal } from './components/DateConverterModal';
import { Sun, Sparkles, Smartphone, MapPin, ArrowRightLeft, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { toTeluguNumber } from './utils/teluguNumbers';

export default function App() {
  // Navigation & Settings State
  const [currentYear, setCurrentYear] = useState<number>(2027);
  const [currentMonth, setCurrentMonth] = useState<number>(4); // Default to April 2027 (Ugadi month!)
  const [selectedDate, setSelectedDate] = useState<string>('2027-04-07'); // Default to Ugadi 2027!
  const [language, setLanguage] = useState<'te' | 'en'>('te');
  const [useTeluguNumerals, setUseTeluguNumerals] = useState<boolean>(true);
  const [selectedCity, setSelectedCity] = useState<CityOption>(TELUGU_CITIES[0]); // Default Hyderabad
  const [activeTab, setActiveTab] = useState<'calendar' | 'day' | 'festivals' | 'muhurtam' | 'docs'>('calendar');

  // Modals State
  const [isDayModalOpen, setIsDayModalOpen] = useState<boolean>(false);
  const [isCityModalOpen, setIsCityModalOpen] = useState<boolean>(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState<boolean>(false);
  const [isConverterOpen, setIsConverterOpen] = useState<boolean>(false);

  // Month Days Data
  const monthDays = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const list: PanchangamDay[] = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
      list.push(
        calculatePanchangamForDay(
          dateStr,
          selectedCity.latitude,
          selectedCity.longitude,
          selectedCity.nameTelugu
        )
      );
    }
    return list;
  }, [currentYear, currentMonth, selectedCity]);

  // Selected Day Object
  const selectedDayData = useMemo(() => {
    return (
      monthDays.find((d) => d.date === selectedDate) ||
      calculatePanchangamForDay(
        selectedDate,
        selectedCity.latitude,
        selectedCity.longitude,
        selectedCity.nameTelugu
      )
    );
  }, [selectedDate, monthDays, selectedCity]);

  // Year Festivals Catalog
  const yearFestivals = useMemo(() => {
    const isLeap = (currentYear % 4 === 0 && currentYear % 100 !== 0) || currentYear % 400 === 0;
    const totalDays = isLeap ? 366 : 365;
    const startDate = new Date(currentYear, 0, 1);
    const map = new Map<string, FestivalItem>();

    for (let i = 0; i < totalDays; i++) {
      const cur = new Date(startDate.getTime() + i * 86400000);
      const y = cur.getFullYear();
      const m = cur.getMonth() + 1;
      const d = cur.getDate();
      const dateStr = `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;

      const p = calculatePanchangamForDay(
        dateStr,
        selectedCity.latitude,
        selectedCity.longitude,
        selectedCity.nameTelugu
      );

      if (p.festivals && p.festivals.length > 0) {
        for (const f of p.festivals) {
          map.set(`${f.id}-${dateStr}`, f);
        }
      }
    }
    return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
  }, [currentYear, selectedCity]);

  // Handlers
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleToday = () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth() + 1;
    const dStr = today.toISOString().split('T')[0];
    setCurrentYear(y);
    setCurrentMonth(m);
    setSelectedDate(dStr);
  };

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    const [yStr, mStr] = date.split('-');
    const y = parseInt(yStr, 10);
    const m = parseInt(mStr, 10);
    if (y !== currentYear) setCurrentYear(y);
    if (m !== currentMonth) setCurrentMonth(m);
    setIsDayModalOpen(true);
  };

  const handlePrevDay = () => {
    const cur = new Date(selectedDate);
    const prev = new Date(cur.getTime() - 86400000);
    const dStr = prev.toISOString().split('T')[0];
    setSelectedDate(dStr);
    const [yStr, mStr] = dStr.split('-');
    setCurrentYear(parseInt(yStr, 10));
    setCurrentMonth(parseInt(mStr, 10));
  };

  const handleNextDay = () => {
    const cur = new Date(selectedDate);
    const next = new Date(cur.getTime() + 86400000);
    const dStr = next.toISOString().split('T')[0];
    setSelectedDate(dStr);
    const [yStr, mStr] = dStr.split('-');
    setCurrentYear(parseInt(yStr, 10));
    setCurrentMonth(parseInt(mStr, 10));
  };

  const handlePrint = () => {
    window.print();
  };

  const isTe = language === 'te';

  // Quick stats for month
  const firstDay = monthDays.length > 0 ? monthDays[0] : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* App Header */}
      <Header
        currentYear={currentYear}
        currentMonth={currentMonth}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
        onYearChange={setCurrentYear}
        language={language}
        onToggleLanguage={() => setLanguage((l) => (l === 'te' ? 'en' : 'te'))}
        useTeluguNumerals={useTeluguNumerals}
        onToggleNumerals={() => setUseTeluguNumerals((v) => !v)}
        selectedCity={selectedCity}
        onOpenCityPicker={() => setIsCityModalOpen(true)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onPrint={handlePrint}
        onDownloadApk={() => setIsApkModalOpen(true)}
        samvatsaraDisplay={firstDay ? `${firstDay.samvatsaraTelugu} నామ సం॥` : undefined}
        teluguMonthDisplay={firstDay ? `${firstDay.monthTelugu} (${firstDay.ayanaTelugu})` : undefined}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 md:px-6 py-4 md:py-6 no-print space-y-6">
        {/* Quick Month Summary Card (Traditional Calendar Top Legend) */}
        {firstDay && (
          <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-amber-950/40 border border-amber-900/40 rounded-2xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-3 text-xs md:text-sm font-telugu">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                <Sun className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="font-bold text-amber-200">
                  {firstDay.samvatsaraTelugu} నామ సంవత్సరం • {firstDay.monthTelugu}
                </div>
                <div className="text-xs text-slate-400">
                  {firstDay.ayanaTelugu} · {firstDay.rituTelugu} · {firstDay.settings.monthSystem} పద్ధతి
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-amber-300/80">
              {/* Date Converter Tool Button */}
              <button
                onClick={() => setIsConverterOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-950/60 border border-amber-800/50 hover:bg-amber-900/60 text-amber-300 transition-colors"
                title="Convert English Date to Telugu Date"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400" />
                <span>{isTe ? 'తేదీ మార్పిడి / శోధన' : 'Date Converter'}</span>
              </button>

              {/* Location Picker */}
              <button
                onClick={() => setIsCityModalOpen(true)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-amber-900/40 hover:bg-slate-850 hover:border-amber-700/60 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{selectedCity.nameTelugu}</span>
              </button>

              {/* Direct APK Download Button */}
              <button
                onClick={() => setIsApkModalOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 hover:bg-emerald-900 transition-colors font-semibold"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isTe ? 'APK డౌన్‌లోడ్' : 'Download APK'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab Views */}
        {activeTab === 'calendar' && (
          <CalendarGrid
            days={monthDays}
            currentYear={currentYear}
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            language={language}
            useTeluguNumerals={useTeluguNumerals}
          />
        )}

        {activeTab === 'day' && (
          <div className="max-w-3xl mx-auto">
            <DayDetailModal
              day={selectedDayData}
              onClose={() => setActiveTab('calendar')}
              onPrevDay={handlePrevDay}
              onNextDay={handleNextDay}
              language={language}
              useTeluguNumerals={useTeluguNumerals}
            />
          </div>
        )}

        {activeTab === 'festivals' && (
          <FestivalList
            festivals={yearFestivals}
            currentYear={currentYear}
            onSelectDate={handleSelectDate}
            language={language}
            useTeluguNumerals={useTeluguNumerals}
          />
        )}

        {activeTab === 'muhurtam' && (
          <MuhurtamView
            day={selectedDayData}
            onSelectDate={setSelectedDate}
            language={language}
            useTeluguNumerals={useTeluguNumerals}
          />
        )}

        {activeTab === 'docs' && <DocsView language={language} />}
      </main>

      {/* Printable Wall Calendar View (only shown when printing) */}
      <PrintCalendar
        days={monthDays}
        currentYear={currentYear}
        currentMonth={currentMonth}
        cityName={selectedCity.nameTelugu}
        useTeluguNumerals={useTeluguNumerals}
        language={language}
      />

      {/* Day Detail Modal (when clicked from calendar view) */}
      {isDayModalOpen && (
        <DayDetailModal
          day={selectedDayData}
          onClose={() => setIsDayModalOpen(false)}
          onPrevDay={handlePrevDay}
          onNextDay={handleNextDay}
          language={language}
          useTeluguNumerals={useTeluguNumerals}
        />
      )}

      {/* Date Converter Modal */}
      <DateConverterModal
        isOpen={isConverterOpen}
        onClose={() => setIsConverterOpen(false)}
        onSelectDate={handleSelectDate}
        language={language}
      />

      {/* Location Picker Modal */}
      {isCityModalOpen && (
        <LocationModal
          selectedCity={selectedCity}
          onSelectCity={setSelectedCity}
          onClose={() => setIsCityModalOpen(false)}
          language={language}
        />
      )}

      {/* Android APK Download Modal */}
      <ApkDownloadBanner
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
        language={language}
      />

      {/* Footer */}
      <footer className="border-t border-amber-900/30 bg-slate-950 py-6 px-4 text-center text-xs text-slate-400 font-telugu no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-amber-300">
            <span>🕉️</span>
            <span className="font-semibold">తెలుగు పంచాంగం ౨౦౨౭ (2027)</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">అమాంత మానం · లహరి అయనాంశ</span>
          </div>

          <div className="flex items-center space-x-4 text-slate-400">
            <button
              onClick={() => setIsConverterOpen(true)}
              className="hover:text-amber-300 transition-colors flex items-center space-x-1"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>{isTe ? 'తేదీ మార్పిడి' : 'Date Converter'}</span>
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('docs')}
              className="hover:text-amber-300 transition-colors"
            >
              {isTe ? 'పంచాంగ గణన పద్ధతులు' : 'Calculation Conventions'}
            </button>
            <span>·</span>
            <button
              onClick={() => setIsApkModalOpen(true)}
              className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium flex items-center space-x-1"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{isTe ? 'ఆండ్రాయిడ్ APK' : 'Android APK'}</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
