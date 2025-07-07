import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Role } from "@prisma/client";

// GET /api/services/[id] - Get a specific service
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
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
    
    // Get the service
    const service = await prisma.service.findUnique({
      where: {
        id,
      },
    });
    
    if (!service) {
      return NextResponse.json({ message: "Service not found" }, { status: 404 });
    }
    
    // If business owner, check if the service belongs to their business
    if (session.user.role === Role.BUSINESS_OWNER) {
      const business = await prisma.business.findUnique({
        where: {
          ownerId: session.user.id,
        },
      });
      
      if (!business || service.businessId !== business.id) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
    }
    
    return NextResponse.json(service);
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// PUT /api/services/[id] - Update a service
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
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
    
    // Get the service to update
    const existingService = await prisma.service.findUnique({
      where: {
        id,
      },
    });
    
    if (!existingService) {
      return NextResponse.json({ message: "Service not found" }, { status: 404 });
    }
    
    // If business owner, check if the service belongs to their business
    if (session.user.role === Role.BUSINESS_OWNER) {
      const business = await prisma.business.findUnique({
        where: {
          ownerId: session.user.id,
        },
      });
      
      if (!business || existingService.businessId !== business.id) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
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
    
    // Update the service
    const updatedService = await prisma.service.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        duration,
        price,
      },
    });
    
    return NextResponse.json(updatedService);
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/services/[id] - Delete a service
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
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
    
    // Get the service to delete
    const existingService = await prisma.service.findUnique({
      where: {
        id,
      },
    });
    
    if (!existingService) {
      return NextResponse.json({ message: "Service not found" }, { status: 404 });
    }
    
    // If business owner, check if the service belongs to their business
    if (session.user.role === Role.BUSINESS_OWNER) {
      const business = await prisma.business.findUnique({
        where: {
          ownerId: session.user.id,
        },
      });
      
      if (!business || existingService.businessId !== business.id) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
    }
    
    // Check if the service is used in any bookings
    const bookingsWithService = await prisma.booking.count({
      where: {
        serviceId: id,
      },
    });
    
    if (bookingsWithService > 0) {
      return NextResponse.json({ 
        message: "Cannot delete service as it is used in bookings. Please remove all associated bookings first." 
      }, { status: 400 });
    }
    
    // Delete the service
    await prisma.service.delete({
      where: {
        id,
      },
    });
    
    return NextResponse.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
