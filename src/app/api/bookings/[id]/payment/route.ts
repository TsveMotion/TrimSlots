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
    // Instead of using isPaid directly, we'll update the status field
    const updatedBooking = await prisma.booking.update({
      where: {
        id,
      },
      data: {
        status: isPaid ? 'paid' : 'pending',
      },
      // Include related data with proper typing
      include: {
        business: true,
      },
    });
    
    // Format the response with only available fields
    const formattedBooking = {
      id: updatedBooking.id,
      startTime: updatedBooking.startTime.toISOString(),
      endTime: updatedBooking.endTime.toISOString(),
      status: updatedBooking.status,
      clientId: updatedBooking.clientId,
      workerId: updatedBooking.workerId,
      serviceId: updatedBooking.serviceId,
      businessId: updatedBooking.businessId,
      businessName: updatedBooking.business.name,
      // isPaid is now represented by the status field
      isPaid: updatedBooking.status === 'paid',
    };
    
    return NextResponse.json(formattedBooking);
  } catch (error) {
    console.error("Error updating booking payment status:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
