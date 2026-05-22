-- VolleyClub Pro - Database Schema
-- Phase 2: Enterprise Database Architecture
-- This file initializes all tables, foreign keys, and indexes.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================================
-- 1. AUTH & RBAC DOMAIN
-- ========================================================

-- Public Users table (synced from auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY, -- Links directly to auth.users.id
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

-- Roles table
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Permissions table
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Role-Permissions Join table
CREATE TABLE IF NOT EXISTS public.role_permissions (
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- User-Roles Join table
CREATE TABLE IF NOT EXISTS public.user_roles (
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- ========================================================
-- 2. CLUB STRUCTURE DOMAIN
-- ========================================================

-- Clubs table
CREATE TABLE IF NOT EXISTS public.clubs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_en TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

-- Seasons table
CREATE TABLE IF NOT EXISTS public.seasons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE NOT NULL,
    name_en TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ,
    CONSTRAINT check_dates CHECK (start_date <= end_date)
);

-- Sports table (Volleyball, Beach Volleyball, etc.)
CREATE TABLE IF NOT EXISTS public.sports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_en TEXT UNIQUE NOT NULL,
    name_ar TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Age Groups table (e.g., U19, First Team)
CREATE TABLE IF NOT EXISTS public.age_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE NOT NULL,
    name_en TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    min_age INT,
    max_age INT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT check_ages CHECK (min_age IS NULL OR max_age IS NULL OR min_age <= max_age)
);

-- Teams table
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE NOT NULL,
    season_id UUID REFERENCES public.seasons(id) ON DELETE SET NULL,
    age_group_id UUID REFERENCES public.age_groups(id) ON DELETE SET NULL,
    sport_id UUID REFERENCES public.sports(id) ON DELETE SET NULL,
    name_en TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    gender TEXT CHECK (gender IN ('Men', 'Women', 'Mixed')) NOT NULL,
    color_hex TEXT DEFAULT '#10B981' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

-- ========================================================
-- 3. PLAYERS DOMAIN
-- ========================================================

-- Players base table
CREATE TABLE IF NOT EXISTS public.players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL, -- Link to user account if they have one
    club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

-- Player Profiles
CREATE TABLE IF NOT EXISTS public.player_profiles (
    player_id UUID PRIMARY KEY REFERENCES public.players(id) ON DELETE CASCADE,
    full_name_en TEXT NOT NULL,
    full_name_ar TEXT NOT NULL,
    jersey_number INT,
    position TEXT CHECK (position IN ('Setter', 'Opposite', 'Outside Hitter', 'Middle Blocker', 'Libero')),
    dominant_hand TEXT CHECK (dominant_hand IN ('Right', 'Left', 'Ambidextrous')),
    height_cm NUMERIC(5,2),
    weight_kg NUMERIC(5,2),
    birth_date DATE,
    parent_name TEXT,
    parent_phone TEXT,
    parent_email TEXT,
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Player Medical Records
CREATE TABLE IF NOT EXISTS public.player_medical (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE NOT NULL,
    medical_status TEXT CHECK (medical_status IN ('Fit', 'Injured', 'Rehabilitation', 'Pending Clearance')) DEFAULT 'Fit' NOT NULL,
    injury_details TEXT,
    blood_type TEXT,
    allergies TEXT,
    last_checkup_date DATE,
    clearance_document_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Player Contracts
CREATE TABLE IF NOT EXISTS public.player_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE NOT NULL,
    contract_number TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    salary NUMERIC(12,2),
    currency TEXT DEFAULT 'USD' NOT NULL,
    status TEXT CHECK (status IN ('Active', 'Terminated', 'Expired')) DEFAULT 'Active' NOT NULL,
    document_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT check_contract_dates CHECK (start_date <= end_date)
);

-- Player Documents
CREATE TABLE IF NOT EXISTS public.player_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    document_type TEXT CHECK (document_type IN ('ID', 'Passport', 'National Registration', 'Insurance', 'Other')) NOT NULL,
    document_url TEXT NOT NULL,
    expiry_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Player Statistics (agg snapshot per season)
CREATE TABLE IF NOT EXISTS public.player_statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE NOT NULL,
    season_id UUID REFERENCES public.seasons(id) ON DELETE CASCADE NOT NULL,
    matches_played INT DEFAULT 0 NOT NULL,
    sets_played INT DEFAULT 0 NOT NULL,
    kills INT DEFAULT 0 NOT NULL,
    attacks INT DEFAULT 0 NOT NULL,
    attack_errors INT DEFAULT 0 NOT NULL,
    aces INT DEFAULT 0 NOT NULL,
    serve_errors INT DEFAULT 0 NOT NULL,
    blocks INT DEFAULT 0 NOT NULL,
    digs INT DEFAULT 0 NOT NULL,
    assists INT DEFAULT 0 NOT NULL,
    receptions INT DEFAULT 0 NOT NULL,
    reception_errors INT DEFAULT 0 NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE (player_id, season_id)
);

-- ========================================================
-- 4. STAFF DOMAIN
-- ========================================================

-- Staff table
CREATE TABLE IF NOT EXISTS public.staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE NOT NULL,
    full_name_en TEXT NOT NULL,
    full_name_ar TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

-- Staff Roles assigning to Teams
CREATE TABLE IF NOT EXISTS public.staff_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE NOT NULL,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE, -- Null means club-wide staff
    role TEXT CHECK (role IN ('Head Coach', 'Assistant Coach', 'Physiotherapist', 'Analyst', 'Team Manager', 'Club Admin')) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Staff Attendance Logs
CREATE TABLE IF NOT EXISTS public.staff_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    status TEXT CHECK (status IN ('Present', 'Late', 'Absent', 'Excused')) NOT NULL,
    check_in TIMESTAMPTZ,
    check_out TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Staff Documents
CREATE TABLE IF NOT EXISTS public.staff_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    document_type TEXT,
    document_url TEXT NOT NULL,
    expiry_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ========================================================
-- 5. ATTENDANCE DOMAIN (CRITICAL)
-- ========================================================

-- Training Sessions
CREATE TABLE IF NOT EXISTS public.training_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
    season_id UUID REFERENCES public.seasons(id) ON DELETE CASCADE NOT NULL,
    title_en TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    focus_area TEXT CHECK (focus_area IN ('Technical', 'Tactical', 'Physical', 'Recovery', 'Match Preparation')) NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    duration_minutes INT NOT NULL,
    location TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

-- Attendance Sessions (unifies trainings and matches attendance)
CREATE TABLE IF NOT EXISTS public.attendance_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE NOT NULL,
    session_type TEXT CHECK (session_type IN ('Training', 'Match')) NOT NULL,
    reference_id UUID NOT NULL, -- training_sessions(id) or matches(id)
    date DATE NOT NULL,
    taken_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Attendance Records
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.attendance_sessions(id) ON DELETE CASCADE NOT NULL,
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('Present', 'Late', 'Absent', 'Excused', 'Injured')) NOT NULL,
    minutes_late INT DEFAULT 0 NOT NULL,
    check_in_time TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT check_member_type CHECK (
        (player_id IS NOT NULL AND staff_id IS NULL) OR
        (player_id IS NULL AND staff_id IS NOT NULL)
    ),
    UNIQUE (session_id, player_id),
    UNIQUE (session_id, staff_id)
);

