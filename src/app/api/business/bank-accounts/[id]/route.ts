import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';

// PUT /api/business/bank-accounts/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const { id } = params;
    const data = await request.json();
    
    // Validate required fields
    if (!data.accountHolderName || !data.accountNumber || !data.sortCode) {
      return NextResponse.json(
        { message: 'Account holder name, account number, and sort code are required' },
        { status: 400 }
      );
    }
    
    // Validate account number format (8 digits)
    if (!/^\d{8}$/.test(data.accountNumber)) {
      return NextResponse.json(
        { message: 'Account number must be 8 digits' },
        { status: 400 }
      );
    }
    
    // Validate sort code format (XX-XX-XX format)
    if (!/^\d{2}-\d{2}-\d{2}$/.test(data.sortCode)) {
      return NextResponse.json(
        { message: 'Invalid sort code format. Must be in XX-XX-XX format.' },
        { status: 400 }
      );
    }
    
    const updatedAccount = {
      id: id,
      accountHolderName: data.accountHolderName,
      accountNumber: data.accountNumber,
      sortCode: data.sortCode,
      isDefault: data.isDefault || false,
      businessId: 'mock-business-id',
      userId: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('Updated mock bank account:', updatedAccount);
    return NextResponse.json(updatedAccount);
  } catch (error) {
    console.error('Error updating bank account:', error);
    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// DELETE /api/business/bank-accounts/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    if (session.user.role !== Role.BUSINESS_OWNER && session.user.role !== Role.ADMIN) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    
    const userId = session.user.id;
    const { id } = params;
    
    console.log(`Mock deleting bank account with ID: ${id}`);
    
    return NextResponse.json({ message: 'Bank account deleted successfully' });
  } catch (error) {
    console.error('Error deleting bank account:', error);
    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
