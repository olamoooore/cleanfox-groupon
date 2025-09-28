'use client';

import Link from 'next/link';
import { CheckCircle, Clock, Calendar, ArrowLeft } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

// Client component that uses useSearchParams
function ThankYouContent() {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const searchParams = useSearchParams();
  const service = searchParams.get('service');

  useEffect(() => {
    // Load BookingKoala embed script when booking form is shown
    if (showBookingForm) {
      const script = document.createElement('script');
      script.src = 'https://cleanfox.bookingkoala.com/resources/embed.js';
      script.defer = true;
      document.head.appendChild(script);

      return () => {
        // Cleanup script when component unmounts or form is hidden
        const existingScript = document.querySelector('script[src="https://cleanfox.bookingkoala.com/resources/embed.js"]');
        if (existingScript) {
          document.head.removeChild(existingScript);
        }
      };
    }
  }, [showBookingForm]);

  if (showBookingForm) {
    // Full-page booking form view
    return (
      <div className="min-h-screen bg-gradient-mixed relative overflow-hidden animate-gradient">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-primary/30 to-secondary/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-secondary/30 to-primary/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Header */}
          <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowBookingForm(false)}
                className="flex items-center text-white/80 hover:text-white transition-all duration-200 group"
              >
                <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                Back to Thank You
              </button>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Book Your Service
              </h1>
              <div className="w-24"></div> {/* Spacer for centering */}
            </div>
          </div>

          {/* Full-page iframe */}
          <div className="flex-1 container mx-auto px-4 pb-6 sm:px-6 lg:px-8">
            <div className="glass-card rounded-3xl shadow-2xl border border-white/20 overflow-hidden h-full">
              <iframe 
                src="https://cleanfox.bookingkoala.com/booknow?embed=true"
                style={{border: 'none', height: '1000px'}} 
                width="100%" 
                scrolling="no"
                title="Service Booking"
                className="w-full h-full min-h-[800px]"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Thank you page view
  return (
    <div className="min-h-screen bg-gradient-mixed relative overflow-hidden animate-gradient">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-primary/30 to-secondary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-secondary/30 to-primary/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-2xl"></div>
      </div>
      
      <main className="relative z-10 min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full">
          <div className="glass-card rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12 text-center">
            {/* Success Icon */}
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-pulse-slow">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Thank You!
              </h1>
              <p className="text-xl text-white/80">
                Your booking request has been submitted successfully.
              </p>
            </div>
            
            {/* What happens next */}
            <div className="glass-card rounded-2xl border border-white/20 p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                What happens next?
              </h2>
              <ul className="text-left text-white/80 space-y-4">
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <span>We'll review your booking request within 24 hours</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <span>You'll receive a confirmation email with details</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <span>Our team will contact you to schedule your service</span>
                </li>
              </ul>
            </div>
            
            {/* Book Now section */}
            <div className="glass-card rounded-2xl border border-orange-400/30 bg-gradient-to-r from-orange-500/10 to-orange-600/10 p-6 md:p-8 mb-8">
              <div className="flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-orange-400 mr-3" />
                <h3 className="text-xl font-bold text-white">Can't wait for our call?</h3>
              </div>
              <p className="text-white/80 mb-6">
                Book your appointment immediately using our direct booking system.
              </p>
              <button
                onClick={() => setShowBookingForm(true)}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 px-6 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
              >
                <Calendar className="w-5 h-5 mr-3" />
                Book Now
              </button>
            </div>

            {/* Action buttons */}
            <div className="space-y-4">
              <Link 
                href="/"
                className="block w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-600 hover:to-secondary-600 text-white py-4 px-6 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Return to Home
              </Link>
              
              <Link 
                href="/"
                className="block w-full glass-card border border-white/20 text-white py-4 px-6 rounded-xl font-semibold hover:bg-white/10 transition-all duration-200"
              >
                Book Another Service
              </Link>
            </div>
            
            {/* Contact info */}
            <div className="mt-8 pt-8 border-t border-white/20">
              <p className="text-white/60">
                Questions? Contact us at{' '}
                <a href="mailto:support@cleanfox.com" className="text-primary hover:text-primary-light transition-colors">
                  support@cleanfox.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Loading fallback component
function ThankYouLoading() {
  return (
    <div className="min-h-screen bg-gradient-mixed relative overflow-hidden animate-gradient">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-primary/30 to-secondary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-secondary/30 to-primary/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-2xl"></div>
      </div>
      
      <main className="relative z-10 min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full">
          <div className="glass-card rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12 text-center">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-pulse-slow">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Thank You!
              </h1>
              <p className="text-xl text-white/80">
                Loading...
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Main page component with Suspense boundary
export default function ThankYouPage() {
  return (
    <Suspense fallback={<ThankYouLoading />}>
      <ThankYouContent />
    </Suspense>
  );
}