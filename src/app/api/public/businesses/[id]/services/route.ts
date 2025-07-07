import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/public/businesses/[id]/services - Get public services for a business
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

    // Fetch services for the business
    const services = await prisma.service.findMany({
      where: {
        businessId: id,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
