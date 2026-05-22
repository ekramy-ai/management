-- VolleyClub Pro - Row Level Security (RLS) Policies
-- Phase 2: Enterprise RLS & Data Privacy Setup

-- ========================================================
-- SECURITY HELPER FUNCTIONS
-- ========================================================

-- Helper: Check if current user is Super Admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN SECURITY DEFINER AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() AND r.name = 'Super Admin'
  );
END;
$$ LANGUAGE plpgsql;

-- Helper: Check if current user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(role_name TEXT)
RETURNS BOOLEAN SECURITY DEFINER AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() AND r.name = role_name
  ) OR public.is_super_admin();
END;
$$ LANGUAGE plpgsql;

-- Helper: Check if current user has any of the specified roles
CREATE OR REPLACE FUNCTION public.has_any_role(role_names TEXT[])
RETURNS BOOLEAN SECURITY DEFINER AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() AND r.name = ANY(role_names)
  ) OR public.is_super_admin();
END;
$$ LANGUAGE plpgsql;

-- Helper: Check if coach is assigned to a specific team
CREATE OR REPLACE FUNCTION public.is_coach_of_team(team_uuid UUID)
RETURNS BOOLEAN SECURITY DEFINER AS $$
BEGIN
  -- If super admin or sports director, they can access any team
  IF public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Team Admin']) THEN
    RETURN TRUE;
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM public.staff s
    JOIN public.staff_roles sr ON s.id = sr.staff_id
    WHERE s.user_id = auth.uid() 
      AND sr.team_id = team_uuid 
      AND sr.role IN ('Head Coach', 'Assistant Coach', 'Analyst')
  );
END;
$$ LANGUAGE plpgsql;

-- Helper: Check if current user is a player and is on a specific team
CREATE OR REPLACE FUNCTION public.is_player_on_team(team_uuid UUID)
RETURNS BOOLEAN SECURITY DEFINER AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.players p
    WHERE p.user_id = auth.uid() AND p.id IN (
      -- Player is currently mapped to this team (via roster/statistics or standard associations)
      -- In the teams table or directly linked
      SELECT player_id FROM public.player_statistics WHERE season_id = (SELECT season_id FROM public.teams WHERE id = team_uuid)
    )
  );
END;
$$ LANGUAGE plpgsql;

-- ========================================================
-- ENABLE RLS ON ALL TABLES
-- ========================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.age_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_medical ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disciplinary_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_loads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rpe_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_lineups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_rotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rally_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- ========================================================
-- RLS POLICIES BY TABLE
-- ========================================================

