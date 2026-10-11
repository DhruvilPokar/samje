import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthUser, UserRole } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isMember: boolean;
  loginAsMember: (phoneOrId: string, password?: string) => { success: boolean; error?: string };
  loginAsAdmin: (username: string, password?: string) => { success: boolean; error?: string };
  loginWithUser: (user: AuthUser) => void;
  quickDemoLogin: (role: UserRole) => void;
  logout: () => void;
  updateMemberProfile: (updated: Partial<AuthUser>) => void;
}

export const DEMO_MEMBER: AuthUser = {
  id: 'USR-MEM-101',
  role: 'member',
  nameGuj: 'પરેશભાઈ મનજીભાઈ પટેલ (પોકાર)',
  nameEng: 'Pareshbhai Manjibhai Patel (Pokar)',
  memberId: 'KKP-KALOL-101',
  phone: '+91 98251 44556',
  email: 'paresh.patel@gmail.com',
  nativeKutchVillageGuj: 'માધાપર (કચ્છ)',
  nativeKutchVillageEng: 'Madhapar (Kutch)',
  addressGuj: '૪૨, સરદાર પટેલ સોસાયટી, બોરીસણા રોડ, કલોલ - ૩૮૨૭૨૧',
  addressEng: '42, Sardar Patel Society, Borisana Road, Kalol - 382721',
  bloodGroup: 'B +ve',
  familyMembersCount: 5,
  joinedYear: '2004',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
};

export const DEMO_ADMIN: AuthUser = {
  id: 'USR-ADM-001',
  role: 'admin',
  nameGuj: 'પ્રમુખ / વહીવટી સંચાલક (એડમિન)',
  nameEng: 'President / Administrator (Admin)',
  phone: '+91 98251 44556',
  email: 'admin@kalolkutchpatidar.org',
  memberId: 'KKP-ADMIN-01',
  nativeKutchVillageGuj: 'કલોલ કેન્દ્ર / મૂળ ભુજ (કચ્છ)',
  nativeKutchVillageEng: 'Kalol Central / Native Bhuj (Kutch)',
  addressGuj: 'શ્રી કચ્છ કડવા પાટીદાર સમાજ ભવન, બોરીસણા રોડ, કલોલ',
  addressEng: 'Shree Kutch Kadva Patidar Samaj Bhavan, Borisana Road, Kalol',
  bloodGroup: 'O +ve',
  joinedYear: '1981',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('kps_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('kps_auth_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('kps_auth_user');
      }
    } catch {
      // storage quota or private mode
    }
  }, [user]);

  const loginWithUser = (authUser: AuthUser) => {
    setUser(authUser);
  };

  const loginAsMember = (phoneOrId: string, password = ''): { success: boolean; error?: string } => {
    const cleanInput = phoneOrId.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanInput) {
      return { success: false, error: 'કૃપા કરીને સભ્ય નંબર અથવા મોબાઈલ દાખલ કરો / Please enter Member ID or Mobile Number' };
    }

    // 1. Check registered members in localStorage
    try {
      const stored = localStorage.getItem('kps_members');
      if (stored) {
        const membersList = JSON.parse(stored);
        const cleanDigits = cleanInput.replace(/\D/g, '');
        const matched = membersList.find((m: any) => {
          const mDigits = m.mobile ? String(m.mobile).replace(/\D/g, '') : '';
          const matchMobile = cleanDigits.length >= 8 && (mDigits.includes(cleanDigits) || cleanDigits.includes(mDigits));
          const matchNo = m.memberNo && String(m.memberNo).toLowerCase() === cleanInput;
          const matchId = m.id && String(m.id).toLowerCase() === cleanInput;
          return matchMobile || matchNo || matchId;
        });

        if (matched) {
          // If a password exists on the profile and user entered a password, check it
          if (matched.password && cleanPass && matched.password !== cleanPass) {
            return {
              success: false,
              error: 'પાસવર્ડ ખોટો છે. કૃપા કરીને સાચો પાસવર્ડ દાખલ કરો. / Incorrect password.',
            };
          }

          const authUser: AuthUser = {
            id: matched.id,
            role: 'member',
            nameGuj: matched.fullNameGuj,
            nameEng: matched.fullNameEng,
            memberId: matched.memberNo,
            phone: matched.mobile,
            email: matched.email || '',
            nativeKutchVillageGuj: matched.nativeVillageGuj,
            nativeKutchVillageEng: matched.nativeVillageEng,
            addressGuj: matched.currentAddressGuj,
            addressEng: matched.currentAddressEng,
            bloodGroup: matched.bloodGroup,
            familyMembersCount: matched.familyMembersCount,
            joinedYear: matched.createdAt ? new Date(matched.createdAt).getFullYear().toString() : '2024',
            avatarUrl: matched.photoUrl,
          };
          setUser(authUser);
          return { success: true };
        }
      }
    } catch (e) {
      console.warn('Error verifying registered member:', e);
    }

    // 2. Demo member fallback
    if (
      cleanInput === '9825144556' ||
      cleanInput === 'kkp-kalol-101' ||
      cleanInput.includes('101') ||
      cleanPass === 'member' ||
      cleanPass === 'member123' ||
      cleanPass === '123456'
    ) {
      setUser(DEMO_MEMBER);
      return { success: true };
    }

    return { success: false, error: 'અમાન્ય સભ્ય વિગતો અથવા પાસવર્ડ. નવી નોંધણી કરવા માટે સાઇન અપ (Sign Up) કરો. / Invalid credentials. Please Sign Up if you are a new member.' };
  };

  const loginAsAdmin = (username: string, password = ''): { success: boolean; error?: string } => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanUser) {
      return { success: false, error: 'કૃપા કરીને એડમિન યુઝરનેમ દાખલ કરો / Please enter Admin username' };
    }

    if (
      cleanUser === 'admin' ||
      cleanUser === 'admin@kalolkutchpatidar.org' ||
      cleanPass === 'admin' ||
      cleanPass === 'admin123'
    ) {
      setUser(DEMO_ADMIN);
      return { success: true };
    }

    return { success: false, error: 'અમાન્ય એડમિન પાસવર્ડ. ડેમો માટે admin / admin123 વાપરો. / Invalid credentials. Use admin / admin123.' };
  };

  const quickDemoLogin = (role: UserRole) => {
    if (role === 'admin') {
      setUser(DEMO_ADMIN);
    } else {
      setUser(DEMO_MEMBER);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateMemberProfile = (updated: Partial<AuthUser>) => {
    setUser((prev) => (prev ? { ...prev, ...updated } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isMember: user?.role === 'member',
        loginAsMember,
        loginAsAdmin,
        loginWithUser,
        quickDemoLogin,
        logout,
        updateMemberProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
