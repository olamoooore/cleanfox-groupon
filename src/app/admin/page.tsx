'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { User } from '@supabase/supabase-js'

export default function AdminLogin() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if Supabase is configured
    if (!supabase || !isSupabaseConfigured()) {
      setLoading(false)
      return
    }

    // Check if user is already logged in
    const getUser = async () => {
      if (!supabase) return
      
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
      
      if (user) {
        router.push('/admin/dashboard')
      }
    }

    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          router.push('/admin/dashboard')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-mixed animate-gradient">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-transparent border-t-primary border-r-secondary mx-auto"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-4 border-primary/20 mx-auto"></div>
          </div>
          <p className="mt-6 text-white/80 font-medium">Loading Admin Portal...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-mixed animate-gradient">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome Back!</h2>
          <p className="text-white/70">Redirecting to your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-mixed animate-gradient flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{backgroundColor: 'transparent'}}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-secondary/20 to-primary/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-2xl bg-gradient-to-r from-primary to-secondary shadow-2xl shadow-primary/25 mb-8 transform hover:scale-105 transition-transform duration-300">
            <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
            Admin Portal
          </h2>
          <p className="text-lg text-white/70 font-medium">
            Secure access to your Cleanfox dashboard
          </p>
        </div>
        
        {/* Login Form */}
        <div className="glass-card py-10 px-8 shadow-2xl rounded-2xl border border-white/30 bg-black/30 hover:bg-black/40 transition-all duration-300">
          <div className="space-y-6 auth-container">
            <div style={{ background: 'transparent', backgroundColor: 'transparent' }}>
              {supabase && isSupabaseConfigured() ? (
                <Auth
                supabaseClient={supabase}
                appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#00d4aa',
                      brandAccent: '#00b894',
                      brandButtonText: 'white',
                      defaultButtonBackground: 'rgba(0, 212, 170, 1)',
                      defaultButtonBackgroundHover: 'rgba(0, 184, 148, 1)',
                      defaultButtonBorder: 'rgba(0, 212, 170, 0.7)',
                      defaultButtonText: 'white',
                      dividerBackground: 'rgba(255, 255, 255, 0.3)',
                      inputBackground: 'rgba(0, 0, 0, 0.5)',
                      inputBorder: 'rgba(255, 255, 255, 0.4)',
                      inputBorderHover: 'rgba(255, 255, 255, 0.6)',
                      inputBorderFocus: '#00d4aa',
                      inputText: 'white',
                      inputPlaceholder: 'rgba(255, 255, 255, 0.8)',
                      inputLabelText: 'white',
                      messageText: 'white',
                      messageTextDanger: '#ff6b6b',
                      anchorTextColor: '#00d4aa',
                      anchorTextHoverColor: '#00b894',
                    },
                    space: {
                      spaceSmall: '4px',
                      spaceMedium: '8px',
                      spaceLarge: '16px',
                      labelBottomMargin: '8px',
                      anchorBottomMargin: '4px',
                      emailInputSpacing: '4px',
                      socialAuthSpacing: '4px',
                      buttonPadding: '10px 15px',
                      inputPadding: '10px',
                    },
                    fontSizes: {
                      baseBodySize: '13px',
                      baseInputSize: '14px',
                      baseLabelSize: '14px',
                      baseButtonSize: '14px',
                    },
                    fonts: {
                      bodyFontFamily: `var(--font-open-sans), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
                      buttonFontFamily: `var(--font-open-sans), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
                      inputFontFamily: `var(--font-open-sans), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
                      labelFontFamily: `var(--font-open-sans), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
                    },
                    borderWidths: {
                      buttonBorderWidth: '1px',
                      inputBorderWidth: '1px',
                    },
                    radii: {
                      borderRadiusButton: '6px',
                      buttonBorderRadius: '6px',
                      inputBorderRadius: '6px',
                    },
                  },
                },
                className: {
                  container: 'space-y-4',
                  button: 'w-full font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25 transform hover:-translate-y-0.5',
                  input: 'w-full backdrop-blur-sm transition-all duration-200 focus:shadow-lg focus:shadow-emerald-500/25',
                  label: 'font-medium',
                  message: 'text-sm',
                },
              }}
              providers={[]}
              redirectTo="/admin/dashboard"
            />
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Admin Panel Not Available</h3>
                  <p className="text-white/70 text-sm">
                    The admin panel requires Supabase configuration. Please set up your environment variables to access this feature.
                  </p>
                  <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-yellow-400 text-xs">
                      Contact your administrator to configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 text-white/60">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-sm font-medium">
              Authorized personnel only
            </p>
          </div>
          <p className="text-xs text-white/40">
            All access is logged and monitored for security purposes
          </p>
        </div>
      </div>
    </div>
  )
}