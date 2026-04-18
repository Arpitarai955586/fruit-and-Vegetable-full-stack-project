'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Star, Filter, Search, X, Plus, Minus } from 'lucide-react'

interface Product {
    id: string
    name: string
    type: string
    description: string
    price: number
    rating: number
    inStock: boolean
    image: string
}

interface CartItem {
    product: Product
    quantity: number
}

type ProductType = 'All' | 'Fruit' | 'Vegetable'

export default function Home() {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [selectedType, setSelectedType] = useState<ProductType>('All')
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [isCartOpen, setIsCartOpen] = useState<boolean>(false)
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        fetchProducts()
        // Load cart from localStorage
        const savedCart = localStorage.getItem('cartItems')
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart)
                setCartItems(parsedCart)
            } catch (error) {
                console.error('Error loading cart from localStorage:', error)
            }
        }
    }, [])

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products')
            const response = await res.json()
            
            if (res.ok && response.success) {
                const transformedProducts = response.data.map((product: {
                    id: string;
                    name: string;
                    type: string;
                    description?: string;
                    price: number;
                    status: string;
                    image?: string;
                }) => ({
                    id: product.id,
                    name: product.name,
                    type: product.type,
                    description: product.description || 'Fresh ' + product.name,
                    price: product.price,
                    rating: 4.5,
                    inStock: product.status === 'active',
                    image: product.image || 'https://images.unsplash.com/photo-1592924357228-91a80da257fb?w=300&h=300&fit=crop'
                }))
                setProducts(transformedProducts)
            } else {
                console.error('Failed to fetch products:', response.error)
            }
        } catch (error) {
            console.error('Error fetching products:', error)
        }
    }

    const filteredProducts = products.filter((product: Product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesType = selectedType === 'All' || product.type === selectedType
        return matchesSearch && matchesType
    })

    const handleTypeChange = (type: ProductType) => {
        setSelectedType(type)
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    const handleAddToCart = (product: Product) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.product.id === product.id)
            let newItems
            if (existingItem) {
                newItems = prevItems.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            } else {
                newItems = [...prevItems, { product, quantity: 1 }]
            }
            // Save to localStorage
            localStorage.setItem('cartItems', JSON.stringify(newItems))
            return newItems
        })
    }

    const handleRemoveFromCart = (productId: string) => {
        setCartItems(prevItems => {
            const newItems = prevItems.filter(item => item.product.id !== productId)
            // Save to localStorage
            localStorage.setItem('cartItems', JSON.stringify(newItems))
            return newItems
        })
    }

    const handleUpdateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            handleRemoveFromCart(productId)
        } else {
            setCartItems(prevItems => {
                const newItems = prevItems.map(item =>
                    item.product.id === productId
                        ? { ...item, quantity }
                        : item
                )
                // Save to localStorage
                localStorage.setItem('cartItems', JSON.stringify(newItems))
                return newItems
            })
        }
    }

    const isInCart = (productId: string) => cartItems.some(item => item.product.id === productId)
    
    const getCartItemQuantity = (productId: string) => {
        const item = cartItems.find(item => item.product.id === productId)
        return item ? item.quantity : 0
    }

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0)
    }

    const getCartItemsCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-green-600">FreshVeg</h1>
                            <p className="ml-4 text-gray-600">Fresh Fruits & Vegetables</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>
                            <div className="relative">
                                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500">
                                    <Filter className="h-4 w-4" />
                                    <span>{selectedType}</span>
                                </button>
                                <select
                                    value={selectedType}
                                    onChange={(e) => handleTypeChange(e.target.value as ProductType)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                >
                                    <option value="All">All</option>
                                    <option value="Fruit">Fruit</option>
                                    <option value="Vegetable">Vegetable</option>
                                </select>
                            </div>
                            <button 
                                    onClick={() => setIsCartOpen(true)}
                                    className="relative p-2 text-gray-600 hover:text-gray-900"
                                >
                                    <ShoppingCart className="h-6 w-6" />
                                    {getCartItemsCount() > 0 && (
                                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                        {getCartItemsCount()}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Fresh Products</h2>
                    <p className="text-lg text-gray-600">Quality fruits and vegetables at your doorstep</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => {
                        const typeClass = product.type === 'Fruit' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                        const buttonClass = !product.inStock || isInCart(product.id) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'
                        const buttonText = isInCart(product.id) ? 'In Cart' : product.inStock ? 'Add to Cart' : 'Out of Stock'
                        
                        return (
                            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                <div className="relative">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="absolute top-2 right-2">
                                        <span className={'px-2 py-1 text-xs font-semibold rounded-full ' + typeClass}>
                                            {product.type}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                                    <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                                    <div className="flex items-center mb-3">
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={'h-4 w-4 ' + (i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300')}
                                                />
                                            ))}
                                        </div>
                                        <span className="ml-2 text-sm text-gray-600">{product.rating}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-2xl font-bold text-green-600">Rs.{product.price}</span>
                                            <span className="text-sm text-gray-500">/unit</span>
                                        </div>
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            disabled={!product.inStock || isInCart(product.id)}
                                            className={'px-4 py-2 rounded-lg font-medium transition-colors ' + buttonClass}
                                        >
                                            {buttonText}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                    </div>
                )}
            </main>

            {/* Cart Modal */}
            {isCartOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                                <div className="bg-green-100 p-2 rounded-full">
                                    <ShoppingCart className="h-6 w-6 text-green-600" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
                                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                                    {getCartItemsCount()} items
                                </span>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>
                        
                        {/* Cart Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {cartItems.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <ShoppingCart className="h-12 w-12 text-gray-300" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                                    <p className="text-gray-500 mb-6">Add some delicious fruits and vegetables to get started!</p>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {cartItems.map((item) => (
                                        <div key={item.product.id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                                            <div className="flex items-center space-x-4">
                                                <img
                                                    src={item.product.image}
                                                    alt={item.product.name}
                                                    className="w-20 h-20 object-cover rounded-lg shadow-sm"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900 text-lg">{item.product.name}</h3>
                                                    <p className="text-sm text-gray-500 mb-2">{item.product.description}</p>
                                                    <div className="flex items-center space-x-4">
                                                        <span className="text-lg font-bold text-green-600">Rs.{item.product.price}</span>
                                                        <span className="text-sm text-gray-500">per unit</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end space-y-3">
                                                    <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm">
                                                        <button
                                                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                                                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                        >
                                                            <Minus className="h-4 w-4 text-gray-600" />
                                                        </button>
                                                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                                        <button
                                                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                                                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                        >
                                                            <Plus className="h-4 w-4 text-gray-600" />
                                                        </button>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-lg text-gray-900">Rs.{item.product.price * item.quantity}</p>
                                                        <button
                                                            onClick={() => handleRemoveFromCart(item.product.id)}
                                                            className="text-sm text-red-500 hover:text-red-700 transition-colors"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* Footer */}
                        {cartItems.length > 0 && (
                            <div className="border-t border-gray-100 p-6 bg-gray-50 rounded-b-2xl">
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium">Rs.{getCartTotal()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Delivery</span>
                                        <span className="font-medium text-green-600">FREE</span>
                                    </div>
                                    <div className="border-t pt-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-semibold text-gray-900">Total</span>
                                            <span className="text-2xl font-bold text-green-600">Rs.{getCartTotal()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Continue Shopping
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsCartOpen(false)
                                            router.push('/checkout')
                                        }}
                                        className="bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                                    >
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
