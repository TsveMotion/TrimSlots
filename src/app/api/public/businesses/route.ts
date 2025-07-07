import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/public/businesses - Get all public businesses
export async function GET(req: NextRequest) {
  try {
    // Fetch all businesses
    const businesses = await prisma.business.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        phone: true,
        email: true,
        createdAt: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ businesses });
  } catch (error) {
    console.error("Error fetching businesses:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
