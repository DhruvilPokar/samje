import React, { useState } from 'react';
import {
  X,
  Users,
  Image as ImageIcon,
  Calendar,
  Plus,
  Trash2,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Database,
  Cloud,
  Download,
  Upload,
  Search,
  ExternalLink,
  Copy,
  Check,
  Building,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSamajData } from '../context/SamajDataContext';
import { getSupabaseConfig, saveSupabaseConfig, testSupabaseConnection } from '../lib/supabase';
import type { SamajPerson, EventPhoto, CalendarEvent, SamajMember } from '../types';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useLanguage();
  const {
    members,
    persons,
    photos,
    events,
    stats,
    addMember,
    deleteMember,
    clearMembers,
    loadSampleMembers,
    addPerson,
    deletePerson,
    clearPersons,
    addPhoto,
    deletePhoto,
    clearPhotos,
    addEvent,
    deleteEvent,
    clearEvents,
    loadSamplePersons,
    loadSamplePhotos,
    loadSampleEvents,
    populateAllSampleData,
    resetAllToEmpty,
    exportDatabaseJSON,
    importDatabaseJSON,
    syncWithSupabase,
  } = useSamajData();

  const [activeTab, setActiveTab] = useState<'members' | 'persons' | 'photos' | 'calendar' | 'database'>('members');
  const [successNote, setSuccessNote] = useState<string | null>(null);

  // Cloud Supabase configuration state
  const [cloudUrl, setCloudUrl] = useState(() => getSupabaseConfig().url);
  const [cloudKey, setCloudKey] = useState(() => getSupabaseConfig().anonKey);
  const [cloudTestStatus, setCloudTestStatus] = useState<string | null>(null);
  const [isTestingCloud, setIsTestingCloud] = useState(false);
  const [copiedSQL, setCopiedSQL] = useState(false);

  // Member Search & Form states
  const [memberSearch, setMemberSearch] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('all');
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [memberForm, setMemberForm] = useState({
    memberNo: `KKP-KALOL-${String(members.length + 1).padStart(3, '0')}`,
    fullNameGuj: '',
    fullNameEng: '',
    mobile: '+91 ',
    email: '',
    nativeVillageGuj: 'માધાપર (કચ્છ)',
    nativeVillageEng: 'Madhapar (Kutch)',
    currentAddressGuj: 'બોરીસણા રોડ, કલોલ',
    currentAddressEng: 'Borisana Road, Kalol',
    bloodGroup: 'B +ve',
    occupationGuj: 'વેપારી / ઉદ્યોગપતિ',
    occupationEng: 'Business / Enterprise',
    familyMembersCount: 4,
    role: 'member' as SamajMember['role'],
    isActive: true,
  });

  // Form states for Person
  const [showAddPersonForm, setShowAddPersonForm] = useState(false);
  const [personForm, setPersonForm] = useState({
    nameGuj: '',
    nameEng: '',
    designationGuj: '',
    designationEng: '',
    category: 'office_bearer' as SamajPerson['category'],
    nativeKutchVillageGuj: '',
    nativeKutchVillageEng: '',
    currentAddress: 'કલોલ',
    phone: '+91 ',
    bloodGroup: 'B +ve',
    occupationGuj: 'વેપારી / ઉદ્યોગપતિ',
    occupationEng: 'Business / Industry',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    term: '૨૦૨૪-૨૦૨૭',
    badge: 'હોદ્દેદાર',
  });

  // Form states for Photo
  const [showAddPhotoForm, setShowAddPhotoForm] = useState(false);
  const [photoForm, setPhotoForm] = useState({
    titleGuj: '',
    titleEng: '',
    category: 'garba' as EventPhoto['category'],
    date: 'આસો સુદ પૂનમ',
    imageUrl: '/bhavan.jpg',
    captionGuj: 'કાર્યક્રમની યાદગાર ક્ષણો.',
    captionEng: 'Memorable celebration moments.',
  });

  // Form states for Event
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [eventForm, setEventForm] = useState({
    titleGuj: '',
    titleEng: '',
    date: '૨૫ ઓક્ટોબર, ૨૦૨૬',
    dayGuj: 'રવિવાર',
    dayEng: 'Sunday',
    tithiGuj: 'આસો સુદ પૂનમ',
    time: 'સાંજે ૭:૩૦ થી ૧૧:૩૦',
    venueGuj: 'શ્રી કચ્છ કડવા પાટીદાર ભવન, કલોલ',
    venueEng: 'Shree Kutch Kadva Patidar Bhavan, Kalol',
    category: 'festival' as CalendarEvent['category'],
    descriptionGuj: 'સમાજના તમામ પરિવારો માટે સ્નેહમિલન અને પ્રસાદીનું આયોજન.',
    descriptionEng: 'Community gathering and dinner celebration.',
    rsvpCount: 150,
  });

  if (!isOpen) return null;

  const notify = (msg: string) => {
    setSuccessNote(msg);
    setTimeout(() => setSuccessNote(null), 3000);
  };

  const filteredMembers = members.filter((m) => {
    const q = memberSearch.toLowerCase();
    const matchesSearch =
      q === '' ||
      m.fullNameGuj.toLowerCase().includes(q) ||
      m.fullNameEng.toLowerCase().includes(q) ||
      m.memberNo.toLowerCase().includes(q) ||
      m.mobile.includes(q) ||
      m.nativeVillageGuj.toLowerCase().includes(q) ||
      m.nativeVillageEng.toLowerCase().includes(q);

    const matchesVillage = selectedVillage === 'all' || m.nativeVillageEng.toLowerCase().includes(selectedVillage.toLowerCase());

    return matchesSearch && matchesVillage;
  });

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberForm.fullNameGuj || !memberForm.fullNameEng || !memberForm.mobile) {
      alert('Please fill member name and mobile');
      return;
    }
    addMember(memberForm);
    setShowAddMemberForm(false);
    notify(t('નવા સભ્ય સફળતાપૂર્વક નોંધાયા!', 'Member registered successfully!'));
  };

  const handleCreatePerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personForm.nameGuj || !personForm.nameEng) {
      alert('Please fill at least name in Gujarati & English');
      return;
    }
    addPerson(personForm);
    setShowAddPersonForm(false);
    notify(t('આગેવાન સફળતાપૂર્વક ઉમેરાયા!', 'Person successfully added!'));
  };

  const handleCreatePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoForm.titleGuj || !photoForm.imageUrl) {
      alert('Please fill photo title and image URL');
      return;
    }
    addPhoto(photoForm);
    setShowAddPhotoForm(false);
    notify(t('ઇવેન્ટ ફોટો સફળતાપૂર્વક ઉમેરાયો!', 'Photo successfully added!'));
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.titleGuj || !eventForm.date) {
      alert('Please fill event title and date');
      return;
    }
    addEvent(eventForm);
    setShowAddEventForm(false);
    notify(t('કાર્યક્રમ સફળતાપૂર્વક ઉમેરાયો!', 'Event successfully added!'));
  };

  const handleSaveCloudConfig = () => {
    saveSupabaseConfig(cloudUrl, cloudKey);
    notify(t('સુપાબેઝ ક્લાઉડ સેટિંગ્સ સાચવવામાં આવી!', 'Supabase config saved successfully!'));
  };

  const handleTestCloudConnection = async () => {
    setIsTestingCloud(true);
    setCloudTestStatus(null);
    const res = await testSupabaseConnection(cloudUrl, cloudKey);
    setIsTestingCloud(false);
    setCloudTestStatus(res.message);
  };

  const handleExportJSON = () => {
    const jsonStr = exportDatabaseJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kalol_kutch_samaj_database_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    notify(t('ડેટાબેઝ બેકઅપ ફાઈલ ડાઉનલોડ થઈ!', 'Database backup exported successfully!'));
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importDatabaseJSON(content);
      if (res.success) {
        notify(res.message);
      } else {
        alert(res.message);
      }
    };
    reader.readAsText(file);
  };

  const copySQLSchema = () => {
    const sqlScript = `-- Shree Kalol Kutch Kadva Patidar Samaj
CREATE TABLE samaj_members (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), member_no TEXT UNIQUE, full_name_guj TEXT, full_name_eng TEXT, mobile TEXT, native_village_guj TEXT, native_village_eng TEXT, current_address_guj TEXT, current_address_eng TEXT, blood_group TEXT, family_members_count INT, role TEXT, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE samaj_persons (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name_guj TEXT, name_eng TEXT, designation_guj TEXT, designation_eng TEXT, category TEXT, native_kutch_village_guj TEXT, phone TEXT, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE event_photos (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title_guj TEXT, title_eng TEXT, category TEXT, date_text TEXT, image_url TEXT, caption_guj TEXT, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE calendar_events (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title_guj TEXT, title_eng TEXT, event_date TEXT, tithi_guj TEXT, event_time TEXT, venue_guj TEXT, category TEXT, created_at TIMESTAMPTZ DEFAULT now());`;
    navigator.clipboard.writeText(sqlScript);
    setCopiedSQL(true);
    setTimeout(() => setCopiedSQL(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-amber-300 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-lg">
              👑
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base sm:text-lg text-amber-200">
                  {t('શ્રી કલોલ કચ્છ કડવા પાટીદાર સમાજ - એડમિન ડેટાબેઝ', 'SKKKPS Administrative Master Database')}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {getSupabaseConfig().isConfigured ? '🟢 Cloud Active' : '🟡 Local DB'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {t(
                  `કુલ ${stats.totalMembers} સભ્યો • ${stats.totalPersons} આગેવાનો • ${stats.totalPhotos} ફોટો • ${stats.totalEvents} કાર્યક્રમો`,
                  `${stats.totalMembers} Members • ${stats.totalPersons} Leaders • ${stats.totalPhotos} Photos • ${stats.totalEvents} Events`
                )}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert Banner */}
        {successNote && (
          <div className="bg-emerald-600 text-white px-6 py-2 text-xs font-bold flex items-center space-x-2 animate-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successNote}</span>
          </div>
        )}

        {/* Navigation Tabs Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5 text-xs font-bold">
            <button
              onClick={() => setActiveTab('members')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'members'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{t('સભ્યો ડેટાબેઝ', 'Members DB')}</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">
                {members.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('persons')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'persons'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>{t('આગેવાનો', 'Leaders')}</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">
                {persons.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('photos')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'photos'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{t('ઇવેન્ટ ફોટો', 'Photos')}</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">
                {photos.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'calendar'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{t('કેલેન્ડર', 'Calendar')}</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">
                {events.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'database'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('ક્લાઉડ DB & બેકઅપ', 'Cloud DB & Backup')}</span>
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          {/* TAB 1: MEMBERS DATABASE */}
          {activeTab === 'members' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                    {t('શ્રી કલોલ કચ્છ કડવા પાટીદાર સમાજ સભ્યોની માસ્ટર ડિરેક્ટરી', 'Samaj Members Master Directory')}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {t(
                      `કચ્છના ૩૫+ ગામોમાંથી કલોલમાં વસેલા કુલ ${members.length} નોંધાયેલા સભ્યો`,
                      `Total ${members.length} registered member families across native Kutch villages.`
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowAddMemberForm(!showAddMemberForm)}
                    className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{showAddMemberForm ? t('ફોર્મ બંધ કરો', 'Close') : t('નવા સભ્ય ઉમેરો (+)', '+ Register Member')}</span>
                  </button>

                  <button
                    onClick={() => {
                      loadSampleMembers();
                      notify(t('નમૂના સભ્યો લોડ થયા!', 'Sample members loaded!'));
                    }}
                    className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200 flex items-center space-x-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>{t('નમૂના સભ્યો', 'Load Samples')}</span>
                  </button>

                  {members.length > 0 && (
                    <button
                      onClick={() => {
                        if (confirm('Clear all members?')) {
                          clearMembers();
                          notify(t('તમામ સભ્યો સાફ કરાયા', 'Cleared all members'));
                        }
                      }}
                      className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 flex items-center space-x-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t('સાફ કરો', 'Clear All')}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Member Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3 rounded-2xl border border-slate-200">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    placeholder={t('નામ, મોબાઈલ, સભ્ય નં. કે ગામ શોધો...', 'Search by name, mobile, ID, village...')}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <span className="text-xs text-slate-500 font-bold shrink-0">{t('મૂળ ગામ:', 'Native Village:')}</span>
                  <select
                    value={selectedVillage}
                    onChange={(e) => setSelectedVillage(e.target.value)}
                    className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden"
                  >
                    <option value="all">{t('બધા ગામો (All Villages)', 'All Villages')}</option>
                    <option value="madhapar">માધાપર (Madhapar)</option>
                    <option value="bhuj">ભુજ (Bhuj)</option>
                    <option value="sukhpar">સુખપર (Sukhpar)</option>
                    <option value="mankuwa">માનકૂવા (Mankuwa)</option>
                    <option value="mirzapar">મિર્ઝાપર (Mirzapar)</option>
                    <option value="dahisara">દહિંસરા (Dahisara)</option>
                    <option value="mandvi">માંડવી (Mandvi)</option>
                    <option value="nakhatrana">નખત્રાણા (Nakhatrana)</option>
                  </select>
                </div>
              </div>

              {/* Add Member Form */}
              {showAddMemberForm && (
                <form
                  onSubmit={handleCreateMember}
                  className="bg-white p-5 rounded-2xl border-2 border-amber-300 shadow-md space-y-4 animate-in slide-in-from-top-2"
                >
                  <h5 className="font-bold text-xs uppercase tracking-wider text-amber-800">
                    {t('નવા સભ્યની સંપૂર્ણ માહિતી ઉમેરો', 'Register New Samaj Member')}
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        સભ્ય નંબર (Member ID)
                      </label>
                      <input
                        type="text"
                        value={memberForm.memberNo}
                        onChange={(e) => setMemberForm({ ...memberForm, memberNo: e.target.value })}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        સંપૂર્ણ નામ (ગુજરાતીમાં) *
                      </label>
                      <input
                        type="text"
                        required
                        value={memberForm.fullNameGuj}
                        onChange={(e) => setMemberForm({ ...memberForm, fullNameGuj: e.target.value })}
                        placeholder="શ્રી મુકેશભાઈ કાનજીભાઈ પટેલ"
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Full Name (English) *
                      </label>
                      <input
                        type="text"
                        required
                        value={memberForm.fullNameEng}
                        onChange={(e) => setMemberForm({ ...memberForm, fullNameEng: e.target.value })}
                        placeholder="Shri Mukeshbhai K. Patel"
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        મોબાઈલ નંબર *
                      </label>
                      <input
                        type="text"
                        required
                        value={memberForm.mobile}
                        onChange={(e) => setMemberForm({ ...memberForm, mobile: e.target.value })}
                        placeholder="+91 98251 00000"
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        મૂળ કચ્છનું ગામ
                      </label>
                      <input
                        type="text"
                        value={memberForm.nativeVillageGuj}
                        onChange={(e) => setMemberForm({ ...memberForm, nativeVillageGuj: e.target.value })}
                        placeholder="માધાપર / ભુજ"
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        બ્લડ ગ્રૂપ
                      </label>
                      <select
                        value={memberForm.bloodGroup}
                        onChange={(e) => setMemberForm({ ...memberForm, bloodGroup: e.target.value })}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                      >
                        <option value="B +ve">B +ve</option>
                        <option value="O +ve">O +ve</option>
                        <option value="A +ve">A +ve</option>
                        <option value="AB +ve">AB +ve</option>
                        <option value="B -ve">B -ve</option>
                        <option value="O -ve">O -ve</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddMemberForm(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                    >
                      {t('રદ કરો', 'Cancel')}
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                    >
                      {t('નોંધણી પૂર્ણ કરો', 'Register Member')}
                    </button>
                  </div>
                </form>
              )}

              {/* Members Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-100 text-slate-900 uppercase text-[10px] font-black border-b border-slate-200">
                      <tr>
                        <th className="p-3">સભ્ય નં.</th>
                        <th className="p-3">નામ (Name)</th>
                        <th className="p-3">મૂળ ગામ (Village)</th>
                        <th className="p-3">મોબાઈલ</th>
                        <th className="p-3">બ્લડ ગ્રૂપ</th>
                        <th className="p-3 text-right">ક્રિયા</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredMembers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-6 text-center text-slate-400">
                            {t('કોઈ સભ્ય મળ્યા નથી.', 'No members found matching criteria.')}
                          </td>
                        </tr>
                      ) : (
                        filteredMembers.map((m) => (
                          <tr key={m.id} className="hover:bg-amber-50/50 transition-colors">
                            <td className="p-3 font-mono font-bold text-amber-800">
                              {m.memberNo}
                            </td>
                            <td className="p-3 font-bold text-slate-900">
                              <div>{m.fullNameGuj}</div>
                              <div className="text-[11px] text-slate-500 font-normal">{m.fullNameEng}</div>
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-semibold text-[11px]">
                                📍 {m.nativeVillageGuj}
                              </span>
                            </td>
                            <td className="p-3 font-mono">
                              {m.mobile}
                            </td>
                            <td className="p-3">
                              <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                                {m.bloodGroup}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => {
                                  deleteMember(m.id);
                                  notify(t('સભ્ય ડિરેક્ટરીમાંથી દૂર કરાયા', 'Member deleted'));
                                }}
                                className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete Member"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PERSONS MANAGEMENT */}
          {activeTab === 'persons' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                    {t('સમાજના હોદ્દેદારો & કારોબારી યાદી મેનેજમેન્ટ', 'Manage Samaj Leaders Directory')}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {t(`હાલમાં કુલ ${persons.length} આગેવાનો સાઇટ પર નોંધાયેલા છે.`, `Currently ${persons.length} persons published on the website.`)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowAddPersonForm(!showAddPersonForm)}
                    className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{showAddPersonForm ? t('ફોર્મ બંધ કરો', 'Close') : t('નવા ઉમેરો (+)', '+ Add Person')}</span>
                  </button>

                  <button
                    onClick={() => {
                      loadSamplePersons();
                      notify(t('નમૂના આગેવાનો લોડ થયા!', 'Sample leaders loaded!'));
                    }}
                    className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200 flex items-center space-x-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>{t('નમૂના ઉમેરો', 'Load Samples')}</span>
                  </button>

                  {persons.length > 0 && (
                    <button
                      onClick={() => {
                        if (confirm('Clear all persons?')) {
                          clearPersons();
                          notify(t('તમામ આગેવાનો દૂર કરાયા', 'Cleared all persons'));
                        }
                      }}
                      className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 flex items-center space-x-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t('સાફ કરો', 'Clear All')}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Add Person Form */}
              {showAddPersonForm && (
                <form
                  onSubmit={handleCreatePerson}
                  className="bg-white p-5 rounded-2xl border-2 border-amber-300 shadow-md space-y-4 animate-in slide-in-from-top-2"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">નામ (ગુજરાતીમાં) *</label>
                      <input
                        type="text"
                        required
                        value={personForm.nameGuj}
                        onChange={(e) => setPersonForm({ ...personForm, nameGuj: e.target.value })}
                        placeholder="શ્રી વિનોદભાઈ કાંતિલાલ પટેલ"
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Name (English) *</label>
                      <input
                        type="text"
                        required
                        value={personForm.nameEng}
                        onChange={(e) => setPersonForm({ ...personForm, nameEng: e.target.value })}
                        placeholder="Shri Vinodbhai K. Patel"
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">હોદ્દો (ગુજરાતીમાં)</label>
                      <input
                        type="text"
                        value={personForm.designationGuj}
                        onChange={(e) => setPersonForm({ ...personForm, designationGuj: e.target.value })}
                        placeholder="કારોબારી સભ્યશ્રી"
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">મૂળ કચ્છનું ગામ</label>
                      <input
                        type="text"
                        value={personForm.nativeKutchVillageGuj}
                        onChange={(e) => setPersonForm({ ...personForm, nativeKutchVillageGuj: e.target.value })}
                        placeholder="માધાપર / ભુજ"
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddPersonForm(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                    >
                      {t('રદ કરો', 'Cancel')}
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                    >
                      {t('સાચવો', 'Save Person')}
                    </button>
                  </div>
                </form>
              )}

              {/* List */}
              <div className="space-y-2">
                {persons.length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center text-slate-500 text-xs">
                    {t('હાલમાં કોઈ આગેવાન ઉમેરેલા નથી.', 'No persons added yet.')}
                  </div>
                ) : (
                  persons.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-3 hover:border-amber-300 transition-colors"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <img src={p.photoUrl} alt="" className="w-11 h-11 rounded-xl object-cover border border-amber-200 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold text-xs sm:text-sm text-slate-900 truncate">{p.nameGuj} ({p.nameEng})</p>
                          <p className="text-[11px] text-amber-800">{p.designationGuj} • 📍 {p.nativeKutchVillageGuj}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          deletePerson(p.id);
                          notify(t('આગેવાન દૂર કરાયા', 'Person deleted'));
                        }}
                        className="p-2 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PHOTOS MANAGEMENT */}
          {activeTab === 'photos' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                    {t('ઇવેન્ટ ફોટો ગેલેરી મેનેજમેન્ટ', 'Manage Event Photos Gallery')}
                  </h4>
                  <p className="text-xs text-slate-500">{t(`હાલમાં કુલ ${photos.length} ફોટા ઉપલબ્ધ છે.`, `Currently ${photos.length} photos.`)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowAddPhotoForm(!showAddPhotoForm)}
                    className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{showAddPhotoForm ? t('ફોર્મ બંધ કરો', 'Close') : t('નવો ફોટો (+)', '+ Add Photo')}</span>
                  </button>
                  <button
                    onClick={() => {
                      loadSamplePhotos();
                      notify(t('નમૂના ફોટો લોડ થયા!', 'Sample photos loaded!'));
                    }}
                    className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200 flex items-center space-x-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>{t('નમૂના ઉમેરો', 'Load Samples')}</span>
                  </button>
                  {photos.length > 0 && (
                    <button
                      onClick={() => {
                        if (confirm('Clear all photos?')) {
                          clearPhotos();
                          notify(t('તમામ ફોટો દૂર કરાયા', 'Cleared all photos'));
                        }
                      }}
                      className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 flex items-center space-x-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t('સાફ કરો', 'Clear All')}</span>
                    </button>
                  )}
                </div>
              </div>

              {showAddPhotoForm && (
                <form onSubmit={handleCreatePhoto} className="bg-white p-5 rounded-2xl border-2 border-amber-300 shadow-md space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">શીર્ષક *</label>
                      <input
                        type="text"
                        required
                        value={photoForm.titleGuj}
                        onChange={(e) => setPhotoForm({ ...photoForm, titleGuj: e.target.value })}
                        placeholder="રાસ-ગરબા મહોત્સવ"
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Image URL *</label>
                      <input
                        type="text"
                        required
                        value={photoForm.imageUrl}
                        onChange={(e) => setPhotoForm({ ...photoForm, imageUrl: e.target.value })}
                        placeholder="/bhavan.jpg"
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button type="button" onClick={() => setShowAddPhotoForm(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold">રદ કરો</button>
                    <button type="submit" className="px-5 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold">સાચવો</button>
                  </div>
                </form>
              )}

              <div className="space-y-2">
                {photos.length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center text-slate-500 text-xs">
                    {t('હાલમાં કોઈ ફોટો નથી.', 'No photos added yet.')}
                  </div>
                ) : (
                  photos.map((ph) => (
                    <div key={ph.id} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                      <div className="flex items-center space-x-3 min-w-0">
                        <img src={ph.imageUrl} alt="" className="w-14 h-10 rounded-lg object-cover border border-amber-200 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold text-xs sm:text-sm text-slate-900 truncate">{ph.titleGuj}</p>
                          <p className="text-[11px] text-slate-500">📅 {ph.date}</p>
                        </div>
                      </div>
                      <button onClick={() => { deletePhoto(ph.id); notify('ફોટો દૂર કરાયો'); }} className="p-2 text-rose-500 hover:text-rose-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: CALENDAR MANAGEMENT */}
          {activeTab === 'calendar' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900">{t('ઇવેન્ટ કેલેન્ડર મેનેજમેન્ટ', 'Manage Events Calendar')}</h4>
                  <p className="text-xs text-slate-500">{t(`કુલ ${events.length} કાર્યક્રમો નિર્ધારિત છે.`, `${events.length} scheduled events.`)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setShowAddEventForm(!showAddEventForm)} className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs cursor-pointer">
                    <Plus className="w-4 h-4" />
                    <span>{showAddEventForm ? 'બંધ કરો' : '+ નવો કાર્યક્રમ'}</span>
                  </button>
                  <button onClick={() => { loadSampleEvents(); notify('નમૂના કાર્યક્રમો લોડ થયા!'); }} className="px-3 py-2 rounded-xl bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200">
                    <Sparkles className="w-3.5 h-3.5 inline mr-1 text-amber-600" />
                    નમૂના ઉમેરો
                  </button>
                  {events.length > 0 && (
                    <button onClick={() => { if (confirm('Clear events?')) { clearEvents(); notify('સાફ કરાયા'); } }} className="px-3 py-2 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                      <Trash2 className="w-3.5 h-3.5 inline mr-1" />
                      સાફ કરો
                    </button>
                  )}
                </div>
              </div>

              {showAddEventForm && (
                <form onSubmit={handleCreateEvent} className="bg-white p-5 rounded-2xl border-2 border-amber-300 shadow-md space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">કાર્યક્રમ શીર્ષક *</label>
                      <input type="text" required value={eventForm.titleGuj} onChange={(e) => setEventForm({ ...eventForm, titleGuj: e.target.value })} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl" />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">તારીખ *</label>
                      <input type="text" required value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl" />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button type="button" onClick={() => setShowAddEventForm(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold">રદ કરો</button>
                    <button type="submit" className="px-5 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold">સાચવો</button>
                  </div>
                </form>
              )}

              <div className="space-y-2">
                {events.length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center text-slate-500 text-xs">
                    {t('હાલમાં કોઈ કાર્યક્રમ નથી.', 'No events scheduled yet.')}
                  </div>
                ) : (
                  events.map((ev) => (
                    <div key={ev.id} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-bold text-xs sm:text-sm text-slate-900 truncate">{ev.titleGuj}</p>
                        <p className="text-[11px] text-amber-800">📅 {ev.date} • 🕒 {ev.time}</p>
                      </div>
                      <button onClick={() => { deleteEvent(ev.id); notify('કાર્યક્રમ દૂર કરાયો'); }} className="p-2 text-rose-500 hover:text-rose-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: CLOUD DATABASE & BACKUP TOOLS */}
          {activeTab === 'database' && (
            <div className="space-y-6 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200">
              {/* Cloud Connection Panel */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-white shadow-md">
                <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                  <div className="flex items-center space-x-2.5">
                    <Cloud className="w-5 h-5 text-amber-400" />
                    <div>
                      <h4 className="font-extrabold text-sm sm:text-base text-amber-100">
                        {t('સુપાબેઝ ક્લાઉડ ડેટાબેઝ સેટિંગ્સ', 'Supabase Cloud Database Connection')}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {t('મોબાઈલ, લેપટોપ અને તમામ ડિવાઇસમાં લાઇવ ડેટા સેવ કરવા માટે કનેક્ટ કરો.', 'Connect to cloud PostgreSQL database for real-time multi-device sync.')}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    getSupabaseConfig().isConfigured ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {getSupabaseConfig().isConfigured ? '🟢 Connected' : '🟡 Offline Mode'}
                  </span>
                </div>

                <div className="mt-4 space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      Supabase Project URL:
                    </label>
                    <input
                      type="text"
                      value={cloudUrl}
                      onChange={(e) => setCloudUrl(e.target.value)}
                      placeholder="https://your-project.supabase.co"
                      className="w-full p-2.5 bg-black/40 border border-slate-700 rounded-xl text-white font-mono text-xs focus:border-amber-400 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      Supabase Anon / Public API Key:
                    </label>
                    <input
                      type="password"
                      value={cloudKey}
                      onChange={(e) => setCloudKey(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      className="w-full p-2.5 bg-black/40 border border-slate-700 rounded-xl text-white font-mono text-xs focus:border-amber-400 focus:outline-hidden"
                    />
                  </div>

                  {cloudTestStatus && (
                    <div className="p-2.5 rounded-xl bg-white/10 text-amber-200 text-xs font-semibold">
                      {cloudTestStatus}
                    </div>
                  )}

                  <div className="pt-2 flex flex-wrap gap-2.5">
                    <button
                      onClick={handleSaveCloudConfig}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      {t('કનેક્શન સાચવો (Save Config)', 'Save Config')}
                    </button>

                    <button
                      onClick={handleTestCloudConnection}
                      disabled={isTestingCloud}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors cursor-pointer flex items-center space-x-1.5"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isTestingCloud ? 'animate-spin' : ''}`} />
                      <span>{t('કનેક્શન ટેસ્ટ કરો', 'Test Connection')}</span>
                    </button>

                    <button
                      onClick={async () => {
                        const res = await syncWithSupabase();
                        notify(res.message);
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs transition-colors cursor-pointer flex items-center space-x-1.5"
                    >
                      <Cloud className="w-3.5 h-3.5" />
                      <span>{t('ક્લાઉડ સાથે સિંક કરો (Sync Now)', 'Sync with Cloud')}</span>
                    </button>

                    <button
                      onClick={copySQLSchema}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-slate-600 transition-colors cursor-pointer flex items-center space-x-1.5"
                    >
                      {copiedSQL ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSQL ? 'SQL કોપી થઈ ગયું!' : 'SQL સ્કીમા કોપી કરો'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Backup & Restore Panel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Export Card */}
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <h5 className="font-bold text-xs text-amber-950 flex items-center space-x-1.5">
                    <Download className="w-4 h-4 text-amber-600" />
                    <span>{t('સંપૂર્ણ ડેટાબેઝ એક્સપોર્ટ (Export JSON Backup)', 'Export Full Database')}</span>
                  </h5>
                  <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                    {t(
                      'તમામ સભ્યો, આગેવાનો, ફોટા અને કેલેન્ડર ડેટાબેઝને તમારી કમ્પ્યુટરમાં JSON ફાઈલ તરીકે સુરક્ષિત ડાઉનલોડ કરો.',
                      'Download a complete backup of all members, leaders, photos, and calendar events as a JSON file.'
                    )}
                  </p>
                  <button
                    onClick={handleExportJSON}
                    className="mt-3 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{t('બેકઅપ ડાઉનલોડ કરો', 'Download Backup')}</span>
                  </button>
                </div>

                {/* Import Card */}
                <div className="p-4 rounded-xl bg-slate-100 border border-slate-300">
                  <h5 className="font-bold text-xs text-slate-900 flex items-center space-x-1.5">
                    <Upload className="w-4 h-4 text-slate-700" />
                    <span>{t('ડેટાબેઝ આયાત (Import JSON Backup)', 'Restore from Backup')}</span>
                  </h5>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    {t(
                      'અગાઉ ડાઉનલોડ કરેલ JSON બેકઅપ ફાઈલ અપલોડ કરીને તમામ ડેટા પુનઃસ્થાપિત કરો.',
                      'Upload a previously exported JSON backup to restore all records.'
                    )}
                  </p>
                  <label className="mt-3 inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{t('ફાઈલ અપલોડ કરો', 'Choose File to Restore')}</span>
                    <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Bulk Reset / Populate */}
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    populateAllSampleData();
                    notify(t('તમામ નમૂના ડેટા સફળતાપૂર્વક લોડ થયો!', 'All sample database records loaded!'));
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-200 transition-colors cursor-pointer flex items-center space-x-1.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>{t('સંપૂર્ણ નમૂના ડેટાબેઝ લોડ કરો (All Sample DB)', 'Load Full Sample Database')}</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to clear the entire database?')) {
                      resetAllToEmpty();
                      notify(t('તમામ ડેટા ખાલી કરાયો', 'Cleared all records'));
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors cursor-pointer flex items-center space-x-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{t('સંપૂર્ણ ડેટા સાફ કરો (Clear DB)', 'Reset Database to Empty')}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="bg-white px-5 py-3.5 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            {t('શ્રી કલોલ કચ્છ કડવા પાટીદાર સમાજ • ડેટાબેઝ પોર્ટલ ૨૦૨૬', 'SKKKPS Master Database Portal')}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            {t('પેનલ બંધ કરો', 'Close Panel')}
          </button>
        </div>
      </div>
    </div>
  );
};
