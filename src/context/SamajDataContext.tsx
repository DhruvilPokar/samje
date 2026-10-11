import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { SamajPerson, EventPhoto, CalendarEvent, SamajMember } from '../types';
import { SAMAJ_PERSONS, EVENT_PHOTOS, CALENDAR_EVENTS } from '../data/kutchSamajData';
import { getSupabaseClient, getSupabaseConfig } from '../lib/supabase';

interface DatabaseStats {
  totalMembers: number;
  totalPersons: number;
  totalPhotos: number;
  totalEvents: number;
}

interface SamajDataContextType {
  // Data arrays
  members: SamajMember[];
  persons: SamajPerson[];
  photos: EventPhoto[];
  events: CalendarEvent[];
  stats: DatabaseStats;

  // Members operations
  addMember: (member: Omit<SamajMember, 'id'>) => void;
  updateMember: (id: string, updated: Partial<SamajMember>) => void;
  deleteMember: (id: string) => void;
  clearMembers: () => void;
  loadSampleMembers: () => void;

  // Persons operations
  addPerson: (person: Omit<SamajPerson, 'id'>) => void;
  deletePerson: (id: string) => void;
  clearPersons: () => void;
  loadSamplePersons: () => void;

  // Photos operations
  addPhoto: (photo: Omit<EventPhoto, 'id'>) => void;
  deletePhoto: (id: string) => void;
  clearPhotos: () => void;
  loadSamplePhotos: () => void;

  // Calendar Events operations
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  deleteEvent: (id: string) => void;
  clearEvents: () => void;
  loadSampleEvents: () => void;

  // Bulk and Database Tools
  populateAllSampleData: () => void;
  resetAllToEmpty: () => void;
  exportDatabaseJSON: () => string;
  importDatabaseJSON: (jsonStr: string) => { success: boolean; message: string };
  isCloudConfigured: boolean;
  syncWithSupabase: () => Promise<{ success: boolean; message: string }>;
}

