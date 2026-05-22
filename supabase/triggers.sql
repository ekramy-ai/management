-- VolleyClub Pro - Database Triggers
-- Phase 2: Automation & State Sync Triggers

-- ========================================================
-- 1. UTILITY: AUTO-UPDATE UPDATED_AT TIMESTAMP
-- ========================================================

-- Trigger function to set updated_at to now()
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Bind set_updated_at to tables
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trigger_clubs_updated_at
    BEFORE UPDATE ON public.clubs
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trigger_seasons_updated_at
    BEFORE UPDATE ON public.seasons
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trigger_teams_updated_at
    BEFORE UPDATE ON public.teams
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trigger_players_updated_at
    BEFORE UPDATE ON public.players
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trigger_player_profiles_updated_at
    BEFORE UPDATE ON public.player_profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trigger_player_medical_updated_at
    BEFORE UPDATE ON public.player_medical
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trigger_player_contracts_updated_at
    BEFORE UPDATE ON public.player_contracts
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trigger_player_documents_updated_at
    BEFORE UPDATE ON public.player_documents
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trigger_staff_updated_at
    BEFORE UPDATE ON public.staff
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trigger_training_sessions_updated_at
    BEFORE UPDATE ON public.training_sessions
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trigger_attendance_sessions_updated_at
    BEFORE UPDATE ON public.attendance_sessions
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trigger_attendance_records_updated_at
    BEFORE UPDATE ON public.attendance_records
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trigger_training_plans_updated_at
    BEFORE UPDATE ON public.training_plans
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trigger_matches_updated_at
    BEFORE UPDATE ON public.matches
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trigger_announcements_updated_at
    BEFORE UPDATE ON public.announcements
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trigger_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ========================================================
-- 2. AUTHENTICATION SYNC SYSTEM (auth.users -> public.users)
-- ========================================================

-- Trigger function to synchronize auth.users with public.users
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER SECURITY DEFINER AS $$
DECLARE
    v_role_id UUID;
    v_default_role TEXT := 'Player'; -- Default fallback role
BEGIN
    -- 1. Insert user profile into public.users
    INSERT INTO public.users (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'New Member'),
        NEW.raw_user_meta_data->>'avatar_url'
    );

    -- Get requested role from user metadata if provided
    IF NEW.raw_user_meta_data->>'role' IS NOT NULL THEN
        v_default_role := NEW.raw_user_meta_data->>'role';
    END IF;

    -- Find the role ID
    SELECT id INTO v_role_id FROM public.roles WHERE name = v_default_role;

    -- If role doesn't exist, search for default 'Player'
    IF v_role_id IS NULL THEN
        SELECT id INTO v_role_id FROM public.roles WHERE name = 'Player';
    END IF;

    -- 2. Associate default role to user
    IF v_role_id IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role_id)
        VALUES (NEW.id, v_role_id)
        ON CONFLICT DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to execute on signup/creation in auth schema
-- Note: In Supabase, this trigger is installed in the auth schema
-- SQL:
-- CREATE TRIGGER on_auth_user_created
--     AFTER INSERT ON auth.users
--     FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- Trigger function to update public.users when auth.users updates (e.g. email change)
CREATE OR REPLACE FUNCTION public.handle_update_auth_user()
RETURNS TRIGGER SECURITY DEFINER AS $$
BEGIN
    UPDATE public.users
    SET 
        email = NEW.email,
        full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', public.users.full_name),
        avatar_url = COALESCE(NEW.raw_user_meta_data->>'avatar_url', public.users.avatar_url)
    WHERE id = NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- SQL:
-- CREATE TRIGGER on_auth_user_updated
--     AFTER UPDATE ON auth.users
--     FOR EACH ROW EXECUTE FUNCTION public.handle_update_auth_user();


-- ========================================================
-- 3. RPE LOGS STATS PROPAGATION
-- ========================================================

-- Trigger to recalculate RPE average for trainings when an RPE log is created or updated
CREATE OR REPLACE TRIGGER trigger_update_rpe_average
    AFTER INSERT OR UPDATE OR DELETE ON public.rpe_logs
    FOR EACH ROW EXECUTE FUNCTION public.update_training_rpe_average();
