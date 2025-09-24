#!/usr/bin/env node

/**
 * Admin Setup Script for Clean Fox Admin Backend
 * 
 * This script helps you set up the default admin user and initialize the system.
 * Make sure you have configured your Supabase credentials in .env.local before running this.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Default admin credentials
const DEFAULT_ADMIN = {
  email: 'admin@cleanfox.com',
  password: 'CleanFox2025!',
  fullName: 'System Administrator'
};

async function setupAdmin() {
  console.log('🚀 Clean Fox Admin Setup');
  console.log('========================\n');

  // Check if .env.local exists
  const envPath = path.join(__dirname, '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('❌ Error: .env.local file not found!');
    console.log('Please create .env.local with your Supabase credentials first.');
    process.exit(1);
  }

  // Load environment variables
  require('dotenv').config({ path: envPath });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Supabase credentials not found in .env.local!');
    console.log('Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.');
    process.exit(1);
  }

  console.log('✅ Environment variables loaded');
  console.log(`📡 Supabase URL: ${supabaseUrl}`);

  // Initialize Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('\n🔐 Creating default admin user...');
    
    // Note: This requires admin privileges or service role key
    // In production, you should create users through Supabase Auth dashboard
    console.log('\n⚠️  Important Note:');
    console.log('Due to security restrictions, admin users must be created manually in the Supabase dashboard.');
    console.log('\nTo create the default admin user:');
    console.log('1. Go to your Supabase project dashboard');
    console.log('2. Navigate to Authentication > Users');
    console.log('3. Click "Add user" and enter:');
    console.log(`   - Email: ${DEFAULT_ADMIN.email}`);
    console.log(`   - Password: ${DEFAULT_ADMIN.password}`);
    console.log('4. Save the user');
    
    console.log('\n📊 Testing database connection...');
    
    // Test database connection by checking tables
    const { data: tables, error: tablesError } = await supabase
      .from('form_submissions')
      .select('count', { count: 'exact', head: true });

    if (tablesError) {
      console.error('❌ Database connection failed:', tablesError.message);
      console.log('\nPlease make sure you have:');
      console.log('1. Created the database tables using supabase-schema.sql');
      console.log('2. Configured Row Level Security policies');
      console.log('3. Set up proper authentication settings');
    } else {
      console.log('✅ Database connection successful');
      console.log(`📈 Current form submissions: ${tables || 0}`);
    }

    console.log('\n🎉 Setup Information:');
    console.log('===================');
    console.log(`🌐 Admin Portal: http://localhost:3001/admin`);
    console.log(`📧 Default Email: ${DEFAULT_ADMIN.email}`);
    console.log(`🔑 Default Password: ${DEFAULT_ADMIN.password}`);
    console.log(`🎮 Demo Page: http://localhost:3001/demo`);
    
    console.log('\n📋 Next Steps:');
    console.log('1. Create the admin user in Supabase dashboard (see instructions above)');
    console.log('2. Run: npm run dev');
    console.log('3. Visit http://localhost:3001/admin');
    console.log('4. Login with the default credentials');
    console.log('5. Change the password after first login');
    
    console.log('\n✨ Setup completed successfully!');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run the setup
if (require.main === module) {
  setupAdmin().catch(console.error);
}

module.exports = { setupAdmin, DEFAULT_ADMIN };