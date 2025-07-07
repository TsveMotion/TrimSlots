import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Role } from "@prisma/client";

// GET /api/workers/[id] - Get a specific worker
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
    
    // Get the worker
    const worker = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        businessId: true,
        createdAt: true,
      },
    });
    
    if (!worker) {
      return NextResponse.json({ message: "Worker not found" }, { status: 404 });
    }
    
    // If business owner, check if the worker belongs to their business
    if (session.user.role === Role.BUSINESS_OWNER) {
      const business = await prisma.business.findUnique({
        where: {
          ownerId: session.user.id,
        },
      });
      
      if (!business || worker.businessId !== business.id) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
    }
    
    return NextResponse.json(worker);
  } catch (error) {
    console.error("Error fetching worker:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// PUT /api/workers/[id] - Update a worker
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
    
    // Get the worker to update
    const existingWorker = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        businessId: true,
        role: true,
      },
    });
    
    if (!existingWorker) {
      return NextResponse.json({ message: "Worker not found" }, { status: 404 });
    }
    
    // If the worker is not actually a worker, reject the request
    if (existingWorker.role !== Role.WORKER) {
      return NextResponse.json({ message: "User is not a worker" }, { status: 400 });
    }
    
    // If business owner, check if the worker belongs to their business
    if (session.user.role === Role.BUSINESS_OWNER) {
      const business = await prisma.business.findUnique({
        where: {
          ownerId: session.user.id,
        },
      });
      
      if (!business || existingWorker.businessId !== business.id) {
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
    if (email !== existingWorker.email) {
      const emailInUse = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      
      if (emailInUse) {
        return NextResponse.json({ message: "Email is already in use" }, { status: 400 });
      }
    }
    
    // Update the worker
    const updatedWorker = await prisma.user.update({
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
        role: true,
        createdAt: true,
      },
    });
    
    return NextResponse.json(updatedWorker);
  } catch (error) {
    console.error("Error updating worker:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/workers/[id] - Delete a worker
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
    
    // Get the worker to delete
    const existingWorker = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        businessId: true,
        role: true,
      },
    });
    
    if (!existingWorker) {
      return NextResponse.json({ message: "Worker not found" }, { status: 404 });
    }
    
    // If the worker is not actually a worker, reject the request
    if (existingWorker.role !== Role.WORKER) {
      return NextResponse.json({ message: "User is not a worker" }, { status: 400 });
    }
    
    // If business owner, check if the worker belongs to their business
    if (session.user.role === Role.BUSINESS_OWNER) {
      const business = await prisma.business.findUnique({
        where: {
          ownerId: session.user.id,
        },
      });
      
      if (!business || existingWorker.businessId !== business.id) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
    }
    
    // Delete the worker
    await prisma.user.delete({
      where: {
        id,
      },
    });
    
    return NextResponse.json({ message: "Worker deleted successfully" });
  } catch (error) {
    console.error("Error deleting worker:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
