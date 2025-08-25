import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('🔍 Testing database connection...');
    await connectDB();
    console.log('✅ Database connected successfully');
    
    return NextResponse.json({ 
      success: true, 
      message: 'API and database connection working!',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Database connection failed',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}