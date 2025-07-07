import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Role } from "@prisma/client";

// PUT /api/bookings/[id]/payment - Update payment status for a booking
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
        business: {
          select: {
            ownerId: true,
          },
        },
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
    const { isPaid } = await req.json();
    
    if (typeof isPaid !== 'boolean') {
      return NextResponse.json({ message: "isPaid must be a boolean" }, { status: 400 });
    }
    
    // Update the booking payment status
    const updatedBooking = await prisma.booking.update({
      where: {
        id,
      },
      data: {
        isPaid,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
          },
        },
        worker: {
          select: {
            id: true,
            name: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });
    
    // Format the response
    const formattedBooking = {
      id: updatedBooking.id,
      date: updatedBooking.date.toISOString(),
      startTime: updatedBooking.startTime,
      endTime: updatedBooking.endTime,
      status: updatedBooking.status,
      clientId: updatedBooking.clientId,
      clientName: updatedBooking.client.name,
      workerId: updatedBooking.workerId,
      workerName: updatedBooking.worker.name,
      serviceId: updatedBooking.serviceId,
      serviceName: updatedBooking.service.name,
      price: updatedBooking.service.price,
      isPaid: updatedBooking.isPaid,
    };
    
    return NextResponse.json(formattedBooking);
  } catch (error) {
    console.error("Error updating booking payment status:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
