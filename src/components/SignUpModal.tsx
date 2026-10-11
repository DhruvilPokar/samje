import React, { useState } from 'react';
import {
  X,
  UserPlus,
  Phone,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  Briefcase,
  Droplet,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  CreditCard,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useSamajData } from '../context/SamajDataContext';
import { getSupabaseClient, getSupabaseConfig } from '../lib/supabase';
import type { AuthUser, SamajMember } from '../types';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onOpenProfile?: () => void;
}

const KUTCH_VILLAGES_LIST = [
  { guj: 'માધાપર (કચ્છ)', eng: 'Madhapar (Kutch)' },
  { guj: 'ભુજ (કચ્છ)', eng: 'Bhuj (Kutch)' },
  { guj: 'સુખપર (કચ્છ)', eng: 'Sukhpar (Kutch)' },
  { guj: 'માનકૂવા (કચ્છ)', eng: 'Mankuwa (Kutch)' },
  { guj: 'મિર્ઝાપર (કચ્છ)', eng: 'Mirzapar (Kutch)' },
  { guj: 'દહીસરા (કચ્છ)', eng: 'Dahisara (Kutch)' },
  { guj: 'માંડવી (કચ્છ)', eng: 'Mandvi (Kutch)' },
  { guj: 'નખત્રાણા (કચ્છ)', eng: 'Nakhatrana (Kutch)' },
  { guj: 'કેરા (કચ્છ)', eng: 'Kera (Kutch)' },
  { guj: 'બળદિયા (કચ્છ)', eng: 'Baladia (Kutch)' },
  { guj: 'કોડકી (કચ્છ)', eng: 'Kodki (Kutch)' },
  { guj: 'દેશલપર (કચ્છ)', eng: 'Deshalpar (Kutch)' },
  { guj: 'ગજોડ (કચ્છ)', eng: 'Gajod (Kutch)' },
  { guj: 'અંજાર (કચ્છ)', eng: 'Anjar (Kutch)' },
  { guj: 'મુન્દ્રા (કચ્છ)', eng: 'Mundra (Kutch)' },
  { guj: 'રાપર / વાગડ (કચ્છ)', eng: 'Rapar / Vagad (Kutch)' },
  { guj: 'અન્ય ગામ (કચ્છ)', eng: 'Other Village (Kutch)' },
];

const BLOOD_GROUPS = ['A +ve', 'B +ve', 'O +ve', 'AB +ve', 'A -ve', 'B -ve', 'O -ve', 'AB -ve'];

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
];

