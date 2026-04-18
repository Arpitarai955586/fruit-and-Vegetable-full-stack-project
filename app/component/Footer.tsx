'use client'

import { Apple, Carrot, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-green-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex">
                <Apple className="h-6 w-6 text-red-400" />
                <Carrot className="h-6 w-6 text-orange-400" />
              </div>
              <span className="text-xl font-bold">FreshVeg</span>
            </div>
            <p className="text-green-200 text-sm">
              Your trusted source for fresh fruits and vegetables delivered to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-green-200 hover:text-white transition-colors text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="/products" className="text-green-200 hover:text-white transition-colors text-sm">
                  Products
                </a>
              </li>
              <li>
                <a href="/fruits" className="text-green-200 hover:text-white transition-colors text-sm">
                  Fruits
                </a>
              </li>
              <li>
                <a href="/vegetables" className="text-green-200 hover:text-white transition-colors text-sm">
                  Vegetables
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-green-200" />
                <span className="text-green-200 text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-green-200" />
                <span className="text-green-200 text-sm">support@freshveg.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-green-200" />
                <span className="text-green-200 text-sm">Delhi, India</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-green-200 text-sm mb-4">
              Subscribe to get updates on fresh produce and special offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 ">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 rounded-l-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-r-md text-white font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-green-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-green-200 text-sm">
              © 2024 FreshVeg. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-green-200 hover:text-white transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-green-200 hover:text-white transition-colors text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-green-200 hover:text-white transition-colors text-sm">
                Refund Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
