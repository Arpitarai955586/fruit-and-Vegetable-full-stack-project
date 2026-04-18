'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CreditCard, Smartphone, DollarSign, MapPin, User, Phone, Mail, Truck } from 'lucide-react'

interface AddressFormData {
  name: string
  phone: string
  email: string
  street: string
  city: string
  state: string
  pincode: string
}

const delivery = 40

export default function CheckoutPage() {
  const router = useRouter()
  const [selectedPayment, setSelectedPayment] = useState<'cash' | 'online' | 'upi'>('cash')
  const [isProcessing, setIsProcessing] = useState(false)

  const [address, setAddress] = useState<AddressFormData>({
    name: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAddress(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Save order details to localStorage
    const orderData = {
      id: `FV${Date.now()}`,
      phone: address.phone,
      email: address.email,
      name: address.name,
      total: total.toFixed(2), // Ensure total is properly formatted
      date: new Date().toISOString(),
      status: 'processing',
      items: cartItems
    }

    localStorage.setItem('lastOrder', JSON.stringify(orderData))

    // Save to order history
    const existingOrders = JSON.parse(localStorage.getItem('orderHistory') || '[]')
    existingOrders.push(orderData)
    localStorage.setItem('orderHistory', JSON.stringify(existingOrders))

    // Simulate order processing
    setTimeout(() => {
      setIsProcessing(false)
      // Clear cart and redirect to success page
      localStorage.removeItem('cartItems')
      router.push('/order-success')
    }, 2000)
  }

  const isAddressValid = () => {
    return Object.values(address).every(value => value.trim() !== '')
  }

  // Client-side localStorage access
  const [cartItems, setCartItems] = useState<any[]>([])
  const [subtotal, setSubtotal] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    // Only access localStorage on client side
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cartItems')
      const items = savedCart ? JSON.parse(savedCart) : []
      console.log('Cart items structure:', items)
      
      const calculatedSubtotal = items.reduce((total: number, item: any) => {
        // Handle both possible cart item structures
        console.log('Processing item:', item)
        const price = item.price || (item.product?.price) || 0
        const quantity = item.quantity || 1
        console.log('Price:', price, 'Quantity:', quantity, 'Subtotal item:', price * quantity)
        return total + (price * quantity)
      }, 0)
      
      const delivery = 40
      const calculatedTotal = calculatedSubtotal + delivery
      
      setCartItems(items)
      setSubtotal(calculatedSubtotal)
      setTotal(calculatedTotal)
      console.log('Final total:', calculatedTotal)
    }
  }, []) 

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ">
        {/* Header */}
        <div className="flex items-center mb-8 ">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" >
          {/* Delivery Address */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <MapPin className="h-6 w-6 text-green-600 mr-3" />
              <h2 className="text-xl font-semibold">Delivery Address</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-1" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={address.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="h-4 w-4 inline mr-1" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={address.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={address.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={address.street}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="123 Main Street, Apt 4B"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Delhi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={address.state}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Delhi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code</label>
                  <input
                    type="text"
                    name="pincode"
                    value={address.pincode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="110001"
                  />
                </div>
              </div>

              {/* Payment Options */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                <div className="space-y-3">
                  <div
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPayment === 'cash' ? 'border-green-500 bg-green-50' : 'border-gray-300'
                    }`}
                    onClick={() => setSelectedPayment('cash')}
                  >
                    <DollarSign className="h-5 w-5 text-green-600 mr-3" />
                    <div className="flex-1">
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-sm text-gray-600">Pay when you receive</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 ${
                      selectedPayment === 'cash' ? 'border-green-500' : 'border-gray-300'
                    }`}>
                      {selectedPayment === 'cash' && <div className="w-3 h-3 bg-green-500 rounded-full m-0.5"></div>}
                    </div>
                  </div>

                  <div
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPayment === 'online' ? 'border-green-500 bg-green-50' : 'border-gray-300'
                    }`}
                    onClick={() => setSelectedPayment('online')}
                  >
                    <CreditCard className="h-5 w-5 text-blue-600 mr-3" />
                    <div className="flex-1">
                      <p className="font-medium">Online Payment</p>
                      <p className="text-sm text-gray-600">Credit/Debit Card, Net Banking</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 ${
                      selectedPayment === 'online' ? 'border-green-500' : 'border-gray-300'
                    }`}>
                      {selectedPayment === 'online' && <div className="w-3 h-3 bg-green-500 rounded-full m-0.5"></div>}
                    </div>
                  </div>

                  <div
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPayment === 'upi' ? 'border-green-500 bg-green-50' : 'border-gray-300'
                    }`}
                    onClick={() => setSelectedPayment('upi')}
                  >
                    <Smartphone className="h-5 w-5 text-purple-600 mr-3" />
                    <div className="flex-1">
                      <p className="font-medium">UPI Payment</p>
                      <p className="text-sm text-gray-600">Paytm, Google Pay, PhonePe</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 ${
                      selectedPayment === 'upi' ? 'border-green-500' : 'border-gray-300'
                    }`}>
                      {selectedPayment === 'upi' && <div className="w-3 h-3 bg-green-500 rounded-full m-0.5"></div>}
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!isAddressValid() || isProcessing}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing Order...
                  </>
                ) : (
                  `Place Order - ${total.toFixed(2)}`
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            
            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cartItems.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md mr-4"
                        />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>Rs. {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span>Rs. {delivery.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span className="text-green-600">Rs. {total.toFixed(2)}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
