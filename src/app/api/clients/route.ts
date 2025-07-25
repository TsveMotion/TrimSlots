import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Role } from "@prisma/client";

// GET /api/clients - Get all clients for the business
export async function GET(req: NextRequest) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    // Check if user is a business owner or admin
    if (session.user.role !== Role.BUSINESS_OWNER && session.user.role !== Role.ADMIN) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    
    let businessId: string | null = null;
    
    // If admin, they need to specify a businessId in the query
    if (session.user.role === Role.ADMIN) {
      const url = new URL(req.url);
      businessId = url.searchParams.get("businessId");
      
      if (!businessId) {
        return NextResponse.json({ message: "Business ID is required for admin" }, { status: 400 });
      }
    } else {
      // For business owner, get their business
      const business = await prisma.business.findUnique({
        where: {
          ownerId: session.user.id,
        },
      });
      
      if (!business) {
        return NextResponse.json({ message: "Business not found" }, { status: 404 });
      }
      
      businessId = business.id;
    }
    
    // Get all clients for the business
    const clients = await prisma.user.findMany({
      where: {
        role: Role.CLIENT,
        clientBusinesses: {
          some: {
            businessId: businessId || "",
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    
    return NextResponse.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/clients - Create a new client
export async function POST(req: NextRequest) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    // Check if user is a business owner or admin
    if (session.user.role !== Role.BUSINESS_OWNER && session.user.role !== Role.ADMIN) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    
    // Parse request body
    const { name, email } = await req.json();
    
    // Validate required fields
    if (!name || !email) {
      return NextResponse.json({ message: "Name and email are required" }, { status: 400 });
    }
    
    // Check if email is already in use
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    
    let businessId: string | null = null;
    
    // If admin, they need to specify a businessId in the body
    if (session.user.role === Role.ADMIN) {
      const { businessId: bodyBusinessId } = await req.json();
      
      if (!bodyBusinessId) {
        return NextResponse.json({ message: "Business ID is required for admin" }, { status: 400 });
      }
      
      businessId = bodyBusinessId;
    } else {
      // For business owner, get their business
      const business = await prisma.business.findUnique({
        where: {
          ownerId: session.user.id,
        },
      });
      
      if (!business) {
        return NextResponse.json({ message: "Business not found" }, { status: 404 });
      }
      
      businessId = business.id;
    }
    
    let client;
    
    // If user already exists, check if they're already a client of this business
    if (existingUser) {
      // Check if user is already a client of this business
      const existingClientBusiness = await prisma.businessClient.findUnique({
        where: {
          businessId_clientId: {
            clientId: existingUser.id,
            businessId: businessId!, // Fixed: Non-null assertion since we've already checked this is valid
          },
        },
      });
      
      if (existingClientBusiness) {
        return NextResponse.json({ message: "Client already exists for this business" }, { status: 400 });
      }
      
      // Ensure businessId is not null
      if (!businessId) {
        return NextResponse.json({ message: "Business ID is required" }, { status: 400 });
      }
      
      // Add existing user as client to this business
      await prisma.businessClient.create({
        data: {
          clientId: existingUser.id,
          businessId: businessId || "", // Fix: Add null check
        },
      });
      
      client = existingUser;
    } else {
      // Create new user with CLIENT role
      client = await prisma.user.create({
        data: {
          name,
          email,
          role: Role.CLIENT,
          hashedPassword: "", // In a real app, would generate a temporary password and send an email
          clientBusinesses: {
            create: {
              businessId: businessId!, // Fixed: Non-null assertion since we've already checked this is valid
            },
          },
        },
      });
    }
    
    return NextResponse.json({
      id: client.id,
      name: client.name,
      email: client.email,
      createdAt: client.createdAt,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
