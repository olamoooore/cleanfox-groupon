import Link from 'next/link';
import { CheckCircle, Clock, Calendar } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

// Client component that uses useSearchParams
'use client';

function ThankYouContent() {
  console.log('Thank you page is rendering');
  const searchParams = useSearchParams();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [service, setService] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set client flag to true after component mounts
    setIsClient(true);
    
    // Get service from URL params or localStorage (only on client)
    if (typeof window !== 'undefined') {
      const serviceFromParams = searchParams.get('service');
      const serviceFromStorage = localStorage.getItem('selectedService');
      const detectedService = serviceFromParams || serviceFromStorage;
      setService(detectedService);
    }
  }, []); // Removed searchParams from dependency array

  const isMobileDetailing = isClient && service === 'mobile-detailing';

  useEffect(() => {
    // Load BookingKoala embed script when booking form is shown
    if (showBookingForm && isMobileDetailing) {
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
  }, [showBookingForm, isMobileDetailing]);
  
  // Show loading state during SSR or while client is initializing
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="mb-6">
            <div className="h-16 w-16 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Thank You!
            </h1>
            <p className="text-lg text-gray-600">
              Your booking request has been submitted successfully.
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              What happens next?
            </h2>
            <ul className="text-left text-gray-600 space-y-2">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                We&apos;ll review your booking request within 24 hours
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                You&apos;ll receive a confirmation email with details
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Our team will contact you to schedule your service
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <Link 
              href="/"
              className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Return to Home
            </Link>
            
            <Link 
              href="/"
              className="block w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Book Another Service
            </Link>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Questions? Contact us at{' '}
              <a href="mailto:support@cleanfox.com" className="text-blue-600 hover:underline">
                support@cleanfox.com
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="mb-6">
          <div className="h-16 w-16 mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thank You!
          </h1>
          <p className="text-lg text-gray-600">
            Your booking request has been submitted successfully.
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            What happens next?
          </h2>
          <ul className="text-left text-gray-600 space-y-2">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              We&apos;ll review your booking request within 24 hours
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              You&apos;ll receive a confirmation email with details
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Our team will contact you to schedule your service
            </li>
          </ul>
        </div>
        
        {/* Can't wait section for mobile detailing */}
        {isMobileDetailing && !showBookingForm && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-2">
              <Clock className="h-5 w-5 text-orange-600 mr-2" />
              <h3 className="text-lg font-semibold text-orange-800">Can&apos;t wait for our call?</h3>
            </div>
            <p className="text-orange-700 mb-3">
              Book your mobile detailing appointment immediately using our direct booking system.
            </p>
            <button
              onClick={() => setShowBookingForm(true)}
              className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Book Now - Mobile Detailing
            </button>
          </div>
        )}

        {/* Embedded booking form for mobile detailing */}
        {isMobileDetailing && showBookingForm && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Book Your Mobile Detailing</h3>
              <button
                onClick={() => setShowBookingForm(false)}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                ✕ Close
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <iframe 
                src="https://cleanfox.bookingkoala.com/login?embed=true" 
                style={{border: 'none', height: '650px'}} 
                width="100%" 
                scrolling="no"
                title="Mobile Detailing Booking"
              />
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Link 
            href="/"
            className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </Link>
          
          <Link 
            href="/"
            className="block w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Book Another Service
          </Link>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Questions? Contact us at{' '}
            <a href="mailto:support@cleanfox.com" className="text-blue-600 hover:underline">
              support@cleanfox.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

// Loading fallback component
function ThankYouLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="mb-6">
          <div className="h-16 w-16 mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thank You!
          </h1>
          <p className="text-lg text-gray-600">
            Your booking request has been submitted successfully.
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            What happens next?
          </h2>
          <ul className="text-left text-gray-600 space-y-2">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              We&apos;ll review your booking request within 24 hours
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              You&apos;ll receive a confirmation email with details
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Our team will contact you to schedule your service
            </li>
          </ul>
        </div>
        
        <div className="space-y-3">
          <Link 
            href="/"
            className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </Link>
          
          <Link 
            href="/"
            className="block w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Book Another Service
          </Link>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Questions? Contact us at{' '}
            <a href="mailto:support@cleanfox.com" className="text-blue-600 hover:underline">
              support@cleanfox.com
            </a>
          </p>
        </div>
      </div>
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