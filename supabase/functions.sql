-- VolleyClub Pro - Advanced PostgreSQL Functions
-- Phase 2: Volleyball Analytics & Attendance KPI Engines

-- ========================================================
-- 1. VOLLEYBALL PERFORMANCE ANALYTICS
-- ========================================================

-- Calculate Hitting (Attack) Efficiency
-- Formula: (Kills - Attack Errors) / Total Attacks
CREATE OR REPLACE FUNCTION public.calculate_hitting_efficiency(
    p_player_id UUID,
    p_season_id UUID DEFAULT NULL
)
RETURNS NUMERIC AS $$
DECLARE
    v_kills INT := 0;
    v_errors INT := 0;
    v_attacks INT := 0;
    v_efficiency NUMERIC := 0.000;
BEGIN
    IF p_season_id IS NOT NULL THEN
        -- Fetch from historical statistics cache
        SELECT kills, attack_errors, attacks 
        INTO v_kills, v_errors, v_attacks
        FROM public.player_statistics
        WHERE player_id = p_player_id AND season_id = p_season_id;
    ELSE
        -- Calculate dynamically from match event logs
        SELECT 
            COALESCE(COUNT(CASE WHEN action_quality = 'Kill' THEN 1 END), 0),
            COALESCE(COUNT(CASE WHEN action_quality = 'Error' THEN 1 END), 0),
            COALESCE(COUNT(1), 0)
        INTO v_kills, v_errors, v_attacks
        FROM public.match_statistics
        WHERE player_id = p_player_id AND action_type = 'Attack';
    END IF;

    IF v_attacks > 0 THEN
        v_efficiency := (v_kills - v_errors)::NUMERIC / v_attacks::NUMERIC;
    ELSE
        v_efficiency := 0.000;
    END IF;

    RETURN ROUND(v_efficiency, 3);
END;
$$ LANGUAGE plpgsql STABLE;

-- Calculate Side Out Percentage
-- Formula: (Rallies Won on Opponent Serve) / (Total Opponent Serves)
CREATE OR REPLACE FUNCTION public.calculate_side_out_percentage(
    p_team_id UUID,
    p_match_id UUID DEFAULT NULL
)
RETURNS NUMERIC AS $$
DECLARE
    v_side_outs_won INT := 0;
    v_total_opponent_serves INT := 0;
    v_side_out_pct NUMERIC := 0.00;
BEGIN
    IF p_match_id IS NOT NULL THEN
        -- Calculate for specific match
        SELECT 
            COALESCE(COUNT(CASE WHEN serving_team = 'Opponent' AND winner = 'Us' THEN 1 END), 0),
            COALESCE(COUNT(CASE WHEN serving_team = 'Opponent' THEN 1 END), 0)
        INTO v_side_outs_won, v_total_opponent_serves
        FROM public.rally_tracking
        WHERE match_id = p_match_id;
    ELSE
        -- Calculate for all matches played by the team
        SELECT 
            COALESCE(COUNT(CASE WHEN r.serving_team = 'Opponent' AND r.winner = 'Us' THEN 1 END), 0),
            COALESCE(COUNT(CASE WHEN r.serving_team = 'Opponent' THEN 1 END), 0)
        INTO v_side_outs_won, v_total_opponent_serves
        FROM public.rally_tracking r
        JOIN public.matches m ON r.match_id = m.id
        WHERE m.team_id = p_team_id;
    END IF;

    IF v_total_opponent_serves > 0 THEN
        v_side_out_pct := (v_side_outs_won::NUMERIC / v_total_opponent_serves::NUMERIC) * 100.0;
    ELSE
        v_side_out_pct := 0.00;
    END IF;

    RETURN ROUND(v_side_out_pct, 2);
END;
$$ LANGUAGE plpgsql STABLE;

