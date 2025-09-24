# Clean Fox - Cleaning Services Coupon Redemption

A responsive web application for redeeming Groupon coupons for professional cleaning services. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Service Selection**: Choose from Car Cleaning, Window Cleaning, Office Cleaning, and Lawn Mowing
- **Coupon Validation**: Enter and validate Groupon coupon codes
- **Booking Integration**: Dummy Booking Koala form integration placeholder
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Ready for Vercel deployment

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   
   # Edit .env.local with your API keys
   # See "API Configuration" section below
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Visit [http://localhost:3000](http://localhost:3000) to see the application.

## API Configuration

### Environment Variables

Create a `.env.local` file in the project root with your API keys:

```bash
# Groupon API Configuration
GROUPON_API_KEY=your_groupon_api_key_here
GROUPON_CLIENT_ID=your_groupon_client_id_here
GROUPON_CLIENT_SECRET=your_groupon_client_secret_here

# API Environment (sandbox or production)
GROUPON_API_BASE_URL=https://api.groupon.com/v2
# For testing: https://sandbox-api.groupon.com/v2

# Booking Koala Configuration
BOOKING_KOALA_API_KEY=your_booking_koala_api_key_here
BOOKING_KOALA_WIDGET_ID=your_booking_koala_widget_id_here

# Optional: Enable debugging
DEBUG_API_CALLS=true
```

### Getting API Keys

1. **Groupon API Keys**:
   - Visit [Groupon Developers Portal](https://www.groupon.com/developers)
   - Register your application
   - Get your API key, Client ID, and Client Secret

2. **Booking Koala**:
   - Sign up at [Booking Koala](https://bookingkoala.com)
   - Get your API key and Widget ID from your dashboard

### Demo Mode

Without API keys configured, the application runs in demo mode:
- Uses placeholder validation logic
- Shows demo booking form
- Perfect for development and testing

## Demo Usage

### Testing Coupon Validation

The application includes demo coupon validation logic:

- **Valid Coupons**: Use codes starting with "CLEAN" (e.g., `CLEAN123456`, `CLEANTEST50`)
- **Special Test Code**: `TESTVALID` - 25% discount
- **Discount Variations**: 
  - Codes containing "50" → 50% off
  - Codes containing "30" → 30% off
  - Default → 20% off

### User Flow

1. **Select Service**: Choose from the four available cleaning services
2. **Enter Coupon**: Input your Groupon coupon code
3. **Validation**: System validates the coupon (with demo logic)
4. **Booking**: Redirected to booking form (placeholder iframe)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx           # Main application page
│   └── globals.css        # Global styles
├── components/
│   ├── Header.tsx         # Application header
│   ├── ServiceSelector.tsx # Service selection cards
│   ├── CouponForm.tsx     # Coupon input and validation
│   └── BookingForm.tsx    # Booking form with iframe placeholder
└── lib/
    └── groupon.ts         # Groupon API utilities and validation
```

## Components

### ServiceSelector
- Displays four service options as interactive cards
- Responsive grid layout (1 column mobile, 2 tablet, 4 desktop)
- Visual feedback for selection

### CouponForm
- Coupon code input with validation
- Loading states and error handling
- Success animation before proceeding

### BookingForm
- Placeholder for Booking Koala iframe integration
- Service and coupon confirmation
- Future integration ready

## Integration Stubs

### Groupon API
- **File**: `src/lib/groupon.ts`
- **Function**: `validateCoupon(couponCode, serviceId)`
- **Documentation**: [Groupon Developers](https://www.groupon.com/developers-docs/bookable-appointments)

### Booking Koala
- **Integration Point**: `BookingForm` component
- **URL Generation**: `getBookingKoalaUrl(serviceId, couponCode)`
- **Implementation**: Replace placeholder div with actual iframe

## Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: Single column layout, stacked elements
- **Tablet**: 2-column service grid, optimized spacing
- **Desktop**: 4-column service grid, full layout

## Future Enhancements

1. **Real API Integration**: Replace demo validation with actual Groupon API
2. **Booking Koala**: Implement real iframe integration
3. **User Authentication**: Add user accounts and booking history
4. **Payment Processing**: Handle payment flows
5. **Analytics**: Track conversion rates and user behavior

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting (recommended)
- Tailwind CSS for styling

## Deployment

The application is ready for deployment on Vercel:

```bash
npm run build
```

Or deploy directly to Vercel:
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/groupon-cleaning-ui)

## License

This project is created as a demo application for Groupon coupon redemption integration.# cleanfox-groupon
