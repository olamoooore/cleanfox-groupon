'use client';

import { useState } from 'react';
import { Ticket, AlertCircle, CheckCircle } from 'lucide-react';
import type { Service } from './ServiceSelector';
import { validateCoupon } from '@/lib/groupon';

interface CouponFormProps {
  service: Service;
  onCouponValidated: (couponCode: string) => void;
  onBack: () => void;
}

export default function CouponForm({ service, onCouponValidated, onBack }: CouponFormProps) {
  const [couponCode, setCouponCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);

  // Using the Groupon API utility function

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!couponCode.trim()) {
      setError('Please enter a coupon code');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const result = await validateCoupon(couponCode, service.id);
      
      if (result.isValid) {
        setIsValid(true);
        setTimeout(() => {
          onCouponValidated(couponCode);
        }, 1500);
      } else {
        setError(result.error || 'Invalid coupon code. Please check your code and try again.');
      }
    } catch (err) {
      setError('Failed to validate coupon. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const IconComponent = service.icon;

  if (isValid) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-500 text-white rounded-full p-3">
              <CheckCircle className="w-8 h-8" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-green-900 mb-2">
            Coupon Validated!
          </h3>
          <p className="text-green-700 mb-4">
            Redirecting to booking form...
          </p>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        {/* Service Info */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 text-brand-blue rounded-full p-3">
              <IconComponent className="w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {service.name}
          </h2>
          <p className="text-gray-600">
            Enter your Groupon coupon code to proceed
          </p>
        </div>

        {/* Coupon Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="coupon-code" className="block text-sm font-medium text-gray-700 mb-2">
              Groupon Coupon Code
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Ticket className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="coupon-code"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value);
                  setError('');
                }}
                placeholder="Enter your coupon code"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue text-lg"
                disabled={isLoading}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
              disabled={isLoading}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading || !couponCode.trim()}
              className="flex-1 px-4 py-3 bg-brand-blue text-white rounded-lg hover:bg-brand-blue-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium flex items-center justify-center"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Validating...</span>
                </div>
              ) : (
                'Apply Coupon'
              )}
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            <strong>Demo:</strong> Use a coupon code starting with "CLEAN" (e.g., "CLEAN123456") to test the validation.
          </p>
        </div>
      </div>
    </div>
  );
}
