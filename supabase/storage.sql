-- VolleyClub Pro - Storage Setup & RLS Policies
-- Phase 2: Supabase Storage Buckets & Policies configuration

-- ========================================================
-- 1. BUCKETS DECLARATION
-- ========================================================

-- Insert buckets configurations into the storage.buckets table
-- This configures public/private status and size limits (bytes)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  (
    'player-photos', 
    'player-photos', 
    true, -- Publicly readable
    5242880, -- 5 MB
    ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']
  ),
  (
    'documents', 
    'documents', 
    false, -- Private (restricted access)
    10485760, -- 10 MB
    ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg']
  ),
  (
    'medical-files', 
    'medical-files', 
    false, -- Private (strictly confidential)
    10485760, -- 10 MB
    ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']
  ),
  (
    'match-videos', 
    'match-videos', 
    false, -- Private (large video sizes)
    1073741824, -- 1 GB
    ARRAY['video/mp4', 'video/quicktime', 'video/x-matroska', 'video/webm']
  ),
  (
    'training-media', 
    'training-media', 
    true, -- Publicly readable drill animations / media
    104857600, -- 100 MB
    ARRAY['image/png', 'image/jpeg', 'image/webp', 'video/mp4', 'application/pdf']
  )
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ========================================================
-- 2. OBJECTS RLS POLICIES
-- ========================================================

-- Enable RLS on storage objects table if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- --- BUCKET: player-photos ---
-- View: Publicly accessible
CREATE POLICY "Public read for player-photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'player-photos');

-- Write/Modify: Admins, Coaches, or the player themselves updating their own photo
CREATE POLICY "Upload/Modify player-photos" ON storage.objects
  FOR ALL USING (
    bucket_id = 'player-photos' 
    AND (
      public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Team Admin', 'Head Coach'])
      OR (auth.uid() IS NOT NULL AND (storage.foldername(name))[1] = auth.uid()::text) -- path matches user ID
    )
  );

-- --- BUCKET: documents ---
-- Read: Admins, Coaches, or the document owner
CREATE POLICY "Read documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents'
    AND (
      public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Team Admin', 'Head Coach'])
      OR (auth.uid() IS NOT NULL AND (storage.foldername(name))[1] = auth.uid()::text)
    )
  );

-- Write: Admins, Team Admins, or the owner uploading their own document
CREATE POLICY "Upload/Modify documents" ON storage.objects
  FOR ALL USING (
    bucket_id = 'documents'
    AND (
      public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Team Admin'])
      OR (auth.uid() IS NOT NULL AND (storage.foldername(name))[1] = auth.uid()::text)
    )
  );

-- --- BUCKET: medical-files ---
-- Read: Medical Staff, Super Admin, or the player themselves
CREATE POLICY "Read medical-files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'medical-files'
    AND (
      public.has_any_role(ARRAY['Super Admin', 'Medical Staff'])
      OR (auth.uid() IS NOT NULL AND (storage.foldername(name))[1] = auth.uid()::text)
    )
  );

-- Write: Medical Staff and Super Admin only
CREATE POLICY "Upload/Modify medical-files" ON storage.objects
  FOR ALL USING (
    bucket_id = 'medical-files'
    AND public.has_any_role(ARRAY['Super Admin', 'Medical Staff'])
  );

-- --- BUCKET: match-videos ---
-- Read: All authenticated players, coaches, staff, and analysts
CREATE POLICY "Read match-videos" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'match-videos'
    AND auth.uid() IS NOT NULL
  );

-- Write: Analysts, Coaches, and Admins
CREATE POLICY "Upload/Modify match-videos" ON storage.objects
  FOR ALL USING (
    bucket_id = 'match-videos'
    AND public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Analyst', 'Head Coach'])
  );

-- --- BUCKET: training-media ---
-- Read: Anyone can read training media
CREATE POLICY "Public read for training-media" ON storage.objects
  FOR SELECT USING (bucket_id = 'training-media');

-- Write: Coaches, Analysts, and Admins
CREATE POLICY "Upload/Modify training-media" ON storage.objects
  FOR ALL USING (
    bucket_id = 'training-media'
    AND public.has_any_role(ARRAY['Super Admin', 'Club Director', 'Sports Director', 'Head Coach', 'Assistant Coach', 'Analyst'])
  );
