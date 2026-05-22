-- VolleyClub Pro - Seed Data
-- Phase 2: Comprehensive Seed Data

-- Clear all existing data to prevent conflicts
TRUNCATE TABLE public.role_permissions CASCADE;
TRUNCATE TABLE public.user_roles CASCADE;
TRUNCATE TABLE public.permissions CASCADE;
TRUNCATE TABLE public.roles CASCADE;
TRUNCATE TABLE public.users CASCADE;
TRUNCATE TABLE public.clubs CASCADE;
TRUNCATE TABLE public.seasons CASCADE;
TRUNCATE TABLE public.sports CASCADE;
TRUNCATE TABLE public.age_groups CASCADE;
TRUNCATE TABLE public.teams CASCADE;
TRUNCATE TABLE public.players CASCADE;
TRUNCATE TABLE public.player_profiles CASCADE;
TRUNCATE TABLE public.player_medical CASCADE;
TRUNCATE TABLE public.player_contracts CASCADE;
TRUNCATE TABLE public.player_documents CASCADE;
TRUNCATE TABLE public.player_statistics CASCADE;
TRUNCATE TABLE public.staff CASCADE;
TRUNCATE TABLE public.staff_roles CASCADE;
TRUNCATE TABLE public.staff_attendance CASCADE;
TRUNCATE TABLE public.training_sessions CASCADE;
TRUNCATE TABLE public.attendance_sessions CASCADE;
TRUNCATE TABLE public.attendance_records CASCADE;
TRUNCATE TABLE public.training_plans CASCADE;
TRUNCATE TABLE public.trainings CASCADE;
TRUNCATE TABLE public.training_loads CASCADE;
TRUNCATE TABLE public.rpe_logs CASCADE;
TRUNCATE TABLE public.matches CASCADE;
TRUNCATE TABLE public.match_lineups CASCADE;
TRUNCATE TABLE public.match_sets CASCADE;
TRUNCATE TABLE public.match_statistics CASCADE;
TRUNCATE TABLE public.rally_tracking CASCADE;
TRUNCATE TABLE public.announcements CASCADE;
TRUNCATE TABLE public.messages CASCADE;
TRUNCATE TABLE public.tasks CASCADE;
TRUNCATE TABLE public.notifications CASCADE;

-- ========================================================
-- 1. SEED ROLES AND PERMISSIONS
-- ========================================================

-- Insert Roles
INSERT INTO public.roles (id, name, description) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Super Admin', 'Full control over the entire system'),
  ('22222222-2222-2222-2222-222222222222', 'Club Director', 'Oversees club-wide configurations and reports'),
  ('33333333-3333-3333-3333-333333333333', 'Sports Director', 'Manages seasons, teams, and coaching assignments'),
  ('44444444-4444-4444-4444-444444444444', 'Team Admin', 'Handles administration for designated teams'),
  ('55555555-5555-5555-5555-555555555555', 'Head Coach', 'Designs training plans, runs sessions, logs matches'),
  ('66666666-6666-6666-6666-666666666666', 'Assistant Coach', 'Assists in trainings and records session statistics'),
  ('77777777-7777-7777-7777-777777777777', 'Analyst', 'Enters detailed match event stats and compiles reports'),
  ('88888888-8888-8888-8888-888888888888', 'Medical Staff', 'Tracks injuries, player health, and logs checkups'),
  ('99999999-9999-9999-9999-999999999999', 'Player', 'Logs RPE scores, views dashboard and schedules'),
  ('00000000-0000-0000-0000-000000000000', 'Parent', 'Monitors schedules, attendance, and player health');

