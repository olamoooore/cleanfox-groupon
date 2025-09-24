'use client';

import Image from 'next/image';

export default function Header() {
  return (
    <header className="relative bg-brand-blue shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo with Overlap Effect */}
          <div className="relative flex items-center">
            {/* Logo Container with Overlap */}
            <div className="relative z-10 bg-white rounded-lg shadow-lg border-2 border-brand-blue p-2 -mb-4 transform translate-y-2">
              <Image
                src="/clean-fox-logo.png"
                alt="Clean Fox Logo"
                width={60}
                height={60}
                className="w-12 h-12 sm:w-14 sm:h-14"
                priority
              />
            </div>
            
            {/* Company Name */}
            <div className="ml-4 pl-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                Clean Fox
              </h1>
              <p className="text-sm text-blue-100 hidden sm:block">
                Professional Cleaning Services
              </p>
            </div>
          </div>

          {/* Groupon Badge */}
          <div className="flex items-center space-x-2">
            <div className="bg-brand-orange border border-brand-orange-dark rounded-full px-3 py-1 shadow-md">
              <span className="text-white text-sm font-medium">
                Groupon Partner
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom border with gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-blue to-brand-orange"></div>
    </header>
  );
}
