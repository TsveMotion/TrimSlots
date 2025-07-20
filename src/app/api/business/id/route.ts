import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';

// GET /api/business/id - Get the business ID for the current user
export async function GET() {
  try {
    console.log('API: /api/business/id - Fetching business ID');
    
    // Get the session
    const session = await getServerSession(authOptions);
    
    // Check if the user is authenticated
    if (!session || !session.user) {
      console.log('API: /api/business/id - Unauthorized, no session or user');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('API: /api/business/id - User authenticated:', session.user.id, 'Role:', session.user.role, 'Email:', session.user.email);
    
    // Check if the user has the appropriate role
    const userRole = session.user.role;
    if (userRole !== Role.BUSINESS_OWNER && userRole !== Role.ADMIN) {
      console.log('API: /api/business/id - Forbidden, invalid role:', userRole);
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // First check if the user has a direct business association
    console.log('API: /api/business/id - Fetching user with business data for user ID:', session.user.id);
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { business: true },
    });
    
    console.log('API: /api/business/id - User found:', !!user, 'Has business:', !!(user?.business));
    
    if (!user) {
      console.log('API: /api/business/id - User not found in database');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    if (user.business) {
      // Verify the business exists in the database
      const businessExists = await prisma.business.findUnique({
        where: { id: user.business.id },
      });
      
      if (businessExists) {
        console.log('API: /api/business/id - Returning business ID:', user.business.id);
        return NextResponse.json({ businessId: user.business.id });
      } else {
        console.log('API: /api/business/id - Business reference exists but business not found in database');
      }
    }
    
    // Check if the user has a managedBusiness instead
    console.log('API: /api/business/id - Checking for managedBusiness');
    const userWithManagedBusiness = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { managedBusiness: true },
    });
    
    if (userWithManagedBusiness?.managedBusiness) {
      // Verify the managed business exists in the database
      const managedBusinessExists = await prisma.business.findUnique({
        where: { id: userWithManagedBusiness.managedBusiness.id },
      });
      
      if (managedBusinessExists) {
        console.log('API: /api/business/id - Found managedBusiness with ID:', userWithManagedBusiness.managedBusiness.id);
        return NextResponse.json({ businessId: userWithManagedBusiness.managedBusiness.id });
      } else {
        console.log('API: /api/business/id - ManagedBusiness reference exists but business not found in database');
      }
    }
    
    // If no business found, create a new one for the user
    console.log('API: /api/business/id - No business found for user, creating a new one');
    
    // Use the user's name if available, otherwise use a default name
    const businessName = user.name ? `${user.name}'s Business` : "My Business";
    
    try {
      const newBusiness = await prisma.business.create({
        data: {
          name: businessName,
          owner: {
            connect: { id: user.id }
          }
        }
      });
      
      console.log('API: /api/business/id - Created new business with ID:', newBusiness.id);
      return NextResponse.json({ businessId: newBusiness.id });
    } catch (createError) {
      console.error('API: /api/business/id - Error creating new business:', createError);
      return NextResponse.json({ error: 'Failed to create business' }, { status: 500 });
    }
    
  } catch (error) {
    console.error('API: /api/business/id - Error fetching business ID:', error);
    return NextResponse.json(
      { error: 'Failed to fetch business ID' },
      { status: 500 }
    );
  }
}
