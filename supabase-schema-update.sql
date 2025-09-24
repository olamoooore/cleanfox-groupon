-- Schema update script for adding image functionality
-- This script only contains the changes needed for image support

-- First, check if the columns already exist and add them if they don't
DO $$
BEGIN
    -- Add property_images column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'form_submissions' 
        AND column_name = 'property_images'
    ) THEN
        ALTER TABLE public.form_submissions ADD COLUMN property_images JSONB;
    END IF;

    -- Add vehicle_images column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'form_submissions' 
        AND column_name = 'vehicle_images'
    ) THEN
        ALTER TABLE public.form_submissions ADD COLUMN vehicle_images JSONB;
    END IF;
END
$$;

-- Create storage bucket for form images if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets WHERE id = 'form-images'
    ) THEN
        INSERT INTO storage.buckets (id, name, public) 
        VALUES ('form-images', 'form-images', true);
    END IF;
END
$$;

-- Create storage policies for form images (these will fail silently if they already exist)
DO $$
BEGIN
    -- We can't easily check if policies exist, so we'll use exception handling
    BEGIN
        CREATE POLICY "Public Access" ON storage.objects FOR SELECT 
        USING (bucket_id = 'form-images');
    EXCEPTION WHEN duplicate_object THEN
        -- Policy already exists, do nothing
    END;

    BEGIN
        CREATE POLICY "Authenticated users can upload form images" ON storage.objects FOR INSERT 
        WITH CHECK (bucket_id = 'form-images' AND auth.role() = 'authenticated');
    EXCEPTION WHEN duplicate_object THEN
        -- Policy already exists, do nothing
    END;

    BEGIN
        CREATE POLICY "Users can update their own form images" ON storage.objects FOR UPDATE 
        USING (bucket_id = 'form-images' AND auth.role() = 'authenticated');
    EXCEPTION WHEN duplicate_object THEN
        -- Policy already exists, do nothing
    END;

    BEGIN
        CREATE POLICY "Users can delete their own form images" ON storage.objects FOR DELETE 
        USING (bucket_id = 'form-images' AND auth.role() = 'authenticated');
    EXCEPTION WHEN duplicate_object THEN
        -- Policy already exists, do nothing
    END;
END
$$;

-- Update comments for documentation
COMMENT ON TABLE public.form_submissions IS 'Stores customer booking form submissions from the website including property and vehicle images';