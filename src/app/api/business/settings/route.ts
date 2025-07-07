import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';

// GET /api/business/settings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    if (session.user.role !== Role.BUSINESS_OWNER && session.user.role !== Role.ADMIN) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    
    // Get business ID from the session user
    const userId = session.user.id;
    
    // Find business settings for this user
    const businessSettings = await prisma.businessSettings.findFirst({
      where: {
        userId: userId,
      },
    });
    
    if (!businessSettings) {
      // Return empty settings if none exist yet
      return NextResponse.json({
        id: '',
        name: '',
        address: '',
        phone: '',
        email: '',
        description: '',
        openingHours: '',
      });
    }
    
    return NextResponse.json(businessSettings);
  } catch (error) {
    console.error('Error fetching business settings:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/business/settings
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    if (session.user.role !== Role.BUSINESS_OWNER && session.user.role !== Role.ADMIN) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    
    const userId = session.user.id;
    const data = await request.json();
    
    // Validate required fields
    if (!data.name) {
      return NextResponse.json(
        { message: 'Business name is required' },
        { status: 400 }
      );
    }
    
    // Create new business settings
    const businessSettings = await prisma.businessSettings.create({
      data: {
        userId: userId,
        name: data.name,
        address: data.address || null,
        phone: data.phone || null,
        email: data.email || null,
        description: data.description || null,
        openingHours: data.openingHours || null,
      },
    });
    
    return NextResponse.json(businessSettings, { status: 201 });
  } catch (error) {
    console.error('Error creating business settings:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/business/settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    if (session.user.role !== Role.BUSINESS_OWNER && session.user.role !== Role.ADMIN) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    
    const userId = session.user.id;
    const data = await request.json();
    
    // Validate required fields
    if (!data.name) {
      return NextResponse.json(
        { message: 'Business name is required' },
        { status: 400 }
      );
    }
    
    // Find existing business settings
    const existingSettings = await prisma.businessSettings.findFirst({
      where: {
        userId: userId,
      },
    });
    
    if (!existingSettings) {
      // Create new settings if none exist
      const businessSettings = await prisma.businessSettings.create({
        data: {
          userId: userId,
          name: data.name,
          address: data.address || null,
          phone: data.phone || null,
          email: data.email || null,
          description: data.description || null,
          openingHours: data.openingHours || null,
        },
      });
      
      return NextResponse.json(businessSettings);
    }
    
    // Update existing settings
    const updatedSettings = await prisma.businessSettings.update({
      where: {
        id: existingSettings.id,
      },
      data: {
        name: data.name,
        address: data.address || null,
        phone: data.phone || null,
        email: data.email || null,
        description: data.description || null,
        openingHours: data.openingHours || null,
      },
    });
    
    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error('Error updating business settings:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
