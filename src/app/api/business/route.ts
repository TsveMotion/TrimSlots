import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';

export async function GET() {
  try {
    console.log('API: /api/business - Fetching business data');
    
    // Get the session
    const session = await getServerSession(authOptions);
    
    // Check if the user is authenticated
    if (!session || !session.user) {
      console.log('API: /api/business - Unauthorized, no session or user');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('API: /api/business - User authenticated:', session.user.id, 'Role:', session.user.role);
    
    // Check if the user has the appropriate role
    const userRole = session.user.role;
    if (userRole !== Role.BUSINESS_OWNER && userRole !== Role.ADMIN) {
      console.log('API: /api/business - Forbidden, invalid role:', userRole);
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Get the business associated with the user
    console.log('API: /api/business - Fetching user with business data for user ID:', session.user.id);
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { business: true },
    });
    
    console.log('API: /api/business - User found:', !!user, 'Has business:', !!(user?.business));
    
    if (!user) {
      console.log('API: /api/business - User not found in database');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    if (!user.business) {
      console.log('API: /api/business - Business not found for user');
      
      // Check if the user has a managedBusiness instead
      console.log('API: /api/business - Checking for managedBusiness');
      const userWithManagedBusiness = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { managedBusiness: true },
      });
      
      if (userWithManagedBusiness?.managedBusiness) {
        console.log('API: /api/business - Found managedBusiness instead');
        
        // Check if the business name contains an email address or needs to be updated
        const managedBusiness = userWithManagedBusiness.managedBusiness;
        const currentName = managedBusiness.name || '';
        
        // Check if the name contains an email pattern or is set to email's business
        const emailPattern = /@[^\s]+\.[^\s]+/;
        const needsNameUpdate = emailPattern.test(currentName) || 
                               currentName.includes("'s Business") && 
                               user.email && currentName.includes(user.email);
        
        if (needsNameUpdate) {
          console.log('API: /api/business - Updating managedBusiness name');
          // Update the business name
          const updatedBusiness = await prisma.business.update({
            where: { id: managedBusiness.id },
            data: { name: "My Business" }
          });
          return NextResponse.json(updatedBusiness);
        }
        
        return NextResponse.json(userWithManagedBusiness.managedBusiness);
      }
      
      console.log('API: /api/business - No business or managedBusiness found, creating a new business record');
      
      // Create a new business for the user
      try {
        // Use a better default name - if user.name exists use it, otherwise use "My Business"
        const businessName = user.name ? `${user.name}'s Business` : "My Business";
        
        const newBusiness = await prisma.business.create({
          data: {
            name: businessName,
            owner: {
              connect: { id: user.id }
            }
          }
        });
        
        console.log('API: /api/business - Created new business:', newBusiness.id);
        return NextResponse.json(newBusiness);
      } catch (createError) {
        console.error('API: /api/business - Error creating business:', createError);
        return NextResponse.json({ error: 'Failed to create business' }, { status: 500 });
      }
    }
    
    console.log('API: /api/business - Returning business data');
    return NextResponse.json(user.business);
  } catch (error) {
    console.error('API: /api/business - Error fetching business:', error);
    return NextResponse.json(
      { error: 'Failed to fetch business data' },
      { status: 500 }
    );
  }
}
