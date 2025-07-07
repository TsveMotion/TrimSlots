import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Role } from "@prisma/client";
import bcrypt from "bcrypt";

// GET /api/workers - Get all workers for the business
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
    
    // Get all workers for the business
    const workers = await prisma.user.findMany({
      where: {
        businessId: businessId,
        role: Role.WORKER,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    
    console.log("Returning real workers data");
    return NextResponse.json(workers);
  } catch (error) {
    console.error("Error fetching workers:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/workers - Create a new worker
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
    const { name, email, password } = await req.json();
    
    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 });
    }
    
    // Check if email is already in use
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    
    if (existingUser) {
      return NextResponse.json({ message: "Email is already in use" }, { status: 400 });
    }
    
    let businessId: string | null = null;
    
    // If admin, they need to specify a businessId in the query
    if (session.user.role === Role.ADMIN) {
      const url = new URL(req.url);
      const bodyBusinessId = url.searchParams.get("businessId");
      
      if (!bodyBusinessId) {
        return NextResponse.json({ message: "Business ID is required for admin" }, { status: 400 });
      }
      
      businessId = bodyBusinessId;
      
      // Check if business exists
      const business = await prisma.business.findUnique({
        where: {
          id: businessId,
        },
      });
      
      if (!business) {
        return NextResponse.json({ message: "Business not found" }, { status: 404 });
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
    
    // Use the provided password from the form
    // If no password is provided (for backward compatibility), generate a random one
    const workerPassword = password || Math.random().toString(36).slice(-8);
    
    // Create the worker
    const worker = await prisma.user.create({
      data: {
        name,
        email,
        role: Role.WORKER,
        hashedPassword: await bcrypt.hash(workerPassword, 12),
        business: {
          connect: {
            id: businessId!,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    
    // Send email with credentials (implement this)
    // ...
    
    console.log("Created real worker:", worker);
    return NextResponse.json({
      ...worker,
      // Don't return the password in the response for security
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating worker:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
