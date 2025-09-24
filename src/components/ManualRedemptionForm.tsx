"use client";

export type VehicleClass = 'sedan' | 'suv' | 'truck' | 'van';

export interface ManualRedemptionData {
  voucherCode: string;
  voucherFile: File | null;
  zipCode: string;
  date: string;
  timeWindow: string;
  name: string;
  phone: string;
  email: string;
  vehicleClass: VehicleClass;
  carMake: string;
  carModel: string;
  carYear: string;
  vehicleImages: File[];
}

interface ManualRedemptionFormProps {
  onSubmit: (data: ManualRedemptionData) => void | Promise<void>;
  onBack: () => void;
  defaultVehicleClass?: VehicleClass;
}

import { useRef, useState } from 'react';
import { Upload, Calendar, Clock, Phone, Mail, User, Car, MapPin, Ticket } from 'lucide-react';

const timeWindows = [
  '8:00 AM - 10:00 AM',
  '10:00 AM - 12:00 PM',
  '12:00 PM - 2:00 PM',
  '2:00 PM - 4:00 PM',
  '4:00 PM - 6:00 PM',
];

export default function ManualRedemptionForm({ onSubmit, onBack, defaultVehicleClass = 'sedan' }: ManualRedemptionFormProps) {
  const [form, setForm] = useState<ManualRedemptionData>({
    voucherCode: '',
    voucherFile: null,
    zipCode: '',
    date: '',
    timeWindow: '',
    name: '',
    phone: '',
    email: '',
    vehicleClass: defaultVehicleClass,
    carMake: '',
    carModel: '',
    carYear: '',
    vehicleImages: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const voucherInputRef = useRef<HTMLInputElement | null>(null);
  const vehicleImagesInputRef = useRef<HTMLInputElement | null>(null);

  // Shared input styles to ensure good contrast for typed text
  const inputBase = 'w-full px-3 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white/10 text-white placeholder-white/60';
  const inputWithIconBase = 'w-full pl-10 pr-3 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white/10 text-white placeholder-white/60';
  const selectWithIconBase = 'w-full pl-10 pr-3 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white/10 text-white';
  const selectBase = 'w-full px-3 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white/10 text-white';

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.voucherCode.trim()) newErrors.voucherCode = 'Voucher code is required';
    if (!form.voucherFile) newErrors.voucherFile = 'Voucher file is required';
    if (!form.zipCode.trim()) newErrors.zipCode = 'Zip code is required';
    if (!/^[0-9]{5}(-[0-9]{4})?$/.test(form.zipCode.trim())) newErrors.zipCode = 'Enter a valid US ZIP code';
    if (!form.date) newErrors.date = 'Date is required';
    if (!form.timeWindow) newErrors.timeWindow = 'Preferred time window is required';
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone is required';
    if (!/^[+()0-9\-\s]{7,}$/.test(form.phone.trim())) newErrors.phone = 'Enter a valid phone number';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) newErrors.email = 'Enter a valid email';
    if (!form.carMake.trim()) newErrors.carMake = 'Car make is required';
    if (!form.carModel.trim()) newErrors.carModel = 'Car model is required';
    if (!form.carYear.trim()) newErrors.carYear = 'Car year is required';
    if (form.carYear.trim() && (!/^\d{4}$/.test(form.carYear.trim()) || parseInt(form.carYear.trim()) < 1900 || parseInt(form.carYear.trim()) > new Date().getFullYear() + 1)) {
      newErrors.carYear = 'Enter a valid year (1900-' + (new Date().getFullYear() + 1) + ')';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof ManualRedemptionData, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field as string]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="glass-card rounded-xl shadow-lg border border-white/20 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-white mb-1 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Manual Groupon Redemption</h2>
        <p className="text-white/80 mb-6">Fill in the details below and we'll redeem your voucher manually.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Voucher */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-white/90 mb-2">Groupon Voucher Code<span className="text-red-400">*</span></label>
              <div className="relative">
                <Ticket className="w-5 h-5 text-white/60 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={form.voucherCode}
                  onChange={(e) => handleChange('voucherCode', e.target.value)}
                  placeholder="e.g., CLEAN123456"
                  className={`${inputWithIconBase} ${errors.voucherCode ? 'border-red-400' : 'border-white/20'}`}
                />
              </div>
              {errors.voucherCode && <p className="text-sm text-red-400 mt-1">{errors.voucherCode}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Upload Voucher<span className="text-red-400">*</span></label>
              <div className="flex items-center">
                <input ref={voucherInputRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => handleChange('voucherFile', e.target.files?.[0] || null)} />
                <button type="button" onClick={() => voucherInputRef.current?.click()} className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 border rounded-lg text-white/90 hover:bg-white/10 transition-all duration-200 ${errors.voucherFile ? 'border-red-400' : 'border-white/20'}`}>
                  <Upload className="w-4 h-4" /> Upload
                </button>
              </div>
              {form.voucherFile && <p className="text-xs text-white/70 mt-1 truncate">Selected: {form.voucherFile.name}</p>}
              {errors.voucherFile && <p className="text-sm text-red-400 mt-1">{errors.voucherFile}</p>}
            </div>
          </div>

          {/* Location & Schedule */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">ZIP Code<span className="text-red-400">*</span></label>
              <div className="relative">
                <MapPin className="w-5 h-5 text-white/60 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={form.zipCode}
                  onChange={(e) => handleChange('zipCode', e.target.value)}
                  placeholder="e.g., 90210"
                  className={`${inputWithIconBase} ${errors.zipCode ? 'border-red-400' : 'border-white/20'}`}
                />
              </div>
              {errors.zipCode && <p className="text-sm text-red-400 mt-1">{errors.zipCode}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Date<span className="text-red-400">*</span></label>
              <div className="relative">
                <Calendar className="w-5 h-5 text-white/60 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className={`${inputWithIconBase} ${errors.date ? 'border-red-400' : 'border-white/20'}`}
                />
              </div>
              {errors.date && <p className="text-sm text-red-400 mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Preferred Time Window<span className="text-red-400">*</span></label>
              <div className="relative">
                <Clock className="w-5 h-5 text-white/60 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={form.timeWindow}
                  onChange={(e) => handleChange('timeWindow', e.target.value)}
                  className={`${selectWithIconBase} ${errors.timeWindow ? 'border-red-400' : 'border-white/20'}`}
                >
                  <option value="">Select a time window</option>
                  {timeWindows.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              {errors.timeWindow && <p className="text-sm text-red-400 mt-1">{errors.timeWindow}</p>}
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Name<span className="text-red-400">*</span></label>
              <div className="relative">
                <User className="w-5 h-5 text-white/60 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Full name"
                  className={`${inputWithIconBase} ${errors.name ? 'border-red-400' : 'border-white/20'}`}
                />
              </div>
              {errors.name && <p className="text-sm text-red-400 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Phone<span className="text-red-400">*</span></label>
              <div className="relative">
                <Phone className="w-5 h-5 text-white/60 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="(555) 555-5555"
                  className={`${inputWithIconBase} ${errors.phone ? 'border-red-400' : 'border-white/20'}`}
                />
              </div>
              {errors.phone && <p className="text-sm text-red-400 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Email<span className="text-red-400">*</span></label>
              <div className="relative">
                <Mail className="w-5 h-5 text-white/60 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="you@example.com"
                  className={`${inputWithIconBase} ${errors.email ? 'border-red-400' : 'border-white/20'}`}
                />
              </div>
              {errors.email && <p className="text-sm text-red-400 mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* Vehicle */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Vehicle Class<span className="text-red-400">*</span></label>
              <div className="relative">
                <Car className="w-5 h-5 text-white/60 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={form.vehicleClass}
                  onChange={(e) => handleChange('vehicleClass', e.target.value as VehicleClass)}
                  className={`${selectWithIconBase} border-white/20`}
                >
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="truck">Truck</option>
                  <option value="van">Van</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">Car Make<span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={form.carMake}
                  onChange={(e) => handleChange('carMake', e.target.value)}
                  placeholder="e.g., Toyota"
                  className={`${inputBase} ${errors.carMake ? 'border-red-400' : 'border-white/20'}`}
                />
                {errors.carMake && <p className="text-red-400 text-sm mt-1">{errors.carMake}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">Car Model<span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={form.carModel}
                  onChange={(e) => handleChange('carModel', e.target.value)}
                  placeholder="e.g., Camry"
                  className={`${inputBase} ${errors.carModel ? 'border-red-400' : 'border-white/20'}`}
                />
                {errors.carModel && <p className="text-red-400 text-sm mt-1">{errors.carModel}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">Car Year<span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={form.carYear}
                  onChange={(e) => handleChange('carYear', e.target.value)}
                  placeholder="e.g., 2018"
                  className={`${inputBase} ${errors.carYear ? 'border-red-400' : 'border-white/20'}`}
                />
                {errors.carYear && <p className="text-red-400 text-sm mt-1">{errors.carYear}</p>}
              </div>
            </div>
          </div>

          {/* Vehicle Images Upload */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">Vehicle Photo Upload (optional) - Up to 5 images</label>
            <div className="flex items-center">
              <input 
                ref={vehicleImagesInputRef} 
                type="file" 
                accept="image/*" 
                multiple 
                className="hidden" 
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length > 5) {
                    alert('You can upload a maximum of 5 images');
                    return;
                  }
                  handleChange('vehicleImages', [...form.vehicleImages, ...files].slice(0, 5));
                }} 
              />
              <button 
                type="button" 
                onClick={() => vehicleImagesInputRef.current?.click()} 
                className="inline-flex items-center justify-center gap-2 px-4 py-3 border border-white/20 rounded-lg text-white/90 hover:bg-white/10 transition-all duration-200"
                disabled={form.vehicleImages.length >= 5}
              >
                <Upload className="w-4 h-4" /> Upload Vehicle Photos
              </button>
            </div>
            {form.vehicleImages.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-white/70 mb-2">Selected {form.vehicleImages.length} image(s):</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {form.vehicleImages.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-white/5 rounded-lg overflow-hidden border border-white/20">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Vehicle image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onLoad={(e) => {
                            // Clean up the object URL after the image loads to prevent memory leaks
                            const img = e.target as HTMLImageElement;
                            setTimeout(() => URL.revokeObjectURL(img.src), 1000);
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = form.vehicleImages.filter((_, i) => i !== index);
                          handleChange('vehicleImages', newImages);
                        }}
                        className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold transition-colors duration-200 opacity-0 group-hover:opacity-100"
                        title="Remove image"
                      >
                        ×
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b-lg truncate opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {file.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button type="button" onClick={onBack} className="flex-1 px-4 py-3 border border-white/20 text-white/90 rounded-lg hover:bg-white/10 transition-all duration-200">Back</button>
            <button type="submit" className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary-600 hover:to-secondary-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">Submit Request</button>
          </div>
        </form>
      </div>
    </div>
  );
}
