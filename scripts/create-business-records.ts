import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function createBusinessRecords() {
  try {
    console.log('Finding business owners without business records...');
    
    // Find all users with BUSINESS_OWNER role
    const businessOwners = await prisma.user.findMany({
      where: {
        role: Role.BUSINESS_OWNER,
        business: null, // Users who don't have a business
        managedBusiness: null // Users who don't manage a business
      }
    });
    
    console.log(`Found ${businessOwners.length} business owners without business records.`);
    
    // Create business records for each user
    for (const user of businessOwners) {
      console.log(`Creating business record for user: ${user.name} (${user.email})`);
      
      // Create a new business for this user
      const business = await prisma.business.create({
        data: {
          name: `${user.name}'s Business`,
          description: 'Auto-generated business record',
          address: 'Please update your business address',
          phone: 'Please update your business phone',
          email: user.email,
          website: '',
          owner: {
            connect: { id: user.id }
          },
          settings: {
            create: {
              // Using only fields that exist in the actual schema
              stripeConnectId: null,
              payoutsEnabled: false
            }
          }
        }
      });
      
      console.log(`Created business: ${business.name} (ID: ${business.id})`);
    }
    
    console.log('Business records creation completed successfully.');
  } catch (error) {
    console.error('Error creating business records:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createBusinessRecords()
  .then(() => console.log('Script execution completed.'))
  .catch((error) => console.error('Script execution failed:', error));
