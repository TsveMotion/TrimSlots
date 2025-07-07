import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Role } from "@prisma/client";

// GET /api/services - Get all services for the business
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
    
    // Get all services for the business
    const services = await prisma.service.findMany({
      where: {
        businessId: businessId,
      },
      orderBy: {
        name: "asc",
      },
    });
    
    console.log("Returning real services data");
    return NextResponse.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/services - Create a new service
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
    const { name, description, duration, price } = await req.json();
    
    // Validate required fields
    if (!name || duration === undefined || price === undefined) {
      return NextResponse.json({ message: "Name, duration, and price are required" }, { status: 400 });
    }
    
    // Validate duration and price
    if (duration < 5) {
      return NextResponse.json({ message: "Duration must be at least 5 minutes" }, { status: 400 });
    }
    
    if (price < 0) {
      return NextResponse.json({ message: "Price cannot be negative" }, { status: 400 });
    }
    
    let businessId: string | null = null;
    
    // If admin, they need to specify a businessId in the body
    if (session.user.role === Role.ADMIN) {
      // We already parsed the request body earlier, so we need to get businessId from the URL params
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
    
    // Create the service
    const service = await prisma.service.create({
      data: {
        name,
        description: description || null,
        duration,
        price,
        business: {
          connect: {
            id: businessId!, // Non-null assertion as we've already checked businessId exists
          },
        },
      },
    });
    
    console.log("Created real service:", service);
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
