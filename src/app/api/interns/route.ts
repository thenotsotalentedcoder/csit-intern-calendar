import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Intern, { IIntern } from '@/lib/models/Intern';

export async function GET() {
  try {
    await connectDB();
    
    const interns = await Intern.find({}).sort({ name: 1 });
    
    return NextResponse.json({ 
      success: true, 
      data: interns 
    });
  } catch (error) {
    console.error('Error fetching interns:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch interns' 
      }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.section || !body.batch || !body.color) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Name, section, batch, and color are required' 
        }, 
        { status: 400 }
      );
    }

    // Check if intern with same name already exists
    const existingIntern = await Intern.findOne({ 
      name: { $regex: new RegExp(`^${body.name}$`, 'i') } 
    });
    
    if (existingIntern) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'An intern with this name already exists' 
        }, 
        { status: 400 }
      );
    }

    const intern = new Intern({
      name: body.name.trim(),
      section: body.section.trim(),
      batch: body.batch.trim(),
      color: body.color,
      avatar: body.avatar || undefined
    });

    await intern.save();

    return NextResponse.json(
      { 
        success: true, 
        data: intern,
        message: 'Intern added successfully' 
      }, 
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating intern:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { 
          success: false, 
          error: validationErrors.join(', ') 
        }, 
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create intern' 
      }, 
      { status: 500 }
    );
  }
}