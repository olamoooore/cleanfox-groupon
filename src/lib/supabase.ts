import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create Supabase client only if environment variables are available
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Database types for TypeScript
export interface FormSubmission {
  id: string
  created_at: string
  updated_at: string
  customer_name: string
  customer_email: string
  customer_phone: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  zip_code: string
  service_type: string
  service_title: string
  coupon_code?: string
  preferred_date: string
  preferred_time: string
  special_instructions?: string
  property_images?: string[] // Required property images
  vehicle_images?: string[] // Optional vehicle images
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  admin_notes?: string
}

export interface AdminUser {
  id: string
  email: string
  created_at: string
  last_sign_in_at: string
  role: 'admin' | 'super_admin'
}

// Helper functions for database operations
export const dbOperations = {
  // Form submissions
  getFormSubmissions: async (): Promise<FormSubmission[]> => {
    if (!supabase) {
      console.warn('Supabase not configured, returning empty array')
      return []
    }
    
    const { data, error } = await supabase
      .from('form_submissions')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },
  
  updateSubmissionStatus: async (id: string, status: FormSubmission['status']) => {
    if (!supabase) {
      console.warn('Supabase not configured, cannot update submission status')
      return false
    }
    
    const { error } = await supabase
      .from('form_submissions')
      .update({ status })
      .eq('id', id)
    
    if (error) throw error
    return true
  },
  
  deleteSubmission: async (id: string) => {
    if (!supabase) {
      console.warn('Supabase not configured, cannot delete submission')
      return false
    }
    
    const { error } = await supabase
      .from('form_submissions')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  },
  
  updateSubmission: async (id: string, data: Partial<FormSubmission>) => {
    if (!supabase) {
      console.warn('Supabase not configured, cannot update submission')
      return false
    }
    
    const { error } = await supabase
      .from('form_submissions')
      .update(data)
      .eq('id', id)
    
    if (error) throw error
    return true
  },

  // Analytics
  async getSubmissionStats() {
    if (!supabase) {
      console.warn('Supabase not configured, returning default stats')
      return {
        total: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
        thisMonth: 0
      }
    }
    
    const { data, error } = await supabase
      .from('form_submissions')
      .select('status, created_at')
    
    if (error) throw error
    
    const stats = {
      total: data.length,
      pending: data.filter(s => s.status === 'pending').length,
      confirmed: data.filter(s => s.status === 'confirmed').length,
      completed: data.filter(s => s.status === 'completed').length,
      cancelled: data.filter(s => s.status === 'cancelled').length,
      thisMonth: data.filter(s => {
        const date = new Date(s.created_at)
        const now = new Date()
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
      }).length
    }
    
    return stats
  }
}