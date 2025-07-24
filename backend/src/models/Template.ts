import mongoose, { Schema, Document } from 'mongoose';

export interface ITemplate extends Document {
  name: string;
  type: string;
  content: any;
  description?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TemplateSchema = new Schema<ITemplate>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['lessonPlan', 'rubric', 'iep', 'exitTicket', 'reportComment', 'assignment', 'direction']
  },
  content: {
    type: Schema.Types.Mixed,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model<ITemplate>('Template', TemplateSchema); 