-- Calculate Serve Receive Rating (Passing Score)
-- Scale: 0.00 to 3.00
-- Formula: (Perfect_Receive * 3 + Good_Receive * 2 + Poor_Receive * 1) / Total Receptions
CREATE OR REPLACE FUNCTION public.calculate_serve_receive_rating(
    p_player_id UUID,
    p_season_id UUID DEFAULT NULL
)
RETURNS NUMERIC AS $$
DECLARE
    v_perfect INT := 0;
    v_good INT := 0;
    v_poor INT := 0;
    v_error INT := 0;
    v_total INT := 0;
    v_rating NUMERIC := 0.00;
BEGIN
    IF p_season_id IS NOT NULL THEN
        -- Dynamic aggregation from match_statistics filter by season
        SELECT 
            COALESCE(COUNT(CASE WHEN action_quality = '3' THEN 1 END), 0),
            COALESCE(COUNT(CASE WHEN action_quality = '2' THEN 1 END), 0),
            COALESCE(COUNT(CASE WHEN action_quality = '1' THEN 1 END), 0),
            COALESCE(COUNT(CASE WHEN action_quality = '0' THEN 1 END), 0),
            COALESCE(COUNT(1), 0)
        INTO v_perfect, v_good, v_poor, v_error, v_total
        FROM public.match_statistics ms
        JOIN public.matches m ON ms.match_id = m.id
        WHERE ms.player_id = p_player_id 
          AND ms.action_type = 'Receive'
          AND m.season_id = p_season_id;
    ELSE
        -- Dynamic aggregation for all times
        SELECT 
            COALESCE(COUNT(CASE WHEN action_quality = '3' THEN 1 END), 0),
            COALESCE(COUNT(CASE WHEN action_quality = '2' THEN 1 END), 0),
            COALESCE(COUNT(CASE WHEN action_quality = '1' THEN 1 END), 0),
            COALESCE(COUNT(CASE WHEN action_quality = '0' THEN 1 END), 0),
            COALESCE(COUNT(1), 0)
        INTO v_perfect, v_good, v_poor, v_error, v_total
        FROM public.match_statistics
        WHERE player_id = p_player_id AND action_type = 'Receive';
    END IF;

    IF v_total > 0 THEN
        v_rating := (v_perfect * 3 + v_good * 2 + v_poor * 1)::NUMERIC / v_total::NUMERIC;
    ELSE
        v_rating := 0.00;
    END IF;

    RETURN ROUND(v_rating, 2);
END;
$$ LANGUAGE plpgsql STABLE;

-- Setter Distribution
-- Returns target zone counts and percentages for a setter in a match
CREATE OR REPLACE FUNCTION public.get_setter_distribution(
    p_match_id UUID,
    p_set_number INT DEFAULT NULL
)
RETURNS TABLE (
    target_zone TEXT,
    set_count BIGINT,
    percentage NUMERIC
) AS $$
DECLARE
    v_total_sets BIGINT;
BEGIN
    -- Calculate total sets
    SELECT COUNT(1) INTO v_total_sets
    FROM public.match_statistics
    WHERE match_id = p_match_id 
      AND action_type = 'Set'
      AND (p_set_number IS NULL OR set_number = p_set_number)
      AND (details->>'target_zone') IS NOT NULL;

    RETURN QUERY
    SELECT 
        details->>'target_zone' AS target_zone,
        COUNT(1) AS set_count,
        ROUND((COUNT(1)::NUMERIC / NULLIF(v_total_sets, 0)::NUMERIC) * 100, 2) AS percentage
    FROM public.match_statistics
    WHERE match_id = p_match_id 
      AND action_type = 'Set'
      AND (p_set_number IS NULL OR set_number = p_set_number)
      AND (details->>'target_zone') IS NOT NULL
    GROUP BY details->>'target_zone'
    ORDER BY set_count DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- ========================================================
-- 2. ATTENDANCE ANALYTICS ENGINE
-- ========================================================

