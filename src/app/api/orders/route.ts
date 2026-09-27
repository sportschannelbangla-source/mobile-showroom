import { NextRequest, NextResponse } from 'next/server';
import { getAllOrders, createOrder } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const orders = getAllOrders();
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.customerName || !body.customerPhone || !body.deliveryMethod || !body.items || !body.items.length) {
      return NextResponse.json(
        { error: 'Missing required order fields: name, phone, delivery method, and items' },
        { status: 400 }
      );
    }

    const order = createOrder({
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail || '',
      deliveryMethod: body.deliveryMethod,
      deliveryAddress: body.deliveryAddress,
      pickupDetails: body.pickupDetails,
      items: body.items,
      mrpTotal: Number(body.mrpTotal || body.totalAmount),
      subtotal: Number(body.subtotal || body.totalAmount),
      festivalDiscountAmount: Number(body.festivalDiscountAmount || 0),
      deliveryFee: Number(body.deliveryFee || 0),
      totalAmount: Number(body.totalAmount),
      paymentMethod: body.paymentMethod || 'cod',
      paymentStatus: 'pending',
      status: 'new',
      notes: body.notes || '',
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
