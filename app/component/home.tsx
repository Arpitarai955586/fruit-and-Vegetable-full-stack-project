'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, Star, Filter, Search } from 'lucide-react'

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

type ProductType = 'All' | 'Fruit' | 'Vegetable'

export default function Home() {
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [selectedType, setSelectedType] = useState<ProductType>('All')
    const [cartItems, setCartItems] = useState<string[]>([])
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products')
            const response = await res.json()
            
            if (res.ok && response.success) {
                const transformedProducts = response.data.map((product: any) => ({
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

    const handleAddToCart = (productId: string) => {
        if (!cartItems.includes(productId)) {
            setCartItems([...cartItems, productId])
        }
    }

    const handleRemoveFromCart = (productId: string) => {
        setCartItems(cartItems.filter(id => id !== productId))
    }

    const isInCart = (productId: string) => cartItems.includes(productId)

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
                            <button className="relative p-2 text-gray-600 hover:text-gray-900">
                                <ShoppingCart className="h-6 w-6" />
                                {cartItems.length > 0 && (
                                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                        {cartItems.length}
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
                                            onClick={() => handleAddToCart(product.id)}
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
        </div>
    )
}
