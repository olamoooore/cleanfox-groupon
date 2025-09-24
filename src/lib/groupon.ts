/**
 * Groupon API integration utilities
 * 
 * This file contains functions for Groupon coupon validation and booking integration.
 * Environment variables are used to store API keys securely.
 * 
 * Documentation: https://www.groupon.com/developers-docs/bookable-appointments
 */

// API Configuration from environment variables
const GROUPON_CONFIG = {
  apiKey: process.env.GROUPON_API_KEY,
  clientId: process.env.GROUPON_CLIENT_ID,
  clientSecret: process.env.GROUPON_CLIENT_SECRET,
  baseUrl: process.env.GROUPON_API_BASE_URL || 'https://api.groupon.com/v2',
  debug: process.env.DEBUG_API_CALLS === 'true',
};

const BOOKING_KOALA_CONFIG = {
  apiKey: process.env.BOOKING_KOALA_API_KEY,
  widgetId: process.env.BOOKING_KOALA_WIDGET_ID,
};

/**
 * Validates that required API keys are configured
 */
function validateApiConfig(): boolean {
  const requiredKeys = [
    'GROUPON_API_KEY',
    'GROUPON_CLIENT_ID', 
    'GROUPON_CLIENT_SECRET'
  ];
  
  const missing = requiredKeys.filter(key => !process.env[key]);
  
  if (missing.length > 0 && GROUPON_CONFIG.debug) {
    console.warn('Missing Groupon API configuration:', missing);
    console.warn('Using demo mode. Add these to your .env.local file for production.');
  }
  
  return missing.length === 0;
}

/**
 * Makes authenticated API call to Groupon
 */
async function grouponApiCall<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> {
  if (!validateApiConfig()) {
    throw new Error('Groupon API not configured. Using demo mode.');
  }

  const url = `${GROUPON_CONFIG.baseUrl}${endpoint}`;
  const headers = {
    'Authorization': `Bearer ${GROUPON_CONFIG.apiKey}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (GROUPON_CONFIG.debug) {
    console.log('Groupon API Call:', url);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Groupon API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

interface GrouponApiResponse {
  valid: boolean;
  discount_amount?: number;
  discount_type?: 'percentage' | 'fixed';
  expiration_date?: string;
  service_restrictions?: string[];
  error_message?: string;
}

export interface CouponValidationResult {
  isValid: boolean;
  discountAmount?: number;
  discountType?: 'percentage' | 'fixed';
  expirationDate?: Date;
  serviceRestrictions?: string[];
  error?: string;
}

/**
 * Validates a Groupon coupon code
 * 
 * @param couponCode - The coupon code to validate
 * @param serviceId - The service ID for which the coupon is being applied
 * @returns Promise<CouponValidationResult>
 */
export async function validateCoupon(
  couponCode: string, 
  serviceId: string
): Promise<CouponValidationResult> {
  // Check if real API is configured
  const hasApiConfig = validateApiConfig();
  
  if (hasApiConfig) {
    try {
      // Real Groupon API call
      const response = await grouponApiCall<GrouponApiResponse>('/vouchers/validate', {
        method: 'POST',
        body: JSON.stringify({
          voucher_code: couponCode,
          service_id: serviceId,
        }),
      });

      return {
        isValid: response.valid,
        discountAmount: response.discount_amount,
        discountType: response.discount_type,
        expirationDate: response.expiration_date ? new Date(response.expiration_date) : undefined,
        serviceRestrictions: response.service_restrictions || [],
        error: response.valid ? undefined : response.error_message,
      };
    } catch (error) {
      console.error('Groupon API validation failed:', error);
      // Fall back to demo mode if API fails
    }
  }

  // Demo mode fallback
  console.log('Using demo validation mode');
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const upperCaseCode = couponCode.toUpperCase().trim();
  
  // Demo validation rules:
  // - Codes starting with "CLEAN" are valid
  // - Code must be at least 8 characters
  // - Different prefixes have different discount amounts
  
  if (upperCaseCode.length < 8) {
    return {
      isValid: false,
      error: 'Coupon code must be at least 8 characters long'
    };
  }
  
  if (upperCaseCode.startsWith('CLEAN')) {
    let discountAmount = 20; // Default 20% off
    
    // Different discount amounts based on code pattern
    if (upperCaseCode.includes('50')) {
      discountAmount = 50;
    } else if (upperCaseCode.includes('30')) {
      discountAmount = 30;
    }
    
    return {
      isValid: true,
      discountAmount,
      discountType: 'percentage',
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      serviceRestrictions: []
    };
  }
  
  // Special codes for testing
  if (upperCaseCode === 'TESTVALID') {
    return {
      isValid: true,
      discountAmount: 25,
      discountType: 'percentage',
      expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      serviceRestrictions: []
    };
  }
  
  return {
    isValid: false,
    error: 'Invalid coupon code. Please check your code and try again.'
  };
}

/**
 * Gets the Booking Koala embed URL for a service with coupon applied
 * 
 * @param serviceId - The service ID
 * @param couponCode - The validated coupon code
 * @returns string - The embed URL for Booking Koala
 */
export function getBookingKoalaUrl(serviceId: string, couponCode: string): string {
  // Use configured Booking Koala settings or fallback to demo
  const widgetId = BOOKING_KOALA_CONFIG.widgetId || 'demo-widget';
  const baseUrl = BOOKING_KOALA_CONFIG.widgetId 
    ? 'https://app.bookingkoala.com/widget'
    : 'https://booking-koala-demo.com/embed';
  
  const params = new URLSearchParams({
    widget_id: widgetId,
    service: serviceId,
    coupon: couponCode,
    partner: 'groupon',
    // Add other necessary parameters
  });
  
  if (GROUPON_CONFIG.debug) {
    console.log('Booking Koala URL:', `${baseUrl}?${params.toString()}`);
  }
  
  return `${baseUrl}?${params.toString()}`;
}