export const SAMPLE_MEMBERS: SamajMember[] = [
  {
    id: 'MEM-001',
    memberNo: 'KKP-KALOL-001',
    fullNameGuj: 'પરેશભાઈ મનજીભાઈ પટેલ (પોકાર)',
    fullNameEng: 'Pareshbhai Manjibhai Patel (Pokar)',
    mobile: '+91 98251 44556',
    email: 'paresh.patel@gmail.com',
    nativeVillageGuj: 'માધાપર (કચ્છ)',
    nativeVillageEng: 'Madhapar (Kutch)',
    currentAddressGuj: '૪૨, સરદાર પટેલ સોસાયટી, બોરીસણા રોડ, કલોલ - ૩૮૨૭૨૧',
    currentAddressEng: '42, Sardar Patel Society, Borisana Road, Kalol - 382721',
    bloodGroup: 'B +ve',
    occupationGuj: 'વેપારી (મશીનરી & હાર્ડવેર)',
    occupationEng: 'Machinery & Hardware Trading',
    familyMembersCount: 5,
    role: 'member',
    isActive: true,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    createdAt: '2024-01-15',
  },
  {
    id: 'MEM-002',
    memberNo: 'KKP-KALOL-002',
    fullNameGuj: 'દિનેશભાઈ શામજીભાઈ પટેલ (વેલાણી)',
    fullNameEng: 'Dineshbhai Shamjibhai Patel (Velani)',
    mobile: '+91 98252 66778',
    email: 'dinesh.velani@yahoo.com',
    nativeVillageGuj: 'ભુજ (કચ્છ)',
    nativeVillageEng: 'Bhuj (Kutch)',
    currentAddressGuj: '૧૫, ઉમિયા નગર, હાઇવે રોડ, કલોલ',
    currentAddressEng: '15, Umiya Nagar, Highway Road, Kalol',
    bloodGroup: 'O +ve',
    occupationGuj: 'ઉદ્યોગપતિ (પ્લાસ્ટિક પ્રોડક્ટ્સ)',
    occupationEng: 'Industrialist (Plastics)',
    familyMembersCount: 4,
    role: 'member',
    isActive: true,
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    createdAt: '2024-02-10',
  },
  {
    id: 'MEM-003',
    memberNo: 'KKP-KALOL-003',
    fullNameGuj: 'ભરતભાઈ કાનજીભાઈ પટેલ (લિમ્બાણી)',
    fullNameEng: 'Bharatbhai Kanjibhai Patel (Limbani)',
    mobile: '+91 98980 11223',
    email: 'bharat.kutch@gmail.com',
    nativeVillageGuj: 'સુખપર (કચ્છ)',
    nativeVillageEng: 'Sukhpar (Kutch)',
    currentAddressGuj: '૮૮, માતૃકૃપા બંગલોઝ, છત્રાલ રોડ, કલોલ',
    currentAddressEng: '88, Matrukrupa Bungalows, Chhatral Road, Kalol',
    bloodGroup: 'A +ve',
    occupationGuj: 'ટેક્સ કન્સલ્ટન્ટ & સીએ',
    occupationEng: 'Tax Consultant & Auditor',
    familyMembersCount: 4,
    role: 'member',
    isActive: true,
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
    createdAt: '2024-03-01',
  },
  {
    id: 'MEM-004',
    memberNo: 'KKP-KALOL-004',
    fullNameGuj: 'હરેશભાઈ રમેશભાઈ પટેલ (ચોથાણી)',
    fullNameEng: 'Hareshbhai Rameshbhai Patel (Chothani)',
    mobile: '+91 98790 33445',
    email: 'haresh.chothani@gmail.com',
    nativeVillageGuj: 'માનકૂવા (કચ્છ)',
    nativeVillageEng: 'Mankuwa (Kutch)',
    currentAddressGuj: '૨૪, પાટીદાર એવન્યુ, પંચવટી, કલોલ',
    currentAddressEng: '24, Patidar Avenue, Panchvati, Kalol',
    bloodGroup: 'AB +ve',
    occupationGuj: 'બિલ્ડર & ડેવલપર',
    occupationEng: 'Real Estate Developer',
    familyMembersCount: 6,
    role: 'member',
    isActive: true,
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
    createdAt: '2024-03-15',
  },
  {
    id: 'MEM-005',
    memberNo: 'KKP-KALOL-005',
    fullNameGuj: 'અરવિંદભાઈ કરસનભાઈ પટેલ (પિંડોરિયા)',
    fullNameEng: 'Arvindbhai Karsanbhai Patel (Pindoria)',
    mobile: '+91 99240 55667',
    email: 'arvind.pindoria@hotmail.com',
    nativeVillageGuj: 'મિર્ઝાપર (કચ્છ)',
    nativeVillageEng: 'Mirzapar (Kutch)',
    currentAddressGuj: '૧૦, સરસ્વતી સોસાયટી, સાઈજ રોડ, કલોલ',
    currentAddressEng: '10, Saraswati Society, Saij Road, Kalol',
    bloodGroup: 'B +ve',
    occupationGuj: 'મિકેનિકલ એન્જિનિયર',
    occupationEng: 'Mechanical Engineer',
    familyMembersCount: 3,
    role: 'member',
    isActive: true,
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    createdAt: '2024-04-05',
  },
  {
    id: 'MEM-006',
    memberNo: 'KKP-KALOL-006',
    fullNameGuj: 'શ્રીમતી મનીષાબેન જીતેન્દ્રભાઈ પટેલ (રબારીયા)',
    fullNameEng: 'Smt. Manishaben Jitendrabhai Patel',
    mobile: '+91 98254 77889',
    email: 'manisha.patel@gmail.com',
    nativeVillageGuj: 'દહિંસરા (કચ્છ)',
    nativeVillageEng: 'Dahisara (Kutch)',
    currentAddressGuj: '૩, સહયોગ સોસાયટી, રેલવે સ્ટેશન રોડ, કલોલ',
    currentAddressEng: '3, Sahayog Society, Railway Station Road, Kalol',
    bloodGroup: 'O +ve',
    occupationGuj: 'શિક્ષિકા (હાઇસ્કૂલ)',
    occupationEng: 'High School Educator',
    familyMembersCount: 4,
    role: 'member',
    isActive: true,
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    createdAt: '2024-04-20',
  },
  {
    id: 'MEM-007',
    memberNo: 'KKP-KALOL-007',
    fullNameGuj: 'મુકેશભાઈ નારાયણભાઈ પટેલ (વરસણી)',
    fullNameEng: 'Mukeshbhai Narayanbhai Patel (Varsani)',
    mobile: '+91 98242 88990',
    email: 'mukesh.varsani@gmail.com',
    nativeVillageGuj: 'માંડવી (કચ્છ)',
    nativeVillageEng: 'Mandvi (Kutch)',
    currentAddressGuj: '૫૫, ઉમા રેસિડેન્સી, બોરીસણા, કલોલ',
    currentAddressEng: '55, Uma Residency, Borisana, Kalol',
    bloodGroup: 'A -ve',
    occupationGuj: 'ફાર્માસ્યુટિકલ ડિસ્ટ્રીબ્યુટર',
    occupationEng: 'Pharma Distributor',
    familyMembersCount: 5,
    role: 'member',
    isActive: true,
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
    createdAt: '2024-05-12',
  },
  {
    id: 'MEM-008',
    memberNo: 'KKP-KALOL-008',
    fullNameGuj: 'જયેશભાઈ પ્રેમજીભાઈ પટેલ (રૂડાણી)',
    fullNameEng: 'Jayeshbhai Premjibhai Patel (Rudani)',
    mobile: '+91 98255 12340',
    email: 'jayesh.rudani@gmail.com',
    nativeVillageGuj: 'નખત્રાણા (કચ્છ)',
    nativeVillageEng: 'Nakhatrana (Kutch)',
    currentAddressGuj: '૧૯, સરદાર પટેલ નગર, ગાંધીનગર રોડ, કલોલ',
    currentAddressEng: '19, Sardar Patel Nagar, Gandhinagar Road, Kalol',
    bloodGroup: 'O -ve',
    occupationGuj: 'ઓટોમોબાઇલ સ્પેરપાર્ટ્સ',
    occupationEng: 'Automobile Spares & Garage',
    familyMembersCount: 4,
    role: 'member',
    isActive: true,
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    createdAt: '2024-06-01',
  },
];

