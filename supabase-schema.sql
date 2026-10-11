-- =========================================================================
-- Shree Kalol Kutch Kadva Patidar Samaj (SKKKPS) - Cloud Database Schema
-- Compatible with PostgreSQL / Supabase
-- =========================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Samaj Members Directory Table (Capacity for 10,000+ community members)
CREATE TABLE IF NOT EXISTS samaj_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_no VARCHAR(50) UNIQUE NOT NULL, -- e.g. KKP-KALOL-001
    full_name_guj VARCHAR(255) NOT NULL,
    full_name_eng VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    email VARCHAR(150),
    native_village_guj VARCHAR(100) NOT NULL, -- e.g. માધાપર
    native_village_eng VARCHAR(100) NOT NULL, -- e.g. Madhapar
    current_address_guj TEXT NOT NULL,
    current_address_eng TEXT NOT NULL,
    blood_group VARCHAR(10), -- e.g. B +ve, O +ve
    occupation_guj VARCHAR(150),
    occupation_eng VARCHAR(150),
    family_members_count INT DEFAULT 1,
    role VARCHAR(20) DEFAULT 'member', -- 'member' | 'admin' | 'trustee'
    is_active BOOLEAN DEFAULT TRUE,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for instant lookup by mobile, member_no and village
CREATE INDEX IF NOT EXISTS idx_members_mobile ON samaj_members(mobile);
CREATE INDEX IF NOT EXISTS idx_members_member_no ON samaj_members(member_no);
CREATE INDEX IF NOT EXISTS idx_members_native_village ON samaj_members(native_village_eng);

-- 3. Samaj Persons & Managing Committee Table
CREATE TABLE IF NOT EXISTS samaj_persons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_guj VARCHAR(255) NOT NULL,
    name_eng VARCHAR(255) NOT NULL,
    designation_guj VARCHAR(150) NOT NULL,
    designation_eng VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'office_bearer', 'executive', 'wing_leader', 'advisory'
    native_kutch_village_guj VARCHAR(100) NOT NULL,
    native_kutch_village_eng VARCHAR(100) NOT NULL,
    current_address TEXT,
    phone VARCHAR(30) NOT NULL,
    blood_group VARCHAR(10),
    occupation_guj VARCHAR(150),
    occupation_eng VARCHAR(150),
    photo_url TEXT,
    term VARCHAR(50),
    badge VARCHAR(50),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Event Photos Table
CREATE TABLE IF NOT EXISTS event_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_guj VARCHAR(255) NOT NULL,
    title_eng VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'garba', 'sammelan', 'education', 'health', 'puja'
    date_text VARCHAR(100) NOT NULL,
    image_url TEXT NOT NULL,
    caption_guj TEXT,
    caption_eng TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Calendar Events Table
CREATE TABLE IF NOT EXISTS calendar_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_guj VARCHAR(255) NOT NULL,
    title_eng VARCHAR(255) NOT NULL,
    event_date VARCHAR(100) NOT NULL,
    day_guj VARCHAR(50),
    day_eng VARCHAR(50),
    tithi_guj VARCHAR(100),
    event_time VARCHAR(100),
    venue_guj VARCHAR(255),
    venue_eng VARCHAR(255),
    category VARCHAR(50) NOT NULL, -- 'festival', 'meeting', 'education', 'health', 'sports'
    description_guj TEXT,
    description_eng TEXT,
    rsvp_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Samaj Bhavan Hall Booking Inquiries
CREATE TABLE IF NOT EXISTS bhavan_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    applicant_name VARCHAR(255) NOT NULL,
    member_no VARCHAR(50),
    mobile VARCHAR(30) NOT NULL,
    event_type VARCHAR(100) NOT NULL, -- લગ્ન પ્રસંગ, સ્નેહમિલન, સામાજિક સભા
    booking_date DATE NOT NULL,
    hall_type VARCHAR(100) DEFAULT 'Main AC Banquet Hall',
    guests_count INT,
    status VARCHAR(30) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Row Level Security (RLS) Configuration
ALTER TABLE samaj_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE samaj_persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE bhavan_bookings ENABLE ROW LEVEL SECURITY;

-- Allow public read access for community directory
CREATE POLICY "Public read samaj_members" ON samaj_members FOR SELECT USING (true);
CREATE POLICY "Public read samaj_persons" ON samaj_persons FOR SELECT USING (true);
CREATE POLICY "Public read event_photos" ON event_photos FOR SELECT USING (true);
CREATE POLICY "Public read calendar_events" ON calendar_events FOR SELECT USING (true);
CREATE POLICY "Public insert bookings" ON bhavan_bookings FOR INSERT WITH CHECK (true);

-- Allow authenticated admins to insert/update/delete
CREATE POLICY "Admin write samaj_members" ON samaj_members FOR ALL USING (true);
CREATE POLICY "Admin write samaj_persons" ON samaj_persons FOR ALL USING (true);
CREATE POLICY "Admin write event_photos" ON event_photos FOR ALL USING (true);
CREATE POLICY "Admin write calendar_events" ON calendar_events FOR ALL USING (true);
CREATE POLICY "Admin write bhavan_bookings" ON bhavan_bookings FOR ALL USING (true);
