import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/public/businesses/[id]/settings
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const businessId = params.id;
    
    // Find business settings
    const businessSettings = await prisma.businessSettings.findFirst({
      where: {
        businessId: businessId,
      },
      // Using a workaround for TypeScript errors with the new fields
      // until Prisma client can be regenerated
      select: {
        id: true,
        businessId: true,
        ...({
          profileBgColor: true,
          profileTextColor: true,
          profileAccentColor: true,
          profileHeaderBgImage: true,
          profileBgImage: true,
          profileCustomCss: true,
          profileFontFamily: true,
        } as any),
      }
    });
    
    if (!businessSettings) {
      // Return default settings if none exist
      return NextResponse.json({
        id: '',
        businessId: businessId,
        profileBgColor: '#0f172a',
        profileTextColor: '#f8fafc',
        profileAccentColor: '#3b82f6',
        profileHeaderBgImage: null,
        profileBgImage: null,
        profileCustomCss: null,
        profileFontFamily: 'Inter, system-ui, sans-serif',
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