-- Attendance Notes
CREATE TABLE IF NOT EXISTS public.attendance_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_id UUID REFERENCES public.attendance_records(id) ON DELETE CASCADE NOT NULL,
    note TEXT NOT NULL,
    author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Disciplinary Actions (e.g. for repeated absences)
CREATE TABLE IF NOT EXISTS public.disciplinary_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE NOT NULL,
    reason TEXT NOT NULL,
    action_type TEXT NOT NULL, -- Warning, Fine, Suspension, Training Ban
    issued_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    issue_date DATE NOT NULL,
    status TEXT CHECK (status IN ('Pending', 'Resolved', 'Appealed')) DEFAULT 'Pending' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ========================================================
-- 6. TRAINING DOMAIN
-- ========================================================

-- Training Plans
CREATE TABLE IF NOT EXISTS public.training_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
    title_en TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    objectives TEXT,
    drills_json JSONB, -- Array of drills { title, description, duration, media_url }
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Link plan to training session
CREATE TABLE IF NOT EXISTS public.trainings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.training_sessions(id) ON DELETE CASCADE NOT NULL,
    plan_id UUID REFERENCES public.training_plans(id) ON DELETE SET NULL,
    notes TEXT,
    rpe_average NUMERIC(4,2),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Planned vs Actual Training Loads
