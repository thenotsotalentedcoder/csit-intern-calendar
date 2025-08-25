import mongoose from 'mongoose';

export interface IMasterTemplate {
  _id: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  timeSlot: string; // Format: "09:00-09:30"
  internIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MasterTemplateSchema = new mongoose.Schema<IMasterTemplate>({
  dayOfWeek: {
    type: String,
    required: [true, 'Day of week is required'],
    enum: {
      values: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      message: '{VALUE} is not a valid day of week'
    }
  },
  timeSlot: {
    type: String,
    required: [true, 'Time slot is required'],
    match: [/^\d{2}:\d{2}-\d{2}:\d{2}$/, 'Time slot must be in format HH:MM-HH:MM'],
    validate: {
      validator: function(timeSlot: string) {
        const [start, end] = timeSlot.split('-');
        const [startHour, startMin] = start.split(':').map(Number);
        const [endHour, endMin] = end.split(':').map(Number);
        
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        
        // Must be 30-minute slot within business hours (8:30 AM - 4:30 PM)
        return (
          startMinutes >= 8 * 60 + 30 && // 8:30 AM
          endMinutes <= 16 * 60 + 30 && // 4:30 PM
          endMinutes - startMinutes === 30 // 30-minute duration
        );
      },
      message: 'Time slot must be 30 minutes within 8:30 AM - 4:30 PM'
    }
  },
  internIds: {
    type: [String],
    default: [],
    validate: {
      validator: function(internIds: string[]) {
        return internIds.every(id => mongoose.Types.ObjectId.isValid(id));
      },
      message: 'All intern IDs must be valid ObjectIds'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for unique day-time combinations
MasterTemplateSchema.index({ dayOfWeek: 1, timeSlot: 1 }, { unique: true });

// Virtual populate for interns
MasterTemplateSchema.virtual('interns', {
  ref: 'Intern',
  localField: 'internIds',
  foreignField: '_id'
});

export default mongoose.models.MasterTemplate || mongoose.model<IMasterTemplate>('MasterTemplate', MasterTemplateSchema);