export type Language = 'gu' | 'en';

export type ActiveTab = 'samaj' | 'persons' | 'photos' | 'calendar';

export type UserRole = 'admin' | 'member';

export interface AuthUser {
  id: string;
  role: UserRole;
  nameGuj: string;
  nameEng: string;
  phone: string;
  email?: string;
  memberId?: string;
  nativeKutchVillageGuj?: string;
  nativeKutchVillageEng?: string;
  addressGuj?: string;
  addressEng?: string;
  bloodGroup?: string;
  familyMembersCount?: number;
  joinedYear?: string;
  avatarUrl?: string;
}

export interface SamajPerson {
  id: string;
  nameGuj: string;
  nameEng: string;
  designationGuj: string;
  designationEng: string;
  category: 'office_bearer' | 'executive' | 'wing_leader' | 'advisory';
  nativeKutchVillageGuj: string;
  nativeKutchVillageEng: string;
  currentAddress: string;
  phone: string;
  bloodGroup: string;
  occupationGuj: string;
  occupationEng: string;
  photoUrl: string;
  term?: string;
  badge?: string;
}

export interface EventPhoto {
  id: string;
  titleGuj: string;
  titleEng: string;
  category: 'garba' | 'sammelan' | 'education' | 'health' | 'puja';
  date: string;
  imageUrl: string;
  captionGuj: string;
  captionEng: string;
}

export interface CalendarEvent {
  id: string;
  titleGuj: string;
  titleEng: string;
  date: string;
  dayGuj: string;
  dayEng: string;
  tithiGuj: string;
  time: string;
  venueGuj: string;
  venueEng: string;
  category: 'festival' | 'meeting' | 'education' | 'health' | 'sports';
  descriptionGuj: string;
  descriptionEng: string;
  rsvpCount: number;
}

export interface SamajMember {
  id: string;
  memberNo: string;
  fullNameGuj: string;
  fullNameEng: string;
  mobile: string;
  email?: string;
  nativeVillageGuj: string;
  nativeVillageEng: string;
  currentAddressGuj: string;
  currentAddressEng: string;
  bloodGroup: string;
  occupationGuj: string;
  occupationEng: string;
  familyMembersCount: number;
  role: 'member' | 'admin' | 'trustee';
  isActive: boolean;
  password?: string;
  photoUrl?: string;
  createdAt?: string;
}