CREATE TABLE IF NOT EXISTS public.training_loads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.training_sessions(id) ON DELETE CASCADE NOT NULL,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
    planned_duration INT NOT NULL,
    actual_duration INT,
    intensity_level INT CHECK (intensity_level BETWEEN 1 AND 10), -- Coach rating
    load_score NUMERIC(6,2), -- duration * intensity
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- RPE Logs (logged by players)
CREATE TABLE IF NOT EXISTS public.rpe_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.training_sessions(id) ON DELETE CASCADE NOT NULL,
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE NOT NULL,
    rpe_score INT CHECK (rpe_score BETWEEN 1 AND 10) NOT NULL,
    session_duration_minutes INT NOT NULL,
    calculated_load NUMERIC(6,2) NOT NULL, -- rpe_score * session_duration_minutes
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE (session_id, player_id)
);

-- Training Notes
CREATE TABLE IF NOT EXISTS public.training_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    training_id UUID REFERENCES public.trainings(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ========================================================
-- 7. MATCH DOMAIN (VOLLEYBALL ANALYTICS)
-- ========================================================

-- Matches
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
    season_id UUID REFERENCES public.seasons(id) ON DELETE CASCADE NOT NULL,
    opponent_name_en TEXT NOT NULL,
    opponent_name_ar TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location_en TEXT,
    location_ar TEXT,
    status TEXT CHECK (status IN ('Scheduled', 'Live', 'Completed', 'Cancelled')) DEFAULT 'Scheduled' NOT NULL,
    competition_name_en TEXT,
    competition_name_ar TEXT,
    our_score INT DEFAULT 0 NOT NULL, -- Sets won by us
    opponent_score INT DEFAULT 0 NOT NULL, -- Sets won by opponent
    video_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

-- Match Lineups (per set starting lineup)
CREATE TABLE IF NOT EXISTS public.match_lineups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE NOT NULL,
    set_number INT NOT NULL,
    pos_1_player_id UUID REFERENCES public.players(id) ON DELETE SET NULL, -- Server position
    pos_2_player_id UUID REFERENCES public.players(id) ON DELETE SET NULL, -- Front-right
    pos_3_player_id UUID REFERENCES public.players(id) ON DELETE SET NULL, -- Front-middle
    pos_4_player_id UUID REFERENCES public.players(id) ON DELETE SET NULL, -- Front-left
    pos_5_player_id UUID REFERENCES public.players(id) ON DELETE SET NULL, -- Back-left
    pos_6_player_id UUID REFERENCES public.players(id) ON DELETE SET NULL, -- Back-middle
    libero_player_id UUID REFERENCES public.players(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE (match_id, set_number)
);

-- Match Rotations (tracks rotation shifts)
CREATE TABLE IF NOT EXISTS public.match_rotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE NOT NULL,
    set_number INT NOT NULL,
    rotation_number INT CHECK (rotation_number BETWEEN 1 AND 6) NOT NULL, -- 1 to 6 where setter is
    details JSONB, -- current line-up order
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Match Sets details
CREATE TABLE IF NOT EXISTS public.match_sets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE NOT NULL,
    set_number INT NOT NULL,
    our_score INT DEFAULT 0 NOT NULL,
    opponent_score INT DEFAULT 0 NOT NULL,
    is_completed BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE (match_id, set_number)
);

-- Match Event Statistics (Detailed analytics tracking)
CREATE TABLE IF NOT EXISTS public.match_statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE NOT NULL,
    set_number INT NOT NULL,
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE NOT NULL,
    action_type TEXT CHECK (action_type IN ('Serve', 'Receive', 'Set', 'Attack', 'Block', 'Dig')) NOT NULL,
    action_quality TEXT CHECK (action_quality IN (
        'Ace', 'Positive', 'Neutral', 'Error', -- Serve
        '3', '2', '1', '0',                    -- Receive (3=Perfect, 2=Good, 1=Poor, 0=Error)
        'Kill',                                -- Attack (Kill, Neutral, Error)
        'Control',                             -- Block (Block Point, Control, Error)
        'Excellent'                            -- Dig/Set (Excellent, Neutral, Error)
    )) NOT NULL,
    details JSONB, -- details like speed, zones, setter call, transitions
    timestamp TIME,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Rally Tracking (for Side-Out and Transition Analytics)
CREATE TABLE IF NOT EXISTS public.rally_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE NOT NULL,
    set_number INT NOT NULL,
    rally_number INT NOT NULL,
    serving_team TEXT CHECK (serving_team IN ('Us', 'Opponent')) NOT NULL,
    winner TEXT CHECK (winner IN ('Us', 'Opponent')) NOT NULL,
    side_out BOOLEAN NOT NULL, -- Was it a side out (serving_team = 'Opponent' AND winner = 'Us')
    first_attack_type TEXT CHECK (first_attack_type IN ('Transition', 'Receive')),
    first_attack_quality TEXT CHECK (first_attack_quality IN ('Kill', 'Neutral', 'Error')),
    events_json JSONB, -- list of statistics IDs tied to the rally
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE (match_id, set_number, rally_number)
);

