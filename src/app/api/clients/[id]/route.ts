import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Role } from "@prisma/client";

// GET /api/clients/[id] - Get a specific client
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
    
    // Get the client
    const client = await prisma.user.findUnique({
      where: {
        id,
        role: Role.CLIENT,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        clientBusinesses: true,
      },
    });
    
    if (!client) {
      return NextResponse.json({ message: "Client not found" }, { status: 404 });
    }
    
    // If business owner, check if the client belongs to their business
    if (session.user.role === Role.BUSINESS_OWNER) {
      const business = await prisma.business.findUnique({
        where: {
          ownerId: session.user.id,
        },
        select: {
          id: true,
        },
      });
      
      if (!business) {
        return NextResponse.json({ message: "Business not found" }, { status: 404 });
      }
      
      const isClientOfBusiness = client.clientBusinesses.some(cb => cb.businessId === business.id);
      
      if (!isClientOfBusiness) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
    }
    
    // Return client without clientBusinesses field
    const { clientBusinesses, ...clientData } = client;
    return NextResponse.json(clientData);
  } catch (error) {
    console.error("Error fetching client:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// PUT /api/clients/[id] - Update a client
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
    
    // Get the client to update
    const existingClient = await prisma.user.findUnique({
      where: {
        id,
        role: Role.CLIENT,
      },
      include: {
        clientBusinesses: true,
      },
    });
    
    if (!existingClient) {
      return NextResponse.json({ message: "Client not found" }, { status: 404 });
    }
    
    // If business owner, check if the client belongs to their business
    if (session.user.role === Role.BUSINESS_OWNER) {
      const business = await prisma.business.findUnique({
        where: {
          ownerId: session.user.id,
        },
        select: {
          id: true,
        },
      });
      
      if (!business) {
        return NextResponse.json({ message: "Business not found" }, { status: 404 });
      }
      
      const isClientOfBusiness = existingClient.clientBusinesses.some(cb => cb.businessId === business.id);
      
      if (!isClientOfBusiness) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
    }
    
    // Parse request body
    const { name, email } = await req.json();
    
    // Validate required fields
    if (!name || !email) {
      return NextResponse.json({ message: "Name and email are required" }, { status: 400 });
    }
    
    // Check if email is already in use by another user
    if (email !== existingClient.email) {
      const emailInUse = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      
      if (emailInUse) {
        return NextResponse.json({ message: "Email is already in use" }, { status: 400 });
      }
    }
    
    // Update the client
    const updatedClient = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
    
    return NextResponse.json(updatedClient);
  } catch (error) {
    console.error("Error updating client:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/clients/[id] - Delete a client (or remove from business)
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
    
    // Get the client to delete
    const existingClient = await prisma.user.findUnique({
      where: {
        id,
        role: Role.CLIENT,
      },
      include: {
        clientBusinesses: true,
        bookings: {
          select: {
            id: true,
          },
        },
      },
    });
    
    if (!existingClient) {
      return NextResponse.json({ message: "Client not found" }, { status: 404 });
    }
    
    let businessId: string | null = null;
    
    // If business owner, get their business and check if client belongs to it
    if (session.user.role === Role.BUSINESS_OWNER) {
      const business = await prisma.business.findUnique({
        where: {
          ownerId: session.user.id,
        },
        select: {
          id: true,
        },
      });
      
      if (!business) {
        return NextResponse.json({ message: "Business not found" }, { status: 404 });
      }
      
      const clientBusiness = existingClient.clientBusinesses.find(cb => cb.businessId === business.id);
      
      if (!clientBusiness) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
      
      businessId = business.id;
    } else if (session.user.role === Role.ADMIN) {
      // For admin, get businessId from query
      const url = new URL(req.url);
      businessId = url.searchParams.get("businessId");
      
      if (!businessId) {
        return NextResponse.json({ message: "Business ID is required for admin" }, { status: 400 });
      }
      
      const clientBusiness = existingClient.clientBusinesses.find(cb => cb.businessId === businessId);
      
      if (!clientBusiness) {
        return NextResponse.json({ message: "Client is not associated with this business" }, { status: 400 });
      }
    }
    
    // Check if client has bookings with this business
    const hasBookings = existingClient.bookings.length > 0;
    
    if (hasBookings) {
      return NextResponse.json({ 
        message: "Cannot delete client as they have bookings. Please cancel all bookings first." 
      }, { status: 400 });
    }
    
    // Remove client from business (don't delete the user account)
    await prisma.clientBusiness.delete({
      where: {
        userId_businessId: {
          userId: id,
          businessId: businessId!,
        },
      },
    });
    
    return NextResponse.json({ message: "Client removed from business successfully" });
  } catch (error) {
    console.error("Error deleting client:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