export const SAMPLE_PERSONS: SamajPerson[] = [
  {
    id: 'SMP-01',
    nameGuj: 'શ્રી ગોપાલભાઈ નારાયણભાઈ પટેલ (પોકાર)',
    nameEng: 'Shri Gopalbhai N. Patel (Pokar)',
    designationGuj: 'પ્રમુખશ્રી, કલોલ સમાજ',
    designationEng: 'President, SKKKPS',
    category: 'office_bearer',
    nativeKutchVillageGuj: 'માધાપર (કચ્છ)',
    nativeKutchVillageEng: 'Madhapar (Kutch)',
    currentAddress: 'બોરીસણા રોડ, કલોલ',
    phone: '+91 98250 11223',
    bloodGroup: 'B +ve',
    occupationGuj: 'ઉદ્યોગપતિ (એન્જિનિયરિંગ)',
    occupationEng: 'Industrialist (Engineering Mfg)',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    term: '૨૦૨૪-૨૦૨૭',
    badge: 'પ્રમુખ',
  },
  {
    id: 'SMP-02',
    nameGuj: 'શ્રી હસમુખભાઈ કાનજીભાઈ પટેલ (લિમ્બાણી)',
    nameEng: 'Shri Hasmukhbhai K. Patel (Limbani)',
    designationGuj: 'માનદ મંત્રીશ્રી',
    designationEng: 'Hon. General Secretary',
    category: 'office_bearer',
    nativeKutchVillageGuj: 'સુખપર (કચ્છ)',
    nativeKutchVillageEng: 'Sukhpar (Kutch)',
    currentAddress: 'છત્રાલ જીઆઇડીસી, કલોલ',
    phone: '+91 98240 33445',
    bloodGroup: 'A +ve',
    occupationGuj: 'વેપારી (હાર્ડવેર & ટ્રેડર્સ)',
    occupationEng: 'Businessman (Hardware & Metals)',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    term: '૨૦૨૪-૨૦૨૭',
    badge: 'મંત્રી',
  },
  {
    id: 'SMP-03',
    nameGuj: 'શ્રીમતી જ્યોતિબેન પ્રવીણભાઈ પટેલ',
    nameEng: 'Smt. Jyotiben Pravinbhai Patel',
    designationGuj: 'પ્રમુખશ્રી, મહિલા મંડળ',
    designationEng: 'President, Women Wing',
    category: 'wing_leader',
    nativeKutchVillageGuj: 'માનકૂવા (કચ્છ)',
    nativeKutchVillageEng: 'Mankuwa (Kutch)',
    currentAddress: 'સરદાર સોસાયટી, કલોલ',
    phone: '+91 98980 55667',
    bloodGroup: 'O +ve',
    occupationGuj: 'શિક્ષણવિદ્ & સામાજિક અગ્રણી',
    occupationEng: 'Educationist & Social Leader',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    term: '૨૦૨૪-૨૦૨૬',
    badge: 'મહિલા મંડળ',
  },
];

