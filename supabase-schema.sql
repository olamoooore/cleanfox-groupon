-- Supabase Database Schema for Admin Backend
-- Run these SQL commands in your Supabase SQL Editor

-- Note: JWT secret is automatically managed by Supabase
-- No need to manually set app.jwt_secret

-- Create form_submissions table
CREATE TABLE IF NOT EXISTS public.form_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Customer Information
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    
    -- Address Information
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    
    -- Service Information
    service_type VARCHAR(100) NOT NULL,
    service_title VARCHAR(255) NOT NULL,
    coupon_code VARCHAR(100),
    
    -- Booking Information
    preferred_date DATE,
    preferred_time VARCHAR(50),
    special_instructions TEXT,
    
    -- Image Information
    property_images JSONB, -- Required: Array of property image URLs
    vehicle_images JSONB, -- Optional: Array of vehicle image URLs
    
    -- Status and Metadata
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    admin_notes TEXT,
    
    -- Indexes for better performance
    CONSTRAINT valid_email CHECK (customer_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON public.form_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_form_submissions_status ON public.form_submissions(status);
CREATE INDEX IF NOT EXISTS idx_form_submissions_email ON public.form_submissions(customer_email);
CREATE INDEX IF NOT EXISTS idx_form_submissions_service_type ON public.form_submissions(service_type);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.form_submissions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create admin_users table for additional admin functionality
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Admin Information
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin', 'viewer')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    
    -- Permissions
    can_manage_users BOOLEAN DEFAULT false,
    can_delete_submissions BOOLEAN DEFAULT true,
    can_export_data BOOLEAN DEFAULT true
);

-- Create trigger for admin_users updated_at
CREATE TRIGGER set_admin_users_updated_at
    BEFORE UPDATE ON public.admin_users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Row Level Security Policies

-- Enable RLS on tables
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Form submissions policies
-- Allow authenticated users to read all submissions
CREATE POLICY "Allow authenticated users to read form submissions" ON public.form_submissions
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert submissions (for the booking form)
CREATE POLICY "Allow authenticated users to insert form submissions" ON public.form_submissions
    FOR INSERT WITH CHECK (true);

-- Allow authenticated users to update submissions
CREATE POLICY "Allow authenticated users to update form submissions" ON public.form_submissions
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete submissions
CREATE POLICY "Allow authenticated users to delete form submissions" ON public.form_submissions
    FOR DELETE USING (auth.role() = 'authenticated');

-- Admin users policies
-- Allow users to read their own admin profile
CREATE POLICY "Allow users to read own admin profile" ON public.admin_users
    FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own admin profile
CREATE POLICY "Allow users to update own admin profile" ON public.admin_users
    FOR UPDATE USING (auth.uid() = id);

-- Allow super admins to manage all admin users
CREATE POLICY "Allow super admins to manage admin users" ON public.admin_users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE id = auth.uid() AND role = 'super_admin' AND is_active = true
        )
    );

-- Create a function to automatically create admin user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.admin_users (id, full_name, role)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', 'admin');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a view for submission statistics
CREATE OR REPLACE VIEW public.submission_stats AS
SELECT 
    COUNT(*) as total_submissions,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
    COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed_count,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_count,
    COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_count,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as this_week,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as this_month,
    service_type,
    DATE_TRUNC('day', created_at) as submission_date
FROM public.form_submissions
GROUP BY service_type, DATE_TRUNC('day', created_at)
ORDER BY submission_date DESC;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.form_submissions TO authenticated;
GRANT ALL ON public.admin_users TO authenticated;
GRANT SELECT ON public.submission_stats TO authenticated;

-- Create default admin user function
CREATE OR REPLACE FUNCTION public.create_default_admin()
RETURNS void AS $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Check if default admin already exists
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@cleanfox.com') THEN
        -- Note: In production, you should create the user through Supabase Auth UI or API
        -- This is a placeholder for the default admin credentials
        
        -- For development, you can manually create this user in Supabase Auth dashboard:
        -- Email: admin@cleanfox.com
        -- Password: CleanFox2025!
        
        RAISE NOTICE 'Default admin user should be created manually in Supabase Auth dashboard';
        RAISE NOTICE 'Email: admin@cleanfox.com';
        RAISE NOTICE 'Password: CleanFox2025!';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Call the function to create default admin
SELECT public.create_default_admin();

-- Image fields have been added to the form_submissions table
-- property_images: Required images of the property to be cleaned
-- vehicle_images: Optional images of vehicles (can be multiple)

-- Create storage bucket for form images
INSERT INTO storage.buckets (id, name, public) VALUES ('form-images', 'form-images', true);

-- Create storage policies for form images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'form-images');
CREATE POLICY "Authenticated users can upload form images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'form-images' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update their own form images" ON storage.objects FOR UPDATE USING (bucket_id = 'form-images' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete their own form images" ON storage.objects FOR DELETE USING (bucket_id = 'form-images' AND auth.role() = 'authenticated');

-- Comments for documentation
COMMENT ON TABLE public.form_submissions IS 'Stores customer booking form submissions from the website';
COMMENT ON TABLE public.admin_users IS 'Stores additional information for admin users';
COMMENT ON VIEW public.submission_stats IS 'Provides aggregated statistics for the admin dashboard';