-- ========================================================
-- 8. REPORTS & ANALYTICS DOMAIN
-- ========================================================

-- Reports
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE NOT NULL,
    title_en TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    report_type TEXT CHECK (report_type IN ('Attendance', 'Player Performance', 'Match Analysis', 'Training Load')) NOT NULL,
    parameters JSONB, -- dates, teams, etc.
    data JSONB, -- calculated statistics snapshot
    generated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Analytics Snapshots
CREATE TABLE IF NOT EXISTS public.analytics_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE NOT NULL,
    snapshot_date DATE NOT NULL,
    metric_name TEXT NOT NULL,
    metric_value NUMERIC(12,4) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Custom dashboards configuration
CREATE TABLE IF NOT EXISTS public.dashboards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    layout_json JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Athletic / Performance Metrics (Testing results like Vertical Jump)
CREATE TABLE IF NOT EXISTS public.performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    metric_type TEXT NOT NULL, -- "Vertical Jump", "Block Reach", "Spike Reach", "Pro Agility", "Cooper Test"
    metric_value NUMERIC(6,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ========================================================
-- 9. COMMUNICATION DOMAIN
-- ========================================================

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title_en TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    message_en TEXT NOT NULL,
    message_ar TEXT NOT NULL,
    type TEXT CHECK (type IN ('Info', 'Warning', 'Success', 'Alert')) DEFAULT 'Info' NOT NULL,
    is_read BOOLEAN DEFAULT false NOT NULL,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Announcements
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    title_en TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    content_en TEXT NOT NULL,
    content_ar TEXT NOT NULL,
    target_teams UUID[], -- Array of team IDs, NULL means everyone in the club
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

-- Messages (Team chat & direct messaging)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    receiver_id UUID REFERENCES public.users(id) ON DELETE SET NULL, -- Direct message
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE, -- Team message
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT check_message_destination CHECK (
        (receiver_id IS NOT NULL AND team_id IS NULL) OR
        (receiver_id IS NULL AND team_id IS NOT NULL)
    )
);

-- Tasks
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    assigned_to UUID REFERENCES public.users(id) ON DELETE SET NULL,
    due_date DATE,
    status TEXT CHECK (status IN ('Todo', 'In Progress', 'Completed')) DEFAULT 'Todo' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ========================================================
-- COMPOSITE AND OPTIMIZED INDEXES
-- ========================================================

-- Composite indexes for query acceleration
CREATE INDEX IF NOT EXISTS idx_teams_club_season ON public.teams (club_id, season_id);
CREATE INDEX IF NOT EXISTS idx_players_club ON public.players (club_id);
CREATE INDEX IF NOT EXISTS idx_player_profiles_pos ON public.player_profiles (position);
CREATE INDEX IF NOT EXISTS idx_player_stats_lookup ON public.player_statistics (player_id, season_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_lookup ON public.attendance_records (session_id, player_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_staff ON public.attendance_records (session_id, staff_id);
CREATE INDEX IF NOT EXISTS idx_attendance_sessions_ref ON public.attendance_sessions (session_type, reference_id);
CREATE INDEX IF NOT EXISTS idx_match_stats_details ON public.match_statistics (match_id, set_number, player_id);
CREATE INDEX IF NOT EXISTS idx_match_stats_action ON public.match_statistics (action_type, action_quality);
CREATE INDEX IF NOT EXISTS idx_rally_tracking_details ON public.rally_tracking (match_id, set_number);
CREATE INDEX IF NOT EXISTS idx_rpe_logs_session_player ON public.rpe_logs (session_id, player_id);
CREATE INDEX IF NOT EXISTS idx_training_sessions_team_date ON public.training_sessions (team_id, date);
CREATE INDEX IF NOT EXISTS idx_matches_team_date ON public.matches (team_id, date);
CREATE INDEX IF NOT EXISTS idx_messages_team ON public.messages (team_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_direct ON public.messages (sender_id, receiver_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications (user_id) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_staff_roles_staff_team ON public.staff_roles (staff_id, team_id);
CREATE INDEX IF NOT EXISTS idx_disciplinary_player ON public.disciplinary_actions (player_id, status);
