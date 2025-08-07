'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  MapPin, 
  Phone, 
  Shield, 
  Clock, 
  Target,
  Building2,
  Activity,
  PieChart,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Lock,
  LogIn,
  LogOut
} from 'lucide-react'
import axios from 'axios'

interface AnalyticsData {
  overview: {
    totalLeads: number
    averageLeadScore: number
    averageSalesCycle: number
    conversionRate: number
  }
  leadSources: Array<{
    source: string
    count: number
    averageScore: number
  }>
  callSources: Array<{
    callSource: string
    count: number
    averageScore: number
  }>
  salesCycle: {
    totalConverted: number
    avgTimeToClose: number
    targetTimeToClose: number
    performanceVsTarget: string
  }
  geographic: Array<{
    zipCode: string
    leadCount: number
    averageScore: number
    marketSegment: string
  }>
  brands: Array<{
    brandId: string
    leadCount: number
    averageScore: number
    averageTimeToClose: number
  }>
  conversions: {
    overall: number
    byTeam: {
      national_call_center: { total: number; converted: number }
      branch_level: { total: number; converted: number }
    }
  }
}

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Mock login - in production, this would be a real authentication system
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === 'admin' && password === 'safehaven2024') {
      setIsLoggedIn(true)
      setError('')
    } else {
      setError('Invalid credentials. Use admin/safehaven2024')
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername('')
    setPassword('')
  }

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001'}/api/analytics/dashboard`)
      setAnalytics(response.data.data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setError('Failed to fetch analytics data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      fetchAnalytics()
      // Refresh data every 30 seconds
      const interval = setInterval(fetchAnalytics, 30000)
      return () => clearInterval(interval)
    }
  }, [isLoggedIn])

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              SafeHaven Admin
            </h1>
            <p className="text-gray-600">
              Access real-time analytics and performance metrics
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <LogIn className="w-5 h-5" />
              <span>Login to Dashboard</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Demo credentials: <br />
              <strong>Username:</strong> admin <br />
              <strong>Password:</strong> safehaven2024
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">SafeHaven Analytics</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : analytics ? (
          <div className="space-y-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Leads</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.overview.totalLeads.toLocaleString()}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">+12.5% from last month</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Lead Score</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.overview.averageLeadScore}</p>
                  </div>
                  <Target className="w-8 h-8 text-green-600" />
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">+5.2% from last month</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Sales Cycle</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.overview.averageSalesCycle} days</p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-600" />
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-red-600">-0.3 days from target</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.overview.conversionRate}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">+2.1% from last month</span>
                </div>
              </motion.div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Lead Sources Chart */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Lead Sources</h3>
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div className="space-y-4">
                  {analytics.leadSources.map((source, index) => (
                    <div key={source.source} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${
                          index === 0 ? 'bg-blue-500' :
                          index === 1 ? 'bg-green-500' :
                          index === 2 ? 'bg-orange-500' : 'bg-purple-500'
                        }`}></div>
                        <span className="font-medium text-gray-700 capitalize">{source.source}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{source.count.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Score: {source.averageScore}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Sales Team Performance */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Sales Team Performance</h3>
                  <Building2 className="w-6 h-6 text-green-600" />
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700">National Call Center</span>
                      <span className="text-sm text-gray-500">
                        {analytics.conversions.byTeam.national_call_center.converted} / {analytics.conversions.byTeam.national_call_center.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(analytics.conversions.byTeam.national_call_center.converted / analytics.conversions.byTeam.national_call_center.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700">Branch Level</span>
                      <span className="text-sm text-gray-500">
                        {analytics.conversions.byTeam.branch_level.converted} / {analytics.conversions.byTeam.branch_level.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(analytics.conversions.byTeam.branch_level.converted / analytics.conversions.byTeam.branch_level.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Geographic Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Geographic Performance</h3>
                <MapPin className="w-6 h-6 text-red-600" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analytics.geographic.map((location, index) => (
                  <div key={location.zipCode} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">ZIP {location.zipCode}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        location.marketSegment === 'premium_urban' ? 'bg-purple-100 text-purple-800' :
                        location.marketSegment === 'suburban_family' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {location.marketSegment.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">Leads: {location.leadCount}</p>
                      <p className="text-sm text-gray-600">Avg Score: {location.averageScore}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Brand Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Brand Performance</h3>
                <Activity className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analytics.brands.map((brand) => (
                  <div key={brand.brandId} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 capitalize">
                        {brand.brandId.replace('-', ' ')}
                      </h4>
                      <span className="text-sm text-gray-500">
                        {brand.averageTimeToClose} days avg
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Total Leads</p>
                        <p className="text-xl font-bold text-gray-900">{brand.leadCount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Avg Score</p>
                        <p className="text-xl font-bold text-gray-900">{brand.averageScore}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Sales Cycle Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Sales Cycle Metrics</h3>
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">{analytics.salesCycle.totalConverted}</p>
                  <p className="text-sm text-gray-600">Total Converted</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">{analytics.salesCycle.avgTimeToClose}</p>
                  <p className="text-sm text-gray-600">Avg Days to Close</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">{analytics.salesCycle.targetTimeToClose}</p>
                  <p className="text-sm text-gray-600">Target Days</p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  analytics.salesCycle.performanceVsTarget === 'on_target' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {analytics.salesCycle.performanceVsTarget === 'on_target' ? 'On Target' : 'Below Target'}
                </span>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No analytics data available</p>
          </div>
        )}
      </main>
    </div>
  )
} 