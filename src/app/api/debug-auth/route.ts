import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Get user from database to compare
    let dbUser = null;
    if (session?.user?.id) {
      dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true
        }
      });
    }
    
    return NextResponse.json({
      session: {
        user: session?.user || null,
        userRoleType: session?.user?.role ? typeof session.user.role : null,
      },
      dbUser: dbUser,
      message: "Debug information retrieved successfully"
    });
  } catch (error) {
    console.error("Debug auth error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve debug information" },
      { status: 500 }
    );
  }
}
