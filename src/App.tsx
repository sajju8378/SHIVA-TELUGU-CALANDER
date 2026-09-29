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
import { AllRemindersView } from './components/AllRemindersView';
import { SankashtaChaturthiSection } from './components/SankashtaChaturthiSection';
import { Sun, Smartphone, MapPin, ArrowRightLeft, Bell, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { loadAllReminders } from './engine/reminders';

export default function App() {
  // Navigation & Settings State - Pure Universal English Numbers (1, 2, 3... 31 & 2027)!
  const [currentYear, setCurrentYear] = useState<number>(2027);
  const [currentMonth, setCurrentMonth] = useState<number>(4); // Default to April 2027 (Ugadi month!)
  const [selectedDate, setSelectedDate] = useState<string>('2027-04-07'); // Default to Ugadi 2027!
  const [language, setLanguage] = useState<'te' | 'en'>('te');
  const [selectedCity, setSelectedCity] = useState<CityOption>(TELUGU_CITIES[0]); // Default Hyderabad
  const [activeTab, setActiveTab] = useState<'calendar' | 'day' | 'festivals' | 'muhurtam' | 'reminders' | 'docs'>('calendar');

  // Modals State
  const [isDayModalOpen, setIsDayModalOpen] = useState<boolean>(false);
  const [isCityModalOpen, setIsCityModalOpen] = useState<boolean>(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState<boolean>(false);
  const [isConverterOpen, setIsConverterOpen] = useState<boolean>(false);

  // Reminders count for quick badge
  const [remindersCount, setRemindersCount] = useState<number>(0);

  useEffect(() => {
    const list = loadAllReminders();
    setRemindersCount(list.length);
  }, [activeTab, isDayModalOpen]);

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
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                <Sun className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="font-bold text-amber-200 text-sm md:text-base">
                  {firstDay.samvatsaraTelugu} నామ సంవత్సరం • {firstDay.monthTelugu}
                </div>
                <div className="text-xs text-slate-400">
                  {firstDay.ayanaTelugu} · {firstDay.rituTelugu} · {firstDay.settings.monthSystem} పద్ధతి
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Reminders Button with count */}
              <button
                onClick={() => setActiveTab('reminders')}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold shadow-md transition-all cursor-pointer"
                title="Manage All Saved Reminders & Notes"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>{isTe ? 'నా రిమైండర్లు' : 'My Reminders'}</span>
                {remindersCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-950 text-amber-300 text-[10px] font-mono">
                    {remindersCount}
                  </span>
                )}
              </button>

              {/* Date Converter Tool Button */}
              <button
                onClick={() => setIsConverterOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-amber-800/50 hover:bg-slate-850 text-amber-300 transition-colors cursor-pointer"
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

        {/* TAB 1: MAIN SECTION - CALENDAR + SANKASHTA CHATURTHI DATES */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            {/* FEATURED: SANKASHTA CHATURTHI DATES SECTION RIGHT IN MAIN SECTION! */}
            <SankashtaChaturthiSection
              currentYear={currentYear}
              cityName={selectedCity.nameTelugu}
              onSelectDate={handleSelectDate}
              language={language}
            />

            {/* Standard Calendar Grid (English 1, 2, 3 Universal Digits) */}
            <CalendarGrid
              days={monthDays}
              currentYear={currentYear}
              currentMonth={currentMonth}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
              language={language}
            />
          </div>
        )}

        {activeTab === 'day' && (
          <div className="max-w-3xl mx-auto">
            <DayDetailModal
              day={selectedDayData}
              onClose={() => setActiveTab('calendar')}
              onPrevDay={handlePrevDay}
              onNextDay={handleNextDay}
              language={language}
              useTeluguNumerals={false}
            />
          </div>
        )}

        {activeTab === 'festivals' && (
          <FestivalList
            festivals={yearFestivals}
            currentYear={currentYear}
            onSelectDate={handleSelectDate}
            language={language}
            useTeluguNumerals={false}
          />
        )}

        {activeTab === 'muhurtam' && (
          <MuhurtamView
            day={selectedDayData}
            onSelectDate={setSelectedDate}
            language={language}
            useTeluguNumerals={false}
          />
        )}

        {/* DEDICATED REMINDERS SECTION */}
        {activeTab === 'reminders' && (
          <AllRemindersView
            onSelectDate={handleSelectDate}
            language={language}
          />
        )}

        {activeTab === 'docs' && <DocsView language={language} />}
      </main>

      {/* Floating Shortcut Button to Reminders */}
      <button
        onClick={() => setActiveTab('reminders')}
        className="fixed bottom-6 right-6 z-30 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center space-x-2 border-2 border-amber-300 transition-all transform hover:scale-105 cursor-pointer no-print"
        title="Open Reminders"
      >
        <Bell className="w-4 h-4 fill-slate-950" />
        <span className="font-telugu text-xs">{isTe ? 'రిమైండర్లు' : 'Reminders'}</span>
        {remindersCount > 0 && (
          <span className="w-5 h-5 rounded-full bg-red-700 text-white text-[11px] font-mono flex items-center justify-center font-bold">
            {remindersCount}
          </span>
        )}
      </button>

      {/* Printable Wall Calendar View (only shown when printing) */}
      <PrintCalendar
        days={monthDays}
        currentYear={currentYear}
        currentMonth={currentMonth}
        cityName={selectedCity.nameTelugu}
        useTeluguNumerals={false}
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
          useTeluguNumerals={false}
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
            <span className="font-semibold">తెలుగు పంచాంగం 2027</span>
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
              onClick={() => setActiveTab('reminders')}
              className="hover:text-amber-300 transition-colors flex items-center space-x-1"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{isTe ? 'రిమైండర్లు' : 'Reminders'}</span>
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('docs')}
              className="hover:text-amber-300 transition-colors"
            >
              {isTe ? 'పంచాంగ సూత్రాలు' : 'Calculation Rules'}
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
