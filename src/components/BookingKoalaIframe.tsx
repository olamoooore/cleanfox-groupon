'use client';

import { useEffect } from 'react';

interface BookingKoalaIframeProps {
  serviceId: string;
  className?: string;
}

export default function BookingKoalaIframe({ serviceId, className = '' }: BookingKoalaIframeProps) {
  useEffect(() => {
    // Load the Booking Koala embed script
    const script = document.createElement('script');
    script.src = 'https://cleanfox.bookingkoala.com/resources/embed.js';
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      const existingScript = document.querySelector('script[src="https://cleanfox.bookingkoala.com/resources/embed.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  const getIframeUrl = (serviceId: string) => {
    const baseUrl = 'https://cleanfox.bookingkoala.com/booknow';
    const params = 'embed=true&bar=false&banner=false';
    
    switch (serviceId) {
      case 'mobile-detailing':
        return `${baseUrl}/car_wash?${params}`;
      case 'deep-move-cleaning':
        return `${baseUrl}/house_cleaning?${params}`;
      case 'gutter-cleaning':
        return `${baseUrl}/gutter_cleaning?${params}`;
      case 'junk-removal':
        return `${baseUrl}/junk_removal?${params}`;
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
          We'll contact you directly to schedule your appointment.
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl overflow-hidden shadow-2xl ${className}`}>
      <iframe 
        src={iframeUrl}
        style={{ border: 'none', height: '1000px' }} 
        width="100%" 
        scrolling="no"
        title={`Book ${serviceId.replace('-', ' ')} Appointment`}
        loading="lazy"
      />
    </div>
  );
}