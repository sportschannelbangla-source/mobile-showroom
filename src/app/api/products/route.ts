import { NextRequest, NextResponse } from 'next/server';
import { filterProducts, createProduct } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') || undefined;
    const brand = searchParams.get('brand') || undefined;
    const query = searchParams.get('q') || searchParams.get('query') || undefined;
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const stock = searchParams.get('stock') || undefined;
    const sortBy = searchParams.get('sortBy') || undefined;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined;
    const offset = searchParams.get('offset') ? Number(searchParams.get('offset')) : undefined;

    const result = filterProducts({
      category,
      brand,
      query,
      minPrice,
      maxPrice,
      stock,
      sortBy,
      limit,
      offset,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.brand || !body.category || !body.price) {
      return NextResponse.json(
        { error: 'Name, brand, category, and price are required fields' },
        { status: 400 }
      );
    }

    const created = createProduct({
      name: body.name,
      brand: body.brand,
      category: body.category,
      subcategory: body.subcategory || 'General',
      model: body.model || body.name,
      price: Number(body.price),
      mrp: Number(body.mrp || body.price),
      discount: body.mrp && body.mrp > body.price ? Math.round(((body.mrp - body.price) / body.mrp) * 100) : 0,
      images: body.images && body.images.length ? body.images : [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80'
      ],
      festivalOffer: body.festivalOffer ?? true,
      festivalDiscount: body.festivalDiscount ?? 20,
      shortDescription: body.shortDescription || '',
      description: body.description || '',
      specifications: body.specifications || {},
      rating: Number(body.rating || 4.5),
      reviewCount: Number(body.reviewCount || 10),
      stock: body.stock || 'in_stock',
      stockQuantity: Number(body.stockQuantity || 10),
      warranty: body.warranty || '1 Year Manufacturer Warranty',
      isFeatured: Boolean(body.isFeatured),
      isBestseller: Boolean(body.isBestseller),
      isNew: Boolean(body.isNew),
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
