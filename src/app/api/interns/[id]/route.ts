import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Intern from '@/lib/models/Intern';
import MasterTemplate from '@/lib/models/MasterTemplate';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const internId = params.id;
    
    if (!internId) {
      return NextResponse.json(
        { success: false, error: 'Intern ID is required' },
        { status: 400 }
      );
    }

    // Check if intern exists
    const intern = await Intern.findById(internId);
    if (!intern) {
      return NextResponse.json(
        { success: false, error: 'Intern not found' },
        { status: 404 }
      );
    }

    // Remove intern from all master templates
    await MasterTemplate.updateMany(
      { internIds: internId },
      { $pull: { internIds: internId } }
    );

    // Delete the intern
    await Intern.findByIdAndDelete(internId);

    return NextResponse.json({
      success: true,
      message: 'Intern deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting intern:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete intern' },
      { status: 500 }
    );
  }
}