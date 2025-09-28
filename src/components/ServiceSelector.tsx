'use client';

import Image from 'next/image';

export interface Service {
  id: string;
  name: string;
  description: string;
  iconPath: string;
}

const services: Service[] = [
  {
    id: 'mobile-detailing',
    name: 'Mobile Detailing',
    description: 'Professional mobile car detailing at your location',
    iconPath: '/images/services/mobile-cleaning.png?v=2024-updated',
  },
  {
    id: 'cleaning',
    name: 'Cleaning',
    description: 'Professional cleaning services for your home or office',
    iconPath: '/images/services/move-in-house-cleaning.png',
  },
];

interface ServiceSelectorProps {
  onServiceSelect: (service: Service) => void;
  selectedService: Service | null;
}

export default function ServiceSelector({ onServiceSelect, selectedService }: ServiceSelectorProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
        {services.map((service) => {
          const isSelected = selectedService?.id === service.id;
          
          return (
            <button
              key={service.id}
              onClick={() => onServiceSelect(service)}
              className={`
                group relative overflow-hidden rounded-2xl text-left transform transition-all duration-700 ease-out
                backdrop-blur-xl border border-white/10 bg-white/5
                hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10
                hover:border-white/20 hover:bg-white/10
                ${isSelected 
                  ? 'scale-[1.02] -translate-y-1 shadow-2xl shadow-blue-500/20 border-blue-400/30 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 ring-1 ring-blue-400/20' 
                  : ''
                }
              `}
            >
              {/* Animated Background Gradient */}
              <div className={`
                absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700
                bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5
                ${isSelected ? 'opacity-100' : ''}
              `} />
              
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden rounded-t-2xl bg-gradient-to-br from-white/90 to-gray-50/90 group-hover:from-white group-hover:to-gray-50 transition-all duration-500">
                <div className="relative w-full h-full p-4 flex items-center justify-center">
                  <div className="relative w-full h-full group-hover:scale-110 transition-transform duration-500 ease-out">
                    <Image
                      src={service.iconPath}
                      alt={service.name}
                      fill
                      className="object-contain drop-shadow-lg"
                    />
                  </div>
                </div>
                
                {/* Image Overlay Effects */}
                <div className={`
                  absolute inset-0 transition-all duration-500
                  ${isSelected 
                    ? 'bg-gradient-to-t from-blue-500/10 via-transparent to-transparent' 
                    : 'bg-gradient-to-t from-transparent via-transparent to-transparent group-hover:from-blue-500/5'
                  }
                `} />
                
                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                
                {/* Hover Indicator */}
                {!isSelected && (
                  <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                )}
              </div>
              
              {/* Content Container */}
              <div className="relative p-6 space-y-3">
                <h3 className={`
                  text-xl font-bold tracking-tight transition-all duration-300
                  ${isSelected 
                    ? 'text-white' 
                    : 'text-white/90 group-hover:text-white'
                  }
                `}>
                  {service.name}
                </h3>
                
                <p className={`
                  text-sm leading-relaxed transition-all duration-300 font-medium
                  ${isSelected 
                    ? 'text-white/80' 
                    : 'text-white/60 group-hover:text-white/75'
                  }
                `}>
                  {service.description}
                </p>
                
                {/* Action Indicator */}
                 {isSelected && (
                   <div className="flex items-center space-x-2 pt-2 transition-all duration-300 text-blue-300">
                     <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50 transition-all duration-300" />
                     <span className="text-xs font-medium tracking-wide">Selected</span>
                   </div>
                 )}
              </div>
              
              {/* Bottom Accent */}
              <div className={`
                absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-500
                ${isSelected 
                  ? 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-100' 
                  : 'bg-gradient-to-r from-blue-400/0 via-blue-400/50 to-blue-400/0 opacity-0 group-hover:opacity-100'
                }
              `} />
              
              {/* Subtle Border Glow */}
              <div className={`
                absolute inset-0 rounded-2xl transition-all duration-500 pointer-events-none
                ${isSelected 
                  ? 'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] ring-1 ring-white/10' 
                  : 'group-hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]'
                }
              `} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
