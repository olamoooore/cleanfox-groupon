/**
 * Configuration checker utility
 * Helps users verify their API setup
 */

export interface ConfigStatus {
  groupon: {
    configured: boolean;
    missing: string[];
  };
  bookingKoala: {
    configured: boolean;
    missing: string[];
  };
  mode: 'production' | 'demo';
}

export function checkApiConfiguration(): ConfigStatus {
  const grouponKeys = ['GROUPON_API_KEY', 'GROUPON_CLIENT_ID', 'GROUPON_CLIENT_SECRET'];
  const bookingKeys = ['BOOKING_KOALA_API_KEY', 'BOOKING_KOALA_WIDGET_ID'];
  
  const missingGroupon = grouponKeys.filter(key => !process.env[key]);
  const missingBooking = bookingKeys.filter(key => !process.env[key]);
  
  const grouponConfigured = missingGroupon.length === 0;
  const bookingConfigured = missingBooking.length === 0;
  
  return {
    groupon: {
      configured: grouponConfigured,
      missing: missingGroupon,
    },
    bookingKoala: {
      configured: bookingConfigured,
      missing: missingBooking,
    },
    mode: grouponConfigured ? 'production' : 'demo',
  };
}

export function logConfigurationStatus(): void {
  const config = checkApiConfiguration();
  
  console.log('🔧 API Configuration Status:');
  console.log(`Mode: ${config.mode.toUpperCase()}`);
  
  if (config.groupon.configured) {
    console.log('✅ Groupon API: Configured');
  } else {
    console.log('⚠️  Groupon API: Using demo mode');
    console.log('   Missing:', config.groupon.missing.join(', '));
  }
  
  if (config.bookingKoala.configured) {
    console.log('✅ Booking Koala: Configured');
  } else {
    console.log('⚠️  Booking Koala: Using demo mode');
    console.log('   Missing:', config.bookingKoala.missing.join(', '));
  }
  
  if (config.mode === 'demo') {
    console.log('');
    console.log('💡 To use production APIs:');
    console.log('   1. Copy .env.example to .env.local');
    console.log('   2. Add your API keys to .env.local');
    console.log('   3. Restart the development server');
  }
}