export const SignUpModal: React.FC<SignUpModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin,
  onOpenProfile,
}) => {
  const { t } = useLanguage();
  const { loginWithUser } = useAuth();
  const { members, addMember } = useSamajData();

  // Form State
  const [fullNameGuj, setFullNameGuj] = useState('');
  const [fullNameEng, setFullNameEng] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [selectedVillageIndex, setSelectedVillageIndex] = useState(0);
  const [customVillage, setCustomVillage] = useState('');

  const [currentAddressGuj, setCurrentAddressGuj] = useState('');
  const [currentAddressEng, setCurrentAddressEng] = useState('');

  const [occupationGuj, setOccupationGuj] = useState('વેપારી / બિઝનેસ');
  const [occupationEng, setOccupationEng] = useState('Business / Trader');

  const [bloodGroup, setBloodGroup] = useState('B +ve');
  const [familyMembersCount, setFamilyMembersCount] = useState(4);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);

  const [agreedToRules, setAgreedToRules] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Success State
  const [registeredMember, setRegisteredMember] = useState<SamajMember | null>(null);

  if (!isOpen) return null;

  const handleReset = () => {
    setFullNameGuj('');
    setFullNameEng('');
    setMobile('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setCurrentAddressGuj('');
    setCurrentAddressEng('');
    setErrorMessage(null);
    setRegisteredMember(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    const cleanMobile = mobile.trim();
    if (!fullNameGuj.trim() && !fullNameEng.trim()) {
      setErrorMessage(t('કૃપા કરીને તમારું પૂરું નામ દાખલ કરો.', 'Please enter your full name.'));
      return;
    }

    if (!cleanMobile || cleanMobile.replace(/\D/g, '').length < 10) {
      setErrorMessage(
        t('કૃપા કરીને માન્ય ૧૦ આંકડાનો મોબાઈલ નંબર દાખલ કરો.', 'Please enter a valid 10-digit mobile number.')
      );
      return;
    }

    if (!password || password.length < 4) {
      setErrorMessage(
        t('પાસવર્ડ ઓછામાં ઓછો ૪ અક્ષરનો હોવો જોઈએ.', 'Password must be at least 4 characters long.')
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(t('બંને પાસવર્ડ મેળ ખાતા નથી.', 'Passwords do not match.'));
      return;
    }

    if (!agreedToRules) {
      setErrorMessage(
        t('કૃપા કરીને સમાજના નિયમોની બાંયધરી સ્વીકારો.', 'Please accept the declaration checkbox.')
      );
      return;
    }

    // Check if mobile already exists in members
    const mobileDigits = cleanMobile.replace(/\D/g, '');
    const alreadyExists = members.some((m) => {
      const existingDigits = m.mobile ? m.mobile.replace(/\D/g, '') : '';
      return existingDigits === mobileDigits;
    });

    if (alreadyExists) {
      setErrorMessage(
        t(
          'આ મોબાઈલ નંબર સાથે સભ્ય પહેલેથી નોંધાયેલા છે. કૃપા કરીને લોગિન કરો.',
          'A member is already registered with this mobile number. Please Sign In.'
        )
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Determine Village
      const villageItem = KUTCH_VILLAGES_LIST[selectedVillageIndex];
      const finalVillageGuj =
        selectedVillageIndex === KUTCH_VILLAGES_LIST.length - 1 && customVillage.trim()
          ? `${customVillage.trim()} (કચ્છ)`
          : villageItem.guj;
      const finalVillageEng =
        selectedVillageIndex === KUTCH_VILLAGES_LIST.length - 1 && customVillage.trim()
          ? `${customVillage.trim()} (Kutch)`
          : villageItem.eng;

      // Auto-generate official Member No
      const nextSequence = 100 + members.length + 1;
      const memberNo = `KKP-KALOL-${nextSequence}`;
      const memberId = `MEM-${Date.now()}`;
      const nowIso = new Date().toISOString().split('T')[0];

      const newMember: SamajMember = {
        id: memberId,
        memberNo,
        fullNameGuj: fullNameGuj.trim() || fullNameEng.trim(),
        fullNameEng: fullNameEng.trim() || fullNameGuj.trim(),
        mobile: `+91 ${mobileDigits.slice(-10, -5)} ${mobileDigits.slice(-5)}`,
        email: email.trim() || undefined,
        password: password.trim(),
        nativeVillageGuj: finalVillageGuj,
        nativeVillageEng: finalVillageEng,
        currentAddressGuj: currentAddressGuj.trim() || 'કલોલ, ગાંધીનગર, ગુજરાત',
        currentAddressEng: currentAddressEng.trim() || 'Kalol, Gandhinagar, Gujarat',
        bloodGroup,
        occupationGuj: occupationGuj.trim(),
        occupationEng: occupationEng.trim(),
        familyMembersCount: Number(familyMembersCount) || 4,
        role: 'member',
        isActive: true,
        photoUrl: selectedAvatar,
        createdAt: nowIso,
      };

      // 1. Add to Data Context & localStorage
      addMember(newMember);

      // 2. Try inserting into Supabase if Cloud DB is configured
      const cloudConfig = getSupabaseConfig();
      if (cloudConfig.isConfigured) {
        try {
          const client = getSupabaseClient();
          if (client) {
            await client.from('samaj_members').insert({
              member_no: memberNo,
              full_name_guj: newMember.fullNameGuj,
              full_name_eng: newMember.fullNameEng,
              mobile: newMember.mobile,
              email: newMember.email,
              native_village_guj: newMember.nativeVillageGuj,
              native_village_eng: newMember.nativeVillageEng,
              current_address_guj: newMember.currentAddressGuj,
              current_address_eng: newMember.currentAddressEng,
              blood_group: newMember.bloodGroup,
              occupation_guj: newMember.occupationGuj,
              occupation_eng: newMember.occupationEng,
              family_members_count: newMember.familyMembersCount,
              role: 'member',
              is_active: true,
              photo_url: newMember.photoUrl,
            });
          }
        } catch (cloudErr) {
          console.warn('Could not save to Supabase cloud immediately:', cloudErr);
        }
      }

      // 3. Authenticate current user automatically
      const authUser: AuthUser = {
        id: newMember.id,
        role: 'member',
        nameGuj: newMember.fullNameGuj,
        nameEng: newMember.fullNameEng,
        memberId: newMember.memberNo,
        phone: newMember.mobile,
        email: newMember.email,
        nativeKutchVillageGuj: newMember.nativeVillageGuj,
        nativeKutchVillageEng: newMember.nativeVillageEng,
        addressGuj: newMember.currentAddressGuj,
        addressEng: newMember.currentAddressEng,
        bloodGroup: newMember.bloodGroup,
        familyMembersCount: newMember.familyMembersCount,
        joinedYear: '2024',
        avatarUrl: newMember.photoUrl,
      };
      loginWithUser(authUser);

      // 4. Trigger celebration
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });

      setRegisteredMember(newMember);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-amber-300/80 overflow-hidden my-6">
        {/* Top Accent Strip */}
        <div className="h-2.5 bg-gradient-to-r from-amber-700 via-orange-500 to-amber-700" />

        {/* Modal Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* SUCCESS VIEW */}
        {registeredMember ? (
          <div className="p-6 sm:p-10 text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-3xl bg-emerald-50 border-2 border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-600/10">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{t('અભિનંદન! સભ્ય નોંધણી સફળ', 'Congratulations! Registration Successful')}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              {registeredMember.fullNameGuj}
            </h3>
            <p className="text-sm text-slate-600 font-medium mt-1">
              {registeredMember.fullNameEng}
            </p>

            {/* Issued Member Card Preview */}
            <div className="mt-6 max-w-md mx-auto p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-300/80 text-left shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-amber-200">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-600 text-white font-serif font-black flex items-center justify-center text-sm">
                    ક
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-amber-900">
                      શ્રી કલોલ કચ્છ કડવા પાટીદાર સમાજ
                    </p>
                    <p className="text-[10px] text-amber-700">સભ્ય ડિજિટલ ઓળખપત્ર</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  સક્રિય (Active)
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] block">સભ્ય નંબર (Member ID):</span>
                  <span className="font-mono font-black text-amber-800 text-sm">
                    {registeredMember.memberNo}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">મોબાઈલ નંબર:</span>
                  <span className="font-bold text-slate-800">{registeredMember.mobile}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">કચ્છનું મૂળ ગામ:</span>
                  <span className="font-bold text-slate-800">{registeredMember.nativeVillageGuj}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">બ્લડ ગ્રૂપ:</span>
                  <span className="font-bold text-rose-600">{registeredMember.bloodGroup}</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-4 max-w-md mx-auto">
              {t(
                'તમે આપમેળે લોગિન થઈ ગયા છો. હવે તમે ડિજિટલ સભ્ય કાર્ડ ડાઉનલોડ અથવા પ્રિન્ટ કરી શકો છો.',
                'You are now automatically logged in. You can now view and print your Digital ID Card.'
              )}
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  if (onOpenProfile) onOpenProfile();
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-600/30 flex items-center justify-center space-x-2 cursor-pointer transition-transform active:scale-95"
              >
                <CreditCard className="w-4 h-4" />
                <span>{t('ડિજિટલ સભ્ય કાર્ડ જુઓ', 'View My Digital ID Card')}</span>
              </button>

              <button
                onClick={handleClose}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm cursor-pointer transition-colors"
              >
                {t('હોમ પેજ પર જાઓ', 'Back to Homepage')}
              </button>
            </div>
          </div>
        ) : (
          /* REGISTRATION FORM VIEW */
          <div className="p-6 sm:p-8 max-h-[88vh] overflow-y-auto">
            {/* Header */}
            <div className="text-center pb-5 border-b border-slate-100">
              <div className="w-13 h-13 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto mb-2.5 shadow-xs">
                <UserPlus className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {t('નવી સભ્ય નોંધણી (Sign Up)', 'New Member Registration')}
              </h3>
              <p className="text-xs text-amber-800 font-semibold mt-1">
                {t(
                  'શ્રી કલોલ કચ્છ કડવા પાટીદાર સમાજ પરિવારમાં આપનું હાર્દિક સ્વાગત છે',
                  'Welcome to Shree Kalol Kutch Kadva Patidar Samaj Community'
                )}
              </p>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="my-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-5">
              {/* SECTION 1: Personal Name Details */}
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-amber-600" />
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {t('૧. સભ્યનું નામ (Personal Name Details)', '1. Member Full Name')}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('પૂરું નામ (ગુજરાતીમાં) *', 'Full Name (in Gujarati) *')}
                    </label>
                    <input
                      type="text"
                      required
                      value={fullNameGuj}
                      onChange={(e) => setFullNameGuj(e.target.value)}
                      placeholder="દા.ત. રમેશભાઈ કાંતિભાઈ પટેલ (પોકાર)"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:border-amber-500 focus:outline-hidden transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('Full Name (English) *', 'Full Name (in English) *')}
                    </label>
                    <input
                      type="text"
                      required
                      value={fullNameEng}
                      onChange={(e) => setFullNameEng(e.target.value)}
                      placeholder="e.g. Rameshbhai Kantibhai Patel (Pokar)"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:border-amber-500 focus:outline-hidden transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Contact & Login Credentials */}
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-amber-600" />
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {t('૨. સંપર્ક અને લોગિન પાસવર્ડ (Contact & Login)', '2. Contact & Login Credentials')}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('મોબાઈલ નંબર (આ તમારું લોગિન ID બનશે) *', 'Mobile Number (Your Login ID) *')}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                        placeholder="9825123456"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:border-amber-500 focus:outline-hidden transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('ઈમેલ એડ્રેસ (વૈકલ્પિક)', 'Email Address (Optional)')}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="patel.example@gmail.com"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:border-amber-500 focus:outline-hidden transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('પાસવર્ડ બનાવો *', 'Create Password *')}
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:border-amber-500 focus:outline-hidden transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('પાસવર્ડ ફરી લખો *', 'Confirm Password *')}
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:border-amber-500 focus:outline-hidden transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Kutch Native Village & Kalol Residence */}
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-amber-600" />
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {t('૩. કચ્છનું વતન અને કલોલ નિવાસ (Native Village & Address)', '3. Native Village & Address')}
                  </h4>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('કચ્છનું મૂળ વતન ગામ *', 'Native Village in Kutch *')}
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-amber-600 absolute left-3.5 top-3 pointer-events-none" />
                      <select
                        value={selectedVillageIndex}
                        onChange={(e) => setSelectedVillageIndex(Number(e.target.value))}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:border-amber-500 focus:outline-hidden transition-all cursor-pointer font-medium"
                      >
                        {KUTCH_VILLAGES_LIST.map((vil, idx) => (
                          <option key={idx} value={idx}>
                            {vil.guj} — {vil.eng}
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedVillageIndex === KUTCH_VILLAGES_LIST.length - 1 && (
                      <div className="mt-2">
                        <input
                          type="text"
                          required
                          value={customVillage}
                          onChange={(e) => setCustomVillage(e.target.value)}
                          placeholder="ગામનું નામ લખો (Enter your village name)"
                          className="w-full px-3.5 py-2 bg-white border border-amber-300 rounded-xl text-xs focus:border-amber-500 focus:outline-hidden"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {t('કલોલનું વર્તમાન સરનામું (ગુજરાતી)', 'Current Address in Kalol (Gujarati)')}
                      </label>
                      <input
                        type="text"
                        value={currentAddressGuj}
                        onChange={(e) => setCurrentAddressGuj(e.target.value)}
                        placeholder="દા.ત. ૧૨, ઉમિયા સોસાયટી, કલોલ"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:border-amber-500 focus:outline-hidden transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {t('Address in Kalol (English)', 'Address in Kalol (English)')}
                      </label>
                      <input
                        type="text"
                        value={currentAddressEng}
                        onChange={(e) => setCurrentAddressEng(e.target.value)}
                        placeholder="e.g. 12, Umiya Society, Kalol"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:border-amber-500 focus:outline-hidden transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: Occupation, Blood Group & Family */}
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-amber-600" />
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {t('૪. વ્યવસાય, બ્લડ ગ્રૂપ અને પરિવાર (Other Details)', '4. Occupation & Family Details')}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('વ્યવસાય (Occupation)', 'Occupation / Business')}
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                      <input
                        type="text"
                        value={occupationGuj}
                        onChange={(e) => {
                          setOccupationGuj(e.target.value);
                          setOccupationEng(e.target.value);
                        }}
                        placeholder="વેપાર / નોકરી"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:border-amber-500 focus:outline-hidden transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('બ્લડ ગ્રૂપ (Blood Group)', 'Blood Group')}
                    </label>
                    <div className="relative">
                      <Droplet className="w-4 h-4 text-rose-500 absolute left-3.5 top-3 pointer-events-none" />
                      <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:border-amber-500 focus:outline-hidden transition-all cursor-pointer font-bold text-rose-700"
                      >
                        {BLOOD_GROUPS.map((bg) => (
                          <option key={bg} value={bg}>
                            {bg}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('પરિવારના સભ્યો (Family)', 'Family Members')}
                    </label>
                    <div className="relative">
                      <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                      <input
                        type="number"
                        min={1}
                        max={15}
                        value={familyMembersCount}
                        onChange={(e) => setFamilyMembersCount(Number(e.target.value))}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:border-amber-500 focus:outline-hidden transition-all font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Avatar Selection */}
                <div className="mt-3.5 pt-3 border-t border-slate-200/60">
                  <label className="block text-[11px] font-bold text-slate-600 mb-2">
                    {t('પ્રોફાઇલ ફોટો પસંદ કરો (Choose Profile Avatar)', 'Select Avatar Photo')}
                  </label>
                  <div className="flex items-center space-x-3 overflow-x-auto pb-1">
                    {AVATAR_OPTIONS.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedAvatar(img)}
                        className={`w-11 h-11 rounded-full overflow-hidden border-2 transition-transform cursor-pointer shrink-0 ${
                          selectedAvatar === img
                            ? 'border-amber-600 ring-2 ring-amber-300 scale-105'
                            : 'border-slate-200 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="Avatar" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Declaration Checkbox */}
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start space-x-2.5">
                <input
                  type="checkbox"
                  id="agree-rules"
                  checked={agreedToRules}
                  onChange={(e) => setAgreedToRules(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded-md border-amber-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <label htmlFor="agree-rules" className="text-xs text-amber-950 font-medium cursor-pointer">
                  {t(
                    'હું પ્રમાણિત કરું છું કે ઉપરોક્ત વિગતો સાચી છે અને હું શ્રી કલોલ કચ્છ કડવા પાટીદાર સમાજના નિયમોનું પાલન કરવાની બાંયધરી આપું છું.',
                    'I confirm that all details provided are true and I agree to abide by the rules and constitution of Shree Kalol Kutch Kadva Patidar Samaj.'
                  )}
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white font-black text-sm shadow-lg shadow-amber-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 active:scale-98"
              >
                <span>
                  {isSubmitting
                    ? t('નોંધણી થઈ રહી છે...', 'Registering...')
                    : t('સભ્ય તરીકે નોંધણી પૂર્ણ કરો (Complete Registration)', 'Register as Member')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Switch to Login Link */}
              <div className="pt-2 text-center text-xs text-slate-500">
                <span>{t('પહેલેથી સભ્ય તરીકે નોંધાયેલા છો?', 'Already registered as a member?')} </span>
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    onSwitchToLogin();
                  }}
                  className="font-bold text-amber-700 hover:text-amber-800 underline cursor-pointer ml-1"
                >
                  {t('અહીં લોગિન કરો (Sign In Here)', 'Sign In Here')}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
