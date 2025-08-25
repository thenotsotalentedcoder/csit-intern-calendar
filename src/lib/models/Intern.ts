import mongoose from 'mongoose';

export interface IIntern {
  _id: string;
  name: string;
  avatar?: string;
  color: string;
  section: string;
  batch: string;
  createdAt: Date;
  updatedAt: Date;
}

const InternSchema = new mongoose.Schema<IIntern>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxLength: [100, 'Name cannot exceed 100 characters']
  },
  avatar: {
    type: String,
    default: null
  },
  color: {
    type: String,
    required: [true, 'Color is required'],
    match: [/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color']
  },
  section: {
    type: String,
    required: [true, 'Section is required'],
    trim: true,
    maxLength: [10, 'Section cannot exceed 10 characters']
  },
  batch: {
    type: String,
    required: [true, 'Batch is required'],
    trim: true,
    maxLength: [20, 'Batch cannot exceed 20 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add index for faster queries
InternSchema.index({ name: 1 });
InternSchema.index({ section: 1 });
InternSchema.index({ batch: 1 });

export default mongoose.models.Intern || mongoose.model<IIntern>('Intern', InternSchema);