-- Repeated Absence Tracker
-- Identifies players with more than threshold unexcused absences in the current month
CREATE OR REPLACE FUNCTION public.get_repeated_absences(
    p_threshold INT DEFAULT 3
)
RETURNS TABLE (
    player_id UUID,
    full_name_en TEXT,
    full_name_ar TEXT,
    team_name_en TEXT,
    absence_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id AS player_id,
        pp.full_name_en,
        pp.full_name_ar,
        t.name_en AS team_name_en,
        COUNT(r.id) AS absence_count
    FROM public.players p
    JOIN public.player_profiles pp ON p.id = pp.player_id
    JOIN public.attendance_records r ON p.id = r.player_id
    JOIN public.attendance_sessions s ON r.session_id = s.id
    JOIN public.teams t ON p.id IN (
        -- Simple check to grab team
        SELECT player_id FROM public.player_statistics WHERE season_id = t.season_id
    )
    WHERE r.status = 'Absent' 
      AND s.date >= DATE_TRUNC('month', CURRENT_DATE)::DATE
    GROUP BY p.id, pp.full_name_en, pp.full_name_ar, t.name_en
    HAVING COUNT(r.id) >= p_threshold
    ORDER BY absence_count DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Monthly Attendance Report
-- Calculates stats (Present %, Late %, Absent %, Excused %, Injured %) for a team and month
CREATE OR REPLACE FUNCTION public.calculate_monthly_attendance_report(
    p_team_id UUID,
    p_start_date DATE,
    p_end_date DATE
)
RETURNS TABLE (
    player_id UUID,
    full_name_en TEXT,
    full_name_ar TEXT,
    total_sessions BIGINT,
    present_count BIGINT,
    late_count BIGINT,
    absent_count BIGINT,
    excused_count BIGINT,
    injured_count BIGINT,
    attendance_rate NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id AS player_id,
        pp.full_name_en,
        pp.full_name_ar,
        COUNT(r.id) AS total_sessions,
        COUNT(CASE WHEN r.status = 'Present' THEN 1 END)::BIGINT AS present_count,
        COUNT(CASE WHEN r.status = 'Late' THEN 1 END)::BIGINT AS late_count,
        COUNT(CASE WHEN r.status = 'Absent' THEN 1 END)::BIGINT AS absent_count,
        COUNT(CASE WHEN r.status = 'Excused' THEN 1 END)::BIGINT AS excused_count,
        COUNT(CASE WHEN r.status = 'Injured' THEN 1 END)::BIGINT AS injured_count,
        ROUND(
            (COUNT(CASE WHEN r.status IN ('Present', 'Late') THEN 1 END)::NUMERIC / 
            NULLIF(COUNT(r.id), 0)::NUMERIC) * 100.0, 
            2
        ) AS attendance_rate
    FROM public.players p
    JOIN public.player_profiles pp ON p.id = pp.player_id
    LEFT JOIN public.attendance_records r ON p.id = r.player_id
    LEFT JOIN public.attendance_sessions s ON r.session_id = s.id
    WHERE s.date BETWEEN p_start_date AND p_end_date
      AND s.reference_id IN (
          -- sessions belonging to the team
          SELECT id FROM public.training_sessions WHERE team_id = p_team_id
          UNION
          SELECT id FROM public.matches WHERE team_id = p_team_id
      )
    GROUP BY p.id, pp.full_name_en, pp.full_name_ar
    ORDER BY pp.full_name_en ASC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Trigger Function: Update RPE Average in Trainings on RPE insert/update
CREATE OR REPLACE FUNCTION public.update_training_rpe_average()
RETURNS TRIGGER AS $$
DECLARE
    v_avg_rpe NUMERIC;
BEGIN
    -- Calculate average RPE score for this session
    SELECT AVG(rpe_score) INTO v_avg_rpe
    FROM public.rpe_logs
    WHERE session_id = NEW.session_id;

    -- Update trainings table
    UPDATE public.trainings
    SET rpe_average = ROUND(v_avg_rpe, 2)
    WHERE session_id = NEW.session_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
