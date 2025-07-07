import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

// GET /api/public/businesses/[id]/workers - Get public workers for a business
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if business exists
    const business = await prisma.business.findUnique({
      where: {
        id,
      },
    });

    if (!business) {
      return NextResponse.json(
        { message: "Business not found" },
        { status: 404 }
      );
    }

    // Fetch workers for the business
    const workers = await prisma.user.findMany({
      where: {
        businessId: id,
        role: Role.WORKER,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(workers);
  } catch (error) {
    console.error("Error fetching workers:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
