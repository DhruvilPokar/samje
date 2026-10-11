import React from 'react';
import {
  X,
  Printer,
  QrCode,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Users,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface MemberProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MemberProfileModal: React.FC<MemberProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  if (!isOpen || !user) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-amber-300 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Bar */}
        <div className="bg-amber-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-amber-300">🚩</span>
            <span className="font-bold text-sm">
              {t('ડિજિટલ સમાજ સભ્ય ઓળખપત્ર', 'Digital Community Member ID Card')}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-amber-200 hover:text-white hover:bg-amber-700/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Card Container */}
        <div className="p-6 overflow-y-auto">
          {/* DIGITAL ID CARD CONTAINER */}
          <div className="relative bg-gradient-to-br from-amber-50 via-white to-amber-100/60 rounded-3xl border-2 border-amber-400 p-6 shadow-lg text-slate-800 print:m-0 print:border-amber-600">
            {/* Watermark Logo in background */}
            <div className="absolute right-6 bottom-6 opacity-5 pointer-events-none text-9xl font-serif font-black select-none">
              ક
            </div>

            {/* Card Header */}
            <div className="border-b-2 border-amber-300 pb-4 text-center">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-600 flex items-center justify-center text-white font-bold text-xl font-serif shadow-xs">
                  ક
                </div>
                <div className="text-left">
                  <h4 className="text-base sm:text-lg font-black text-amber-950 leading-tight">
                    {t('શ્રી કલોલ કચ્છ કડવા પાટીદાર સમાજ', 'Shree Kalol Kutch Kadva Patidar Samaj')}
                  </h4>
                  <p className="text-[11px] font-bold text-amber-800">
                    {t('નોંધણી નં. એ-૪૨૦ / ગાંધીનગર (સ્થાપના: ૧૯૮૧)', 'Reg. No. A-420 | Est. 1981')}
                  </p>
                </div>
              </div>
              <p className="text-[10px] text-amber-700 font-bold uppercase tracking-widest mt-2">
                ॥ ૐ શ્રી ઉમિયા માતાજી પ્રસન્ન ॥ જય સરદાર ॥
              </p>
            </div>

            {/* Card Body with Photo and Info */}
            <div className="py-5 flex flex-col sm:flex-row gap-5 items-center sm:items-start">
              {/* Member Photo & Member ID */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-24 h-28 rounded-2xl overflow-hidden border-2 border-amber-500 shadow-md bg-amber-100 flex items-center justify-center">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.nameEng}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-amber-800 font-serif">ક</span>
                  )}
                </div>
                <span className="mt-2 text-[11px] font-mono font-bold bg-amber-600 text-white px-2 py-0.5 rounded-md shadow-xs">
                  {user.memberId || 'KKP-101'}
                </span>
                <span className="mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  ✓ {t('પ્રમાણિત સભ્ય', 'Active Member')}
                </span>
              </div>

              {/* Member Details */}
              <div className="flex-1 space-y-2 text-xs">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                    {t(user.nameGuj, user.nameEng)}
                  </h3>
                  <p className="text-xs font-bold text-amber-800 flex items-center mt-0.5">
                    <MapPin className="w-3 h-3 mr-1 text-amber-600" />
                    <span>{t(`મૂળ ગામ: ${user.nativeKutchVillageGuj || 'કચ્છ'}`, `Native: ${user.nativeKutchVillageEng || 'Kutch'}`)}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-amber-200 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">{t('બ્લડ ગ્રૂપ:', 'Blood Group:')}</span>
                    <span className="font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded-md">
                      {user.bloodGroup || 'B +ve'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{t('પરિવાર સભ્યો:', 'Family Members:')}</span>
                    <span className="font-bold text-slate-800 flex items-center">
                      <Users className="w-3 h-3 mr-1 text-slate-400" />
                      {user.familyMembersCount || 4} {t('સભ્યો', 'Members')}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 pt-1 text-[11px] text-slate-600">
                  <p className="flex items-center">
                    <Phone className="w-3 h-3 mr-1.5 text-slate-400" />
                    <span>{user.phone}</span>
                  </p>
                  {user.email && (
                    <p className="flex items-center">
                      <Mail className="w-3 h-3 mr-1.5 text-slate-400" />
                      <span>{user.email}</span>
                    </p>
                  )}
                  {user.addressGuj && (
                    <p className="flex items-start text-[11px] leading-tight">
                      <MapPin className="w-3 h-3 mr-1.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{t(user.addressGuj, user.addressEng || '')}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Card Footer: QR Code & Verification */}
            <div className="border-t-2 border-amber-300 pt-3 flex items-center justify-between text-[10px] text-slate-500">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-white border border-amber-300 rounded-lg p-1 flex items-center justify-center">
                  <QrCode className="w-8 h-8 text-amber-900" />
                </div>
                <div>
                  <span className="block font-bold text-slate-800">
                    {t('ડિજિટલ સ્કેન ચકાસણી', 'Digital Verified')}
                  </span>
                  <span className="text-slate-400 font-mono text-[9px]">
                    SKKKPS-TRUST-2026
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center text-amber-800 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  {t('અધિકૃત ટ્રસ્ટી સંમતિ', 'Official Seal')}
                </span>
                <p className="text-[9px] text-slate-400">
                  કલોલ, ગાંધીનગર (ગુજરાત)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-600" />
            <span>{t('કાર્ડ પ્રિન્ટ કરો (Print)', 'Print ID Card')}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            {t('બંધ કરો', 'Close')}
          </button>
        </div>
      </div>
    </div>
  );
};
