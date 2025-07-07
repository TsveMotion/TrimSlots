import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';

export async function GET() {
  try {
    // Get the session
    const session = await getServerSession(authOptions);
    
    // Check if the user is authenticated and is an admin
    if (!session || !session.user || session.user.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }
    
    // Count total businesses
    const totalBusinesses = await prisma.business.count();
    
    // Count total users
    const totalUsers = await prisma.user.count();
    
    // Count total bookings (if exists in schema)
    let totalBookings = 0;
    try {
      totalBookings = await prisma.booking.count();
    } catch (error) {
      console.log('Booking model may not exist:', error);
    }
    
    // Calculate total revenue (if payment model exists)
    let totalRevenue = 0;
    try {
      // First check if Payment table exists
      const tableExists = await prisma.$queryRaw`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'Payment'
        );
      `;
      
      // @ts-ignore - tableExists is an array with one object containing exists
      const paymentTableExists = tableExists[0]?.exists || false;
      
      if (paymentTableExists) {
        const revenueResult = await prisma.$queryRaw`
          SELECT SUM(amount) as total FROM "Payment"
        `;
        
        // @ts-ignore - revenueResult is an array with one object containing total
        totalRevenue = Number(revenueResult[0]?.total) || 0;
      }
    } catch (error) {
      console.error('Error checking Payment model:', error);
      totalRevenue = 0;
    }
    
    // Define activity type
    interface Activity {
      id: string;
      type: 'new_business' | 'new_user' | 'booking' | 'payment';
      name: string;
      time: Date | string;
    }
    
    // Get recent activities
    const recentActivities: Activity[] = [];
    
    // Recent new businesses
    try {
      const recentBusinesses = await prisma.business.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        take: 3,
        select: {
          id: true,
          name: true,
          createdAt: true
        }
      });
      
      recentBusinesses.forEach(business => {
        recentActivities.push({
          id: `business-${business.id}`,
          type: 'new_business',
          name: business.name,
          time: business.createdAt
        });
      });
    } catch (error) {
      console.log('Error fetching recent businesses:', error);
    }
    
    // Recent new users
    try {
      const recentUsers = await prisma.user.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        take: 3,
        select: {
          id: true,
          name: true,
          createdAt: true
        }
      });
      
      recentUsers.forEach(user => {
        recentActivities.push({
          id: `user-${user.id}`,
          type: 'new_user',
          name: user.name || 'Anonymous User',
          time: user.createdAt
        });
      });
    } catch (error) {
      console.log('Error fetching recent users:', error);
    }
    
    // Sort activities by time
    recentActivities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    
    // Format time for display
    const formattedActivities = recentActivities.map(activity => {
      const activityTime = new Date(activity.time);
      const now = new Date();
      const diffMs = now.getTime() - activityTime.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      
      let timeDisplay;
      if (diffDays > 0) {
        timeDisplay = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      } else if (diffHours > 0) {
        timeDisplay = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      } else if (diffMins > 0) {
        timeDisplay = `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
      } else {
        timeDisplay = 'just now';
      }
      
      return {
        ...activity,
        time: timeDisplay
      };
    });
    
    // Return dashboard stats
    return NextResponse.json({
      stats: {
        totalBusinesses,
        totalUsers,
        totalBookings,
        revenue: `$${(totalRevenue / 100).toFixed(2)}` // Assuming amount is stored in cents
      },
      recentActivities: formattedActivities
    });
  } catch (error) {
    console.error('API: /api/admin/stats - Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
