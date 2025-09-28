import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
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