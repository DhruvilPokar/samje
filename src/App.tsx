import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SamajDataProvider } from './context/SamajDataContext';
import {
  Globe,
  Building,
  Users,
  Image as ImageIcon,
  Calendar,
  Phone,
  MapPin,
  Mail,
  Menu,
  X,
  LogIn,
  LogOut,
  ShieldCheck,
  User,
  UserPlus,
  CreditCard,
  Settings,
} from 'lucide-react';
import type { ActiveTab, UserRole } from './types';
import { SAMAJ_DETAILS } from './data/kutchSamajData';

// Dedicated Sections
import { SamajDetailsSection } from './components/SamajDetailsSection';
import { SamajPersonsSection } from './components/SamajPersonsSection';
import { EventPhotosSection } from './components/EventPhotosSection';
import { EventCalendarSection } from './components/EventCalendarSection';

// Auth & Admin Modals
import { LoginModal } from './components/LoginModal';
import { SignUpModal } from './components/SignUpModal';
import { MemberProfileModal } from './components/MemberProfileModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';

const MainApp: React.FC = () => {
  const { lang, toggleLang, t } = useLanguage();
  const { user, isAdmin, isMember, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<ActiveTab>('samaj');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modal dialog states
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [loginDefaultRole, setLoginDefaultRole] = useState<UserRole>('member');
  const [isMemberProfileOpen, setIsMemberProfileOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  const tabs = [
    {
      id: 'samaj' as ActiveTab,
      labelGuj: 'સમાજ પરિચય',
      labelEng: 'Samaj Details',
      icon: Building,
    },
    {
      id: 'persons' as ActiveTab,
      labelGuj: 'સમાજના હોદ્દેદારો',
      labelEng: 'Persons of Samaj',
      icon: Users,
    },
    {
      id: 'photos' as ActiveTab,
      labelGuj: 'ઇવેન્ટ ફોટો',
      labelEng: 'Event Photos',
      icon: ImageIcon,
    },
    {
      id: 'calendar' as ActiveTab,
      labelGuj: 'ઇવેન્ટ કેલેન્ડર',
      labelEng: 'Event Calendar',
      icon: Calendar,
    },
  ];

  const handleTabClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openLogin = (role: UserRole = 'member') => {
    setLoginDefaultRole(role);
    setIsLoginModalOpen(true);
    setIsSignUpModalOpen(false);
    setMobileMenuOpen(false);
  };

  const openSignUp = () => {
    setIsSignUpModalOpen(true);
    setIsLoginModalOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#faf8f4] text-slate-800 flex flex-col font-sans selection:bg-amber-600 selection:text-white">
      {/* Auspicious Top Header Banner */}
      <div className="bg-gradient-to-r from-amber-800 via-orange-700 to-amber-800 text-amber-50 text-xs sm:text-sm py-1.5 px-4 font-medium tracking-wide border-b border-amber-600/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 truncate">
            <span className="text-amber-300">🚩</span>
            <span className="font-semibold truncate">
              {t(
                '॥ ૐ શ્રી ઉમિયા માતાજી પ્રસન્ન ॥ જય સરદાર ॥ શ્રી કલોલ કચ્છ કડવા પાટીદાર સમાજ',
                'Shree Kalol Kutch Kadva Patidar Samaj • Jay Maa Umiya • Jay Sardar'
              )}
            </span>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <a
              href="tel:+919825144556"
              className="hidden lg:flex items-center space-x-1 hover:text-amber-200 transition-colors text-xs"
            >
              <Phone className="w-3.5 h-3.5 text-amber-300" />
              <span>+91 98251 44556</span>
            </a>

            {/* Quick Top Auth Indicator / Buttons */}
            {!user ? (
              <div className="hidden sm:flex items-center space-x-2 text-xs">
                <button
                  onClick={() => openLogin('member')}
                  className="hover:text-amber-200 font-bold transition-colors cursor-pointer"
                >
                  {t('સભ્ય લોગિન', 'Member')}
                </button>
                <span className="text-amber-400/60">•</span>
                <button
                  onClick={openSignUp}
                  className="text-amber-200 hover:text-white font-bold transition-colors cursor-pointer"
                >
                  {t('સાઇન અપ (Sign Up)', 'Sign Up')}
                </button>
                <span className="text-amber-400/60">•</span>
                <button
                  onClick={() => openLogin('admin')}
                  className="hover:text-amber-200 font-bold transition-colors cursor-pointer"
                >
                  {t('એડમિન', 'Admin')}
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2 text-xs">
                {isAdmin ? (
                  <button
                    onClick={() => setIsAdminDashboardOpen(true)}
                    className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 hover:bg-amber-500/30 font-bold cursor-pointer transition-colors"
                  >
                    <span>👑 {t('એડમિન પેનલ', 'Admin Panel')}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsMemberProfileOpen(true)}
                    className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold cursor-pointer transition-colors"
                  >
                    <span>🪪 {t('સભ્ય કાર્ડ', 'Member Card')}</span>
                  </button>
                )}
                <button
                  onClick={logout}
                  className="text-amber-300 hover:text-white font-bold cursor-pointer transition-colors"
                  title="Logout"
                >
                  {t('બહાર નીકળો', 'Logout')}
                </button>
              </div>
            )}

            {/* Language Switch */}
            <button
              onClick={toggleLang}
              className="flex items-center space-x-1 bg-white/20 hover:bg-white/30 text-white px-2.5 py-0.5 rounded-full font-bold transition-transform active:scale-95 text-xs border border-white/20"
            >
              <Globe className="w-3 h-3" />
              <span>{lang === 'gu' ? 'English' : 'ગુજરાતી'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Header with Tabs and Auth */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo and Samaj Title */}
            <div
              onClick={() => handleTabClick('samaj')}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-700 via-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-600/20 ring-2 ring-amber-400/40 group-hover:scale-105 transition-transform duration-300">
                <span className="font-black text-2xl font-serif">ક</span>
              </div>
              <div>
                <h1 className="font-black text-base sm:text-xl text-slate-900 tracking-tight group-hover:text-amber-800 transition-colors leading-tight">
                  {t('શ્રી કલોલ કચ્છ કડવા પાટીદાર સમાજ', 'Shree Kalol Kutch Kadva Patidar Samaj')}
                </h1>
                <p className="text-xs text-amber-800 font-semibold mt-0.5">
                  {t('સ્થાપના: ૧૯૮૧ | રજિ. ટ્રસ્ટ નં. એ-૪૨૦', 'Est. 1981 | Reg. Trust No. A-420')}
                </p>
              </div>
            </div>

            {/* Desktop Navigation 4 Tabs */}
            <nav className="hidden lg:flex items-center space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center space-x-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25 scale-102'
                        : 'text-slate-700 hover:text-amber-800 hover:bg-amber-50/80'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{t(tab.labelGuj, tab.labelEng)}</span>
                  </button>
                );
              })}
            </nav>

            {/* Desktop Auth Button / Profile Controls */}
            <div className="hidden lg:flex items-center space-x-2 pl-3 border-l border-slate-200">
              {!user ? (
                <>
                  <button
                    onClick={openSignUp}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 active:scale-95 text-white font-bold text-xs shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-amber-100" />
                    <span>{t('સાઇન અપ (Sign Up)', 'Sign Up')}</span>
                  </button>

                  <button
                    onClick={() => openLogin('member')}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t('લોગિન (Login)', 'Sign In')}</span>
                  </button>
                </>
              ) : isMember ? (
                /* Member Controls */
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsMemberProfileOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
                    title={t('ડિજિટલ સભ્ય કાર્ડ જુઓ', 'View Member Card')}
                  >
                    <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                    <span className="truncate max-w-[120px]">{user.nameGuj.split(' ')[0]}</span>
                  </button>

                  <button
                    onClick={logout}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title={t('બહાર નીકળો', 'Logout')}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* Admin Controls */
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsAdminDashboardOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white font-bold text-xs shadow-xs hover:shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-amber-200" />
                    <span>{t('એડમિન પેનલ', 'Admin Panel')}</span>
                  </button>

                  <button
                    onClick={logout}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title={t('બહાર નીકળો', 'Logout')}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex lg:hidden items-center space-x-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-700 hover:text-amber-800 focus:outline-hidden"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-amber-800" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-amber-200 px-4 pt-2 pb-5 shadow-xl animate-in slide-in-from-top-2">
            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`w-full text-left py-2.5 px-3 rounded-xl text-sm font-bold flex items-center justify-between ${
                      isActive
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-amber-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{t(tab.labelGuj, tab.labelEng)}</span>
                    </div>
                    <span className="text-xs opacity-60">→</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Auth Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
              {!user ? (
                <div className="space-y-2">
                  <button
                    onClick={openSignUp}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-xs flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-amber-100" />
                    <span>{t('નવી સભ્ય નોંધણી (Sign Up)', 'New Member Registration (Sign Up)')}</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => openLogin('member')}
                      className="w-full py-2.5 px-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100 font-bold text-xs flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                    >
                      <User className="w-3.5 h-3.5 text-amber-700" />
                      <span>{t('સભ્ય લોગિન', 'Member Login')}</span>
                    </button>

                    <button
                      onClick={() => openLogin('admin')}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t('એડમિન', 'Admin Login')}</span>
                    </button>
                  </div>
                </div>
              ) : isMember ? (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setIsMemberProfileOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 font-bold text-xs flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4 text-amber-600" />
                    <span>{t('મારું ડિજિટલ સભ્ય કાર્ડ', 'My Member ID Card')}</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 text-rose-600 font-bold text-xs text-center cursor-pointer"
                  >
                    {t('બહાર નીકળો (Logout)', 'Sign Out')}
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setIsAdminDashboardOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-amber-400" />
                    <span>{t('એડમિન મેનેજમેન્ટ પેનલ', 'Admin Control Panel')}</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 text-rose-600 font-bold text-xs text-center cursor-pointer"
                  >
                    {t('બહાર નીકળો (Logout)', 'Sign Out')}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area: Selected Tab Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {activeTab === 'samaj' && <SamajDetailsSection />}
        {activeTab === 'persons' && <SamajPersonsSection />}
        {activeTab === 'photos' && <EventPhotosSection />}
        {activeTab === 'calendar' && <EventCalendarSection />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-white pt-14 pb-10 border-t-4 border-amber-600 relative mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-slate-800">
            {/* Identity */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center font-bold text-lg font-serif">
                  ક
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-amber-200">
                    {t('શ્રી કલોલ કચ્છ કડવા પાટીદાર સમાજ', 'Shree Kalol Kutch Kadva Patidar Samaj')}
                  </h3>
                  <p className="text-xs text-amber-400 font-medium">
                    {SAMAJ_DETAILS.regNumber}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                {t(
                  'કચ્છની સંસ્કૃતિ, સંગઠિત શક્તિ અને શિક્ષણના સંસ્કારો સાથે કલોલ પંથકમાં કાર્યરત પાટીદાર સમુદાયનું સર્વોચ્ચ ટ્રસ્ટ.',
                  'The apex community trust uniting Kutch Kadva Patidar families across Kalol, Gandhinagar and surrounding industrial regions.'
                )}
              </p>
            </div>

            {/* Quick Links & Portal */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
                {t('વિભાગો & પોર્ટલ', 'Sections & Portals')}
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className="text-left hover:text-amber-400 transition-colors py-1 cursor-pointer"
                  >
                    • {t(tab.labelGuj, tab.labelEng)}
                  </button>
                ))}
                <button
                  onClick={() => openLogin('member')}
                  className="text-left text-amber-300 hover:text-white transition-colors py-1 cursor-pointer"
                >
                  • {t('સભ્ય લોગિન', 'Member Portal')}
                </button>
                <button
                  onClick={() => openLogin('admin')}
                  className="text-left text-amber-300 hover:text-white transition-colors py-1 cursor-pointer"
                >
                  • {t('એડમિન પેનલ', 'Admin Portal')}
                </button>
              </div>
            </div>

            {/* Address & Contact */}
            <div className="space-y-2 text-xs text-slate-300">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
                {t('સંપર્ક કાર્યાલય', 'Office & Bhavan')}
              </h4>
              <p className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 text-amber-500 shrink-0 mt-0.5" />
                <span>{t(SAMAJ_DETAILS.addressGuj, SAMAJ_DETAILS.addressEng)}</span>
              </p>
              <p className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-emerald-400 shrink-0" />
                <a href="tel:+919825144556" className="hover:underline">
                  {SAMAJ_DETAILS.phone}
                </a>
              </p>
              <p className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-blue-400 shrink-0" />
                <a href="mailto:info@kalolkutchpatidar.org" className="hover:underline">
                  {SAMAJ_DETAILS.email}
                </a>
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
            <p>
              © {new Date().getFullYear()} {t('શ્રી કલોલ કચ્છ કડવા પાટીદાર સમાજ', 'Shree Kalol Kutch Kadva Patidar Samaj')}. {t('સર્વાધિકાર સુરક્ષિત.', 'All Rights Reserved.')}
            </p>
            <p className="font-bold text-amber-400">
              ॥ જય માઁ ઉમિયા ॥ જય સરદાર ॥
            </p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        defaultRole={loginDefaultRole}
        onSwitchToSignUp={openSignUp}
      />

      {/* Member Sign Up Modal */}
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
        onSwitchToLogin={() => openLogin('member')}
        onOpenProfile={() => setIsMemberProfileOpen(true)}
      />

      {/* Member Digital ID Card Modal */}
      <MemberProfileModal
        isOpen={isMemberProfileOpen}
        onClose={() => setIsMemberProfileOpen(false)}
      />

      {/* Admin Management Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <SamajDataProvider>
          <MainApp />
        </SamajDataProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
