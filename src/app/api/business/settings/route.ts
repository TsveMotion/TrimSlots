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
    
    // Find business for this user first (check both owned and managed businesses)
    let business = await prisma.business.findUnique({
      where: {
        ownerId: userId,
      },
    });
    
    // If not found as owner, check if user has a managed business
    if (!business) {
      console.log('API: /api/business/settings - Business not found for owner, checking managed business');
      const userWithManagedBusiness = await prisma.user.findUnique({
        where: { id: userId },
        include: { managedBusiness: true },
      });
      
      if (userWithManagedBusiness?.managedBusiness) {
        console.log('API: /api/business/settings - Found managed business');
        business = userWithManagedBusiness.managedBusiness;
      }
    }
    
    if (!business) {
      console.log('API: /api/business/settings - No business found for user');
      return NextResponse.json({ message: 'Business not found' }, { status: 404 });
    }
    
    console.log('API: /api/business/settings - Found business:', business.id);
    
    // Find business settings using businessId
    const businessSettings = await prisma.businessSettings.findFirst({
      where: {
        businessId: business.id,
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
    
    // Find business for this user first (check both owned and managed businesses)
    let business = await prisma.business.findUnique({
      where: {
        ownerId: userId,
      },
    });
    
    // If not found as owner, check if user has a managed business
    if (!business) {
      console.log('API: /api/business/settings POST - Business not found for owner, checking managed business');
      const userWithManagedBusiness = await prisma.user.findUnique({
        where: { id: userId },
        include: { managedBusiness: true },
      });
      
      if (userWithManagedBusiness?.managedBusiness) {
        console.log('API: /api/business/settings POST - Found managed business');
        business = userWithManagedBusiness.managedBusiness;
      }
    }
    
    if (!business) {
      console.log('API: /api/business/settings POST - No business found for user');
      return NextResponse.json({ message: 'Business not found' }, { status: 404 });
    }
    
    console.log('API: /api/business/settings POST - Found business:', business.id);
    
    // First, update the business record with basic information
    await prisma.business.update({
      where: {
        id: business.id,
      },
      data: {
        name: data.name,
        address: data.address || null,
        phone: data.phone || null,
        email: data.email || null,
        description: data.description || null,
      },
    });

    // Now create or update business settings using upsert
    const businessSettings = await prisma.businessSettings.upsert({
      where: {
        businessId: business.id,
      },
      create: {
        businessId: business.id,
        // Stripe integration
        stripeConnectId: data.stripeConnectId || null,
        payoutsEnabled: data.payoutsEnabled || false,
        // Profile customization fields
        profileBgColor: data.profileBgColor || null,
        profileTextColor: data.profileTextColor || null,
        profileAccentColor: data.profileAccentColor || null,
        profileHeaderBgImage: data.profileHeaderBgImage || null,
        profileBgImage: data.profileBgImage || null,
        profileCustomCss: data.profileCustomCss || null,
        profileFontFamily: data.profileFontFamily || null,
      },
      update: {
        // Stripe integration
        stripeConnectId: data.stripeConnectId || null,
        payoutsEnabled: data.payoutsEnabled || false,
        // Profile customization fields
        profileBgColor: data.profileBgColor || null,
        profileTextColor: data.profileTextColor || null,
        profileAccentColor: data.profileAccentColor || null,
        profileHeaderBgImage: data.profileHeaderBgImage || null,
        profileBgImage: data.profileBgImage || null,
        profileCustomCss: data.profileCustomCss || null,
        profileFontFamily: data.profileFontFamily || null,
      },
    });
    
    console.log('Business settings saved successfully:', businessSettings.id);
    
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
    
    // Find business for this user first (check both owned and managed businesses)
    let business = await prisma.business.findUnique({
      where: {
        ownerId: userId,
      },
    });
    
    // If not found as owner, check if user has a managed business
    if (!business) {
      console.log('API: /api/business/settings PUT - Business not found for owner, checking managed business');
      const userWithManagedBusiness = await prisma.user.findUnique({
        where: { id: userId },
        include: { managedBusiness: true },
      });
      
      if (userWithManagedBusiness?.managedBusiness) {
        console.log('API: /api/business/settings PUT - Found managed business');
        business = userWithManagedBusiness.managedBusiness;
      }
    }
    
    if (!business) {
      console.log('API: /api/business/settings PUT - No business found for user');
      return NextResponse.json({ message: 'Business not found' }, { status: 404 });
    }
    
    console.log('API: /api/business/settings PUT - Found business:', business.id);
    
    // Find existing business settings
    const existingSettings = await prisma.businessSettings.findFirst({
      where: {
        businessId: business.id,
      },
    });
    
    if (!existingSettings) {
      // Create new settings if none exist
      const businessSettings = await prisma.businessSettings.create({
        data: {
          businessId: business.id,
          stripeConnectId: data.stripeConnectId || null,
          payoutsEnabled: data.payoutsEnabled || false,
          // Profile customization fields - using type assertion to bypass TypeScript errors
          // until Prisma client can be regenerated
          ...({
            profileBgColor: data.profileBgColor || null,
            profileTextColor: data.profileTextColor || null,
            profileAccentColor: data.profileAccentColor || null,
            profileHeaderBgImage: data.profileHeaderBgImage || null,
            profileBgImage: data.profileBgImage || null,
            profileCustomCss: data.profileCustomCss || null,
            profileFontFamily: data.profileFontFamily || null,
          } as any),
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
        stripeConnectId: data.stripeConnectId || existingSettings.stripeConnectId,
        payoutsEnabled: data.payoutsEnabled !== undefined ? data.payoutsEnabled : existingSettings.payoutsEnabled,
        // Profile customization fields - only including fields that exist in the database
        // Removed profileTheme as it doesn't exist in the database yet
        ...({
          profileBgColor: data.profileBgColor !== undefined ? data.profileBgColor : (existingSettings as any).profileBgColor,
          profileTextColor: data.profileTextColor !== undefined ? data.profileTextColor : (existingSettings as any).profileTextColor,
          profileAccentColor: data.profileAccentColor !== undefined ? data.profileAccentColor : (existingSettings as any).profileAccentColor,
          profileHeaderBgImage: data.profileHeaderBgImage !== undefined ? data.profileHeaderBgImage : (existingSettings as any).profileHeaderBgImage,
          profileBgImage: data.profileBgImage !== undefined ? data.profileBgImage : (existingSettings as any).profileBgImage,
          profileCustomCss: data.profileCustomCss !== undefined ? data.profileCustomCss : (existingSettings as any).profileCustomCss,
          profileFontFamily: data.profileFontFamily !== undefined ? data.profileFontFamily : (existingSettings as any).profileFontFamily,
        } as any),
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
