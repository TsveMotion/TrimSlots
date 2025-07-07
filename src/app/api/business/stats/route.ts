import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';

export async function GET() {
  try {
    // Get the session
    const session = await getServerSession(authOptions);

    console.log('Fetching business stats for user:', session.user.id);

    // Check if the user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if the user has the appropriate role
    const userRole = session.user.role;
    if (userRole !== Role.BUSINESS_OWNER && userRole !== Role.ADMIN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get the business associated with the user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { business: true },
    });

    if (!user || !user.business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const businessId = user.business.id;

    // Get current date
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Get total bookings
    const totalBookings = await prisma.booking.count({
      where: { businessId }
    });

    console.log('Total bookings:', totalBookings);

    // Get active clients (clients with at least one booking)
    // Using BusinessClient model since there's no direct relation between User and Booking
    const activeClients = await prisma.businessClient.count({
      where: {
        businessId
      }
      // Removed distinct parameter as it's causing TypeScript errors
      // We'll get total clients associated with the business
    });

    console.log('Active clients:', activeClients);

    // Get monthly revenue
    const monthlyBookings = await prisma.booking.findMany({
      where: {
        businessId,
        createdAt: {
          gte: startOfMonth
        },
        status: 'COMPLETED'
      },
      include: {
        service: true
      }
    });

    const monthlyRevenue = monthlyBookings.reduce((total, booking) => {
      return total + (booking.service?.price || 0);
    }, 0);

    console.log('Monthly revenue:', monthlyRevenue);

    // Calculate average booking value
    const avgBookingValue = totalBookings > 0 ? monthlyRevenue / monthlyBookings.length : 0;

    console.log('Average booking value:', avgBookingValue);

    // Get active workers
    const activeWorkers = await prisma.user.count({
      where: {
        businessId,
        role: Role.WORKER
      }
    });

    console.log('Active workers:', activeWorkers);

    // Get active services
    const activeServices = await prisma.service.count({
      where: {
        businessId
      }
    });

    console.log('Active services:', activeServices);

    // Get today's bookings
    const todayBookings = await prisma.booking.count({
      where: {
        businessId,
        startTime: {
          gte: startOfToday
        }
      }
    });

    console.log('Today bookings:', todayBookings);

    // Since there's no Payment model in the schema yet, we'll use a placeholder value
    // This can be updated when the Payment model is added to the schema
    const pendingPayments = 0;

    const stats = {
      totalBookings,
      activeClients,
      monthlyRevenue,
      avgBookingValue,
      activeWorkers,
      activeServices,
      todayBookings,
      pendingPayments
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching business stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch business stats' },
      { status: 500 }
    );
  }
}
