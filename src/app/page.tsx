'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ServiceSelector, { type Service } from '@/components/ServiceSelector';
import ManualRedemptionForm, { type ManualRedemptionData } from '@/components/ManualRedemptionForm';
import BookingKoalaIframe from '@/components/BookingKoalaIframe';
import { logConfigurationStatus } from '@/lib/config-check';
import { supabase } from '@/lib/supabase';

type AppStep = 'service-selection' | 'manual-form' | 'booking' | 'submitted';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<AppStep>('service-selection');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [submission, setSubmission] = useState<ManualRedemptionData | null>(null);

  // Log configuration status in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      logConfigurationStatus();
    }
  }, []);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setCurrentStep('manual-form');
  };

  // Function to upload image to Supabase storage
  const uploadImageToSupabase = async (file: File, folder: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('form-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('form-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleManualSubmit = async (data: ManualRedemptionData) => {
    try {
      // Upload voucher file (now required)
      let voucherImageUrls: string[] = [];
      if (data.voucherFile) {
        try {
          const voucherUrl = await uploadImageToSupabase(data.voucherFile, 'vouchers');
          voucherImageUrls.push(voucherUrl);
        } catch (error) {
          console.error('Error uploading voucher file:', error);
          throw new Error('Failed to upload voucher file');
        }
      } else {
        throw new Error('Voucher file is required');
      }
      
      // Upload vehicle images if they exist
      let vehicleImageUrls: string[] = [];
      if (data.vehicleImages && data.vehicleImages.length > 0) {
        try {
          for (const vehicleImage of data.vehicleImages) {
            const vehicleUrl = await uploadImageToSupabase(vehicleImage, 'vehicle-photos');
            vehicleImageUrls.push(vehicleUrl);
          }
        } catch (error) {
          console.error('Error uploading vehicle images:', error);
        }
      }

      // Save form data to database
      const { error } = await supabase
        .from('form_submissions')
        .insert([
          {
            customer_name: data.name,
            customer_email: data.email,
            customer_phone: data.phone,
            service_type: selectedService?.name || 'Unknown',
            service_title: selectedService?.name || 'Unknown Service',
            address_line1: `ZIP: ${data.zipCode}`, // Using ZIP code as address since that's what we collect
            city: 'Unknown', // We don't collect city in manual form
            state: 'Unknown', // We don't collect state in manual form
            zip_code: data.zipCode,
            preferred_date: data.date,
            preferred_time: data.timeWindow,
            coupon_code: data.voucherCode,
            special_instructions: `Vehicle: ${data.carYear} ${data.carMake} ${data.carModel} (${data.vehicleClass})`,
            property_images: voucherImageUrls.length > 0 ? voucherImageUrls : null, // Store voucher images as property images
            vehicle_images: vehicleImageUrls.length > 0 ? vehicleImageUrls : null, // Store vehicle images separately
            status: 'pending'
          }
        ]);

      if (error) {
        console.error('Error saving to database:', error);
        // Continue to booking step even if database save fails
      }

      setSubmission(data);
      setCurrentStep('booking');
    } catch (err) {
      console.error('Error submitting form:', err);
      // Continue to booking step even if there's an error
      setSubmission(data);
      setCurrentStep('booking');
    }
  };

  const handleBack = () => {
    if (currentStep === 'manual-form') {
      setCurrentStep('service-selection');
      setSelectedService(null);
    } else if (currentStep === 'booking') {
      setCurrentStep('manual-form');
    } else if (currentStep === 'submitted') {
      setCurrentStep('service-selection');
      setSelectedService(null);
      setSubmission(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-mixed relative overflow-hidden animate-gradient">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-primary/30 to-secondary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-secondary/30 to-primary/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-2xl"></div>
      </div>
      
      <Header />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight">
                Cleanfox Coupon Redeem
              </h1>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-4 pb-16 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Progress Indicator */}
            <div className="mb-12">
              <div className="glass-card rounded-2xl border border-white/20 backdrop-blur-sm p-4 md:p-6 lg:p-8">
                <div className="flex items-center justify-center space-x-2 sm:space-x-4 md:space-x-8">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-300 ${
                      currentStep === 'service-selection' 
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg transform scale-110' 
                        : 'bg-white/30 text-white/70 backdrop-blur-sm border-2 border-white/20'
                    }`}>
                      1
                    </div>
                    <span className={`ml-2 sm:ml-3 text-xs sm:text-sm font-medium transition-colors hidden sm:block ${
                      currentStep === 'service-selection' ? 'text-white' : 'text-white/70'
                    }`}>Select Service</span>
                  </div>
                  
                  <div className={`flex-1 h-0.5 max-w-8 sm:max-w-12 md:max-w-20 transition-all duration-300 ${
                    currentStep !== 'service-selection' ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-white/30'
                  }`}></div>
                  
                  <div className="flex items-center">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-300 ${
                      currentStep === 'manual-form' 
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg transform scale-110' 
                        : 'bg-white/30 text-white/70 backdrop-blur-sm border-2 border-white/20'
                    }`}>
                      2
                    </div>
                    <span className={`ml-2 sm:ml-3 text-xs sm:text-sm font-medium transition-colors hidden sm:block ${
                      currentStep === 'manual-form' ? 'text-white' : 'text-white/70'
                    }`}>Provide Details</span>
                  </div>
                  
                  <div className={`flex-1 h-0.5 max-w-8 sm:max-w-12 md:max-w-20 transition-all duration-300 ${
                    currentStep === 'submitted' ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-white/30'
                  }`}></div>
                  
                  <div className="flex items-center">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-300 ${
                      currentStep === 'submitted' 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg transform scale-110' 
                        : 'bg-white/30 text-white/70 backdrop-blur-sm border-2 border-white/20'
                    }`}>
                      3
                    </div>
                    <span className={`ml-2 sm:ml-3 text-xs sm:text-sm font-medium transition-colors hidden sm:block ${
                      currentStep === 'submitted' ? 'text-white' : 'text-white/70'
                    }`}>Confirmation</span>
                  </div>
                </div>
                
                {/* Mobile step labels - shown below on small screens */}
                <div className="mt-4 sm:hidden">
                  <div className="text-center">
                    <span className={`text-xs font-medium transition-colors ${
                      currentStep === 'service-selection' ? 'text-white' : 
                      currentStep === 'manual-form' ? 'text-white' : 
                      currentStep === 'submitted' ? 'text-white' : 'text-white/70'
                    }`}>
                      {currentStep === 'service-selection' ? 'Select Service' : 
                       currentStep === 'manual-form' ? 'Provide Details' : 
                       currentStep === 'submitted' ? 'Confirmation' : 'Select Service'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          {/* Step Content */}
          <div className="transition-all duration-500 ease-in-out">
              {currentStep === 'service-selection' && (
                <div className="glass-card rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12">
                  <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      Choose Your Service
                    </h2>
                    <p className="text-white/80 text-lg">Select the cleaning service that best fits your needs</p>
                  </div>
                  <ServiceSelector 
                    onServiceSelect={handleServiceSelect}
                    selectedService={selectedService}
                  />
                </div>
              )}
            
            {currentStep === 'manual-form' && selectedService && (
              <div className="glass-card rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12">
                <div className="mb-8">
                  <button
                    onClick={handleBack}
                    className="flex items-center text-white/80 hover:text-white transition-all duration-200 group"
                  >
                    <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span>
                    Back to Service Selection
                  </button>
                </div>
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Provide Your Details
                  </h2>
                  <p className="text-white/80 text-lg">Fill in your information so we can provide you with the best service possible.</p>
                </div>
                <ManualRedemptionForm
                   onSubmit={handleManualSubmit}
                   onBack={handleBack}
                 />
              </div>
            )}

            {currentStep === 'booking' && selectedService && submission && (
              <div className="glass-card rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12">
                <div className="mb-8">
                  <button
                    onClick={handleBack}
                    className="flex items-center text-white/80 hover:text-white transition-all duration-200 group"
                  >
                    <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span>
                    Back to Form
                  </button>
                </div>
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Book Your {selectedService.name} Appointment
                  </h2>
                  <p className="text-white/80 text-lg">Complete your booking using the form below</p>
                </div>
                
                {/* Booking Koala iframe - show for supported services */}
                <BookingKoalaIframe serviceId={selectedService.id} />
                
                <div className="mt-8 text-center">
                  <button 
                    onClick={() => setCurrentStep('submitted')} 
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary-600 hover:to-secondary-600 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {currentStep === 'submitted' && selectedService && submission && (
              <div className="glass-card rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse-slow">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Request Submitted Successfully!
                  </h3>
                  <p className="text-white/80 text-lg mb-8 max-w-md mx-auto leading-relaxed">
                    Thank you for choosing our services. We'll contact you soon to confirm your appointment for {selectedService.name}.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-sm mb-8">
                    <div className="p-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm"><span className="text-white/60 block mb-1">Voucher Code:</span> <span className="font-mono text-white">{submission.voucherCode}</span></div>
                    <div className="p-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm"><span className="text-white/60 block mb-1">ZIP Code:</span> <span className="font-medium text-white">{submission.zipCode}</span></div>
                    <div className="p-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm"><span className="text-white/60 block mb-1">Preferred Date:</span> <span className="font-medium text-white">{submission.date}</span></div>
                    <div className="p-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm"><span className="text-white/60 block mb-1">Time Window:</span> <span className="font-medium text-white">{submission.timeWindow}</span></div>
                    <div className="p-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm"><span className="text-white/60 block mb-1">Contact:</span> <span className="font-medium text-white">{submission.name} · {submission.phone}</span></div>
                    <div className="p-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm"><span className="text-white/60 block mb-1">Email:</span> <span className="font-medium text-white">{submission.email}</span></div>
                    <div className="p-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm sm:col-span-2"><span className="text-white/60 block mb-1">Vehicle Details:</span> <span className="font-medium capitalize text-white">{submission.vehicleClass}</span></div>
                  </div>
                  <button 
                    onClick={handleBack} 
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary-600 hover:to-secondary-600 text-white px-8 py-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium backdrop-blur-sm"
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-16 py-8 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="glass-card rounded-2xl p-6 shadow-lg border border-white/20">
            <p className="text-white/80 text-sm">
              © 2024 Cleanfox. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
