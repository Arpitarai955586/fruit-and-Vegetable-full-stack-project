'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Package, ArrowLeft, Calendar, User, Phone, Mail, DollarSign } from 'lucide-react'

interface Order {
  id: string
  date: string
  name: string
  email: string
  phone: string
  total: string
  status: 'delivered' | 'processing' | 'pending'
  items?: any[]
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    // Load orders from localStorage
    const savedOrders = localStorage.getItem('orderHistory')
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders)
        setOrders(parsedOrders)
      } catch (error) {
        console.error('Error loading orders:', error)
      }
    }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100'
      case 'processing':
        return 'text-blue-600 bg-blue-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Delivered'
      case 'processing':
        return 'Processing'
      case 'pending':
        return 'Pending'
      default:
        return 'Unknown'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
              <p className="text-gray-600">You haven't placed any orders yet. Start shopping to see your orders here!</p>
              <button
                onClick={() => router.push('/')}
                className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md transition-colors"
              >
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                      <p className="text-green-100 text-sm">{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customer Info */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Customer Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <span className="text-gray-600 w-20">Name:</span>
                          <span className="font-medium">{order.name}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-gray-600 w-20">Phone:</span>
                          <span className="font-medium">{order.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-gray-600 w-20">Email:</span>
                          <span className="font-medium">{order.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Package className="h-4 w-4 mr-2" />
                        Order Summary
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order Date:</span>
                          <span className="font-medium">{new Date(order.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order ID:</span>
                          <span className="font-medium">{order.id}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Total Amount:</span>
                          <span className="font-bold text-green-600 text-lg flex items-center">
                            <DollarSign className="h-4 w-4" />
                            {order.total}
                          </span>
                        </div>
                      </div>

                      {/* Order Items Preview */}
                      {order.items && order.items.length > 0 && (
                        <div className="mt-4">
                          <h5 className="font-medium text-gray-900 mb-2">Order Items</h5>
                          <div className="space-y-2">
                            {order.items.slice(0, 3).map((item: any, itemIndex: number) => (
                              <div key={itemIndex} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                                <img
                                  src={item.image || item.product?.image || 'https://images.unsplash.com/photo-1592924357228-91a60b27e6dc?w=50&h=50&fit=crop'}
                                  alt={item.name || item.product?.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">{item.name || item.product?.name}</p>
                                  <p className="text-xs text-gray-600">Qty: {item.quantity} × Rs.{item.price || item.product?.price}</p>
                                </div>
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <p className="text-xs text-gray-500 text-center">+{order.items.length - 3} more items</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
