'use client'

import { usePathname } from 'next/navigation'
import Navbar from './navbar'


interface LayoutWrapperProps {
  children: React.ReactNode
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  const hideNavbar = pathname.startsWith('/dashboard')

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main className="flex-1">{children}</main>
      
    </>
  )
}
