import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Portal - Groupon Cleaning Service',
  description: 'Administrative dashboard for managing cleaning service bookings and data',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}