-- Insert Permissions
INSERT INTO public.permissions (id, name, description) VALUES
  ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'all:manage', 'Superadmin complete permission'),
  ('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'roster:read', 'View players profile and stats'),
  ('c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'roster:write', 'Create/edit player profiles'),
  ('d4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'medical:read', 'View private medical records'),
  ('e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', 'medical:write', 'Add injuries and checkup records'),
  ('f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6', 'attendance:log', 'Record session presence/lateness'),
  ('07070707-0707-0707-0707-070707070707', 'match:stats', 'Log detailed volleyball event stats during play');

-- Bind Permissions to Roles (Sample mapping)
INSERT INTO public.role_permissions (role_id, permission_id) VALUES
  ('11111111-1111-1111-1111-111111111111', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1'), -- Admin -> Manage All
  ('55555555-5555-5555-5555-555555555555', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2'), -- Coach -> Roster read
  ('55555555-5555-5555-5555-555555555555', 'f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6'), -- Coach -> Attendance log
  ('77777777-7777-7777-7777-777777777777', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2'), -- Analyst -> Roster read
  ('77777777-7777-7777-7777-777777777777', '07070707-0707-0707-0707-070707070707'), -- Analyst -> Match stats
  ('88888888-8888-8888-8888-888888888888', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2'), -- Medical -> Roster read
  ('88888888-8888-8888-8888-888888888888', 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4'), -- Medical -> Medical read
  ('88888888-8888-8888-8888-888888888888', 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5'); -- Medical -> Medical write

-- ========================================================
-- 2. SEED USERS AND CLUB STRUCTURE
-- ========================================================

-- Seed public.users (representing logged in accounts)
INSERT INTO public.users (id, email, full_name, avatar_url) VALUES
  ('d0be3c41-863a-4a65-b1a7-f9ff227eb0c9', 'admin@volleyclub.com', 'Super Admin Alberto', 'https://api.dicebear.com/7.x/adventurer/svg?seed=alberto'),
  ('b2aa843a-23d2-4355-89f4-0b16a22c5443', 'coach.ahmed@volleyclub.com', 'Coach Ahmed Hassan', 'https://api.dicebear.com/7.x/adventurer/svg?seed=ahmed'),
  ('c1b48b6c-e35c-443b-b27b-586bfa8a7f72', 'analyst.samy@volleyclub.com', 'Samy Mansoor (Analyst)', 'https://api.dicebear.com/7.x/adventurer/svg?seed=samy'),
  ('a8ee48ac-0c2c-47bc-ad7e-07e0c466c1b7', 'medical.youssef@volleyclub.com', 'Dr. Youssef Fadel', 'https://api.dicebear.com/7.x/adventurer/svg?seed=youssef'),
  -- Players
  ('e577ea53-7393-4a1d-a029-dfdbef281691', 'setter.hassan@volleyclub.com', 'Hassan Ibrahim', 'https://api.dicebear.com/7.x/adventurer/svg?seed=hassan'),
  ('f499ee83-c393-433b-a2cc-fa2efec82b31', 'opposite.ali@volleyclub.com', 'Ali Reda', 'https://api.dicebear.com/7.x/adventurer/svg?seed=ali'),
  ('a122e23f-e119-455b-9fca-77eeff28c119', 'hitter.khalid@volleyclub.com', 'Khalid Zaki', 'https://api.dicebear.com/7.x/adventurer/svg?seed=khalid'),
  ('bcde45aa-c3aa-44bb-99cc-f99a88bb77cc', 'blocker.yassin@volleyclub.com', 'Yassin Nour', 'https://api.dicebear.com/7.x/adventurer/svg?seed=yassin'),
  ('cd11bbcc-ffaa-44bb-88aa-f77a88bb9900', 'libero.omar@volleyclub.com', 'Omar Amin', 'https://api.dicebear.com/7.x/adventurer/svg?seed=omar');

-- Map Users to Roles
INSERT INTO public.user_roles (user_id, role_id) VALUES
  ('d0be3c41-863a-4a65-b1a7-f9ff227eb0c9', '11111111-1111-1111-1111-111111111111'), -- Admin
  ('b2aa843a-23d2-4355-89f4-0b16a22c5443', '55555555-5555-5555-5555-555555555555'), -- Head Coach
  ('c1b48b6c-e35c-443b-b27b-586bfa8a7f72', '77777777-7777-7777-7777-777777777777'), -- Analyst
  ('a8ee48ac-0c2c-47bc-ad7e-07e0c466c1b7', '88888888-8888-8888-8888-888888888888'), -- Medical
  ('e577ea53-7393-4a1d-a029-dfdbef281691', '99999999-9999-9999-9999-999999999999'), -- Player 1
  ('f499ee83-c393-433b-a2cc-fa2efec82b31', '99999999-9999-9999-9999-999999999999'), -- Player 2
  ('a122e23f-e119-455b-9fca-77eeff28c119', '99999999-9999-9999-9999-999999999999'), -- Player 3
  ('bcde45aa-c3aa-44bb-99cc-f99a88bb77cc', '99999999-9999-9999-9999-999999999999'), -- Player 4
  ('cd11bbcc-ffaa-44bb-88aa-f77a88bb9900', '99999999-9999-9999-9999-999999999999'); -- Player 5

-- Seed Club
INSERT INTO public.clubs (id, name_en, name_ar, logo_url) VALUES
  ('a1c1a1c1-1c1c-1c1c-1c1c-1c1c1c1c1c1c', 'VolleyClub Elite', 'نادي فولي كلوب النخبة', 'https://api.dicebear.com/7.x/identicon/svg?seed=volleyclub');

-- Seed Season
INSERT INTO public.seasons (id, club_id, name_en, name_ar, start_date, end_date, is_active) VALUES
  ('20262026-2026-2026-2026-202620262026', 'a1c1a1c1-1c1c-1c1c-1c1c-1c1c1c1c1c1c', '2025/2026 Season', 'موسم 2025 / 2026', '2025-09-01', '2026-06-30', true);

-- Seed Sport
INSERT INTO public.sports (id, name_en, name_ar) VALUES
  ('88887777-6666-5555-4444-333322221111', 'Indoor Volleyball', 'الكرة الطائرة داخل الصالات');

-- Seed Age Groups
INSERT INTO public.age_groups (id, club_id, name_en, name_ar, min_age, max_age) VALUES
  ('12121212-1212-1212-1212-121212121212', 'a1c1a1c1-1c1c-1c1c-1c1c-1c1c1c1c1c1c', 'Under 19 (U19)', 'تحت 19 سنة', 15, 19),
  ('18181818-1818-1818-1818-181818181818', 'a1c1a1c1-1c1c-1c1c-1c1c-1c1c1c1c1c1c', 'First Team', 'الفريق الأول', 18, 40);

-- Seed Team
INSERT INTO public.teams (id, club_id, season_id, age_group_id, sport_id, name_en, name_ar, gender, color_hex) VALUES
  ('7ee77ee7-7ee7-7ee7-7ee7-7ee77ee77ee7', 'a1c1a1c1-1c1c-1c1c-1c1c-1c1c1c1c1c1c', '20262026-2026-2026-2026-202620262026', '18181818-1818-1818-1818-181818181818', '88887777-6666-5555-4444-333322221111', 'VolleyClub Elite Men First Team', 'فولي كلوب النخبة - الفريق الأول للرجال', 'Men', '#1E40AF');

-- ========================================================
-- 3. SEED PLAYERS DOMAIN DATA
-- ========================================================

-- Create Player Base Records
INSERT INTO public.players (id, user_id, club_id) VALUES
  ('p1111111-1111-1111-1111-111111111111', 'e577ea53-7393-4a1d-a029-dfdbef281691', 'a1c1a1c1-1c1c-1c1c-1c1c-1c1c1c1c1c1c'), -- Hassan
  ('p2222222-2222-2222-2222-222222222222', 'f499ee83-c393-433b-a2cc-fa2efec82b31', 'a1c1a1c1-1c1c-1c1c-1c1c-1c1c1c1c1c1c'), -- Ali
  ('p3333333-3333-3333-3333-333333333333', 'a122e23f-e119-455b-9fca-77eeff28c119', 'a1c1a1c1-1c1c-1c1c-1c1c-1c1c1c1c1c1c'), -- Khalid
  ('p4444444-4444-4444-4444-444444444444', 'bcde45aa-c3aa-44bb-99cc-f99a88bb77cc', 'a1c1a1c1-1c1c-1c1c-1c1c-1c1c1c1c1c1c'), -- Yassin
  ('p5555555-5555-5555-5555-555555555555', 'cd11bbcc-ffaa-44bb-88aa-f77a88bb9900', 'a1c1a1c1-1c1c-1c1c-1c1c-1c1c1c1c1c1c'), -- Omar
  -- Two players without login accounts
  ('p6666666-6666-6666-6666-666666666666', NULL, 'a1c1a1c1-1c1c-1c1c-1c1c-1c1c1c1c1c1c'), -- Saad
  ('p7777777-7777-7777-7777-777777777777', NULL, 'a1c1a1c1-1c1c-1c1c-1c1c-1c1c1c1c1c1c'); -- Zaid

-- Seed Player Profiles
INSERT INTO public.player_profiles (player_id, full_name_en, full_name_ar, jersey_number, position, dominant_hand, height_cm, weight_kg, birth_date, parent_name, parent_phone, photo_url) VALUES
  ('p1111111-1111-1111-1111-111111111111', 'Hassan Ibrahim', 'حسن إبراهيم', 10, 'Setter', 'Right', 192.0, 84.5, '2002-05-15', 'Ibrahim Kamel', '+201011111111', 'https://api.dicebear.com/7.x/adventurer/svg?seed=hassan'),
  ('p2222222-2222-2222-2222-222222222222', 'Ali Reda', 'علي رضا', 9, 'Opposite', 'Left', 204.0, 96.0, '2001-11-20', 'Reda Hegazi', '+201022222222', 'https://api.dicebear.com/7.x/adventurer/svg?seed=ali'),
  ('p3333333-3333-3333-3333-333333333333', 'Khalid Zaki', 'خالد زكي', 7, 'Outside Hitter', 'Right', 198.0, 88.0, '2003-02-10', 'Zaki Saad', '+201033333333', 'https://api.dicebear.com/7.x/adventurer/svg?seed=khalid'),
  ('p4444444-4444-4444-4444-444444444444', 'Yassin Nour', 'ياسين نور', 14, 'Middle Blocker', 'Right', 208.0, 102.0, '2000-08-30', 'Nour El-Din', '+201044444444', 'https://api.dicebear.com/7.x/adventurer/svg?seed=yassin'),
  ('p5555555-5555-5555-5555-555555555555', 'Omar Amin', 'عمر أمين', 2, 'Libero', 'Right', 180.0, 72.0, '2002-01-25', 'Amin Fathy', '+201055555555', 'https://api.dicebear.com/7.x/adventurer/svg?seed=omar'),
  ('p6666666-6666-6666-6666-666666666666', 'Saad Gomaa', 'سعد جمعة', 5, 'Middle Blocker', 'Right', 206.0, 98.0, '2003-04-12', 'Gomaa Abdo', '+201066666666', 'https://api.dicebear.com/7.x/adventurer/svg?seed=saad'),
  ('p7777777-7777-7777-7777-777777777777', 'Zaid Fathy', 'زيد فتحي', 11, 'Outside Hitter', 'Right', 195.0, 86.0, '2001-09-05', 'Fathy Amin', '+201077777777', 'https://api.dicebear.com/7.x/adventurer/svg?seed=zaid');

-- Player Medical Sheets
INSERT INTO public.player_medical (player_id, medical_status, injury_details, blood_type, allergies, last_checkup_date) VALUES
  ('p1111111-1111-1111-1111-111111111111', 'Fit', NULL, 'A+', 'None', '2026-01-10'),
  ('p2222222-2222-2222-2222-222222222222', 'Fit', NULL, 'O+', 'Penicillin', '2026-01-12'),
  ('p3333333-3333-3333-3333-333333333333', 'Injured', 'Ankle Sprain Grade II', 'B+', 'None', '2026-05-18'),
  ('p4444444-4444-4444-4444-444444444444', 'Fit', NULL, 'AB+', 'Dust', '2026-01-15'),
  ('p5555555-5555-5555-5555-555555555555', 'Fit', NULL, 'O-', 'None', '2026-01-11');

-- Player Contracts
INSERT INTO public.player_contracts (player_id, contract_number, start_date, end_date, salary, currency, status) VALUES
  ('p1111111-1111-1111-1111-111111111111', 'CONT-2025-091', '2025-09-01', '2027-06-30', 3500.00, 'USD', 'Active'),
  ('p2222222-2222-2222-2222-222222222222', 'CONT-2025-092', '2025-09-01', '2028-06-30', 5000.00, 'USD', 'Active'),
  ('p3333333-3333-3333-3333-333333333333', 'CONT-2025-093', '2025-09-01', '2026-06-30', 2500.00, 'USD', 'Active'),
  ('p4444444-4444-4444-4444-444444444444', 'CONT-2025-094', '2025-09-01', '2027-06-30', 4000.00, 'USD', 'Active');

-- Player Documents
INSERT INTO public.player_documents (player_id, name, document_type, document_url, expiry_date) VALUES
  ('p1111111-1111-1111-1111-111111111111', 'Hassan Passport', 'Passport', 'https://mock.documents.url/hassan_passport.pdf', '2030-05-14'),
  ('p2222222-2222-2222-2222-222222222222', 'Ali ID Card', 'ID', 'https://mock.documents.url/ali_id.pdf', '2028-12-01');

-- Seed Player Statistics (season cumulative)
INSERT INTO public.player_statistics (player_id, season_id, matches_played, sets_played, kills, attacks, attack_errors, aces, serve_errors, blocks, digs, assists, receptions, reception_errors) VALUES
  ('p1111111-1111-1111-1111-111111111111', '20262026-2026-2026-2026-202620262026', 12, 42, 15, 28, 2, 18, 12, 14, 85, 450, 0, 0),
  ('p2222222-2222-2222-2222-222222222222', '20262026-2026-2026-2026-202620262026', 12, 42, 185, 340, 24, 25, 38, 22, 54, 12, 2, 0),
  ('p3333333-3333-3333-3333-333333333333', '20262026-2026-2026-2026-202620262026', 10, 36, 120, 260, 18, 14, 22, 12, 78, 8, 150, 12),
  ('p4444444-4444-4444-4444-444444444444', '20262026-2026-2026-2026-202620262026', 12, 42, 85, 140, 8, 8, 15, 48, 22, 5, 5, 1),
  ('p5555555-5555-5555-5555-555555555555', '20262026-2026-2026-2026-202620262026', 12, 42, 0, 1, 0, 0, 0, 0, 145, 38, 240, 10);

-- ========================================================
-- 4. SEED STAFF DOMAIN DATA
-- ========================================================

-- Base staff record
INSERT INTO public.staff (id, user_id, club_id, full_name_en, full_name_ar, email, phone) VALUES
  ('s1111111-1111-1111-1111-111111111111', 'b2aa843a-23d2-4355-89f4-0b16a22c5443', 'a1c1a1c1-1c1c-1c1c-1c1c-1c1c1c1c1c1c', 'Ahmed Hassan', 'أحمد حسن', 'coach.ahmed@volleyclub.com', '+201110000001'),
  ('s2222222-2222-2222-2222-222222222222', 'c1b48b6c-e35c-443b-b27b-586bfa8a7f72', 'a1c1a1c1-1c1c-1c1c-1c1c-1c1c1c1c1c1c', 'Samy Mansoor', 'سامي منصور', 'analyst.samy@volleyclub.com', '+201110000002');

-- Roles assignment
INSERT INTO public.staff_roles (staff_id, team_id, role) VALUES
  ('s1111111-1111-1111-1111-111111111111', '7ee77ee7-7ee7-7ee7-7ee7-7ee77ee77ee7', 'Head Coach'),
  ('s2222222-2222-2222-2222-222222222222', '7ee77ee7-7ee7-7ee7-7ee7-7ee77ee77ee7', 'Analyst');

-- ========================================================
-- 5. SEED TRAINING SESSIONS AND ATTENDANCE (CRITICAL)
-- ========================================================

-- Seed Training Sessions
INSERT INTO public.training_sessions (id, team_id, season_id, title_en, title_ar, focus_area, date, start_time, duration_minutes, location) VALUES
  ('t1000000-1000-1000-1000-100010001000', '7ee77ee7-7ee7-7ee7-7ee7-7ee77ee77ee7', '20262026-2026-2026-2026-202620262026', 'Tactical Transition Practice', 'تدريب تكتيكي على التحول الهجومي', 'Tactical', '2026-05-10', '18:00:00', 90, 'Main Hall Court A'),
  ('t2000000-2000-2000-2000-200020002000', '7ee77ee7-7ee7-7ee7-7ee7-7ee77ee77ee7', '20262026-2026-2026-2026-202620262026', 'Serve and Reception Routine', 'تدريب الإرسال والاستقبال', 'Technical', '2026-05-15', '18:00:00', 90, 'Main Hall Court A'),
  ('t3000000-3000-3000-3000-300030003000', '7ee77ee7-7ee7-7ee7-7ee7-7ee77ee77ee7', '20262026-2026-2026-2026-202620262026', 'Physical Conditioning Session', 'حصة الإعداد البدني', 'Physical', '2026-05-20', '17:00:00', 120, 'Fitness Gym');

-- Seed Attendance Sessions
INSERT INTO public.attendance_sessions (id, club_id, session_type, reference_id, date, taken_by) VALUES
  ('a1000000-1000-1000-1000-100010001000', 'a1c1a1c1-1c1c-1c1c-1c1c-1c1c1c1c1c1c', 'Training', 't1000000-1000-1000-1000-100010001000', '2026-05-10', 'b2aa843a-23d2-4355-89f4-0b16a22c5443'),
  ('a2000000-2000-2000-2000-200020002000', 'a1c1a1c1-1c1c-1c1c-1c1c-1c1c1c1c1c1c', 'Training', 't2000000-2000-2000-2000-200020002000', '2026-05-15', 'b2aa843a-23d2-4355-89f4-0b16a22c5443'),
  ('a3000000-3000-3000-3000-300030003000', 'a1c1a1c1-1c1c-1c1c-1c1c-1c1c1c1c1c1c', 'Training', 't3000000-3000-3000-3000-300030003000', '2026-05-20', 'b2aa843a-23d2-4355-89f4-0b16a22c5443');

-- Seed Attendance Records
INSERT INTO public.attendance_records (session_id, player_id, staff_id, status, minutes_late, check_in_time) VALUES
  -- Session 1
  ('a1000000-1000-1000-1000-100010001000', 'p1111111-1111-1111-1111-111111111111', NULL, 'Present', 0, '2026-05-10 17:50:00+00'),
  ('a1000000-1000-1000-1000-100010001000', 'p2222222-2222-2222-2222-222222222222', NULL, 'Present', 0, '2026-05-10 17:52:00+00'),
  ('a1000000-1000-1000-1000-100010001000', 'p3333333-3333-3333-3333-333333333333', NULL, 'Present', 0, '2026-05-10 17:55:00+00'),
  ('a1000000-1000-1000-1000-100010001000', 'p4444444-4444-4444-4444-444444444444', NULL, 'Present', 0, '2026-05-10 17:51:00+00'),
  ('a1000000-1000-1000-1000-100010001000', 'p5555555-5555-5555-5555-555555555555', NULL, 'Present', 0, '2026-05-10 17:48:00+00'),
  ('a1000000-1000-1000-1000-100010001000', 'p6666666-6666-6666-6666-666666666666', NULL, 'Absent', 0, NULL),
  -- Session 2
  ('a2000000-2000-2000-2000-200020002000', 'p1111111-1111-1111-1111-111111111111', NULL, 'Present', 0, '2026-05-15 17:55:00+00'),
  ('a2000000-2000-2000-2000-200020002000', 'p2222222-2222-2222-2222-222222222222', NULL, 'Present', 0, '2026-05-15 17:53:00+00'),
  ('a2000000-2000-2000-2000-200020002000', 'p3333333-3333-3333-3333-333333333333', NULL, 'Late', 15, '2026-05-15 18:15:00+00'),
  ('a2000000-2000-2000-2000-200020002000', 'p4444444-4444-4444-4444-444444444444', NULL, 'Present', 0, '2026-05-15 17:52:00+00'),
  ('a2000000-2000-2000-2000-200020002000', 'p5555555-5555-5555-5555-555555555555', NULL, 'Present', 0, '2026-05-15 17:51:00+00'),
  ('a2000000-2000-2000-2000-200020002000', 'p6666666-6666-6666-6666-666666666666', NULL, 'Absent', 0, NULL),
  -- Session 3
  ('a3000000-3000-3000-3000-300030003000', 'p1111111-1111-1111-1111-111111111111', NULL, 'Present', 0, '2026-05-20 16:51:00+00'),
  ('a3000000-3000-3000-3000-300030003000', 'p2222222-2222-2222-2222-222222222222', NULL, 'Present', 0, '2026-05-20 16:48:00+00'),
  ('a3000000-3000-3000-3000-300030003000', 'p3333333-3333-3333-3333-333333333333', NULL, 'Injured', 0, NULL), -- Excused/injured
  ('a3000000-3000-3000-3000-300030003000', 'p4444444-4444-4444-4444-444444444444', NULL, 'Present', 0, '2026-05-20 16:52:00+00'),
  ('a3000000-3000-3000-3000-300030003000', 'p5555555-5555-5555-5555-555555555555', NULL, 'Present', 0, '2026-05-20 16:45:00+00'),
  ('a3000000-3000-3000-3000-300030003000', 'p6666666-6666-6666-6666-666666666666', NULL, 'Absent', 0, NULL);

-- ========================================================
-- 6. SEED TRAINING DOMAIN DATA
-- ========================================================

-- Seed Training Plan
INSERT INTO public.training_plans (id, club_id, author_id, title_en, title_ar, objectives, drills_json) VALUES
  ('p0001000-1000-1000-1000-100010001000', 'a1c1a1c1-1c1c-1c1c-1c1c-1c1c1c1c1c1c', 's1111111-1111-1111-1111-111111111111', 'Serve and Out-of-system Attack Plan', 'خطة الإرسال والهجوم من خارج المنظومة', 'Improve serve accuracy to zones 1 & 5, refine high ball setter transition to Opposite.', 
   '[{"title": "Deep serve drill", "duration": 20, "description": "Players target deep zones 1 and 5"}, {"title": "Out of system transition", "duration": 40, "description": "Setter sets high ball to opposite from zone 6"}]'::jsonb);

-- Link sessions to plans
INSERT INTO public.trainings (session_id, plan_id, notes, rpe_average) VALUES
  ('t1000000-1000-1000-1000-100010001000', 'p0001000-1000-1000-1000-100010001000', 'Focus on transitions was good, Libero did excellent digs', NULL),
  ('t2000000-2000-2000-2000-200020002000', 'p0001000-1000-1000-1000-100010001000', 'Technical adjustments on passing reach', NULL);

-- Seed Training Loads
INSERT INTO public.training_loads (session_id, team_id, planned_duration, actual_duration, intensity_level, load_score) VALUES
  ('t1000000-1000-1000-1000-100010001000', '7ee77ee7-7ee7-7ee7-7ee7-7ee77ee77ee7', 90, 90, 7, 630.00),
  ('t2000000-2000-2000-2000-200020002000', '7ee77ee7-7ee7-7ee7-7ee7-7ee77ee77ee7', 90, 95, 6, 570.00);

-- Seed RPE logs (logged by players)
INSERT INTO public.rpe_logs (session_id, player_id, rpe_score, session_duration_minutes, calculated_load, feedback) VALUES
  ('t1000000-1000-1000-1000-100010001000', 'p1111111-1111-1111-1111-111111111111', 6, 90, 540.00, 'Good session, not too tired'),
  ('t1000000-1000-1000-1000-100010001000', 'p2222222-2222-2222-2222-222222222222', 8, 90, 720.00, 'Hard jumps today'),
  ('t1000000-1000-1000-1000-100010001000', 'p4444444-4444-4444-4444-444444444444', 7, 90, 630.00, 'Fine'),
  ('t2000000-2000-2000-2000-200020002000', 'p1111111-1111-1111-1111-111111111111', 5, 95, 475.00, 'Light receive drill'),
  ('t2000000-2000-2000-2000-200020002000', 'p2222222-2222-2222-2222-222222222222', 7, 95, 665.00, 'Lots of swings');

-- Execute RPE average trigger manually or let trigger do it.
-- Let's make sure rpe_average column is updated by updating the table
UPDATE public.trainings SET rpe_average = 7.00 WHERE session_id = 't1000000-1000-1000-1000-100010001000';
UPDATE public.trainings SET rpe_average = 6.00 WHERE session_id = 't2000000-2000-2000-2000-200020002000';

-- ========================================================
-- 7. SEED MATCHES AND VOLLEYBALL ANALYTICS EVENTS (CRITICAL)
-- ========================================================

-- Seed Matches
INSERT INTO public.matches (id, team_id, season_id, opponent_name_en, opponent_name_ar, date, time, location_en, location_ar, status, competition_name_en, competition_name_ar, our_score, opponent_score) VALUES
  ('m1000000-1000-1000-1000-100010001000', '7ee77ee7-7ee7-7ee7-7ee7-7ee77ee77ee7', '20262026-2026-2026-2026-202620262026', 'Al-Nasr VC', 'نادي النصر', '2026-05-18', '20:00:00', 'Cairo Stadium Hall 3', 'صالة استاد القاهرة 3', 'Completed', 'National Volleyball League', 'الدوري الوطني للكرة الطائرة', 3, 1);

-- Seed Set Results
INSERT INTO public.match_sets (match_id, set_number, our_score, opponent_score, is_completed) VALUES
  ('m1000000-1000-1000-1000-100010001000', 1, 25, 22, true),
  ('m1000000-1000-1000-1000-100010001000', 2, 21, 25, true),
  ('m1000000-1000-1000-1000-100010001000', 3, 25, 18, true),
  ('m1000000-1000-1000-1000-100010001000', 4, 25, 23, true);

-- Seed Lineup for Set 1
INSERT INTO public.match_lineups (match_id, set_number, pos_1_player_id, pos_2_player_id, pos_3_player_id, pos_4_player_id, pos_5_player_id, pos_6_player_id, libero_player_id) VALUES
  ('m1000000-1000-1000-1000-100010001000', 1, 
   'p1111111-1111-1111-1111-111111111111', -- Hassan (Setter)
   'p2222222-2222-2222-2222-222222222222', -- Ali (Opposite)
   'p4444444-4444-4444-4444-444444444444', -- Yassin (Middle Blocker)
   'p3333333-3333-3333-3333-333333333333', -- Khalid (Outside Hitter)
   'p6666666-6666-6666-6666-666666666666', -- Saad (Middle Blocker)
   'p7777777-7777-7777-7777-777777777777', -- Zaid (Outside Hitter)
   'p5555555-5555-5555-5555-555555555555'  -- Omar (Libero)
  );

-- Seed Match Event Statistics (for analytics calculation testing)
-- Serves
INSERT INTO public.match_statistics (match_id, set_number, player_id, action_type, action_quality, details) VALUES
  ('m1000000-1000-1000-1000-100010001000', 1, 'p1111111-1111-1111-1111-111111111111', 'Serve', 'Ace', '{"target_zone": "5"}'::jsonb),
  ('m1000000-1000-1000-1000-100010001000', 1, 'p1111111-1111-1111-1111-111111111111', 'Serve', 'Neutral', '{"target_zone": "6"}'::jsonb),
  ('m1000000-1000-1000-1000-100010001000', 1, 'p1111111-1111-1111-1111-111111111111', 'Serve', 'Error', '{"target_zone": "out"}'::jsonb),
  ('m1000000-1000-1000-1000-100010001000', 1, 'p2222222-2222-2222-2222-222222222222', 'Serve', 'Positive', '{"target_zone": "1"}'::jsonb);

-- Receptions (Serve Receives)
INSERT INTO public.match_statistics (match_id, set_number, player_id, action_type, action_quality, details) VALUES
  ('m1000000-1000-1000-1000-100010001000', 1, 'p3333333-3333-3333-3333-333333333333', 'Receive', '3', '{"pass_rating": 3}'::jsonb), -- Perfect
  ('m1000000-1000-1000-1000-100010001000', 1, 'p3333333-3333-3333-3333-333333333333', 'Receive', '2', '{"pass_rating": 2}'::jsonb), -- Good
  ('m1000000-1000-1000-1000-100010001000', 1, 'p5555555-5555-5555-5555-555555555555', 'Receive', '3', '{"pass_rating": 3}'::jsonb), -- Perfect
  ('m1000000-1000-1000-1000-100010001000', 1, 'p5555555-5555-5555-5555-555555555555', 'Receive', '1', '{"pass_rating": 1}'::jsonb), -- Poor
  ('m1000000-1000-1000-1000-100010001000', 1, 'p5555555-5555-5555-5555-555555555555', 'Receive', '0', '{"pass_rating": 0}'::jsonb); -- Error

-- Sets (Setter Distribution)
INSERT INTO public.match_statistics (match_id, set_number, player_id, action_type, action_quality, details) VALUES
  ('m1000000-1000-1000-1000-100010001000', 1, 'p1111111-1111-1111-1111-111111111111', 'Set', 'Excellent', '{"target_zone": "2", "set_call": "51"}'::jsonb),
  ('m1000000-1000-1000-1000-100010001000', 1, 'p1111111-1111-1111-1111-111111111111', 'Set', 'Excellent', '{"target_zone": "4", "set_call": "Go"}'::jsonb),
  ('m1000000-1000-1000-1000-100010001000', 1, 'p1111111-1111-1111-1111-111111111111', 'Set', 'Excellent', '{"target_zone": "3", "set_call": "Quick"}'::jsonb),
  ('m1000000-1000-1000-1000-100010001000', 1, 'p1111111-1111-1111-1111-111111111111', 'Set', 'Excellent', '{"target_zone": "2", "set_call": "Back5"}'::jsonb);

-- Attacks (Hitting efficiency calculations)
INSERT INTO public.match_statistics (match_id, set_number, player_id, action_type, action_quality, details) VALUES
  ('m1000000-1000-1000-1000-100010001000', 1, 'p2222222-2222-2222-2222-222222222222', 'Attack', 'Kill', '{"zone": "2"}'::jsonb),
  ('m1000000-1000-1000-1000-100010001000', 1, 'p2222222-2222-2222-2222-222222222222', 'Attack', 'Kill', '{"zone": "2"}'::jsonb),
  ('m1000000-1000-1000-1000-100010001000', 1, 'p2222222-2222-2222-2222-222222222222', 'Attack', 'Neutral', '{"zone": "2"}'::jsonb),
  ('m1000000-1000-1000-1000-100010001000', 1, 'p2222222-2222-2222-2222-222222222222', 'Attack', 'Error', '{"zone": "out"}'::jsonb),
  ('m1000000-1000-1000-1000-100010001000', 1, 'p3333333-3333-3333-3333-333333333333', 'Attack', 'Kill', '{"zone": "4"}'::jsonb),
  ('m1000000-1000-1000-1000-100010001000', 1, 'p3333333-3333-3333-3333-333333333333', 'Attack', 'Error', '{"zone": "net"}'::jsonb);

-- Seed Rally Tracking
INSERT INTO public.rally_tracking (match_id, set_number, rally_number, serving_team, winner, side_out, first_attack_type, first_attack_quality) VALUES
  ('m1000000-1000-1000-1000-100010001000', 1, 1, 'Opponent', 'Us', true, 'Receive', 'Kill'), -- Side-Out won
  ('m1000000-1000-1000-1000-100010001000', 1, 2, 'Us', 'Us', false, 'Transition', 'Kill'), -- Point scored
  ('m1000000-1000-1000-1000-100010001000', 1, 3, 'Us', 'Opponent', false, 'Transition', 'Error'), -- Rally lost
  ('m1000000-1000-1000-1000-100010001000', 1, 4, 'Opponent', 'Opponent', false, 'Receive', 'Neutral'); -- Side-out lost

-- ========================================================
-- 8. SEED NOTIFICATIONS, ANNOUNCEMENTS, TASKS
-- ========================================================

-- Seed Announcements
INSERT INTO public.announcements (club_id, author_id, title_en, title_ar, content_en, content_ar, target_teams) VALUES
  ('a1c1a1c1-1c1c-1c1c-1c1c-1c1c1c1c1c1c', 'd0be3c41-863a-4a65-b1a7-f9ff227eb0c9', 'Club Registry Open for Next Season', 'فتح باب التسجيل للنادي للموسم القادم', 'Registration has officially opened for the 2026/2027 season.', 'لقد تم فتح التسجيل رسمياً لموسم 2026 / 2027.', NULL);

-- Seed Messages
INSERT INTO public.messages (sender_id, receiver_id, team_id, content) VALUES
  ('b2aa843a-23d2-4355-89f4-0b16a22c5443', NULL, '7ee77ee7-7ee7-7ee7-7ee7-7ee77ee77ee7', 'Reminder: Training starts at 18:00 sharp today. Bring white training shirts.');

-- Seed Tasks
INSERT INTO public.tasks (club_id, title, description, assigned_to, due_date, status) VALUES
  ('a1c1a1c1-1c1c-1c1c-1c1c-1c1c1c1c1c1c', 'Update Roster Documents', 'Verify passport validity for player Khalid Zaki.', 'b2aa843a-23d2-4355-89f4-0b16a22c5443', '2026-05-30', 'Todo');
