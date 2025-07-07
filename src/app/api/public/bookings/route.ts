import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// POST /api/public/bookings - Create a new booking
export async function POST(req: NextRequest) {
  try {
    // Get the current session (optional, user might not be logged in)
    const session = await getServerSession(authOptions);
    
    // Parse request body
    const { 
      serviceId, 
      workerId, 
      businessId, 
      date, 
      time, 
      clientName, 
      clientEmail, 
      clientPhone 
    } = await req.json();
    
    // Validate required fields
    if (!serviceId || !workerId || !businessId || !date || !time) {
      return NextResponse.json({ 
        message: "Service, worker, business, date, and time are required" 
      }, { status: 400 });
    }
    
    // If user is not logged in, require client information
    if (!session?.user) {
      if (!clientName || !clientEmail) {
        return NextResponse.json({ 
          message: "Client name and email are required" 
        }, { status: 400 });
      }
    }
    
    // Check if business exists
    const business = await prisma.business.findUnique({
      where: {
        id: businessId,
      },
    });
    
    if (!business) {
      return NextResponse.json({ message: "Business not found" }, { status: 404 });
    }
    
    // Check if service exists and belongs to the business
    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        businessId,
      },
    });
    
    if (!service) {
      return NextResponse.json({ message: "Service not found" }, { status: 404 });
    }
    
    // Check if worker exists and belongs to the business
    const worker = await prisma.user.findFirst({
      where: {
        id: workerId,
        businessId,
      },
    });
    
    if (!worker) {
      return NextResponse.json({ message: "Worker not found" }, { status: 404 });
    }
    
    // Parse date and time
    const [hours, minutes] = time.split(':').map(Number);
    const bookingDate = new Date(date);
    bookingDate.setHours(hours, minutes, 0, 0);
    
    // Calculate end time based on service duration
    const endTime = new Date(bookingDate);
    endTime.setMinutes(endTime.getMinutes() + service.duration);
    
    // Check if the worker is available at the requested time
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        workerId,
        AND: [
          {
            startTime: {
              lt: endTime,
            },
          },
          {
            endTime: {
              gt: bookingDate,
            },
          },
        ],
      },
    });
    
    if (conflictingBooking) {
      return NextResponse.json({ 
        message: "Worker is not available at the requested time" 
      }, { status: 400 });
    }
    
    // Ensure we have a client ID (required by the schema)
    let clientId = session?.user?.id;
    
    // If no authenticated user, find or create a user based on the provided email
    if (!clientId && clientEmail) {
      // Check if a user with this email exists
      const existingUser = await prisma.user.findUnique({
        where: { email: clientEmail }
      });
      
      if (existingUser) {
        // Use existing user
        clientId = existingUser.id;
      } else {
        // Create a new user with CLIENT role
        const newUser = await prisma.user.create({
          data: {
            email: clientEmail,
            name: clientName,
            role: 'CLIENT',
          }
        });
        clientId = newUser.id;
      }
    }
    
    // If we still don't have a clientId, return an error
    if (!clientId) {
      return NextResponse.json({ 
        message: "Client identification required for booking"
      }, { status: 400 });
    }
    
    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        startTime: bookingDate,
        endTime,
        service: {
          connect: {
            id: serviceId,
          },
        },
        workerId: workerId,
        business: {
          connect: {
            id: businessId,
          },
        },
        clientId: clientId,
        status: "CONFIRMED",
        // Store client contact info in the notes field since we don't have dedicated fields
        notes: `Name: ${session?.user?.name || clientName}, Email: ${session?.user?.email || clientEmail}${clientPhone ? `, Phone: ${clientPhone}` : ''}`,
      },
    });
    
    // TODO: Send confirmation email to client
    // ...
    
    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json({ 
      message: "Error creating booking", 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
