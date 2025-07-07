import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Get all users with BUSINESS_OWNER role
    const businessOwners = await prisma.user.findMany({
      where: {
        role: 'BUSINESS_OWNER'
      },
      include: {
        business: true,
        managedBusiness: true
      }
    });

    console.log('Business Owners:');
    businessOwners.forEach((user, index) => {
      console.log(`\nUser ${index + 1}:`);
      console.log(`ID: ${user.id}`);
      console.log(`Name: ${user.name}`);
      console.log(`Email: ${user.email}`);
      console.log(`Role: ${user.role}`);
      console.log(`Has business relation: ${user.business !== null}`);
      console.log(`Has managed business: ${user.managedBusiness !== null}`);
      
      if (user.managedBusiness) {
        console.log('\nManaged Business Details:');
        console.log(`ID: ${user.managedBusiness.id}`);
        console.log(`Name: ${user.managedBusiness.name}`);
      }
    });

    // If no business owners found
    if (businessOwners.length === 0) {
      console.log('No users with BUSINESS_OWNER role found.');
    }
  } catch (error) {
    console.error('Error checking user business:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
