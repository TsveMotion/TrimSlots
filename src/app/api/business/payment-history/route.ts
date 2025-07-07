import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';

// GET /api/business/payment-history
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    if (session.user.role !== Role.BUSINESS_OWNER && session.user.role !== Role.ADMIN) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    
    // Get business ID from the session user
    const userId = session.user.id;
    
    // For now, return mock data as we don't have a payments table yet
    // In a real implementation, you would query the database for payment records
    const mockPaymentHistory = [
      {
        id: '1',
        amount: 250.00,
        status: 'completed',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        description: 'Weekly payout',
      },
      {
        id: '2',
        amount: 175.50,
        status: 'completed',
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
        description: 'Weekly payout',
      },
      {
        id: '3',
        amount: 320.25,
        status: 'pending',
        date: new Date().toISOString(), // Today
        description: 'Weekly payout (processing)',
      },
    ];
    
    return NextResponse.json(mockPaymentHistory);
  } catch (error) {
    console.error('Error fetching payment history:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
