'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    try {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser)
        console.log('Loading user from localStorage:', parsedUser)
        setUser(parsedUser)
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error)
      localStorage.removeItem('user') // Clear corrupted data
    }
    setIsLoading(false)
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
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
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
