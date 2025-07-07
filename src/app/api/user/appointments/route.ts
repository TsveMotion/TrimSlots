import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Booking } from "@prisma/client";

type BookingWithRelations = Booking & {
  service: {
    name: string;
    duration: number;
    price: number;
  };
  business?: {
    name: string;
  };
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const userRole = session.user.role;
    
    // Different queries based on user role
    let bookings: BookingWithRelations[] = [];
    
    if (userRole === "CLIENT") {
      // For clients, get bookings where they are the client
      bookings = await prisma.booking.findMany({
        where: {
          clientId: userId,
          status: {
            notIn: ["cancelled"]
          }
        },
        orderBy: {
          startTime: "asc"
        },
        include: {
          service: true,
          business: true
        },
        take: 5 // Limit to 5 most recent bookings
      });
    } else if (userRole === "WORKER") {
      // For workers, get bookings assigned to them
      bookings = await prisma.booking.findMany({
        where: {
          workerId: userId,
          status: {
            notIn: ["cancelled"]
          }
        },
        orderBy: {
          startTime: "asc"
        },
        include: {
          service: true,
          business: true
        },
        take: 5
      });
    } else if (userRole === "BUSINESS_OWNER") {
      // For business owners, get bookings for their business
      const business = await prisma.business.findUnique({
        where: {
          ownerId: userId
        }
      });
      
      if (business) {
        bookings = await prisma.booking.findMany({
          where: {
            businessId: business.id,
            status: {
              notIn: ["cancelled"]
            }
          },
          orderBy: {
            startTime: "asc"
          },
          include: {
            service: true
          },
          take: 5
        });
      } else {
        bookings = [];
      }
    } else if (userRole === "ADMIN") {
      // For admins, get the most recent bookings across all businesses
      bookings = await prisma.booking.findMany({
        orderBy: {
          startTime: "asc"
        },
        include: {
          service: true,
          business: true
        },
        take: 5
      });
    } else {
      bookings = [];
    }

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
