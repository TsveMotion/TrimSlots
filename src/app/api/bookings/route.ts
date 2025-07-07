import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Role } from "@prisma/client";

// GET /api/bookings - Get all bookings for the business
export async function GET(req: NextRequest) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    // Check if user is a business owner, worker, or admin
    if (session.user.role !== Role.BUSINESS_OWNER && 
        session.user.role !== Role.ADMIN && 
        session.user.role !== Role.WORKER) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    
    let businessId: string | null = null;
    let workerId: string | null = null;
    
    // Parse query parameters
    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const date = url.searchParams.get("date");
    
    // If admin, they need to specify a businessId in the query
    if (session.user.role === Role.ADMIN) {
      const queryBusinessId = url.searchParams.get("businessId");
      
      if (!queryBusinessId) {
        return NextResponse.json({ message: "Business ID is required for admin" }, { status: 400 });
      }
      
      businessId = queryBusinessId;
    } else if (session.user.role === Role.BUSINESS_OWNER) {
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
    } else if (session.user.role === Role.WORKER) {
      // For worker, get their business and filter by workerId
      workerId = session.user.id;
      
      const worker = await prisma.user.findUnique({
        where: {
          id: workerId,
        },
        select: {
          businessId: true,
        },
      });
      
      if (!worker || !worker.businessId) {
        return NextResponse.json({ message: "Worker's business not found" }, { status: 404 });
      }
      
      businessId = worker.businessId;
    }
    
    // Build the query
    const where: any = {
      businessId: businessId,
    };
    
    if (workerId) {
      where.workerId = workerId;
    }
    
    if (status && status !== "all") {
      where.status = status;
    }
    
    if (date) {
      // Filter by date using startTime field
      const filterDate = new Date(date);
      const nextDay = new Date(filterDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      where.startTime = {
        gte: filterDate,
        lt: nextDay
      };
    }
    
    // Get all bookings for the business
    const bookings = await prisma.booking.findMany({
      where,
      include: {
        business: true,
        service: true,
      },
      orderBy: [
        { startTime: "asc" },
      ],
    });
    
    // Get related user data
    const userIds = Array.from(new Set(
      bookings.map(booking => booking.clientId)
        .concat(bookings.filter(b => b.workerId).map(b => b.workerId || ''))
        .filter(id => id) // Filter out empty strings
    ));
      
    const users = await prisma.user.findMany({
      where: {
        id: { in: userIds }
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    });
    
    // Create a map for quick lookup
    const userMap = new Map(users.map(user => [user.id, user]));
    
    // Format the response
    const formattedBookings = bookings.map(booking => {
      const client = userMap.get(booking.clientId);
      const worker = booking.workerId ? userMap.get(booking.workerId) : null;
      
      return {
        id: booking.id,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status,
        notes: booking.notes,
        clientId: booking.clientId,
        clientName: client?.name || 'Unknown Client',
        clientEmail: client?.email || '',
        workerId: booking.workerId,
        workerName: worker?.name || 'Unassigned',
        serviceId: booking.serviceId,
        serviceName: booking.service.name,
        price: booking.service.price,
      };
    });
    
    return NextResponse.json(formattedBookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/bookings - Create a new booking
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
    const { date, startTime, clientId, workerId, serviceId, status } = await req.json();
    
    // Validate required fields
    if (!date || !startTime || !clientId || !workerId || !serviceId) {
      return NextResponse.json({ 
        message: "Date, start time, client, worker, and service are required" 
      }, { status: 400 });
    }
    
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
    
    // Get the service to calculate end time
    const service = await prisma.service.findUnique({
      where: {
        id: serviceId,
      },
    });
    
    if (!service) {
      return NextResponse.json({ message: "Service not found" }, { status: 404 });
    }
    
    // Calculate end time
    const endTime = calculateEndTime(startTime, service.duration);
    
    // Check if worker is available at this time
    const bookingDate = new Date(date);
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        workerId,
        startTime: {
          gte: new Date(bookingDate.setHours(0, 0, 0, 0)),
          lt: new Date(bookingDate.setHours(23, 59, 59, 999)),
        },
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
    
    // Parse date and time into a proper DateTime
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = startTime.split(':').map(Number);
    const bookingStartTime = new Date(year, month - 1, day, hours, minutes);
    
    // Calculate end time based on service duration
    const bookingEndTime = new Date(bookingStartTime);
    bookingEndTime.setMinutes(bookingEndTime.getMinutes() + service.duration);
    
    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        startTime: bookingStartTime,
        endTime: bookingEndTime,
        status: status || "CONFIRMED",
        businessId,
        clientId,
        workerId,
        serviceId,
      },
    });
    
    // Get related user data
    const client = await prisma.user.findUnique({
      where: { id: clientId },
      select: { id: true, name: true, email: true }
    });
    
    const worker = workerId ? await prisma.user.findUnique({
      where: { id: workerId },
      select: { id: true, name: true }
    }) : null;
    
    // Get service data
    const serviceData = await prisma.service.findUnique({
      where: { id: serviceId },
      select: { id: true, name: true, price: true }
    });
    
    // Format the response
    const formattedBooking = {
      id: booking.id,
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status,
      clientId: booking.clientId,
      clientName: client?.name || 'Unknown Client',
      workerId: booking.workerId,
      workerName: worker?.name || 'Unassigned',
      serviceId: booking.serviceId,
      serviceName: serviceData?.name || '',
      price: serviceData?.price || 0,
    };
    
    return NextResponse.json(formattedBooking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
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
