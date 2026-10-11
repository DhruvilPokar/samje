import React, { useState } from 'react';
import {
  Search,
  Phone,
  MapPin,
  Briefcase,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSamajData } from '../context/SamajDataContext';
import type { SamajPerson } from '../types';

export const SamajPersonsSection: React.FC = () => {
  const { t } = useLanguage();
  const { persons } = useSamajData();
  const [selectedCat, setSelectedCat] = useState<'all' | 'office_bearer' | 'wing_leader' | 'advisory'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPersons = persons.filter((p) => {
    const matchCat = selectedCat === 'all' || p.category === selectedCat;
    const matchSearch =
      searchQuery === '' ||
      p.nameGuj.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameEng.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nativeKutchVillageGuj.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nativeKutchVillageEng.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.occupationEng.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.designationEng.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          {t('સમાજના હોદ્દેદારો & કારોબારી સમિતિ', 'Office Bearers & Managing Committee')}
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2">
          {t('શ્રી કલોલ કચ્છ કડવા પાટીદાર સમાજના આગેવાનો', 'Prominent Persons & Leaders of SKKKPS')}
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          {t(
            'સમાજ સેવા, પારદર્શક વહીવટ અને ભાઈચારા માટે સમર્પિત હોદ્દેદારો, મહિલા અને યુવક મંડળના પ્રતિનિધિઓ.',
            'Dedicated trustees, executive committee members, women and youth wing leaders steering the community.'
          )}
        </p>
      </div>

      {persons.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-amber-300 p-10 sm:p-14 text-center max-w-xl mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto mb-4 font-bold text-2xl font-serif">
            ક
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            {t('કારોબારી સમિતિના સભ્યોની વિગત ટૂંક સમયમાં ઉમેરવામાં આવશે', 'Office Bearers & Managing Committee Directory Coming Soon')}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            {t(
              'શ્રી કલોલ કચ્છ કડવા પાટીદાર સમાજના હોદ્દેદારો અને કારોબારી સભ્યોની અધિકૃત યાદી ટૂંક સમયમાં અહીં પ્રસિદ્ધ થશે.',
              'The official directory of trustees and managing committee members will be updated soon.'
            )}
          </p>
        </div>
      ) : (
        <>
          {/* Filter and Search Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Buttons */}
            <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
              <button
                onClick={() => setSelectedCat('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCat === 'all'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t('બધા આગેવાનો (All)', 'All Persons')}
              </button>
              <button
                onClick={() => setSelectedCat('office_bearer')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCat === 'office_bearer'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                {t('મુખ્ય હોદ્દેદારો (Executive)', 'Office Bearers')}
              </button>
              <button
                onClick={() => setSelectedCat('wing_leader')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCat === 'wing_leader'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                }`}
              >
                {t('મહિલા & યુવક મંડળ', 'Women & Youth Wings')}
              </button>
              <button
                onClick={() => setSelectedCat('advisory')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCat === 'advisory'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
                }`}
              >
                {t('સલાહકાર ટ્રસ્ટીઓ', 'Advisory Board')}
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('નામ, મૂળ કચ્છનું ગામ કે હોદ્દો...', 'Search name, native village, role...')}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:border-amber-500 focus:outline-hidden"
              />
            </div>
          </div>

          {filteredPersons.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-amber-300 p-8 text-center max-w-md mx-auto shadow-xs">
              <p className="text-sm font-semibold text-slate-700">
                {t('કોઈ પરિણામ મળ્યું નથી', 'No persons match the criteria')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPersons.map((person) => (
                <div
                  key={person.id}
                  className="bg-white rounded-2xl border border-amber-200/90 hover:border-amber-400 p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="relative">
                        <img
                          src={person.photoUrl}
                          alt={person.nameEng}
                          className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-200 group-hover:border-amber-500 transition-colors shadow-xs"
                        />
                        {person.badge && (
                          <span className="absolute -bottom-2 -right-1 px-1.5 py-0.5 rounded-md bg-amber-600 text-white text-[9px] font-bold">
                            {person.badge}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors truncate">
                          {t(person.nameGuj, person.nameEng)}
                        </h3>
                        <p className="text-xs font-bold text-amber-700 mt-0.5">
                          {t(person.designationGuj, person.designationEng)}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-medium">
                          📍 {person.nativeKutchVillageGuj}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                      <p className="flex items-center">
                        <Briefcase className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                        <span className="truncate">{t(person.occupationGuj, person.occupationEng)}</span>
                      </p>
                      <p className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                        <span className="truncate">{person.currentAddress}</span>
                      </p>
                      <p className="flex items-center justify-between text-[11px] pt-1">
                        <span className="text-slate-400">બ્લડ ગ્રૂપ:</span>
                        <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                          {person.bloodGroup}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {person.term || 'કલોલ ટ્રસ્ટ'}
                    </span>

                    <a
                      href={`tel:${person.phone.replace(/\s+/g, '')}`}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 transition-colors"
                    >
                      <Phone className="w-3 h-3 text-amber-600" />
                      <span>{person.phone}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

