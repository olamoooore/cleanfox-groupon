'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface BookingKoalaIframeProps {
  serviceId: string;
  className?: string;
  onFormSubmit?: () => void;
}

export default function BookingKoalaIframe({ serviceId, className = '', onFormSubmit }: BookingKoalaIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Load the iframe resizer script
    const script = document.createElement('script');
    script.src = 'https://cleanfox.bookingkoala.com/resources/iframeResizer.min.js';
    script.defer = true;
    document.head.appendChild(script);

    let hasRedirected = false;

    // Listen for messages from the iframe
    const handleMessage = (event: MessageEvent) => {
      if (hasRedirected) return;
      
      // Check if the message is from BookingKoala
      if (event.origin === 'https://cleanfox.bookingkoala.com') {
        console.log('Message received from BookingKoala:', event.data);
        
        // Look for form submission indicators in various message formats
        const messageStr = typeof event.data === 'string' ? event.data : JSON.stringify(event.data);
        
        if (messageStr.includes('form_submitted') || 
            messageStr.includes('success') || 
            messageStr.includes('thank') ||
            messageStr.includes('complete') ||
            messageStr.includes('submitted') ||
            messageStr.includes('booking_created') ||
            messageStr.includes('appointment_booked') ||
            messageStr.includes('confirmation') ||
            messageStr.includes('booked')) {
          console.log('Form submission detected via message, redirecting to thank you page');
          console.log('Current URL before redirect:', window.location.href);
          hasRedirected = true;
          
          // Add a small delay to ensure the message is processed
          setTimeout(() => {
            console.log('Executing redirect to /thank-you');
            // Store service info for the thank you page
            localStorage.setItem('selectedService', serviceId);
            router.push(`/thank-you?service=${serviceId}`);
            if (onFormSubmit) {
              onFormSubmit();
            }
          }, 100);
        }
      }
    };

    // Listen for iframe resize events which might indicate page changes
    const handleResize = (event: MessageEvent) => {
      if (hasRedirected) return;
      
      if (event.origin === 'https://cleanfox.bookingkoala.com' && event.data && typeof event.data === 'object') {
        // iFrame Resizer sends height information - check if it's a significant change that might indicate a thank you page
        if (event.data.type === 'setHeight' && event.data.height) {
          const height = parseInt(event.data.height);
          // Thank you pages are typically shorter than booking forms
          if (height < 400) {
            console.log('Detected potential thank you page based on height:', height);
            setTimeout(() => {
              if (!hasRedirected) {
                hasRedirected = true;
                router.push('/thank-you');
                if (onFormSubmit) {
                  onFormSubmit();
                }
              }
            }, 2000); // Wait 2 seconds to confirm it's not just a loading state
          }
        }
      }
    };

    // Set up a timer to check for form completion after a reasonable time
    const completionTimer = setTimeout(() => {
      // This is a fallback - if user has been on the form for more than 5 minutes,
      // we'll start checking more aggressively
      const checkForCompletion = setInterval(() => {
        if (hasRedirected) {
          clearInterval(checkForCompletion);
          return;
        }
        
        // Check if the iframe title or any other indicators suggest completion
        const iframe = iframeRef.current;
        if (iframe) {
          try {
            // This will likely fail due to CORS, but worth trying
            const title = iframe.contentDocument?.title || '';
            if (title.toLowerCase().includes('thank') || 
                title.toLowerCase().includes('success') || 
                title.toLowerCase().includes('complete')) {
              hasRedirected = true;
              clearInterval(checkForCompletion);
              router.push('/thank-you');
              if (onFormSubmit) {
                onFormSubmit();
              }
            }
          } catch (e) {
            // Expected CORS error
          }
        }
      }, 3000);

      // Clear the interval after 10 minutes to avoid infinite checking
      setTimeout(() => clearInterval(checkForCompletion), 600000);
    }, 300000); // Start aggressive checking after 5 minutes

    window.addEventListener('message', handleMessage);
    window.addEventListener('message', handleResize);

    return () => {
      // Cleanup
      clearTimeout(completionTimer);
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('message', handleResize);
      const existingScript = document.querySelector('script[src="https://cleanfox.bookingkoala.com/resources/iframeResizer.min.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [router, onFormSubmit]);

  const getIframeUrl = (serviceId: string) => {
    // Use the specific iframe URL for mobile detailing
    if (serviceId === 'mobile-detailing') {
      return 'https://cleanfox.bookingkoala.com/leads/form/ef6945872c9f4e128575f7227b16b70d19a7f1e292f515707ff2179bd829a85d3d57b9e0e0ae6572aff79ebdbe6658e18072c2efb57f9285df979ef37bb69b87?embed=true';
    }
    
    // Use the specific iframe URL for cleaning services
    if (serviceId === 'cleaning') {
      return 'https://cleanfox.bookingkoala.com/leads/form/ba6c96c8d577daa2d917ee106394a3fc4239d51b9c4c82f2e8d5d94e4a524df7ebd78709b3b32625e156593dcbfbbd75d42a586f15de1f8edb827355cfc1ef3f?embed=true';
    }
    
    // For other services, use the original logic
    const baseUrl = 'https://cleanfox.bookingkoala.com/booknow';
    const params = 'embed=true&bar=false&banner=false';
    
    switch (serviceId) {
      case 'deep-move-cleaning':
        return `${baseUrl}/home_cleaning?${params}`;
      case 'post-construction-cleaning':
        return `${baseUrl}/post_construction?${params}`;
      case 'gutter-cleaning':
        return `${baseUrl}/gutter_cleaning?${params}`;
      case 'junk-removal':
        return `${baseUrl}/junk-removal?${params}`;
      case 'moving-services':
        return `${baseUrl}/moving_service?${params}`;
      default:
        return null; // Return null for unsupported services
    }
  };

  const iframeUrl = getIframeUrl(serviceId);

  if (!iframeUrl) {
    return (
      <div className={`bg-white rounded-2xl p-8 text-center shadow-2xl ${className}`}>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Booking Form Coming Soon</h3>
        <p className="text-gray-600 mb-6">
          The booking form for {serviceId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} will be available soon. 
          We&apos;ll contact you directly to schedule your appointment.
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl overflow-hidden shadow-2xl ${className}`}>
      <iframe 
        ref={iframeRef}
        id="iFrameResizer0"
        src={iframeUrl}
        style={{ border: 0 }} 
        height="1000px"
        width="100%" 
        scrolling="yes"
        title={`Book ${serviceId.replace('-', ' ')} Appointment`}
        loading="lazy"
      />
    </div>
  );
}