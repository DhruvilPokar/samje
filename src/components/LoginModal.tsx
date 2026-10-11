import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  UserPlus,
  ShieldCheck,
  Lock,
  Phone,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
  onSwitchToSignUp?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'member',
  onSwitchToSignUp,
}) => {
  const { t } = useLanguage();
  const { loginAsMember, loginAsAdmin } = useAuth();

  const [activeRole, setActiveRole] = useState<UserRole>(defaultRole);
  const [memberInput, setMemberInput] = useState('');
  const [memberPass, setMemberPass] = useState('');
  const [adminUser, setAdminUser] = useState('admin');
  const [adminPass, setAdminPass] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveRole(defaultRole);
      if (defaultRole === 'admin') {
        setAdminUser('admin');
        setAdminPass('admin123');
      }
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen, defaultRole]);

  if (!isOpen) return null;

  const triggerSuccessCelebration = (role: UserRole) => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    setSuccessMessage(
      role === 'admin'
        ? t('એડમિન લોગિન સફળ થયું!', 'Admin Login Successful!')
        : t('સભ્ય લોગિન સફળ થયું! સ્વાગત છે.', 'Member Login Successful! Welcome.')
    );
    setTimeout(() => {
      setSuccessMessage(null);
      setErrorMessage(null);
      onClose();
    }, 1200);
  };

  const handleMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const result = loginAsMember(memberInput, memberPass);
    if (result.success) {
      triggerSuccessCelebration('member');
    } else {
      setErrorMessage(result.error || 'Login failed');
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const result = loginAsAdmin(adminUser, adminPass);
    if (result.success) {
      triggerSuccessCelebration('admin');
    } else {
      setErrorMessage(result.error || 'Login failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-amber-300/80 overflow-hidden">
        {/* Decorative Top Accent Bar */}
        <div className="h-2 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700" />

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 sm:p-7 pb-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <span className="font-serif font-black text-2xl">ક</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t('શ્રી કલોલ કચ્છ કડવા પાટીદાર સમાજ', 'Shree Kalol Kutch Kadva Patidar Samaj')}
          </h3>
          <p className="text-xs text-amber-800 font-semibold mt-1">
            {t('સભ્ય & વહીવટી લોગિન પોર્ટલ', 'Member & Admin Access Portal')}
          </p>

          {/* Role Selection Switch Tabs */}
          <div className="mt-5 grid grid-cols-2 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setActiveRole('member');
                setErrorMessage(null);
              }}
              className={`py-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                activeRole === 'member'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{t('સભ્ય લોગિન (Member)', 'Member Login')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveRole('admin');
                setErrorMessage(null);
              }}
              className={`py-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                activeRole === 'admin'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('એડમિન (Admin)', 'Admin Login')}</span>
            </button>
          </div>
        </div>

        {/* Form Content Area */}
        <div className="px-6 sm:px-7 pb-6 sm:pb-7">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold">{successMessage}</span>
            </div>
          )}

          {/* MEMBER FORM */}
          {activeRole === 'member' ? (
            <form onSubmit={handleMemberSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t('સભ્ય નંબર અથવા મોબાઈલ નંબર', 'Member ID or Mobile Number')}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={memberInput}
                    onChange={(e) => setMemberInput(e.target.value)}
                    placeholder="98251 44556 / KKP-KALOL-101"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:border-amber-500 focus:bg-white focus:outline-hidden transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t('પાસવર્ડ (વૈકલ્પિક ડેમો માટે)', 'Password (Optional for demo)')}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={memberPass}
                    onChange={(e) => setMemberPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:border-amber-500 focus:bg-white focus:outline-hidden transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>{t('સભ્ય તરીકે પ્રવેશ કરો', 'Sign In as Member')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Link to Sign Up */}
              {onSwitchToSignUp && (
                <div className="pt-3 border-t border-slate-100 text-center">
                  <p className="text-xs text-slate-500 mb-1.5">
                    {t('નવા સભ્ય છો? હજુ સુધી નોંધણી નથી કરાવી?', 'New member? Not registered yet?')}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onSwitchToSignUp();
                    }}
                    className="w-full py-2.5 px-3 rounded-xl border border-amber-300 bg-amber-50/70 hover:bg-amber-100 text-amber-900 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-amber-700" />
                    <span>{t('નવી સભ્ય નોંધણી (Sign Up / Register)', 'Register as New Member (Sign Up)')}</span>
                  </button>
                </div>
              )}
            </form>
          ) : (
            /* ADMIN FORM */
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t('એડમિન યુઝરનેમ અથવા ઈમેલ', 'Admin Username or Email')}
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={adminUser}
                    onChange={(e) => setAdminUser(e.target.value)}
                    placeholder="admin"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:border-amber-500 focus:bg-white focus:outline-hidden transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t('એડમિન સિક્યોરિટી પાસવર્ડ', 'Admin Security Password')}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    placeholder="admin123"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:border-amber-500 focus:bg-white focus:outline-hidden transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>{t('એડમિન પેનલમાં પ્રવેશ કરો', 'Sign In as Admin')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
