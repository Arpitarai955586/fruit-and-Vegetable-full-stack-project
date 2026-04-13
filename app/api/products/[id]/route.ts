import { NextRequest, NextResponse } from 'next/server'

// Sample products data (in real app, this would come from database)
let products = [
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = products.find(p => p.id === id)

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

    const productIndex = products.findIndex(p => p.id === id)

    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Update product
    const updatedProduct = {
      ...products[productIndex],
      name,
      type,
      description,
      price,
      image,
      status: status || products[productIndex].status,
      category: type === 'Fruit' ? 'Fruits' : 'Vegetables'
    }

    products[productIndex] = updatedProduct

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
    const productIndex = products.findIndex(p => p.id === id)

    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const deletedProduct = products[productIndex]
    products.splice(productIndex, 1)

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
