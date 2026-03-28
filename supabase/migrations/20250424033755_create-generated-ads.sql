-- Create the generated_ads table
CREATE TABLE IF NOT EXISTS public.generated_ads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    prompt TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.generated_ads ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to view their own generated ads
CREATE POLICY "Users can view their own generated ads"
    ON public.generated_ads
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow users to insert their own generated ads
CREATE POLICY "Users can insert their own generated ads"
    ON public.generated_ads
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own generated ads
CREATE POLICY "Users can update their own generated ads"
    ON public.generated_ads
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own generated ads
CREATE POLICY "Users can delete their own generated ads"
    ON public.generated_ads
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create an index on user_id for better query performance
CREATE INDEX IF NOT EXISTS generated_ads_user_id_idx ON public.generated_ads(user_id);

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_generated_ads_updated_at
    BEFORE UPDATE ON public.generated_ads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create a storage bucket for generated ads
INSERT INTO storage.buckets (id, name, public)
VALUES ('generated-ads', 'generated-ads', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Users can upload their own generated ads"
    ON storage.objects
    FOR INSERT
    WITH CHECK (
        bucket_id = 'generated-ads' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view their own generated ads from storage"
    ON storage.objects
    FOR SELECT
    USING (
        bucket_id = 'generated-ads' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own generated ads from storage"
    ON storage.objects
    FOR DELETE
    USING (
        bucket_id = 'generated-ads' AND
        auth.uid()::text = (storage.foldername(name))[1]
    ); 