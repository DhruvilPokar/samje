import React, { useState } from 'react';
import {
  ZoomIn,
  X,
  Camera,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSamajData } from '../context/SamajDataContext';
import type { EventPhoto } from '../types';

export const EventPhotosSection: React.FC = () => {
  const { t } = useLanguage();
  const { photos } = useSamajData();
  const [selectedCat, setSelectedCat] = useState<'all' | 'garba' | 'puja' | 'education'>('all');
  const [lightboxPhoto, setLightboxPhoto] = useState<EventPhoto | null>(null);

  const filteredPhotos = photos.filter(
    (photo) => selectedCat === 'all' || photo.category === selectedCat
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          {t('કાર્યક્રમો & ઉત્સવ યાદો', 'Community Photo Gallery')}
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2">
          {t('શ્રી કલોલ કચ્છ કડવા પાટીદાર સમાજ ઇવેન્ટ ફોટો ગેલેરી', 'Memorable Moments & Event Celebrations')}
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          {t(
            'નવરાત્રી ગરબા, સ્નેહમિલન, સરસ્વતી સન્માન અને ધાર્મિક ઉત્સવોની મનોહર ક્ષણો.',
            'Photographs capturing the joyous celebrations, youth achievements and cultural gatherings of SKKKPS.'
          )}
        </p>
      </div>

      {photos.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-amber-300 p-10 sm:p-14 text-center max-w-xl mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            {t('કાર્યક્રમ તસવીરો ટૂંક સમયમાં અપલોડ કરવામાં આવશે', 'Event Photos & Gallery Coming Soon')}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            {t(
              'શ્રી કલોલ કચ્છ કડવા પાટીદાર સમાજના ઉત્સવો, નવરાત્રી રાસ-ગરબા અને સ્નેહ સંમેલનની તસવીરો ટૂંક સમયમાં અહીં ઉપલબ્ધ થશે.',
              'High-definition photographs and galleries of upcoming community events and celebrations will be published here.'
            )}
          </p>
        </div>
      ) : (
        <>
          {/* Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setSelectedCat('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedCat === 'all'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-200'
              }`}
            >
              {t('તમામ તસવીરો (All)', 'All Photos')}
            </button>
            <button
              onClick={() => setSelectedCat('garba')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedCat === 'garba'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-200'
              }`}
            >
              {t('શરદ પૂનમ રાસ-ગરબા', 'Raas-Garba Night')}
            </button>
            <button
              onClick={() => setSelectedCat('education')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedCat === 'education'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-200'
              }`}
            >
              {t('સરસ્વતી સન્માન (Education)', 'Student Felicitation')}
            </button>
            <button
              onClick={() => setSelectedCat('puja')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedCat === 'puja'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-200'
              }`}
            >
              {t('ભવન પરિસર & પૂજન', 'Bhavan & Religious')}
            </button>
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setLightboxPhoto(photo)}
                className="group relative bg-white rounded-3xl overflow-hidden border border-amber-200 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
              >
                <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                  <img
                    src={photo.imageUrl}
                    alt={photo.titleEng}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-xs text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-5 h-5 text-amber-300" />
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[11px] font-mono text-amber-300 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
                      📅 {photo.date}
                    </span>
                    <h3 className="text-lg font-bold mt-1 text-amber-100">
                      {t(photo.titleGuj, photo.titleEng)}
                    </h3>
                  </div>
                </div>

                <div className="p-4 bg-white">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {t(photo.captionGuj, photo.captionEng)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Lightbox Zoom Modal */}
      {lightboxPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-amber-500/30 text-white">
            <button
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="aspect-16/9 w-full overflow-hidden bg-black flex items-center justify-center">
              <img
                src={lightboxPhoto.imageUrl}
                alt=""
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-6 bg-slate-950 border-t border-slate-800">
              <span className="text-xs font-mono text-amber-400">
                📅 {lightboxPhoto.date}
              </span>
              <h3 className="text-xl font-bold mt-1 text-white">
                {t(lightboxPhoto.titleGuj, lightboxPhoto.titleEng)}
              </h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                {t(lightboxPhoto.captionGuj, lightboxPhoto.captionEng)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
