import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const DATA_FILE = join(process.cwd(), 'data', 'products.json')

// Helper functions
function readProducts() {
  try {
    const data = readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading products:', error)
    return []
  }
}

function writeProducts(products: any[]) {
  try {
    writeFileSync(DATA_FILE, JSON.stringify(products, null, 2))
  } catch (error) {
    console.error('Error writing products:', error)
  }
}

function findProduct(id: string) {
  const products = readProducts()
  return products.find((p: any) => p.id === id)
}

function updateProduct(id: string, updates: any) {
  const products = readProducts()
  const index = products.findIndex((p: any) => p.id === id)
  if (index !== -1) {
    products[index] = { ...products[index], ...updates }
    writeProducts(products)
    return products[index]
  }
  return null
}

function deleteProduct(id: string) {
  const products = readProducts()
  const filteredProducts = products.filter((p: any) => p.id !== id)
  writeProducts(filteredProducts)
  return true
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = findProduct(id)

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: product
    })
  } catch (error) {
    console.error('Get product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, type, description, price, image, status } = body

    // Validate input
    if (!name || !type || !description || !price || !image) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (typeof price !== 'number' || price <= 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      )
    }

    // Update product using persistent storage
    const updatedProduct = updateProduct(id, {
      name,
      type,
      description,
      price,
      image,
      status,
      category: type === 'Fruit' ? 'Fruits' : 'Vegetables'
    })

    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    })
  } catch (error) {
    console.error('Update product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Delete product using persistent storage
    const deletedProduct = deleteProduct(id)

    if (!deletedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
      data: deletedProduct
    })
  } catch (error) {
    console.error('Delete product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
