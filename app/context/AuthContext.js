'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount (client-side only)
    if (typeof window !== 'undefined') {
      try {
        console.log('AuthContext: Component mounted, checking localStorage...')

        // Test localStorage availability
        try {
          localStorage.setItem('test', 'test')
          localStorage.removeItem('test')
          console.log('AuthContext: localStorage is available')
        } catch (e) {
          console.error('AuthContext: localStorage is NOT available:', e)
        }

        const savedUser = localStorage.getItem('user')
        console.log('AuthContext: Raw localStorage data:', savedUser)

        if (savedUser) {
          const parsedUser = JSON.parse(savedUser)
          console.log('AuthContext: Successfully parsed user:', parsedUser)
          setUser(parsedUser)
          console.log('AuthContext: User state set successfully')
        } else {
          console.log('AuthContext: No user data found in localStorage')
        }
      } catch (error) {
        console.error('AuthContext: Critical error in user loading:', error)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user') // Clear corrupted data
        }
      }
    } else {
      console.log('AuthContext: Running on server, skipping localStorage check')
    }
    setIsLoading(false)
    console.log('AuthContext: Initial setup complete, isLoading:', false)
  }, [])

  // Handle user state changes for redirect (only on login, not on refresh)
  useEffect(() => {
    if (user) {
      // Check if user is Arpita (admin) - redirect to dashboard
      // Other users redirect to home page
      // Only redirect if we just logged in (not on page refresh)
      if (window.location.pathname === '/login' || window.location.pathname === '/signup') {
        if (user.email === 'arpita@gmail.com') {
          window.location.href = '/dashboard'
        } else {
          window.location.href = '/'
        }
      }
    }
  }, [user])

  const login = (userData) => {
    console.log('AuthContext: Login called with user data:', userData)
    setUser(userData)

    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData))
      console.log('AuthContext: User data saved to localStorage')

      // Verify it was saved
      const savedData = localStorage.getItem('user')
      console.log('AuthContext: Verification - user data in localStorage:', savedData ? 'Yes' : 'No')
    } else {
      console.log('AuthContext: Running on server, cannot save to localStorage')
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  const value = {
    user,
    login,
    logout,
    isLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
