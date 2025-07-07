import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import HeroSection from "@/components/homepage/HeroSection";
import { renderToStaticMarkup } from "react-dom/server";

export async function GET(request: NextRequest) {
  try {
    // Check if the current user is an admin
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    // Get the userId from the query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Create a mock session for the selected user
    const mockSession = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    // Create HTML with the HeroSection component and the mock session
    // Note: This is a simplified approach and won't work directly since HeroSection uses client hooks
    // In a real implementation, we'd need to create a special server-rendered version or use an iframe approach
    
    // For now, return the mock session data that would be used
    return NextResponse.json({
      message: "Preview not fully implemented - would show HeroSection with this user session",
      mockSession,
      note: "To fully implement this preview, you would need to create a special server-compatible version of HeroSection or use an iframe approach with session mocking"
    });
  } catch (error) {
    console.error("Error generating preview:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