-- 1. USERS
CREATE POLICY users_select_policy ON public.users
    FOR SELECT USING (auth.uid() = id OR public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Team Admin', 'Head Coach', 'Assistant Coach', 'Analyst', 'Medical Staff']));

CREATE POLICY users_modify_policy ON public.users
    FOR ALL USING (public.is_super_admin() OR auth.uid() = id);

-- 2. RBAC (roles, permissions, role_permissions, user_roles)
CREATE POLICY rbac_read_policy ON public.roles FOR SELECT USING (true);
CREATE POLICY rbac_admin_policy ON public.roles FOR ALL USING (public.is_super_admin());

CREATE POLICY permissions_read_policy ON public.permissions FOR SELECT USING (true);
CREATE POLICY permissions_admin_policy ON public.permissions FOR ALL USING (public.is_super_admin());

CREATE POLICY role_perms_read_policy ON public.role_permissions FOR SELECT USING (true);
CREATE POLICY role_perms_admin_policy ON public.role_permissions FOR ALL USING (public.is_super_admin());

CREATE POLICY user_roles_read_policy ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Team Admin']));
CREATE POLICY user_roles_admin_policy ON public.user_roles FOR ALL USING (public.is_super_admin());

-- 3. CLUBS & SEASONS
CREATE POLICY clubs_select_policy ON public.clubs FOR SELECT USING (true);
CREATE POLICY clubs_write_policy ON public.clubs FOR ALL USING (public.has_any_role(ARRAY['Super Admin', 'Club Director']));

CREATE POLICY seasons_select_policy ON public.seasons FOR SELECT USING (true);
CREATE POLICY seasons_write_policy ON public.seasons FOR ALL USING (public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director']));

-- 4. TEAMS, AGE GROUPS, SPORTS
CREATE POLICY teams_select_policy ON public.teams FOR SELECT USING (true);
CREATE POLICY teams_write_policy ON public.teams FOR ALL USING (public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Team Admin']));

CREATE POLICY age_groups_select_policy ON public.age_groups FOR SELECT USING (true);
CREATE POLICY age_groups_write_policy ON public.age_groups FOR ALL USING (public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director']));

CREATE POLICY sports_select_policy ON public.sports FOR SELECT USING (true);
CREATE POLICY sports_write_policy ON public.sports FOR ALL USING (public.is_super_admin());

-- 5. PLAYERS & PROFILES
CREATE POLICY players_select_policy ON public.players 
    FOR SELECT USING (true);

CREATE POLICY players_write_policy ON public.players 
    FOR ALL USING (public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Team Admin', 'Head Coach']));

CREATE POLICY profiles_select_policy ON public.player_profiles 
    FOR SELECT USING (true);

CREATE POLICY profiles_write_policy ON public.player_profiles 
    FOR ALL USING (public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Team Admin', 'Head Coach']) OR player_id IN (SELECT id FROM public.players WHERE user_id = auth.uid()));

-- 6. MEDICAL (Restricted to Medical, Super Admin, and the Player themselves)
CREATE POLICY medical_select_policy ON public.player_medical
    FOR SELECT USING (
        public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Medical Staff']) OR
        player_id IN (SELECT id FROM public.players WHERE user_id = auth.uid())
    );

CREATE POLICY medical_write_policy ON public.player_medical
    FOR ALL USING (public.has_any_role(ARRAY['Super Admin', 'Medical Staff']));

-- 7. CONTRACTS & DOCUMENTS (Restricted to Admins and the Player themselves)
CREATE POLICY contracts_select_policy ON public.player_contracts
    FOR SELECT USING (
        public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Team Admin']) OR
        player_id IN (SELECT id FROM public.players WHERE user_id = auth.uid())
    );

CREATE POLICY contracts_write_policy ON public.player_contracts
    FOR ALL USING (public.has_any_role(ARRAY['Super Admin', 'Club Director']));

CREATE POLICY documents_select_policy ON public.player_documents
    FOR SELECT USING (
        public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Team Admin', 'Head Coach']) OR
        player_id IN (SELECT id FROM public.players WHERE user_id = auth.uid())
    );

CREATE POLICY documents_write_policy ON public.player_documents
    FOR ALL USING (public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Team Admin']) OR player_id IN (SELECT id FROM public.players WHERE user_id = auth.uid()));

-- 8. PLAYER STATISTICS
CREATE POLICY stats_select_policy ON public.player_statistics FOR SELECT USING (true);
CREATE POLICY stats_write_policy ON public.player_statistics FOR ALL USING (public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Team Admin', 'Head Coach', 'Assistant Coach', 'Analyst']));

-- 9. STAFF & ROLES
CREATE POLICY staff_select_policy ON public.staff FOR SELECT USING (true);
CREATE POLICY staff_write_policy ON public.staff FOR ALL USING (public.has_any_role(ARRAY['Super Admin', 'Club Director']));

CREATE POLICY staff_roles_select_policy ON public.staff_roles FOR SELECT USING (true);
CREATE POLICY staff_roles_write_policy ON public.staff_roles FOR ALL USING (public.has_any_role(ARRAY['Super Admin', 'Club Director']));

CREATE POLICY staff_attendance_select_policy ON public.staff_attendance
    FOR SELECT USING (public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director']) OR staff_id IN (SELECT id FROM public.staff WHERE user_id = auth.uid()));
CREATE POLICY staff_attendance_write_policy ON public.staff_attendance FOR ALL USING (public.has_any_role(ARRAY['Super Admin', 'Club Director']));

CREATE POLICY staff_docs_select_policy ON public.staff_documents
    FOR SELECT USING (public.has_any_role(ARRAY['Super Admin', 'Club Director']) OR staff_id IN (SELECT id FROM public.staff WHERE user_id = auth.uid()));
CREATE POLICY staff_docs_write_policy ON public.staff_documents FOR ALL USING (public.has_any_role(ARRAY['Super Admin', 'Club Director']));

-- 10. TRAINING SESSIONS & PLANS
CREATE POLICY training_sessions_select_policy ON public.training_sessions FOR SELECT USING (true);
CREATE POLICY training_sessions_write_policy ON public.training_sessions 
    FOR ALL USING (public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Team Admin', 'Head Coach', 'Assistant Coach']));

CREATE POLICY plans_select_policy ON public.training_plans FOR SELECT USING (true);
CREATE POLICY plans_write_policy ON public.training_plans FOR ALL USING (public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Head Coach', 'Assistant Coach']));

CREATE POLICY trainings_select_policy ON public.trainings FOR SELECT USING (true);
CREATE POLICY trainings_write_policy ON public.trainings FOR ALL USING (public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Head Coach', 'Assistant Coach']));

CREATE POLICY loads_select_policy ON public.training_loads FOR SELECT USING (true);
CREATE POLICY loads_write_policy ON public.training_loads FOR ALL USING (public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Head Coach', 'Assistant Coach']));

-- 11. RPE LOGS (Players write their own logs; Coaches/Admins read all)
CREATE POLICY rpe_select_policy ON public.rpe_logs
    FOR SELECT USING (
        public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Team Admin', 'Head Coach', 'Assistant Coach', 'Analyst', 'Medical Staff']) OR
        player_id IN (SELECT id FROM public.players WHERE user_id = auth.uid())
    );

CREATE POLICY rpe_insert_policy ON public.rpe_logs
    FOR INSERT WITH CHECK (
        player_id IN (SELECT id FROM public.players WHERE user_id = auth.uid())
    );

CREATE POLICY rpe_update_policy ON public.rpe_logs
    FOR UPDATE USING (
        player_id IN (SELECT id FROM public.players WHERE user_id = auth.uid())
    );

CREATE POLICY rpe_delete_policy ON public.rpe_logs
    FOR DELETE USING (
        public.is_super_admin()
    );

CREATE POLICY training_notes_select_policy ON public.training_notes FOR SELECT USING (true);
CREATE POLICY training_notes_write_policy ON public.training_notes FOR ALL USING (public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Head Coach', 'Assistant Coach']));

-- 12. ATTENDANCE (CRITICAL MODULE)
CREATE POLICY att_sessions_select_policy ON public.attendance_sessions FOR SELECT USING (true);
CREATE POLICY att_sessions_write_policy ON public.attendance_sessions FOR ALL USING (public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Team Admin', 'Head Coach', 'Assistant Coach']));

CREATE POLICY att_records_select_policy ON public.attendance_records
    FOR SELECT USING (
        public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Team Admin', 'Head Coach', 'Assistant Coach', 'Analyst']) OR
        player_id IN (SELECT id FROM public.players WHERE user_id = auth.uid()) OR
        staff_id IN (SELECT id FROM public.staff WHERE user_id = auth.uid())
    );

CREATE POLICY att_records_write_policy ON public.attendance_records
    FOR ALL USING (public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Team Admin', 'Head Coach', 'Assistant Coach']));

CREATE POLICY att_notes_select_policy ON public.attendance_notes FOR SELECT USING (true);
CREATE POLICY att_notes_write_policy ON public.attendance_notes FOR ALL USING (public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Team Admin', 'Head Coach', 'Assistant Coach']));

CREATE POLICY disciplinary_select_policy ON public.disciplinary_actions
    FOR SELECT USING (
        public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Team Admin', 'Head Coach']) OR
        player_id IN (SELECT id FROM public.players WHERE user_id = auth.uid())
    );

CREATE POLICY disciplinary_write_policy ON public.disciplinary_actions
    FOR ALL USING (public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Team Admin', 'Head Coach']));

-- 13. MATCHES, LINEUPS, ROTATIONS, SETS, STATISTICS & RALLIES
CREATE POLICY matches_select_policy ON public.matches FOR SELECT USING (true);
CREATE POLICY matches_write_policy ON public.matches FOR ALL USING (public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Team Admin', 'Head Coach', 'Assistant Coach', 'Analyst']));

CREATE POLICY lineups_select_policy ON public.match_lineups FOR SELECT USING (true);
CREATE POLICY lineups_write_policy ON public.match_lineups FOR ALL USING (public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Head Coach', 'Assistant Coach', 'Analyst']));

CREATE POLICY rotations_select_policy ON public.match_rotations FOR SELECT USING (true);
CREATE POLICY rotations_write_policy ON public.match_rotations FOR ALL USING (public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Head Coach', 'Assistant Coach', 'Analyst']));

CREATE POLICY sets_select_policy ON public.match_sets FOR SELECT USING (true);
CREATE POLICY sets_write_policy ON public.match_sets FOR ALL USING (public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Head Coach', 'Assistant Coach', 'Analyst']));

CREATE POLICY stats_event_select_policy ON public.match_statistics FOR SELECT USING (true);
CREATE POLICY stats_event_write_policy ON public.match_statistics FOR ALL USING (public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Head Coach', 'Assistant Coach', 'Analyst']));

CREATE POLICY rally_select_policy ON public.rally_tracking FOR SELECT USING (true);
CREATE POLICY rally_write_policy ON public.rally_tracking FOR ALL USING (public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Head Coach', 'Assistant Coach', 'Analyst']));

-- 14. REPORTS & snapshots
CREATE POLICY reports_select_policy ON public.reports
    FOR SELECT USING (public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Team Admin', 'Head Coach', 'Assistant Coach', 'Analyst']));
CREATE POLICY reports_write_policy ON public.reports FOR ALL USING (public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Team Admin', 'Head Coach', 'Analyst']));

CREATE POLICY snapshots_select_policy ON public.analytics_snapshots FOR SELECT USING (true);
CREATE POLICY snapshots_write_policy ON public.analytics_snapshots FOR ALL USING (public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Analyst']));

CREATE POLICY dashboards_select_policy ON public.dashboards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY dashboards_write_policy ON public.dashboards FOR ALL USING (auth.uid() = user_id);

CREATE POLICY metrics_select_policy ON public.performance_metrics FOR SELECT USING (true);
CREATE POLICY metrics_write_policy ON public.performance_metrics FOR ALL USING (public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Head Coach', 'Assistant Coach', 'Analyst', 'Medical Staff']));

-- 15. COMMUNICATIONS (notifications, announcements, messages, tasks)
CREATE POLICY notifications_select_policy ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY notifications_write_policy ON public.notifications FOR ALL USING (auth.uid() = user_id OR public.is_super_admin());

CREATE POLICY announcements_select_policy ON public.announcements FOR SELECT USING (true);
CREATE POLICY announcements_write_policy ON public.announcements FOR ALL USING (public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Team Admin']));

-- Messages (Direct message or Team message)
CREATE POLICY messages_select_policy ON public.messages
    FOR SELECT USING (
        sender_id = auth.uid() OR
        receiver_id = auth.uid() OR
        (team_id IS NOT NULL AND public.is_coach_of_team(team_id)) OR
        (team_id IS NOT NULL AND public.is_player_on_team(team_id))
    );

CREATE POLICY messages_insert_policy ON public.messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid()
    );

CREATE POLICY tasks_select_policy ON public.tasks
    FOR SELECT USING (
        public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Team Admin', 'Head Coach']) OR
        assigned_to = auth.uid()
    );

CREATE POLICY tasks_write_policy ON public.tasks FOR ALL USING (public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Team Admin', 'Head Coach']));
