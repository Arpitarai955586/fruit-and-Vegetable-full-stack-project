'use client'

import { useRouter } from 'next/navigation'
import { CheckCircle, Package, ArrowLeft, Home, Phone } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function OrderSuccessPage() {
  const router = useRouter()
  const [orderDetails, setOrderDetails] = useState<any>(null)

  useEffect(() => {
    const savedOrder = localStorage.getItem('lastOrder')
    if (savedOrder) {
      try {
        const order = JSON.parse(savedOrder)
        setOrderDetails(order)
        
        // Send email confirmation
        sendOrderConfirmationEmail(order)
      } catch (error) {
        console.error('Error parsing order details:', error)
      }
    }
  }, [])

  const sendOrderConfirmationEmail = async (order: any) => {
    try {
      // Generate Order ID from order date to ensure consistency
      const orderId = order.date ? `FV${new Date(order.date).getTime()}` : `FV${Date.now()}`
      const message = `Dear ${order.name}, your order has been placed successfully! Order ID: ${orderId}. Total amount: Rs.${order.total}. Your fresh fruits and vegetables will be delivered within 2-3 business days. Thank you for shopping with FreshVeg!`
      
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: order.email || order.phone, // Use email if available, fallback to phone
          subject: `Order Confirmation - ${orderId}`,
          message: message
        })
      })

      const result = await response.json()
      
      if (result.success) {
        console.log('Email sent successfully:', result)
      } else {
        console.error('Failed to send email:', result.error)
      }
    } catch (error) {
      console.error('Error sending email:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your order is placed successfully!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your order. Your fresh fruits and vegetables will be delivered soon.
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <div className="flex items-center mb-4">
              <Package className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="font-semibold">Order Details</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium">{orderDetails?.date ? `FV${new Date(orderDetails.date).getTime()}` : 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Date:</span>
                <span className="font-medium">{orderDetails?.date ? new Date(orderDetails.date).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Delivery:</span>
                <span className="font-medium">2-3 Business Days</span>
              </div>
              {orderDetails && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{orderDetails.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone Number:</span>
                    <span className="font-medium flex items-center">
                      <Phone className="h-4 w-4 mr-1 text-green-600" />
                      {orderDetails.phone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-medium text-green-600">Rs. {orderDetails.total}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => router.push('/')}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-md transition-colors flex items-center justify-center"
            >
              <Home className="h-5 w-5 mr-2" />
              Continue Shopping
            </button>
            
            <button
              onClick={() => router.back()}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-md transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Previous Page
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
