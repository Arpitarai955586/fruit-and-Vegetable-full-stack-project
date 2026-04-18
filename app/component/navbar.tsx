'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, User, LogOut, Menu, X, Apple, Carrot } from 'lucide-react'
import LoginModal from './LoginModal'
import SignupModal from './SignupModal'
import { useAuth } from '../context/AuthContext'

interface UserData {
  id: string
  name: string
  email: string
}

interface NavLink {
  name: string
  href: string
}

export default function Navbar() {
  const { user, login, logout } = useAuth()
  const router = useRouter()
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [cartItems, setCartItems] = useState(0)
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Load cart items from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const savedCart = localStorage.getItem('cartItems')
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart)
          const totalItems = parsedCart.reduce((total: number, item: any) => total + item.quantity, 0)
          setCartItems(totalItems)
        } catch (error) {
          console.error('Error loading cart from localStorage:', error)
        }
      }
    }

    updateCartCount()
    // Listen for cart updates
    const interval = setInterval(updateCartCount, 1000)
    return () => clearInterval(interval)
  }, [])

  const getCartItems = () => {
    try {
      return JSON.parse(localStorage.getItem('cartItems') || '[]')
    } catch {
      return []
    }
  }

  const getCartTotal = () => {
    const items = getCartItems()
    return items.reduce((total: number, item: any) => total + (item.price * item.quantity), 0)
  }

  const handleLogin = (userData: UserData) => {
    console.log('Navbar handleLogin called with user data:', userData)
    login(userData)
    setIsLoginOpen(false)
    // Check if user is admin (arpita@gmail.com), redirect accordingly
    if (userData.email === 'arpita@gmail.com') {
      console.log('Admin user detected in navbar, redirecting to dashboard')
      window.location.href = '/dashboard'
    } else {
      console.log('Regular user detected in navbar, redirecting to home')
      window.location.href = '/'
    }
  }

  const handleLogout = () => {
    logout()
    // Clear user session
    localStorage.removeItem('user')
    // Redirect to home page
    window.location.href = '/'
  }

  const handleSignup = (userData: UserData) => {
    setIsSignupOpen(false)
    setIsLoginOpen(true)
    console.log('User signed up:', userData)
  }

  const navLinks: NavLink[] = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
  
    { name: 'Fruits', href: '/fruits' },
    { name: 'Vegetables', href: '/vegetables' },
    { name: 'Orders', href: '/orders' },
  ]

  return (
    <>
      <nav className="bg-green-600 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  <Apple className="h-8 w-8 text-red-400" />
                  <Carrot className="h-8 w-8 text-orange-400" />
                </div>
                <span className="text-white font-bold text-xl">FreshVeg</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-white hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Right side buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Cart */}
              <div className="relative">
                {/* <button 
                  onClick={() => setIsCartOpen(!isCartOpen)}
                  className="text-white hover:bg-green-700 p-2 rounded-full transition-colors"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {cartItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItems}
                    </span>
                  )}
                </button> */}

                {/* Cart Dropdown */}
                {isCartOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50">
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Shopping Cart</h3>
                      
                      {getCartItems().length === 0 ? (
                        <p className="text-gray-500 text-center py-4">Your cart is empty</p>
                      ) : (
                        <>
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {getCartItems().map((item: any, index: number) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div className="flex items-center">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-10 h-10 object-cover rounded mr-3"
                                  />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                                  </div>
                                </div>
                                <p className="text-sm font-medium text-gray-900">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                              </div>
                            ))}
                          </div>
                          
                          <div className="border-t mt-3 pt-3">
                            <div className="flex justify-between items-center mb-3">
                              <span className="font-semibold text-gray-900">Total:</span>
                              <span className="font-bold text-green-600">Rs. {getCartTotal().toFixed(2)}</span>
                            </div>
                            
                            <button
                              onClick={() => {
                                router.push('/checkout')
                                setIsCartOpen(false)
                              }}
                              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                            >
                              Proceed to Checkout
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Auth buttons */}
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-white text-sm">Welcome, {user?.name || 'User'}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="bg-white text-green-600 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setIsSignupOpen(true)}
                    className="bg-yellow-400 text-green-800 hover:bg-yellow-300 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:bg-green-700 p-2 rounded-md"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-white hover:bg-green-700 block px-3 py-2 rounded-md text-base font-medium"
                  >
                    {link.name}
                  </a>
                ))}

                {/* Mobile Auth Section */}
                <div className="border-t border-green-700 pt-4 mt-4">
                  {user ? (
                    <div className="space-y-2">
                      <span className="text-white text-sm block px-3">Welcome, {user?.name}</span>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={() => setIsLoginOpen(true)}
                        className="w-full bg-white text-green-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => setIsSignupOpen(true)}
                        className="w-full bg-yellow-400 text-green-800 hover:bg-yellow-300 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Sign Up
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
      />

      {/* Signup Modal */}
      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onSignup={handleSignup}
      />
    </>
  )
}