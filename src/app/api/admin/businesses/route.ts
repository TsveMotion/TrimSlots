import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';

// GET all businesses (admin only)
export async function GET() {
  try {
    // Get the session
    const session = await getServerSession(authOptions);
    
    // Check if the user is authenticated and is an admin
    if (!session || !session.user || session.user.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }
    
    // Fetch all businesses with their owners
    const businesses = await prisma.business.findMany({
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });
    
    return NextResponse.json(businesses);
  } catch (error) {
    console.error('API: /api/admin/businesses - Error fetching businesses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch businesses data' },
      { status: 500 }
    );
  }
}

// POST to create a new business (admin only)
export async function POST(request: Request) {
  try {
    // Get the session
    const session = await getServerSession(authOptions);
    
    // Check if the user is authenticated and is an admin
    if (!session || !session.user || session.user.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }
    
    // Parse the request body
    const body = await request.json();
    const { name, description, ownerId } = body;
    
    if (!name) {
      return NextResponse.json({ error: 'Business name is required' }, { status: 400 });
    }
    
    // Create the business
    const business = await prisma.business.create({
      data: {
        name,
        description: description || '',
        ...(ownerId && {
          owner: {
            connect: { id: ownerId }
          }
        })
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });
    
    return NextResponse.json(business, { status: 201 });
  } catch (error) {
    console.error('API: /api/admin/businesses - Error creating business:', error);
    return NextResponse.json(
      { error: 'Failed to create business' },
      { status: 500 }
    );
  }
}
