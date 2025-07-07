import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';

// GET /api/business/bank-accounts
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Get user ID from the session
    const userId = session.user.id;
    
    // Return mock data for now until schema issues are resolved
    const mockBankAccounts = [
      {
        id: '1',
        accountHolderName: 'Business Account',
        accountNumber: '12345678',
        sortCode: '12-34-56',
        isDefault: true,
        businessId: 'mock-business-id',
        userId: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    console.log('Returning mock bank accounts data');
    return NextResponse.json(mockBankAccounts);
  } catch (error) {
    console.error('Error fetching bank accounts:', error);
    return NextResponse.json(
      { 
        message: 'Internal server error', 
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// POST /api/business/bank-accounts
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    if (session.user.role !== Role.BUSINESS_OWNER && session.user.role !== Role.ADMIN) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    
    // Get user ID from the session
    const userId = session.user.id;
    
    // Parse request body
    const body = await request.json();
    const { accountHolderName, accountNumber, sortCode, isDefault } = body;
    
    // Validate required fields
    if (!accountHolderName || !accountNumber || !sortCode) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate UK account number (8 digits)
    if (!/^\d{8}$/.test(accountNumber)) {
      return NextResponse.json(
        { message: 'Invalid account number format. Must be 8 digits.' },
        { status: 400 }
      );
    }
    
    // Validate UK sort code (XX-XX-XX format)
    if (!/^\d{2}-\d{2}-\d{2}$/.test(sortCode)) {
      return NextResponse.json(
        { message: 'Invalid sort code format. Must be in XX-XX-XX format.' },
        { status: 400 }
      );
    }
    
    // Create a mock bank account response
    const mockBankAccount = {
      id: Math.random().toString(36).substring(2, 15),
      accountHolderName,
      accountNumber,
      sortCode,
      isDefault: isDefault || false,
      businessId: 'mock-business-id',
      userId: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('Created mock bank account:', mockBankAccount);
    return NextResponse.json(mockBankAccount, { status: 201 });
  } catch (error) {
    console.error('Error creating bank account:', error);
    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