export const SAMPLE_PHOTOS: EventPhoto[] = [
  {
    id: 'SMPH-01',
    titleGuj: 'શ્રી કચ્છ કડવા પાટીદાર સમાજ ભવન, કલોલ',
    titleEng: 'Shree Kutch Kadva Patidar Bhavan, Kalol',
    category: 'puja',
    date: 'ભવન પરિસર',
    imageUrl: '/bhavan.jpg',
    captionGuj: 'કલોલ બોરીસણા રોડ પર આધુનિક સુવિધાયુક્ત સેન્ટ્રલ એરકન્ડિશન્ડ પાટીદાર સમાજ ભવન.',
    captionEng: 'Modern centrally AC community hall, guest rooms and dining complex on Borisana Road, Kalol.',
  },
  {
    id: 'SMPH-02',
    titleGuj: 'કુળદેવી મા ઉમિયા પાવન પૂજન મહોત્સવ',
    titleEng: 'Kuldevi Maa Umiya Pujan Mahotsav',
    category: 'puja',
    date: 'વાર્ષિક પાટોત્સવ',
    imageUrl: '/kutch_heritage.jpg',
    captionGuj: 'સમાજ ભવન ખાતે શ્રદ્ધાપૂર્વક યોજાયેલ મા ઉમિયા મહાપૂજન અને નવચંડી હવન દર્શન.',
    captionEng: 'Auspicious Maa Umiya Pujan, Navchandi Yagna and Maha Aarti at Kalol Patidar Bhavan.',
  },
];

export const SAMPLE_EVENTS: CalendarEvent[] = [
  {
    id: 'SMPE-01',
    titleGuj: 'ભવ્ય શરદ પૂનમ રાસ-ગરબા અને પ્રસાદી ઉત્સવ',
    titleEng: 'Grand Sharad Purnima Raas-Garba & Mahaprasad Night',
    date: '૨૫ ઓક્ટોબર, ૨૦૨૬',
    dayGuj: 'રવિવાર',
    dayEng: 'Sunday',
    tithiGuj: 'આસો સુદ પૂનમ (શરદ પૂર્ણિમા)',
    time: 'સાંજે ૭:૩૦ થી રાત્રે ૧૨:૦૦',
    venueGuj: 'શ્રી કચ્છ કડવા પાટીદાર ભવન પાર્ટી પ્લોટ, કલોલ',
    venueEng: 'Shree Kutch Kadva Patidar Bhavan Lawns, Kalol',
    category: 'festival',
    descriptionGuj: 'કચ્છના પારંપરિક લોકગાયકો સાથે દૂધ-પૌંઆની પ્રસાદી અને પારંપરિક વેશભૂષા રાસ-ગરબા.',
    descriptionEng: 'Traditional Gujarati Garba with authentic Kutchi folk singers and Dudh-Poha prasad distribution.',
    rsvpCount: 420,
  },
  {
    id: 'SMPE-02',
    titleGuj: 'વાર્ષિક સાધારણ સભા (AGM) ૨૦૨૬',
    titleEng: 'Annual General Body Meeting (AGM) 2026',
    date: '૧૫ નવેમ્બર, ૨૦૨૬',
    dayGuj: 'રવિવાર',
    dayEng: 'Sunday',
    tithiGuj: 'કારતક સુદ સાતમ',
    time: 'સવારે ૧૦:૦૦ થી બપોરે ૧:૦૦',
    venueGuj: 'ઓડિટોરિયમ હોલ, સમાજ ભવન, કલોલ',
    venueEng: 'Auditorium Hall, Samaj Bhavan, Kalol',
    category: 'meeting',
    descriptionGuj: 'વાર્ષિક ઓડિટ હિસાબોની બહાલી, આગામી શૈક્ષણિક પ્રકલ્પોની સમીક્ષા અને સ્નેહ સંમેલન.',
    descriptionEng: 'Approval of audited annual accounts, review of upcoming education initiatives and community fellowship.',
    rsvpCount: 250,
  },
];

