'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, dbOperations, FormSubmission } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  Clock, 
  XCircle, 
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
  Star,
  Activity,
  Image,
  Eye,
  Edit,
  Trash2,
  Save,
  X
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
  const router = useRouter()

  useEffect(() => {
    checkUser()
    fetchSubmissions()
  }, [])

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

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/admin')
      return
    }
    setUser(user)
  }

  const fetchSubmissions = async () => {
    try {
      const data = await dbOperations.getFormSubmissions()
      setSubmissions(data)
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }

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
    await supabase.auth.signOut()
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
    </div>
  )
}