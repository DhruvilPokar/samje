import React from 'react';
import {
  Sparkles,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SAMAJ_DETAILS } from '../data/kutchSamajData';

export const SamajDetailsSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-16 animate-in fade-in duration-300">
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950 via-stone-900 to-amber-950 text-white shadow-2xl border border-amber-500/30">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center p-6 sm:p-12 gap-8">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{t('કચ્છની પાવન ધરાથી કલોલ કર્મભૂમિ', 'Sacred Roots in Kutch • Thriving in Kalol')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-amber-100">
              {t(SAMAJ_DETAILS.nameGuj, SAMAJ_DETAILS.nameEng)}
            </h1>

            <p className="text-base sm:text-lg font-bold text-amber-300">
              {t(SAMAJ_DETAILS.taglineGuj, SAMAJ_DETAILS.taglineEng)}
            </p>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl font-normal">
              {t(SAMAJ_DETAILS.historyGuj, SAMAJ_DETAILS.historyEng)}
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold text-amber-200">
              <span className="flex items-center bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                🚩 {t(SAMAJ_DETAILS.kuldeviGuj, SAMAJ_DETAILS.kuldeviEng)}
              </span>
              <span className="flex items-center bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                📜 {SAMAJ_DETAILS.regNumber}
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-400/40 aspect-4/3 group">
              <img
                src="/kutch_heritage.jpg"
                alt="Kutch Kadva Patidar Heritage"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-center">
                <p className="text-xs font-bold text-amber-300">॥ જય માઁ ઉમિયા ॥</p>
                <p className="text-sm font-extrabold">{t('કચ્છ કડવા પાટીદાર પરંપરા & સંસ્કાર', 'Kutch Kadva Patidar Heritage')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="bg-black/40 border-t border-amber-500/20 py-4 px-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl sm:text-3xl font-black text-amber-400">{SAMAJ_DETAILS.familiesCount}</p>
            <p className="text-xs text-stone-300 font-medium">{t('નોંધાયેલા પરિવારો', 'Patidar Families')}</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-amber-400">{SAMAJ_DETAILS.villagesCount}</p>
            <p className="text-xs text-stone-300 font-medium">{t('મૂળ કચ્છના ગામો', 'Native Kutch Villages')}</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-amber-400">{SAMAJ_DETAILS.establishedYear}</p>
            <p className="text-xs text-stone-300 font-medium">{t('સ્થાપના વર્ષ', 'Established Year')}</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-amber-400">100%</p>
            <p className="text-xs text-stone-300 font-medium">{t('સંગઠન અને સેવા', 'Unity & Welfare')}</p>
          </div>
        </div>
      </section>

      {/* Core Values 4 Grid */}
      <section>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            {t('આપણા મુખ્ય સિદ્ધાંતો', 'Core Pillars & Values')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {t('સમાજના પાયાના મૂલ્યો અને સંકલ્પ', 'Fundamental Values of SKKKPS')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SAMAJ_DETAILS.coreValues.map((val, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-amber-200/80 shadow-xs hover:shadow-md transition-all flex items-start space-x-4"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-bold shrink-0">
                <CheckCircle2 className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  {t(val.titleGuj, val.titleEng)}
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed font-normal">
                  {t(val.descGuj, val.descEng)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Samaj Bhavan Facility Card */}
      <section className="bg-white rounded-3xl border border-amber-200 p-6 sm:p-10 shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 rounded-2xl overflow-hidden shadow-md">
            <img
              src="/bhavan.jpg"
              alt="Shree Kutch Kadva Patidar Bhavan"
              className="w-full h-full object-cover aspect-4/3"
            />
          </div>

          <div className="lg:col-span-6 space-y-4">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
              {t('સમુદાય કેન્દ્ર', 'Community Hub')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t('શ્રી કચ્છ કડવા પાટીદાર સમાજ ભવન, કલોલ', 'Shree Kutch Kadva Patidar Bhavan, Kalol')}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t(
                'કલોલ ખાતે બોરીસણા રોડ પર આવેલું આપણું સમાજ ભવન તમામ સામાજિક મેળાવડા, લગ્ન પ્રસંગો, સ્નેહમિલન અને વિદ્યાર્થી વાચનાલય માટે આધુનિક સુવિધાઓથી સજ્જ છે.',
                'Centrally located on Borisana Road in Kalol, our community Bhavan features central AC auditorium, spacious dining facility, guest rooms and student reading library.'
              )}
            </p>

            <div className="space-y-2 pt-2 text-xs sm:text-sm text-slate-700 font-medium">
              <p className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 text-amber-600 shrink-0 mt-0.5" />
                <span>{t(SAMAJ_DETAILS.addressGuj, SAMAJ_DETAILS.addressEng)}</span>
              </p>
              <p className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-emerald-600 shrink-0" />
                <span>{SAMAJ_DETAILS.phone}</span>
              </p>
              <p className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-blue-600 shrink-0" />
                <span>{SAMAJ_DETAILS.email}</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
