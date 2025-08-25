import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import MasterTemplate, { IMasterTemplate } from '@/lib/models/MasterTemplate';

export async function GET() {
  try {
    await connectDB();
    
    const templates = await MasterTemplate.find({})
      .sort({ dayOfWeek: 1, timeSlot: 1 });
    
    return NextResponse.json({ 
      success: true, 
      data: templates 
    });
  } catch (error) {
    console.error('Error fetching master templates:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch master templates' 
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
    if (!body.dayOfWeek || !body.timeSlot) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Day of week and time slot are required' 
        }, 
        { status: 400 }
      );
    }

    // Find existing template or create new one
    let template = await MasterTemplate.findOne({
      dayOfWeek: body.dayOfWeek,
      timeSlot: body.timeSlot
    });

    if (template) {
      // Update existing template
      template.internIds = body.internIds || [];
      await template.save();
    } else {
      // Create new template
      template = new MasterTemplate({
        dayOfWeek: body.dayOfWeek,
        timeSlot: body.timeSlot,
        internIds: body.internIds || []
      });
      await template.save();
    }

    return NextResponse.json(
      { 
        success: true, 
        data: template,
        message: template.isNew ? 'Template created successfully' : 'Template updated successfully'
      }, 
      { status: template.isNew ? 201 : 200 }
    );
  } catch (error: any) {
    console.error('Error creating/updating master template:', error);
    
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

    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'A template for this day and time slot already exists' 
        }, 
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to save template' 
      }, 
      { status: 500 }
    );
  }
}