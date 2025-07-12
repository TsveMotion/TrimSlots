import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// This is a test-only endpoint to get a list of users with different roles
// It should be restricted in production or removed entirely
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Only allow admins to access this endpoint
    if (!session?.user?.role || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    // Get a sample of users with different roles
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        businessId: true,
        business: {
          select: {
            id: true,
            name: true
          }
        },
        managedBusiness: {
          select: {
            id: true,
            name: true
          }
        },
        clientBusinesses: {
          select: {
            id: true,
            business: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        _count: {
          select: {
            // Using valid count properties from the schema
            accounts: true,
            sessions: true,
            clientBusinesses: true
          }
        }
      },
      orderBy: {
        role: 'asc'
      },
      take: 10
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching test users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
