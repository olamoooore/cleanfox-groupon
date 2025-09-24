'use client';

import { Calendar, CheckCircle } from 'lucide-react';
import type { Service } from './ServiceSelector';
import { getBookingKoalaUrl } from '@/lib/groupon';

interface BookingFormProps {
  service: Service;
  couponCode: string;
  onBack: () => void;
}

export default function BookingForm({ service, couponCode, onBack }: BookingFormProps) {
  const IconComponent = service.icon;
  const bookingUrl = getBookingKoalaUrl(service.id, couponCode);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 text-brand-orange rounded-full p-3">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Coupon Applied Successfully!
              </h2>
              <p className="text-gray-600">
                Booking {service.name} with coupon: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{couponCode}</span>
              </p>
            </div>
          </div>
          <div className="bg-blue-100 text-brand-blue rounded-full p-2">
            <IconComponent className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Booking Form Container */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-brand-blue to-brand-orange p-4">
          <div className="flex items-center space-x-2 text-white">
            <Calendar className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Book Your Appointment</h3>
          </div>
        </div>

        {/* Dummy Booking Koala iframe placeholder */}
        <div className="relative bg-gray-50 min-h-[600px] flex items-center justify-center">
          {/* This is a placeholder for the actual Booking Koala iframe */}
          <div className="text-center p-8 max-w-md">
            <div className="bg-white rounded-lg shadow-md p-6 border-2 border-dashed border-gray-300">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Booking Koala Form Placeholder
              </h4>
              <p className="text-gray-600 mb-4">
                This is where the actual Booking Koala iframe will be embedded for {service.name}.
              </p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>Service: <span className="font-medium">{service.name}</span></p>
                <p>Coupon: <span className="font-mono bg-gray-100 px-1 rounded">{couponCode}</span></p>
                <p className="text-xs text-gray-400 mt-2">Booking URL: {bookingUrl}</p>
              </div>
            </div>
          </div>

          {/* Actual iframe would look like this: */}
          {/* 
          <iframe
            src={bookingUrl}
            width="100%"
            height="600"
            frameBorder="0"
            title={`Book ${service.name}`}
            className="w-full h-full"
          />
          */}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <button
              onClick={onBack}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              ← Start Over
            </button>
            <div className="text-sm text-gray-500">
              Powered by Booking Koala
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-brand-blue rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="bg-brand-blue text-white rounded-full p-1 mt-0.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-brand-blue mb-1">Integration Note</h4>
            <p className="text-brand-blue text-sm">
              In production, this will integrate with the actual Groupon API for coupon validation 
              and embed the real Booking Koala form for appointment scheduling.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