const SamajDataContext = createContext<SamajDataContextType | undefined>(undefined);

export const SamajDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Members database state
  const [members, setMembers] = useState<SamajMember[]>(() => {
    try {
      const saved = localStorage.getItem('kps_members');
      return saved ? JSON.parse(saved) : SAMPLE_MEMBERS;
    } catch {
      return SAMPLE_MEMBERS;
    }
  });

  // Samaj Leaders state
  const [persons, setPersons] = useState<SamajPerson[]>(() => {
    try {
      const saved = localStorage.getItem('kps_persons');
      return saved ? JSON.parse(saved) : SAMAJ_PERSONS;
    } catch {
      return SAMAJ_PERSONS;
    }
  });

  // Event Photos state
  const [photos, setPhotos] = useState<EventPhoto[]>(() => {
    try {
      const saved = localStorage.getItem('kps_photos');
      return saved ? JSON.parse(saved) : EVENT_PHOTOS;
    } catch {
      return EVENT_PHOTOS;
    }
  });

  // Calendar Events state
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    try {
      const saved = localStorage.getItem('kps_events');
      return saved ? JSON.parse(saved) : CALENDAR_EVENTS;
    } catch {
      return CALENDAR_EVENTS;
    }
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('kps_members', JSON.stringify(members));
    } catch (e) {
      console.warn('Storage quota limit reached:', e);
    }
  }, [members]);

  useEffect(() => {
    try {
      localStorage.setItem('kps_persons', JSON.stringify(persons));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [persons]);

  useEffect(() => {
    try {
      localStorage.setItem('kps_photos', JSON.stringify(photos));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [photos]);

  useEffect(() => {
    try {
      localStorage.setItem('kps_events', JSON.stringify(events));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [events]);

  // Members Handlers
  const addMember = (memberData: Omit<SamajMember, 'id'>) => {
    const newMember: SamajMember = {
      ...memberData,
      id: `MEM-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setMembers((prev) => [newMember, ...prev]);
  };

  const updateMember = (id: string, updated: Partial<SamajMember>) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...updated } : m)));
  };

  const deleteMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const clearMembers = () => {
    setMembers([]);
  };

  const loadSampleMembers = () => {
    setMembers(SAMPLE_MEMBERS);
  };

  // Persons Handlers
  const addPerson = (personData: Omit<SamajPerson, 'id'>) => {
    const newPerson: SamajPerson = {
      ...personData,
      id: `PER-${Date.now()}`,
    };
    setPersons((prev) => [newPerson, ...prev]);
  };

  const deletePerson = (id: string) => {
    setPersons((prev) => prev.filter((p) => p.id !== id));
  };

  const clearPersons = () => {
    setPersons([]);
  };

  const loadSamplePersons = () => {
    setPersons(SAMPLE_PERSONS);
  };

  // Photos Handlers
  const addPhoto = (photoData: Omit<EventPhoto, 'id'>) => {
    const newPhoto: EventPhoto = {
      ...photoData,
      id: `PH-${Date.now()}`,
    };
    setPhotos((prev) => [newPhoto, ...prev]);
  };

  const deletePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const clearPhotos = () => {
    setPhotos([]);
  };

  const loadSamplePhotos = () => {
    setPhotos(SAMPLE_PHOTOS);
  };

  // Events Handlers
  const addEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `EVT-${Date.now()}`,
    };
    setEvents((prev) => [newEvent, ...prev]);
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const clearEvents = () => {
    setEvents([]);
  };

  const loadSampleEvents = () => {
    setEvents(SAMPLE_EVENTS);
  };

  // Bulk Database Operations
  const populateAllSampleData = () => {
    setMembers(SAMPLE_MEMBERS);
    setPersons(SAMPLE_PERSONS);
    setPhotos(SAMPLE_PHOTOS);
    setEvents(SAMPLE_EVENTS);
  };

  const resetAllToEmpty = () => {
    setPersons([]);
    setPhotos([]);
    setEvents([]);
  };

  // Export full database as structured JSON
  const exportDatabaseJSON = useCallback(() => {
    const exportBundle = {
      samaj: 'Shree Kalol Kutch Kadva Patidar Samaj',
      exportedAt: new Date().toISOString(),
      version: '1.0',
      database: {
        members,
        persons,
        photos,
        events,
      },
    };
    return JSON.stringify(exportBundle, null, 2);
  }, [members, persons, photos, events]);

  // Import full database from structured JSON
  const importDatabaseJSON = (jsonStr: string): { success: boolean; message: string } => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed.database) {
        return { success: false, message: 'અમાન્ય ડેટાબેઝ ફોર્મેટ / Invalid database format' };
      }
      if (Array.isArray(parsed.database.members)) setMembers(parsed.database.members);
      if (Array.isArray(parsed.database.persons)) setPersons(parsed.database.persons);
      if (Array.isArray(parsed.database.photos)) setPhotos(parsed.database.photos);
      if (Array.isArray(parsed.database.events)) setEvents(parsed.database.events);
      return { success: true, message: 'ડેટાબેઝ સફળતાપૂર્વક આયાત કરવામાં આવ્યો! / Database successfully imported!' };
    } catch {
      return { success: false, message: 'JSON ફાઈલ વાંચવામાં ભૂલ / Failed to parse JSON file' };
    }
  };

  // Cloud Supabase Sync
  const isCloudConfigured = getSupabaseConfig().isConfigured;

  const syncWithSupabase = async (): Promise<{ success: boolean; message: string }> => {
    const client = getSupabaseClient();
    if (!client) {
      return {
        success: false,
        message: 'સુપાબેઝ કનેક્શન સેટ કરેલ નથી. કૃપા કરીને સેટિંગ્સમાં URL અને Key ઉમેરો. / Supabase is not configured.',
      };
    }

    try {
      // 1. Fetch cloud persons
      const { data: cloudPersons, error: personsErr } = await client.from('samaj_persons').select('*');
      if (personsErr && personsErr.code !== '42P01') {
        return { success: false, message: `Cloud fetch error: ${personsErr.message}` };
      }
      if (cloudPersons && cloudPersons.length > 0) {
        setPersons(
          cloudPersons.map((p) => ({
            id: p.id,
            nameGuj: p.name_guj,
            nameEng: p.name_eng,
            designationGuj: p.designation_guj,
            designationEng: p.designation_eng,
            category: p.category,
            nativeKutchVillageGuj: p.native_kutch_village_guj,
            nativeKutchVillageEng: p.native_kutch_village_eng,
            currentAddress: p.current_address || '',
            phone: p.phone,
            bloodGroup: p.blood_group || '',
            occupationGuj: p.occupation_guj || '',
            occupationEng: p.occupation_eng || '',
            photoUrl: p.photo_url || '',
            term: p.term,
            badge: p.badge,
          }))
        );
      }

      return {
        success: true,
        message: 'ક્લાઉડ ડેટાબેઝ સાથે સફળતાપૂર્વક સમન્વય (Sync) થઈ ગયું! / Cloud sync completed successfully!',
      };
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Sync failed',
      };
    }
  };

  const stats: DatabaseStats = {
    totalMembers: members.length,
    totalPersons: persons.length,
    totalPhotos: photos.length,
    totalEvents: events.length,
  };

  return (
    <SamajDataContext.Provider
      value={{
        members,
        persons,
        photos,
        events,
        stats,
        addMember,
        updateMember,
        deleteMember,
        clearMembers,
        loadSampleMembers,
        addPerson,
        deletePerson,
        clearPersons,
        loadSamplePersons,
        addPhoto,
        deletePhoto,
        clearPhotos,
        loadSamplePhotos,
        addEvent,
        deleteEvent,
        clearEvents,
        loadSampleEvents,
        populateAllSampleData,
        resetAllToEmpty,
        exportDatabaseJSON,
        importDatabaseJSON,
        isCloudConfigured,
        syncWithSupabase,
      }}
    >
      {children}
    </SamajDataContext.Provider>
  );
};

export const useSamajData = () => {
  const context = useContext(SamajDataContext);
  if (!context) {
    throw new Error('useSamajData must be used within a SamajDataProvider');
  }
  return context;
};
