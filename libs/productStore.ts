// Persistent product storage using file system
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

interface Product {
    id: string
    name: string
    type: string
    description: string
    price: number
    image: string
    status: string
    createdAt: string
    stock: number
    category: string
}

const PRODUCTS_FILE = join(process.cwd(), 'data', 'products.json')

// Ensure data directory exists
const dataDir = join(process.cwd(), 'data')
if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true })
}

// Load products from file or use default data
let products: Product[] = []

const loadProducts = () => {
    try {
        if (existsSync(PRODUCTS_FILE)) {
            const data = readFileSync(PRODUCTS_FILE, 'utf-8')
            products = JSON.parse(data)
        } else {
            // Default products if file doesn't exist
            products = [
                {
                    id: '1',
                    name: 'Tomato',
                    type: 'Vegetable',
                    description: 'Versatile and flavorful',
                    price: 180,
                    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5O6rX_YRZ9vlf7YXqHqMnL2zAXm85_Bcz4w&s',
                    status: 'active',
                    createdAt: '2024-01-01',
                    stock: 50,
                    category: 'Vegetables'
                },
                {
                    id: '2',
                    name: 'Apple',
                    type: 'Fruit',
                    description: 'Crisp and sweet',
                    price: 120,
                    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop',
                    status: 'active',
                    createdAt: '2024-01-02',
                    stock: 100,
                    category: 'Fruits'
                },
                {
                    id: '3',
                    name: 'Carrot',
                    type: 'Vegetable',
                    description: 'Fresh and crunchy',
                    price: 80,
                    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJuWEn6fnC2CQ2PY4hWbh6QZ1ojB7GopHRhw&s',
                    status: 'active',
                    createdAt: '2024-01-03',
                    stock: 75,
                    category: 'Vegetables'
                }
            ]
            saveProducts()
        }
    } catch (error) {
        console.error('Error loading products:', error)
        products = []
    }
}

const saveProducts = () => {
    try {
        writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8')
    } catch (error) {
        console.error('Error saving products:', error)
    }
}

// Load products on startup
loadProducts()

export const getProducts = (): Product[] => {
    return products
}

export const addProduct = (product: Omit<Product, 'id' | 'createdAt'>): Product => {
    const newProduct: Product = {
        id: Date.now().toString(),
        ...product,
        createdAt: new Date().toISOString().split('T')[0]
    }
    products.push(newProduct)
    saveProducts()
    return newProduct
}

export const updateProduct = (id: string, updatedProduct: Partial<Product>): Product | null => {
    const index = products.findIndex(p => p.id === id)
    if (index !== -1) {
        products[index] = { ...products[index], ...updatedProduct }
        saveProducts()
        return products[index]
    }
    return null
}

export const deleteProduct = (id: string): Product | null => {
    const index = products.findIndex(p => p.id === id)
    if (index !== -1) {
        const deletedProduct = products[index]
        products.splice(index, 1)
        saveProducts()
        return deletedProduct
    }
    return null
}

export const findProduct = (id: string): Product | undefined => {
    return products.find(p => p.id === id)
}
