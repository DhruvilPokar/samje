import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  MapPin,
  Ticket,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import { useSamajData } from '../context/SamajDataContext';
import type { CalendarEvent } from '../types';

export const EventCalendarSection: React.FC = () => {
  const { t } = useLanguage();
  const { events } = useSamajData();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'festival' | 'meeting' | 'education' | 'health' | 'sports'>('all');
  const [rsvpSuccessId, setRsvpSuccessId] = useState<string | null>(null);

  const filteredEvents = events.filter(
    (evt) => selectedCategory === 'all' || evt.category === selectedCategory
  );

  const handleRsvp = (evt: CalendarEvent) => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });

    setRsvpSuccessId(evt.id);
    setTimeout(() => {
      setRsvpSuccessId(null);
    }, 4000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          {t('આગામી તિથિ & કાર્યક્રમો', 'Event Calendar & Dates')}
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2">
          {t('શ્રી કલોલ કચ્છ કડવા પાટીદાર સમાજ ઇવેન્ટ કેલેન્ડર', 'SKKKPS Community Event Calendar')}
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          {t(
            'ગુજરાતી પંચાંગ તિથિ, સમય અને સ્થળ સાથે આગામી સામાજિક, ધાર્મિક અને યુવા કાર્યક્રમોની સંપૂર્ણ રૂપરેખા.',
            'Upcoming festivals, general meetings, education awards and youth championships with traditional Gujarati tithi.'
          )}
        </p>
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-amber-300 p-10 sm:p-14 text-center max-w-xl mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto mb-4">
            <CalendarDays className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            {t('આગામી કાર્યક્રમોનું કેલેન્ડર ટૂંક સમયમાં જાહેર કરવામાં આવશે', 'Upcoming Event Dates Will Be Announced Soon')}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            {t(
              'શ્રી કલોલ કચ્છ કડવા પાટીદાર સમાજના સ્નેહમિલન, સાધારણ સભા અને વાર્ષિક મહોત્સવની તારીખો અને કાર્યક્રમ વિગતો ટૂંક સમયમાં અહીં પ્રકાશિત થશે.',
              'Official dates, tithi, venues and schedule for upcoming community meetings, festivals and youth programs will be announced here.'
            )}
          </p>
        </div>
      ) : (
        <>
          {/* Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-200'
              }`}
            >
              {t('બધા કાર્યક્રમો (All)', 'All Events')}
            </button>
            <button
              onClick={() => setSelectedCategory('festival')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'festival'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-200'
              }`}
            >
              {t('ઉત્સવ & ગરબા (Festivals)', 'Festivals')}
            </button>
            <button
              onClick={() => setSelectedCategory('meeting')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'meeting'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-200'
              }`}
            >
              {t('સાધારણ સભા (AGM)', 'Meetings')}
            </button>
            <button
              onClick={() => setSelectedCategory('education')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'education'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-200'
              }`}
            >
              {t('સ્નેહમિલન & શિક્ષણ', 'Education & Awards')}
            </button>
            <button
              onClick={() => setSelectedCategory('health')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'health'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-200'
              }`}
            >
              {t('રક્તદાન & સેવા', 'Blood Donation')}
            </button>
            <button
              onClick={() => setSelectedCategory('sports')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'sports'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-200'
              }`}
            >
              {t('KPPL ક્રિકેટ', 'Sports League')}
            </button>
          </div>

          {/* Events Timeline / Cards */}
          <div className="space-y-4">
            {filteredEvents.map((evt) => {
              const isRsvpDone = rsvpSuccessId === evt.id;

              return (
                <div
                  key={evt.id}
                  className="bg-white rounded-3xl border border-amber-200/90 hover:border-amber-400 p-6 shadow-xs hover:shadow-md transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 group"
                >
                  {/* Left Date Badge Box */}
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col items-center justify-center text-center shrink-0">
                      <span className="text-[11px] font-bold text-amber-800 uppercase">
                        {evt.dayGuj}
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-slate-900 leading-none my-0.5">
                        {evt.date.split(' ')[0]}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold truncate max-w-[70px]">
                        {evt.date.split(' ')[1]}
                      </span>
                    </div>

                    {/* Event Info */}
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                          🕉️ {evt.tithiGuj}
                        </span>
                        <span className="text-xs text-slate-500 font-medium flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          {evt.time}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                        {t(evt.titleGuj, evt.titleEng)}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                        {t(evt.descriptionGuj, evt.descriptionEng)}
                      </p>

                      <p className="text-xs text-slate-500 mt-2 flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-amber-600 shrink-0" />
                        <span>{t(evt.venueGuj, evt.venueEng)}</span>
                      </p>
                    </div>
                  </div>

                  {/* Right Action Button */}
                  <div className="w-full lg:w-auto shrink-0 flex items-center justify-between lg:justify-end space-x-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="text-left lg:text-right text-xs text-slate-500">
                      <span className="block font-bold text-slate-700">
                        👥 {evt.rsvpCount} {t('નોંધાયેલા', 'Attending')}
                      </span>
                      <span className="text-[11px] text-emerald-600 font-semibold">
                        {t('પ્રવેશ વિનામૂલ્યે', 'Free Entry')}
                      </span>
                    </div>

                    <button
                      onClick={() => handleRsvp(evt)}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all active:scale-95 flex items-center space-x-1.5 cursor-pointer ${
                        isRsvpDone
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      {isRsvpDone ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>{t('હાજરી નોંધાઈ ગઈ!', 'RSVP Confirmed!')}</span>
                        </>
                      ) : (
                        <>
                          <Ticket className="w-4 h-4 text-amber-400" />
                          <span>{t('હાજરી નોંધાવો (RSVP)', 'Register Attendance')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
