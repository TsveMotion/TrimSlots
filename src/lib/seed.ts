import prisma from "./prisma";
import bcrypt from "bcrypt";
import { Role } from "@prisma/client";

/**
 * Seeds the database with a super admin user
 */
export async function seedSuperAdmin() {
  try {
    const email = process.env.SUPERADMIN_EMAIL;
    const password = process.env.SUPERADMIN_PASSWORD;

    if (!email || !password) {
      console.error("Super admin credentials not found in environment variables");
      return;
    }

    // Check if super admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log("Super admin already exists");
      return;
    }

    // Create super admin
    const hashedPassword = await bcrypt.hash(password, 12);
    const superAdmin = await prisma.user.create({
      data: {
        name: "Super Admin",
        email,
        hashedPassword,
        role: Role.ADMIN,
      },
    });

    console.log("Super admin created successfully:", superAdmin.email);
  } catch (error) {
    console.error("Error seeding super admin:", error);
  }
}

/**
 * Main seed function to be called during app initialization
 */
export async function seed() {
  try {
    await seedSuperAdmin();
    console.log("Database seeding completed");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
