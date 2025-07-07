import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';

// GET a specific business by ID (admin only)
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get the session
    const session = await getServerSession(authOptions);
    
    // Check if the user is authenticated and is an admin
    if (!session || !session.user || session.user.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }
    
    const businessId = params.id;
    
    // Fetch the business with its owner and workers
    const business = await prisma.business.findUnique({
      where: {
        id: businessId
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
    
    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }
    
    return NextResponse.json(business);
  } catch (error) {
    console.error('API: /api/admin/businesses/[id] - Error fetching business:', error);
    return NextResponse.json(
      { error: 'Failed to fetch business data' },
      { status: 500 }
    );
  }
}

// DELETE a business by ID (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get the session
    const session = await getServerSession(authOptions);
    
    // Check if the user is authenticated and is an admin
    if (!session || !session.user || session.user.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }
    
    const businessId = params.id;
    
    // Check if the business exists
    const business = await prisma.business.findUnique({
      where: {
        id: businessId
      }
    });
    
    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }
    
    // Delete the business
    await prisma.business.delete({
      where: {
        id: businessId
      }
    });
    
    return NextResponse.json({ success: true, message: 'Business deleted successfully' });
  } catch (error) {
    console.error('API: /api/admin/businesses/[id] - Error deleting business:', error);
    return NextResponse.json(
      { error: 'Failed to delete business' },
      { status: 500 }
    );
  }
}

// PATCH to update a business by ID (admin only)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get the session
    const session = await getServerSession(authOptions);
    
    // Check if the user is authenticated and is an admin
    if (!session || !session.user || session.user.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }
    
    const businessId = params.id;
    const body = await request.json();
    const { name, description, ownerId } = body;
    
    // Check if the business exists
    const business = await prisma.business.findUnique({
      where: {
        id: businessId
      }
    });
    
    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }
    
    // Update the business
    const updatedBusiness = await prisma.business.update({
      where: {
        id: businessId
      },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
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
    
    return NextResponse.json(updatedBusiness);
  } catch (error) {
    console.error('API: /api/admin/businesses/[id] - Error updating business:', error);
    return NextResponse.json(
      { error: 'Failed to update business' },
      { status: 500 }
    );
  }
}
