'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import ServiceSelector, { type Service } from '@/components/ServiceSelector';
import CouponForm from '@/components/CouponForm';
import BookingFormWithDatabase from '@/components/BookingFormWithDatabase';
import Link from 'next/link';

type AppStep = 'service-selection' | 'coupon-entry' | 'booking-form';

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState<AppStep>('service-selection');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [couponCode, setCouponCode] = useState<string>('');

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setCurrentStep('coupon-entry');
  };

  const handleCouponValidated = (code: string) => {
    setCouponCode(code);
    setCurrentStep('booking-form');
  };

  const handleBack = () => {
    if (currentStep === 'coupon-entry') {
      setCurrentStep('service-selection');
      setSelectedService(null);
    } else if (currentStep === 'booking-form') {
      setCurrentStep('coupon-entry');
      setCouponCode('');
    }
  };

  const handleStartOver = () => {
    setCurrentStep('service-selection');
    setSelectedService(null);
    setCouponCode('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Demo Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Complete Booking Demo with Admin Backend
            </h1>
            <p className="text-gray-600 mb-4">
              This demo showcases the complete booking flow with Supabase database integration
            </p>
            <div className="flex justify-center space-x-4">
              <Link 
                href="/admin" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Admin Portal
              </Link>
              <Link 
                href="/" 
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Original Demo
              </Link>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div className={`flex items-center ${currentStep === 'service-selection' ? 'text-brand-blue' : 'text-brand-orange'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'service-selection' ? 'bg-brand-blue text-white' : 'bg-brand-orange text-white'}`}>
                  1
                </div>
                <span className="ml-2 text-sm font-medium hidden sm:block">Select Service</span>
              </div>
              
              <div className="w-8 h-1 bg-gray-200 rounded">
                <div className={`h-full rounded transition-all duration-300 ${currentStep === 'coupon-entry' || currentStep === 'booking-form' ? 'bg-brand-orange w-full' : 'bg-gray-200 w-0'}`}></div>
              </div>
              
              <div className={`flex items-center ${currentStep === 'coupon-entry' ? 'text-brand-blue' : currentStep === 'booking-form' ? 'text-brand-orange' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'coupon-entry' ? 'bg-brand-blue text-white' : currentStep === 'booking-form' ? 'bg-brand-orange text-white' : 'bg-gray-200 text-gray-600'}`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium hidden sm:block">Enter Coupon</span>
              </div>
              
              <div className="w-8 h-1 bg-gray-200 rounded">
                <div className={`h-full rounded transition-all duration-300 ${currentStep === 'booking-form' ? 'bg-brand-orange w-full' : 'bg-gray-200 w-0'}`}></div>
              </div>
              
              <div className={`flex items-center ${currentStep === 'booking-form' ? 'text-brand-blue' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'booking-form' ? 'bg-brand-blue text-white' : 'bg-gray-200 text-gray-600'}`}>
                  3
                </div>
                <span className="ml-2 text-sm font-medium hidden sm:block">Book Appointment</span>
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="transition-all duration-300">
            {currentStep === 'service-selection' && (
              <ServiceSelector 
                onServiceSelect={handleServiceSelect}
                selectedService={selectedService}
              />
            )}
            
            {currentStep === 'coupon-entry' && selectedService && (
              <CouponForm
                service={selectedService}
                onCouponValidated={handleCouponValidated}
                onBack={handleBack}
              />
            )}

            {currentStep === 'booking-form' && selectedService && couponCode && (
              <BookingFormWithDatabase
                service={selectedService}
                couponCode={couponCode}
                onBack={handleStartOver}
              />
            )}
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Demo Features</h3>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• Complete booking flow with form validation</li>
              <li>• Supabase database integration for storing submissions</li>
              <li>• Admin portal with authentication and data management</li>
              <li>• Real-time status updates and analytics</li>
              <li>• Modern responsive UI with Tailwind CSS</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              © 2025 Clean Fox. Professional cleaning services with Groupon integration.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Demo application with Supabase backend integration.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}