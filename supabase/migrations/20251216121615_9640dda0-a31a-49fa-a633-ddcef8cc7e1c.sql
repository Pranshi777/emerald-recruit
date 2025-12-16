-- Create jobs table
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create candidates table
CREATE TABLE public.candidates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  resume_url TEXT,
  ai_score INTEGER,
  ai_summary TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on jobs
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Jobs policies - users can only manage their own jobs
CREATE POLICY "Users can view their own jobs"
  ON public.jobs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own jobs"
  ON public.jobs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own jobs"
  ON public.jobs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own jobs"
  ON public.jobs FOR DELETE
  USING (auth.uid() = user_id);

-- Enable RLS on candidates
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

-- Candidates policies - users can manage candidates for their jobs
CREATE POLICY "Users can view candidates for their jobs"
  ON public.candidates FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.jobs
    WHERE jobs.id = candidates.job_id
    AND jobs.user_id = auth.uid()
  ));

CREATE POLICY "Users can create candidates for their jobs"
  ON public.candidates FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.jobs
    WHERE jobs.id = candidates.job_id
    AND jobs.user_id = auth.uid()
  ));

CREATE POLICY "Users can update candidates for their jobs"
  ON public.candidates FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.jobs
    WHERE jobs.id = candidates.job_id
    AND jobs.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete candidates for their jobs"
  ON public.candidates FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.jobs
    WHERE jobs.id = candidates.job_id
    AND jobs.user_id = auth.uid()
  ));

-- Create resumes storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true);

-- Storage policies for resumes bucket
CREATE POLICY "Anyone can view resumes"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'resumes');

CREATE POLICY "Authenticated users can upload resumes"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'resumes' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their uploaded resumes"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'resumes' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their uploaded resumes"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'resumes' AND auth.role() = 'authenticated');

-- Create indexes for better query performance
CREATE INDEX idx_jobs_user_id ON public.jobs(user_id);
CREATE INDEX idx_candidates_job_id ON public.candidates(job_id);
CREATE INDEX idx_candidates_status ON public.candidates(status);