import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Service } from "@prisma/client";

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
    let services: Service[] = [];
    
    if (userRole === "CLIENT") {
      // For clients, get popular services across all businesses
      services = await prisma.service.findMany({
        orderBy: {
          bookings: {
            _count: 'desc'
          }
        },
        take: 4
      });
    } else if (userRole === "WORKER" || userRole === "BUSINESS_OWNER") {
      // For workers and business owners, get services from their business
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { business: true }
      });
      
      if (user?.businessId) {
        services = await prisma.service.findMany({
          where: {
            businessId: user.businessId
          },
          orderBy: {
            bookings: {
              _count: 'desc'
            }
          },
          take: 4
        });
      }
    } else if (userRole === "ADMIN") {
      // For admins, get the most popular services across all businesses
      services = await prisma.service.findMany({
        orderBy: {
          bookings: {
            _count: 'desc'
          }
        },
        take: 4
      });
    }

    return NextResponse.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
