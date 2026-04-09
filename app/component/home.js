'use client'

import { useState } from 'react'
import { ShoppingCart, Star, Filter, Search } from 'lucide-react'

export default function Home() {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedType, setSelectedType] = useState('All')
    const [cartItems, setCartItems] = useState([])

    const products = [
        {
            id: '1',
            name: 'Tomato',
            type: 'Vegetable',
            description: 'Versatile and flavorful',
            price: 180,
            rating: 4.5,
            inStock: true,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5O6rX_YRZ9vlf7YXqHqMnL2zAXm85_Bcz4w&s'
        },
        {
            id: '2',
            name: 'Apple',
            type: 'Fruit',
            description: 'Crisp and sweet',
            price: 120,
            rating: 4.8,
            inStock: true,
            image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop'
        },
        {
            id: '3',
            name: 'Carrot',
            type: 'Vegetable',
            description: 'Fresh and crunchy',
            price: 80,
            rating: 4.3,
            inStock: true,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJuWEn6fnC2CQ2PY4hWbh6QZ1ojB7GopHRhw&s'
        },
        {
            id: '4',
            name: 'Banana',
            type: 'Fruit',
            description: 'Rich and creamy',
            price: 60,
            rating: 4.6,
            inStock: true,
            image: 'https://img.freepik.com/free-vector/vector-ripe-yellow-banana-bunch-isolated-white-background_1284-45456.jpg?semt=ais_hybrid&w=740&q=80'
        },
        {
            id: '5',
            name: 'Potato',
            type: 'Vegetable',
            description: 'Starchy and versatile',
            price: 50,
            rating: 4.2,
            inStock: true,
            image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG90YXRvfGVufDB8fDB8fHww'
        },
        {
            id: '6',
            name: 'Orange',
            type: 'Fruit',
            description: 'Juicy and citrusy',
            price: 100,
            rating: 4.7,
            inStock: true,
            image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=300&h=300&fit=crop'
        },
        {
            id: '7',
            name: 'Onion',
            type: 'Vegetable',
            description: 'Essential flavor base',
            price: 70,
            rating: 4.1,
            inStock: true,
            image: 'https://5.imimg.com/data5/SELLER/Default/2024/5/419610158/MO/LQ/OO/160347834/white-onion.jpg'
        },
        {
            id: '8',
            name: 'Mango',
            type: 'Fruit',
            description: 'Tropical and sweet',
            price: 250,
            rating: 4.9,
            inStock: false,
            image: 'https://5.imimg.com/data5/SELLER/Default/2023/9/344928632/OW/RQ/XC/25352890/yellow-mango-500x500.jpeg'
        },
        {
            id: '9',
            name: 'Spinach',
            type: 'Vegetable',
            description: 'Nutritious green leaves',
            price: 90,
            rating: 4.4,
            inStock: true,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpB46AMLDmG0ZCMr1J-v3BlVHgRmuLHTE7pA&s'
        }
    ]

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesType = selectedType === 'All' || product.type === selectedType
        return matchesSearch && matchesType
    })

    const handleAddToCart = (productId) => {
        setCartItems(prev => [...prev, productId])
        console.log('Added to cart:', productId)
    }

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                size={16}
                className={i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
            />
        ))
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Fresh Products</h1>
                    <p className="text-lg text-gray-600">Choose from our selection of fresh fruits and vegetables</p>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        {/* Filter */}
                        <div className="flex items-center gap-2">
                            <Filter size={20} className="text-gray-600" />
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="All">All Products</option>
                                <option value="Fruit">Fruits</option>
                                <option value="Vegetable">Vegetables</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            {/* Product Image */}
                            <div className="relative h-48 bg-gray-100">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${product.type === 'Fruit'
                                        ? 'bg-orange-100 text-orange-800'
                                        : 'bg-green-100 text-green-800'
                                        }`}>
                                        {product.type}
                                    </span>
                                </div>
                                {!product.inStock && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                        <span className="text-white font-semibold">Out of Stock</span>
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>
                                <p className="text-sm text-gray-600 mb-2">{product.description}</p>

                                {/* Rating */}
                                <div className="flex items-center gap-1 mb-2">
                                    {renderStars(product.rating)}
                                    <span className="text-sm text-gray-600">({product.rating})</span>
                                </div>

                                {/* Price and Add to Cart */}
                                <div className="flex items-center justify-between">
                                    <div className="text-xl font-bold text-green-600">
                                        Rs. {product.price}
                                    </div>
                                    <button
                                        onClick={() => handleAddToCart(product.id)}
                                        disabled={!product.inStock}
                                        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${product.inStock
                                            ? 'bg-green-600 text-white hover:bg-green-700'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                    >
                                        <ShoppingCart size={16} />
                                        {product.inStock ? 'Add' : 'Unavailable'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* No Results */}
                {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg">No products found matching your criteria.</div>
                    </div>
                )}
            </div>
        </div>
    )
}
