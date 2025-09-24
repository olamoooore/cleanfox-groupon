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
    iconPath: '/images/icons/car-wash.png',
  },
  {
    id: 'deep-move-cleaning',
    name: 'Deep & Move in/out Cleaning',
    description: 'Comprehensive deep cleaning for moving in or out',
    iconPath: '/images/icons/move-in move-out.png',
  },
  {
    id: 'post-construction-cleaning',
    name: 'Post Construction Cleaning',
    description: 'Specialized cleaning after construction projects',
    iconPath: '/images/icons/construction.png',
  },
  {
    id: 'junk-removal',
    name: 'Junk Removal',
    description: 'Professional junk and debris removal services',
    iconPath: '/images/icons/junk-removal.png',
  },
  {
    id: 'gutter-cleaning',
    name: 'Gutter Cleaning',
    description: 'Professional gutter cleaning and maintenance',
    iconPath: '/images/icons/gutter.png',
  },
  {
    id: 'moving-services',
    name: 'Moving Services',
    description: 'Complete moving and relocation assistance',
    iconPath: '/images/icons/moving-truck.png',
  },
];

interface ServiceSelectorProps {
  onServiceSelect: (service: Service) => void;
  selectedService: Service | null;
}

export default function ServiceSelector({ onServiceSelect, selectedService }: ServiceSelectorProps) {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          const isSelected = selectedService?.id === service.id;
          
          return (
            <button
              key={service.id}
              onClick={() => onServiceSelect(service)}
              className={`
                group relative p-8 rounded-2xl border transition-all duration-300 text-left transform hover:-translate-y-1 backdrop-blur-sm
                ${isSelected 
                  ? 'border-primary/30 bg-gradient-to-br from-primary/20 to-secondary/20 shadow-xl scale-105 ring-2 ring-primary/30' 
                  : 'border-white/20 bg-white/10 hover:border-primary/20 hover:shadow-lg hover:bg-white/20'
                }
              `}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`
                  w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 p-3 backdrop-blur-sm
                  ${isSelected 
                    ? 'bg-gradient-to-br from-primary to-secondary shadow-lg' 
                    : 'bg-white/20 group-hover:bg-gradient-to-br group-hover:from-primary/30 group-hover:to-secondary/30'
                  }
                `}>
                  <Image
                    src={service.iconPath}
                    alt={`${service.name} icon`}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                
                <h3 className={`
                  text-xl font-bold mb-3 transition-colors
                  ${isSelected ? 'text-white' : 'text-white/90 group-hover:text-white'}
                `}>
                  {service.name}
                </h3>
                
                <p className={`
                  text-sm leading-relaxed transition-colors
                  ${isSelected ? 'text-white/80' : 'text-white/70 group-hover:text-white/80'}
                `}>
                  {service.description}
                </p>
              </div>
              
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
              
              {/* Hover effect overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
