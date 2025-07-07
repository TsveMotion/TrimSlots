import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Seeding database...');
    
    // Create super admin
    const superAdminEmail = process.env.SUPERADMIN_EMAIL;
    const superAdminPassword = process.env.SUPERADMIN_PASSWORD;
    
    if (!superAdminEmail || !superAdminPassword) {
      console.error('Super admin credentials not found in environment variables');
      return;
    }
    
    // Check if super admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: superAdminEmail },
    });
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(superAdminPassword, 12);
      
      const superAdmin = await prisma.user.create({
        data: {
          name: 'Super Admin',
          email: superAdminEmail,
          hashedPassword,
          role: Role.ADMIN,
        },
      });
      
      console.log('Super admin created successfully:', superAdmin.email);
    } else {
      console.log('Super admin already exists');
    }
    
    console.log('Database seeding completed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
