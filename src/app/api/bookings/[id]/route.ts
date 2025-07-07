import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Role } from "@prisma/client";

// GET /api/bookings/[id] - Get a specific booking
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
    
    // Get the booking
    const booking = await prisma.booking.findUnique({
      where: {
        id,
      },
      include: {
        service: true,
        business: true,
      },
    });
    
    if (!booking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }
    
    // Get client and worker information separately since they're not directly related in the schema
    const clientPromise = prisma.user.findUnique({
      where: { id: booking.clientId },
      select: { id: true, name: true, email: true },
    });
    
    const workerPromise = booking.workerId ? prisma.user.findUnique({
      where: { id: booking.workerId },
      select: { id: true, name: true, email: true },
    }) : Promise.resolve(null);
    
    // Resolve promises
    const [client, worker] = await Promise.all([clientPromise, workerPromise]);
    
    // Check permissions based on role
    if (session.user.role === Role.ADMIN) {
      // Admin can access any booking
    } else if (session.user.role === Role.BUSINESS_OWNER) {
      // Business owner can only access bookings for their business
      if (booking.business.ownerId !== session.user.id) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
    } else if (session.user.role === Role.WORKER) {
      // Worker can only access bookings assigned to them
      if (booking.workerId !== session.user.id) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
    } else if (session.user.role === Role.CLIENT) {
      // Client can only access their own bookings
      if (booking.clientId !== session.user.id) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
    } else {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    
    // Format the response
    const formattedBooking = {
      id: booking.id,
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status,
      clientId: booking.clientId,
      clientName: client?.name || 'Unknown Client',
      clientEmail: client?.email || '',
      workerId: booking.workerId,
      workerName: worker?.name || 'Unassigned',
      workerEmail: worker?.email || '',
      serviceId: booking.serviceId,
      serviceName: booking.service.name,
      serviceDuration: booking.service.duration,
      price: booking.service.price,
      businessId: booking.businessId,
      businessName: booking.business.name,
    };
    
    return NextResponse.json(formattedBooking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// PUT /api/bookings/[id] - Update a booking
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
    
    // Get the booking to update
    const existingBooking = await prisma.booking.findUnique({
      where: {
        id,
      },
      include: {
        business: true,
        service: true,
      },
    });
    
    if (!existingBooking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }
    
    // If business owner, check if the booking belongs to their business
    if (session.user.role === Role.BUSINESS_OWNER) {
      if (existingBooking.business.ownerId !== session.user.id) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
    }
    
    // Parse request body
    const { startTime, clientId, workerId, serviceId, status } = await req.json();
    
    // Validate required fields
    if (!startTime || !clientId || !workerId || !serviceId || !status) {
      return NextResponse.json({ 
        message: "Start time, client, worker, service, and status are required" 
      }, { status: 400 });
    }
    
    // Get the service to calculate end time (if service changed)
    let serviceDuration = existingBooking.service.duration;
    if (serviceId !== existingBooking.serviceId) {
      const service = await prisma.service.findUnique({
        where: {
          id: serviceId,
        },
      });
      
      if (!service) {
        return NextResponse.json({ message: "Service not found" }, { status: 404 });
      }
      
      serviceDuration = service.duration;
    }
    
    // Calculate end time
    const endTime = calculateEndTime(startTime, serviceDuration);
    
    // Check if worker is available at this time (if time or worker changed)
    if (startTime !== existingBooking.startTime || workerId !== existingBooking.workerId) {
      
      const conflictingBooking = await prisma.booking.findFirst({
        where: {
          id: { not: id }, // Exclude the current booking
          workerId,
          status: {
            not: "CANCELLED",
          },
          OR: [
            {
              // New booking starts during an existing booking
              AND: [
                { startTime: { lte: startTime } },
                { endTime: { gt: startTime } },
              ],
            },
            {
              // New booking ends during an existing booking
              AND: [
                { startTime: { lt: endTime } },
                { endTime: { gte: endTime } },
              ],
            },
            {
              // New booking completely contains an existing booking
              AND: [
                { startTime: { gte: startTime } },
                { endTime: { lte: endTime } },
              ],
            },
          ],
        },
      });
      
      if (conflictingBooking) {
        return NextResponse.json({ 
          message: "Worker is not available at this time. Please choose another time." 
        }, { status: 400 });
      }
    }
    
    // Update the booking
    const updatedBooking = await prisma.booking.update({
      where: {
        id,
      },
      data: {
        startTime,
        endTime,
        status,
        clientId,
        workerId,
        serviceId,
      },
      include: {
        service: true,
      },
    });
    
    // Get client and worker information separately
    const clientPromise = prisma.user.findUnique({
      where: { id: updatedBooking.clientId },
      select: { id: true, name: true },
    });
    
    const workerPromise = updatedBooking.workerId ? prisma.user.findUnique({
      where: { id: updatedBooking.workerId },
      select: { id: true, name: true },
    }) : Promise.resolve(null);
    
    // Resolve promises
    const [client, worker] = await Promise.all([clientPromise, workerPromise]);
    
    // Format the response
    const formattedBooking = {
      id: updatedBooking.id,
      startTime: updatedBooking.startTime,
      endTime: updatedBooking.endTime,
      status: updatedBooking.status,
      clientId: updatedBooking.clientId,
      clientName: client?.name || 'Unknown Client',
      workerId: updatedBooking.workerId,
      workerName: worker?.name || 'Unassigned',
      serviceId: updatedBooking.serviceId,
      serviceName: updatedBooking.service.name,
      price: updatedBooking.service.price,
    };
    
    return NextResponse.json(formattedBooking);
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH /api/bookings/[id] - Update booking status
export async function PATCH(
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
    
    // Get the booking to update
    const existingBooking = await prisma.booking.findUnique({
      where: {
        id,
      },
      include: {
        business: true,
        service: true,
      },
    });
    
    if (!existingBooking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }
    
    // Parse request body
    const { status } = await req.json();
    
    // Validate required fields
    if (!status) {
      return NextResponse.json({ 
        message: "Status is required" 
      }, { status: 400 });
    }
    
    // Check permissions based on role
    if (session.user.role === Role.ADMIN) {
      // Admin can update any booking
    } else if (session.user.role === Role.BUSINESS_OWNER) {
      // Business owner can only update bookings for their business
      if (existingBooking.business.ownerId !== session.user.id) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
    } else if (session.user.role === Role.WORKER) {
      // Worker can only update bookings assigned to them
      if (existingBooking.workerId !== session.user.id) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
      
      // Workers can only mark bookings as COMPLETED or CANCELLED
      if (status !== "COMPLETED" && status !== "CANCELLED") {
        return NextResponse.json({ 
          message: "Workers can only mark bookings as completed or cancelled" 
        }, { status: 403 });
      }
    } else {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    
    // Update the booking status
    const updatedBooking = await prisma.booking.update({
      where: {
        id,
      },
      data: {
        status,
      },
      include: {
        service: true,
      },
    });
    
    // Get client and worker information separately since they're not directly related in the schema
    const clientPromise = prisma.user.findUnique({
      where: { id: updatedBooking.clientId },
      select: { id: true, name: true, email: true },
    });
    
    const workerPromise = updatedBooking.workerId ? prisma.user.findUnique({
      where: { id: updatedBooking.workerId },
      select: { id: true, name: true },
    }) : Promise.resolve(null);
    
    // Resolve promises
    const [client, worker] = await Promise.all([clientPromise, workerPromise]);
    
    // Format the response
    const formattedBooking = {
      id: updatedBooking.id,
      startTime: updatedBooking.startTime,
      endTime: updatedBooking.endTime,
      status: updatedBooking.status,
      clientId: updatedBooking.clientId,
      clientName: client?.name || 'Unknown Client',
      clientEmail: client?.email || '',
      workerId: updatedBooking.workerId,
      workerName: worker?.name || "Unassigned",
      serviceId: updatedBooking.serviceId,
      serviceName: updatedBooking.service.name,
      price: updatedBooking.service.price,
    };
    
    return NextResponse.json(formattedBooking);
  } catch (error) {
    console.error("Error updating booking status:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/bookings/[id] - Delete a booking
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
    
    // Get the booking to delete
    const existingBooking = await prisma.booking.findUnique({
      where: {
        id,
      },
      include: {
        business: true,
      },
    });
    
    if (!existingBooking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }
    
    // If business owner, check if the booking belongs to their business
    if (session.user.role === Role.BUSINESS_OWNER) {
      if (existingBooking.business.ownerId !== session.user.id) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
    }
    
    // Instead of deleting, update the status to CANCELLED
    await prisma.booking.update({
      where: {
        id,
      },
      data: {
        status: "CANCELLED",
      },
    });
    
    return NextResponse.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// Helper function to calculate end time based on start time and duration
function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  
  let totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  
  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
}
