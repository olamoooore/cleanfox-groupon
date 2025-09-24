# Admin Backend Setup Guide

This guide will help you set up the complete admin backend with Supabase integration for managing form submissions and user authentication.

## 🚀 Features

- **Modern Admin Interface**: Clean, responsive dashboard built with Next.js and Tailwind CSS
- **Authentication**: Secure login system using Supabase Auth
- **Data Management**: Complete CRUD operations for form submissions
- **Real-time Analytics**: Dashboard with submission statistics and trends
- **Form Integration**: Customer booking form with database storage
- **Status Management**: Track and update submission statuses
- **Search & Filter**: Advanced filtering and search capabilities

## 📋 Prerequisites

- Node.js 18+ installed
- Supabase account and project
- Environment variables configured

## 🛠️ Setup Instructions

### 1. Database Setup

1. **Create Supabase Project**:
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Create a new project
   - Note your project URL and anon key

2. **Run Database Schema**:
   - Open your Supabase project dashboard
   - Go to SQL Editor
   - Copy and paste the contents of `supabase-schema.sql`
   - Execute the SQL commands

3. **Configure Authentication**:
   - Go to Authentication > Settings
   - Enable Email authentication
   - Configure your site URL (e.g., `http://localhost:3001`)

4. **Create Default Admin User**:
   - Go to Authentication > Users in your Supabase dashboard
   - Click "Add user" and create a new user with:
     - **Email**: `admin@cleanfox.com`
     - **Password**: `CleanFox2025!`
   - This will be your default admin account for initial access

### 2. Environment Configuration

Your `.env.local` file should include:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Other existing configurations...
GROUPON_API_KEY=your-groupon-key
GROUPON_CLIENT_ID=your-client-id
GROUPON_CLIENT_SECRET=your-client-secret
GROUPON_BASE_URL=https://api.groupon.com
BOOKING_KOALA_API_KEY=your-booking-koala-key
BOOKING_KOALA_WIDGET_ID=your-widget-id
NEXT_PUBLIC_ENV=development
API_DEBUG=true
```

### 3. Install Dependencies

```bash
npm install
```

The following packages are included:
- `@supabase/supabase-js` - Supabase client
- `@supabase/auth-ui-react` - Pre-built auth components
- `react-hook-form` - Form handling
- `zod` - Schema validation
- `date-fns` - Date utilities

### 4. Run Admin Setup Script (Optional)

For automated setup assistance, run:

```bash
npm run setup-admin
```

This script will:
- Verify your environment configuration
- Test database connectivity
- Provide step-by-step instructions for creating the admin user
- Display all necessary URLs and credentials

### 5. Start Development Server

```bash
npm run dev
```

## 🎯 Usage

### Default Admin Credentials

For initial access to the admin portal, use these default credentials:

- **Email**: `admin@cleanfox.com`
- **Password**: `CleanFox2025!`

> **Important**: Change these credentials after first login for security purposes.

### Admin Portal

1. **Access Admin**: Navigate to `/admin`
2. **Login**: Use the default credentials above or create new admin users
3. **Dashboard**: View submission statistics and manage data
4. **Manage Submissions**: Update status, add notes, delete entries

### Booking Form Demo

1. **Complete Demo**: Navigate to `/demo`
2. **Test Flow**: Complete the booking process
3. **Database Integration**: Submissions are automatically saved to Supabase
4. **Admin Review**: Check the admin portal to see new submissions

### Key URLs

- **Main App**: `http://localhost:3001/`
- **Admin Portal**: `http://localhost:3001/admin`
- **Complete Demo**: `http://localhost:3001/demo`
- **Admin Dashboard**: `http://localhost:3001/admin/dashboard`

## 📊 Database Schema

### Tables Created

1. **form_submissions**: Stores customer booking data
   - Customer information (name, email, phone)
   - Address details
   - Service information
   - Booking preferences
   - Status tracking

2. **admin_users**: Extended admin user profiles
   - Role management
   - Permissions
   - Activity tracking

3. **submission_stats**: View for analytics
   - Aggregated statistics
   - Date-based grouping
   - Service type breakdown

### Row Level Security

- Authenticated users can manage form submissions
- Admin users have role-based permissions
- Secure data access with Supabase RLS policies

## 🔧 Customization

### Adding New Fields

1. **Database**: Update the `form_submissions` table schema
2. **Types**: Update interfaces in `src/lib/supabase.ts`
3. **Form**: Modify `BookingFormWithDatabase.tsx`
4. **Admin**: Update dashboard display in `dashboard/page.tsx`

### Styling

- Built with Tailwind CSS
- Consistent design system
- Responsive layout
- Modern UI components

### Authentication

- Supabase Auth integration
- Email/password authentication
- Session management
- Protected routes

## 🚨 Security Notes

- Environment variables are properly configured
- Row Level Security enabled on all tables
- Authentication required for admin access
- Input validation with Zod schemas

## 📱 Mobile Responsive

The admin interface is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection**: Verify Supabase URL and keys
2. **Authentication**: Check site URL configuration in Supabase
3. **Permissions**: Ensure RLS policies are properly set
4. **Environment**: Verify all required environment variables

### Debug Mode

Set `API_DEBUG=true` in your environment for detailed logging.

## 📈 Analytics Features

- Total submissions count
- Status distribution
- Weekly/monthly trends
- Service type breakdown
- Real-time updates

## 🔄 Data Management

- **Create**: New submissions via booking form
- **Read**: View all submissions with filtering
- **Update**: Change status and add admin notes
- **Delete**: Remove submissions (with confirmation)

## 🎨 UI Components

- Modern card-based layout
- Interactive status badges
- Search and filter controls
- Responsive data tables
- Loading states and error handling

---

## 🤝 Support

For issues or questions:
1. Check the browser console for errors
2. Verify Supabase configuration
3. Review the database schema
4. Check authentication settings

The admin backend is now ready for production use with proper security, scalability, and user experience considerations.