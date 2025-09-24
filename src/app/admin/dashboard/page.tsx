'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, dbOperations, FormSubmission, isSupabaseConfigured } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  LogOut, 
  Settings,
  Home,
  FileText,
  BarChart3,
  Search,
  Filter,
  Download,
  TrendingUp,
  DollarSign,
  Activity,
  Image,
  Eye,
  Edit,
  Trash2,
  Save,
  X,
  User as UserIcon,
  MapPin,
  MessageSquare,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import ConfirmModal from '@/components/ConfirmModal'
import SuccessModal from '@/components/SuccessModal'

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [submissions, setSubmissions] = useState<FormSubmission[]>([])
  const [filteredSubmissions, setFilteredSubmissions] = useState<FormSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('overview')
  const [editingSubmission, setEditingSubmission] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState<Partial<FormSubmission>>({})
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState<{show: boolean, title: string, message: string}>({show: false, title: '', message: ''})
  const [viewingSubmission, setViewingSubmission] = useState<FormSubmission | null>(null)
  const [imagePreview, setImagePreview] = useState<{show: boolean, images: string[], currentIndex: number, title: string}>({show: false, images: [], currentIndex: 0, title: ''})
  const router = useRouter()

  const checkUser = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured()) {
      // If Supabase is not configured, redirect to admin login
      router.push('/admin')
      return
    }
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/admin')
      return
    }
    setUser(user)
  }, [router])

  const fetchSubmissions = useCallback(async () => {
    try {
      const data = await dbOperations.getFormSubmissions()
      setSubmissions(data)
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkUser()
    fetchSubmissions()
  }, [checkUser, fetchSubmissions])

  useEffect(() => {
    const filtered = submissions.filter(submission => {
      const matchesSearch = 
        submission.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.customer_phone?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || submission.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
    setFilteredSubmissions(filtered)
  }, [submissions, searchTerm, statusFilter])

  const updateStatus = async (id: string, status: FormSubmission['status']) => {
    try {
      await dbOperations.updateSubmissionStatus(id, status)
      setSubmissions(prev => 
        prev.map(sub => sub.id === id ? { ...sub, status } : sub)
      )
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await dbOperations.deleteSubmission(id)
      setSubmissions(prev => prev.filter(sub => sub.id !== id))
      setShowSuccessModal({
        show: true,
        title: 'Success',
        message: 'Submission deleted successfully'
      })
    } catch (error) {
      console.error('Error deleting submission:', error)
      setShowSuccessModal({
        show: true,
        title: 'Error',
        message: 'Failed to delete submission'
      })
    }
  }

  const handleEdit = (submission: FormSubmission) => {
    setEditingSubmission(submission.id)
    setEditFormData({
      customer_name: submission.customer_name,
      customer_email: submission.customer_email,
      customer_phone: submission.customer_phone,
      address_line1: submission.address_line1,
      address_line2: submission.address_line2,
      city: submission.city,
      state: submission.state,
      zip_code: submission.zip_code,
      service_type: submission.service_type,
      service_title: submission.service_title,
      preferred_date: submission.preferred_date,
      preferred_time: submission.preferred_time,
      special_instructions: submission.special_instructions,
      admin_notes: submission.admin_notes
    })
  }

  const handleSaveEdit = async (id: string) => {
    try {
      await dbOperations.updateSubmission(id, editFormData)
      setSubmissions(prev => 
        prev.map(sub => sub.id === id ? { ...sub, ...editFormData } : sub)
      )
      setEditingSubmission(null)
      setShowSuccessModal({
        show: true,
        title: 'Success',
        message: 'Submission updated successfully'
      })
    } catch (error) {
      console.error('Error updating submission:', error)
      setShowSuccessModal({
        show: true,
        title: 'Error',
        message: 'Failed to update submission'
      })
    }
  }

  const handleCancelEdit = () => {
    setEditingSubmission(null)
    setEditFormData({})
  }

  const handleViewSubmission = (submission: FormSubmission) => {
    setViewingSubmission(submission)
  }

  const openImagePreview = (images: string[], startIndex: number, title: string) => {
    setImagePreview({
      show: true,
      images,
      currentIndex: startIndex,
      title
    })
  }

  const closeImagePreview = () => {
    setImagePreview({show: false, images: [], currentIndex: 0, title: ''})
  }

  const nextImage = () => {
    setImagePreview(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length
    }))
  }

  const prevImage = () => {
    setImagePreview(prev => ({
      ...prev,
      currentIndex: prev.currentIndex === 0 ? prev.images.length - 1 : prev.currentIndex - 1
    }))
  }

  const handleExport = () => {
    // Create CSV content
    const headers = [
      'Customer Name', 'Email', 'Phone', 
      'Address', 'City', 'State', 'Zip', 
      'Service Type', 'Service Title', 
      'Preferred Date', 'Preferred Time', 
      'Special Instructions', 'Status', 
      'Created At'
    ].join(',')
    
    const rows = filteredSubmissions.map(s => [
      `"${s.customer_name}"`,
      `"${s.customer_email}"`,
      `"${s.customer_phone || ''}"`,
      `"${s.address_line1} ${s.address_line2 || ''}"`,
      `"${s.city}"`,
      `"${s.state}"`,
      `"${s.zip_code}"`,
      `"${s.service_type}"`,
      `"${s.service_title}"`,
      `"${s.preferred_date || ''}"`,
      `"${s.preferred_time || ''}"`,
      `"${s.special_instructions || ''}"`,
      `"${s.status}"`,
      `"${new Date(s.created_at).toLocaleString()}"`,
    ].join(','))
    
    const csvContent = [headers, ...rows].join('\n')
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `submissions-export-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleLogout = async () => {
    if (supabase && isSupabaseConfigured()) {
      await supabase.auth.signOut()
    }
    router.push('/admin')
  }

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    confirmed: submissions.filter(s => s.status === 'confirmed').length,
    completed: submissions.filter(s => s.status === 'completed').length,
    cancelled: submissions.filter(s => s.status === 'cancelled').length,
    thisWeek: submissions.filter(s => {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return new Date(s.created_at) > weekAgo
    }).length,
    revenue: submissions.filter(s => s.status === 'completed').length * 150 // Estimated revenue
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Modern Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-slate-200/60">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  CleanFox Admin
                </h1>
                <p className="text-sm text-slate-500">Dashboard</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'submissions', label: 'Submissions', icon: FileText },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="p-6 border-t border-slate-200/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">Admin</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-72 p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
            {activeTab === 'overview' ? 'Dashboard Overview' : 
             activeTab === 'submissions' ? 'Form Submissions' :
             activeTab === 'analytics' ? 'Analytics' : 'Settings'}
          </h2>
          <p className="text-slate-600">
            {activeTab === 'overview' ? 'Monitor your cleaning service bookings and performance' :
             activeTab === 'submissions' ? 'Manage customer booking requests' :
             activeTab === 'analytics' ? 'View detailed analytics and insights' : 'Configure your admin settings'}
          </p>
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { 
                  title: 'Total Bookings', 
                  value: stats.total, 
                  icon: FileText, 
                  color: 'from-blue-500 to-cyan-500',
                  bgColor: 'from-blue-50 to-cyan-50',
                  change: '+12%'
                },
                { 
                  title: 'This Week', 
                  value: stats.thisWeek, 
                  icon: Calendar, 
                  color: 'from-emerald-500 to-teal-500',
                  bgColor: 'from-emerald-50 to-teal-50',
                  change: '+8%'
                },
                { 
                  title: 'Completed', 
                  value: stats.completed, 
                  icon: CheckCircle, 
                  color: 'from-green-500 to-emerald-500',
                  bgColor: 'from-green-50 to-emerald-50',
                  change: '+15%'
                },
                { 
                  title: 'Revenue', 
                  value: `$${stats.revenue.toLocaleString()}`, 
                  icon: DollarSign, 
                  color: 'from-purple-500 to-pink-500',
                  bgColor: 'from-purple-50 to-pink-50',
                  change: '+23%'
                }
              ].map((stat, index) => (
                <div key={index} className={`bg-gradient-to-br ${stat.bgColor} p-6 rounded-2xl border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-emerald-600 text-sm font-semibold bg-emerald-100 px-2 py-1 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</h3>
                  <p className="text-slate-600 font-medium">{stat.title}</p>
                </div>
              ))}
            </div>

            {/* Status Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Status Distribution */}
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/60 shadow-lg">
                <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-blue-500" />
                  Status Distribution
                </h3>
                <div className="space-y-4">
                  {[
                    { status: 'Pending', count: stats.pending, color: 'bg-yellow-500', bgColor: 'bg-yellow-50' },
                    { status: 'Confirmed', count: stats.confirmed, color: 'bg-blue-500', bgColor: 'bg-blue-50' },
                    { status: 'Completed', count: stats.completed, color: 'bg-green-500', bgColor: 'bg-green-50' },
                    { status: 'Cancelled', count: stats.cancelled, color: 'bg-red-500', bgColor: 'bg-red-50' }
                  ].map((item) => (
                    <div key={item.status} className={`${item.bgColor} p-4 rounded-xl border border-white/60`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
                          <span className="font-medium text-slate-700">{item.status}</span>
                        </div>
                        <span className="text-xl font-bold text-slate-800">{item.count}</span>
                      </div>
                      <div className="mt-2 bg-white/60 rounded-full h-2">
                        <div 
                          className={`${item.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${stats.total > 0 ? (item.count / stats.total) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/60 shadow-lg">
                <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-500" />
                  Recent Submissions
                </h3>
                <div className="space-y-4">
                  {submissions.slice(0, 5).map((submission) => (
                    <div key={submission.id} className="flex items-center justify-between p-3 bg-slate-50/80 rounded-xl border border-white/40">
                      <div>
                        <p className="font-medium text-slate-800">{submission.customer_name}</p>
                        <p className="text-sm text-slate-500">{submission.service_type}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        submission.status === 'completed' ? 'bg-green-100 text-green-700' :
                        submission.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                        submission.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {submission.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'submissions' && (
          <>
            {/* Search and Filter */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/60 shadow-lg mb-6">
              <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white shadow-sm border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-800"
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-10 pr-8 py-3 bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <button 
                  onClick={handleExport}
                  className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                </div>
              </div>
            </div>

            {/* Submissions Table */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Customer</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Service</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Address</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Images</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSubmissions.map((submission) => (
                      <tr key={submission.id} className="hover:bg-orange-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            {editingSubmission === submission.id ? (
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  value={editFormData.customer_name || ''}
                                  onChange={(e) => setEditFormData({...editFormData, customer_name: e.target.value})}
                                  className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                                  placeholder="Customer Name"
                                />
                                <input
                                  type="email"
                                  value={editFormData.customer_email || ''}
                                  onChange={(e) => setEditFormData({...editFormData, customer_email: e.target.value})}
                                  className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                                  placeholder="Email Address"
                                />
                                <input
                                  type="tel"
                                  value={editFormData.customer_phone || ''}
                                  onChange={(e) => setEditFormData({...editFormData, customer_phone: e.target.value})}
                                  className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                                  placeholder="Phone Number"
                                />
                              </div>
                            ) : (
                              <>
                                <div className="text-sm font-medium text-slate-900">{submission.customer_name}</div>
                                <div className="text-sm text-slate-500">{submission.customer_email}</div>
                                <div className="text-sm text-slate-500">{submission.customer_phone}</div>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-slate-900">{submission.service_type}</div>
                            <div className="text-sm text-slate-500">
                              {submission.preferred_date} at {submission.preferred_time}
                            </div>
                            {submission.coupon_code && (
                              <div className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-md inline-block mt-1">
                                Coupon: {submission.coupon_code}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-900">
                            {submission.address_line1}
                            {submission.address_line2 && <><br />{submission.address_line2}</>}
                            <br />
                            {submission.city}, {submission.state} {submission.zip_code}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col space-y-2">
                            {submission.property_images && submission.property_images.length > 0 && (
                              <div className="flex items-center space-x-2">
                                <Image className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-slate-700">Property: {submission.property_images.length}</span>
                                <button
                                  onClick={() => {
                                    const modal = document.createElement('div');
                                    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
                                    modal.innerHTML = `
                                      <div class="bg-white p-6 rounded-lg max-w-4xl max-h-[80vh] overflow-auto">
                                        <div class="flex justify-between items-center mb-4">
                                          <h3 class="text-lg font-semibold">Property Images</h3>
                                          <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">×</button>
                                        </div>
                                        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                                          ${submission.property_images?.map(url => `
                                             <img src="${url}" alt="Property" class="w-full h-48 object-cover rounded-lg" />
                                           `).join('') || ''}
                                        </div>
                                      </div>
                                    `;
                                    document.body.appendChild(modal);
                                  }}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                            {submission.vehicle_images && submission.vehicle_images.length > 0 && (
                              <div className="flex items-center space-x-2">
                                <Image className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-slate-700">Vehicle: {submission.vehicle_images.length}</span>
                                <button
                                  onClick={() => {
                                    const modal = document.createElement('div');
                                    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
                                    modal.innerHTML = `
                                      <div class="bg-white p-6 rounded-lg max-w-4xl max-h-[80vh] overflow-auto">
                                        <div class="flex justify-between items-center mb-4">
                                          <h3 class="text-lg font-semibold">Vehicle Images</h3>
                                          <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">×</button>
                                        </div>
                                        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                                          ${submission.vehicle_images?.map(url => `
                                             <img src="${url}" alt="Vehicle" class="w-full h-48 object-cover rounded-lg" />
                                           `).join('') || ''}
                                        </div>
                                      </div>
                                    `;
                                    document.body.appendChild(modal);
                                  }}
                                  className="text-green-600 hover:text-green-800"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                            {(!submission.property_images || submission.property_images.length === 0) && 
                             (!submission.vehicle_images || submission.vehicle_images.length === 0) && (
                              <span className="text-sm text-slate-400">No images</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={submission.status}
                            onChange={(e) => updateStatus(submission.id, e.target.value as FormSubmission['status'])}
                            className={`text-sm rounded-xl px-3 py-2 font-semibold border-0 cursor-pointer transition-all ${
                              submission.status === 'completed' ? 'bg-green-100 text-green-800' :
                              submission.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                              submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {new Date(submission.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            {editingSubmission === submission.id ? (
                              <>
                                <button 
                                  onClick={() => handleSaveEdit(submission.id)}
                                  className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
                                  title="Save changes"
                                >
                                  <Save className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={handleCancelEdit}
                                  className="p-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200"
                                  title="Cancel editing"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button 
                                  onClick={() => handleViewSubmission(submission)}
                                  className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
                                  title="View submission details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleEdit(submission)}
                                  className="p-1 bg-orange-100 text-orange-600 rounded hover:bg-orange-200"
                                  title="Edit submission"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => setShowDeleteModal(submission.id)}
                                  className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                                  title="Delete submission"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-white/60 shadow-lg text-center">
            <TrendingUp className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Analytics Coming Soon</h3>
            <p className="text-slate-600">Advanced analytics and reporting features will be available here.</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-white/60 shadow-lg text-center">
            <Settings className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Settings</h3>
            <p className="text-slate-600">Admin settings and configuration options will be available here.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <ConfirmModal
        isOpen={showDeleteModal !== null}
        onClose={() => setShowDeleteModal(null)}
        onConfirm={() => {
          if (showDeleteModal) {
            handleDelete(showDeleteModal);
            setShowDeleteModal(null);
          }
        }}
        title="Delete Submission"
        message="Are you sure you want to delete this submission? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      <SuccessModal
        isOpen={showSuccessModal.show}
        onClose={() => setShowSuccessModal({show: false, title: '', message: ''})}
        title={showSuccessModal.title}
        message={showSuccessModal.message}
      />

      {/* View Submission Modal */}
      {viewingSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-800">Submission Details</h2>
              <button
                onClick={() => setViewingSubmission(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                   <UserIcon className="w-5 h-5 mr-2" />
                   Customer Information
                 </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <p className="text-gray-800">{viewingSubmission.customer_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-800">{viewingSubmission.customer_email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-gray-800">{viewingSubmission.customer_phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      viewingSubmission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      viewingSubmission.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      viewingSubmission.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {viewingSubmission.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Service Information */}
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-orange-800 mb-3 flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Service Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Service Type</label>
                    <p className="text-gray-800">{viewingSubmission.service_type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Service Title</label>
                    <p className="text-gray-800">{viewingSubmission.service_title}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Coupon Code</label>
                    <p className="text-gray-800">{viewingSubmission.coupon_code || 'None'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Preferred Date</label>
                    <p className="text-gray-800">{viewingSubmission.preferred_date || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Preferred Time</label>
                    <p className="text-gray-800">{viewingSubmission.preferred_time || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Address Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Address Line 1</label>
                    <p className="text-gray-800">{viewingSubmission.address_line1}</p>
                  </div>
                  {viewingSubmission.address_line2 && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Address Line 2</label>
                      <p className="text-gray-800">{viewingSubmission.address_line2}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-600">City</label>
                    <p className="text-gray-800">{viewingSubmission.city}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">State</label>
                    <p className="text-gray-800">{viewingSubmission.state}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">ZIP Code</label>
                    <p className="text-gray-800">{viewingSubmission.zip_code}</p>
                  </div>
                </div>
              </div>

              {/* Special Instructions */}
              {viewingSubmission.special_instructions && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-800 mb-3 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Special Instructions
                  </h3>
                  <p className="text-gray-800 whitespace-pre-wrap">{viewingSubmission.special_instructions}</p>
                </div>
              )}

              {/* Images */}
              {((viewingSubmission.property_images && viewingSubmission.property_images.length > 0) || 
                (viewingSubmission.vehicle_images && viewingSubmission.vehicle_images.length > 0)) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <Image className="w-5 h-5 mr-2" />
                    Images
                  </h3>
                  
                  {viewingSubmission.property_images && viewingSubmission.property_images.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-md font-medium text-gray-700 mb-2">Voucher Images</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {viewingSubmission.property_images.map((url, index) => {
                          console.log('Rendering property image:', url);
                          return (
                          <div key={index} className="relative group">
                            <img 
                              src={url} 
                              alt={`Voucher ${index + 1}`} 
                              className="w-full h-32 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                              onClick={() => openImagePreview(viewingSubmission.property_images!, index, 'Voucher Images')}
                              onLoad={() => {
                                console.log('Successfully loaded image:', url);
                              }}
                              onError={(e) => {
                                console.error('Failed to load image:', url);
                                console.error('Error details:', e);
                                // Show a placeholder instead of hiding
                                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIEZhaWxlZCB0byBMb2FkPC90ZXh0Pjwvc3ZnPg==';
                              }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                              <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {viewingSubmission.vehicle_images && viewingSubmission.vehicle_images.length > 0 && (
                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-2">Vehicle Images</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {viewingSubmission.vehicle_images.map((url, index) => {
                          console.log('Rendering vehicle image:', url);
                          return (
                          <div key={index} className="relative group">
                            <img 
                              src={url} 
                              alt={`Vehicle ${index + 1}`} 
                              className="w-full h-32 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                              onClick={() => openImagePreview(viewingSubmission.vehicle_images!, index, 'Vehicle Images')}
                              onLoad={() => {
                                console.log('Successfully loaded vehicle image:', url);
                              }}
                              onError={(e) => {
                                console.error('Failed to load vehicle image:', url);
                                console.error('Error details:', e);
                                // Show a placeholder instead of hiding
                                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIEZhaWxlZCB0byBMb2FkPC90ZXh0Pjwvc3ZnPg==';
                              }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                              <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Admin Notes */}
              {viewingSubmission.admin_notes && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Admin Notes
                  </h3>
                  <p className="text-gray-800 whitespace-pre-wrap">{viewingSubmission.admin_notes}</p>
                </div>
              )}

              {/* Timestamps */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Timestamps
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Created At</label>
                    <p className="text-gray-800">{new Date(viewingSubmission.created_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Updated At</label>
                    <p className="text-gray-800">{new Date(viewingSubmission.updated_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {imagePreview.show && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-full p-4">
            {/* Close Button */}
            <button
              onClick={closeImagePreview}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Image Title */}
            <div className="absolute top-4 left-4 text-white z-10">
              <h3 className="text-lg font-semibold">{imagePreview.title}</h3>
              <p className="text-sm text-gray-300">
                {imagePreview.currentIndex + 1} of {imagePreview.images.length}
              </p>
            </div>

            {/* Navigation Buttons */}
            {imagePreview.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Image */}
            <img
              src={imagePreview.images[imagePreview.currentIndex]}
              alt={`${imagePreview.title} ${imagePreview.currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onLoad={() => {
                console.log('Successfully loaded preview image:', imagePreview.images[imagePreview.currentIndex]);
              }}
              onError={(e) => {
                console.error('Failed to load preview image:', imagePreview.images[imagePreview.currentIndex]);
                console.error('Preview image error details:', e);
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}