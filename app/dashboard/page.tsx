'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit2, Trash2, X, Check, Users, Package, TrendingUp, DollarSign, Home, Settings, LogOut, Menu, Bell, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

interface DataItem {
  id: string
  name: string
  type: string
  description: string
  price: number
  image: string
  status: 'active' | 'inactive'
  createdAt: string
  stock?: number
  category?: string
}

export default function Dashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [data, setData] = useState<DataItem[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<DataItem | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    price: 0,
    image: '',
    status: 'active' as 'active' | 'inactive'
  })
  const [isDataLoading, setIsDataLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Check if user is admin, redirect to home if not
  useEffect(() => {
    console.log('Dashboard: checking user auth', { user, userEmail: user?.email })
    
    // Give time for auth context to load user from localStorage
    const timer = setTimeout(() => {
      if (!user || user.email !== 'arpita@gmail.com') {
        console.log('Dashboard: redirecting to home - not admin or no user', { user, userEmail: user?.email })
        router.push('/')
      } else {
        console.log('Dashboard: admin user confirmed, staying on dashboard')
        setIsAuthLoading(false)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [user, router])

  // Fetch products from API
  useEffect(() => {
    if (!isAuthLoading) {
      fetchProducts()
    }
  }, [isAuthLoading])

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const response = await res.json()
      
      if (res.ok && response.success) {
        // Transform API data to match DataItem interface
        const transformedData = response.data.map((product: any) => ({
          id: product.id,
          name: product.name,
          type: product.category === 'Fruits' ? 'Fruit' : 'Vegetable',
          description: product.description || `Fresh ${product.name}`,
          price: product.price,
          image: product.image || 'https://images.unsplash.com/photo-1592924357228-91a80da257fb?w=300&h=300&fit=crop',
          status: product.stock > 0 ? 'active' : 'inactive',
          createdAt: product.createdAt || new Date().toISOString().split('T')[0],
          stock: product.stock || 0,
          category: product.category
        }))
        setData(transformedData)
      } else {
        console.error('Failed to fetch products:', response.error)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  // Remove filter functionality - using all data
  const filteredData = data

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsDataLoading(true)
    
    try {
      const productData = {
        name: formData.name,
        type: formData.type,
        description: formData.description,
        price: formData.price,
        image: formData.image,
        status: formData.status
      }

      if (editingItem) {
        // Update existing item
        const res = await fetch(`/api/products?id=${editingItem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ...productData, id: editingItem.id })
        })

        if (res.ok) {
          const updatedProduct = await res.json()
          // Refresh products list from API
          await fetchProducts()
        } else {
          const error = await res.json()
          console.error('Failed to update product:', error.error)
          alert('Failed to update product: ' + (error.error || 'Unknown error'))
        }
      } else {
        // Create new item
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(productData)
        })

        if (res.ok) {
          const newProduct = await res.json()
          // Refresh products list from API
          await fetchProducts()
        } else {
          const error = await res.json()
          console.error('Failed to create product:', error.error)
          alert('Failed to create product: ' + (error.error || 'Unknown error'))
        }
      }

      resetForm()
      setIsDataLoading(false)
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error saving product. Please try again.')
      setIsDataLoading(false)
    }
  }

  const handleEdit = (item: DataItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      type: item.type,
      description: item.description,
      price: item.price,
      image: item.image,
      status: item.status
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        const res = await fetch(`/api/products?id=${id}`, {
          method: 'DELETE'
        })

        if (res.ok) {
          // Refresh products list from API
          await fetchProducts()
        } else {
          const error = await res.json()
          console.error('Failed to delete product:', error.error)
          alert('Failed to delete product: ' + (error.error || 'Unknown error'))
        }
      } catch (error) {
        console.error('Error deleting product:', error)
        alert('Error deleting product. Please try again.')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      description: '',
      price: 0,
      image: '',
      status: 'active'
    })
    setEditingItem(null)
    setIsModalOpen(false)
  }

  // Calculate statistics
  const totalProducts = data.length
  const activeProducts = data.filter(item => item.status === 'active').length
  const totalValue = data.reduce((sum, item) => sum + (item.price * (item.stock || 0)), 0)
  const totalStock = data.reduce((sum, item) => sum + (item.stock || 0), 0)

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-indigo-900 min-h-screen transition-all duration-300`}>
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-indigo-800">
            <h2 className={`text-white font-bold text-xl ${!sidebarOpen && 'hidden'}`}>Admin Panel</h2>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white hover:bg-indigo-800 p-2 rounded"
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Profile Section */}
          <div className="p-4 border-b border-indigo-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">A</span>
              </div>
              <div className={`${!sidebarOpen && 'hidden'}`}>
                <p className="text-white font-medium">Admin User</p>
                <p className="text-indigo-300 text-sm">admin@freshveg.com</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="mt-4">
            <a href="#" className="flex items-center space-x-3 text-white bg-indigo-800 p-3 rounded-lg mx-2">
              <Home size={20} />
              <span className={`${!sidebarOpen && 'hidden'}`}>Products</span>
            </a>
            <a href="#" className="flex items-center space-x-3 text-indigo-300 hover:bg-indigo-800 p-3 rounded-lg mx-2 mt-2">
              <Package size={20} />
              <span className={`${!sidebarOpen && 'hidden'}`}>Categories</span>
            </a>
            <a href="#" className="flex items-center space-x-3 text-indigo-300 hover:bg-indigo-800 p-3 rounded-lg mx-2 mt-2">
              <TrendingUp size={20} />
              <span className={`${!sidebarOpen && 'hidden'}`}>Analytics</span>
            </a>
            <a href="#" className="flex items-center space-x-3 text-indigo-300 hover:bg-indigo-800 p-3 rounded-lg mx-2 mt-2">
              <TrendingUp size={20} />
              <span className={`${!sidebarOpen && 'hidden'}`}>Analytics</span>
            </a>
            <a href="#" className="flex items-center space-x-3 text-indigo-300 hover:bg-indigo-800 p-3 rounded-lg mx-2 mt-2">
              <Settings size={20} />
              <span className={`${!sidebarOpen && 'hidden'}`}>Settings</span>
            </a>
          </nav>

          {/* Logout Button */}
          <div className="absolute bottom-4 left-4 right-4 ">
            <button className="flex items-center space-x-3 text-red-400 hover:bg-indigo-800 w-50 p-3 rounded-lg mt-2 mx-2">
              <LogOut size={20} />
              <span className={`${!sidebarOpen && 'hidden'}`}>Logout</span>
            </button>
          </div>
        </div>

      {/* Main Content */}
        <div className="flex-1">
          {/* Top Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, Admin</p>
              </div>
              <div className="flex items-center space-x-4">
                <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">A</span>
                  </div>
                  <ChevronDown size={16} className="text-gray-600" />
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="p-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Products</p>
                    <p className="text-2xl font-bold text-gray-900">{activeProducts}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Stock</p>
                    <p className="text-2xl font-bold text-gray-900">{totalStock}</p>
                  </div>
                  <Users className="h-8 w-8 text-yellow-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Value</p>
                    <p className="text-2xl font-bold text-gray-900">Rs.{totalValue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-purple-500" />
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Product Management</h2>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={20} />
                  Add New Product
                </button>
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-12 w-12 flex-shrink-0 mr-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-12 w-12 rounded-lg object-cover"
                              />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{item.name}</div>
                              <div className="text-sm text-gray-500">{item.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            item.type === 'Fruit' 
                              ? 'bg-orange-100 text-orange-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">Rs.{item.price}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${
                            (item.stock || 0) > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {item.stock || 0} units
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            item.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredData.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No products found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {editingItem ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Type</option>
                    <option value="Fruit">Fruit</option>
                    <option value="Vegetable">Vegetable</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (Rs.)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isDataLoading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isDataLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      editingItem ? 'Update' : 'Create'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
  )
}
