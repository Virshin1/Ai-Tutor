import mongoose, { Schema, Document } from 'mongoose';

export interface IShare extends Document {
  itemId: string;
  itemType: string;
  sharedBy: string;
  sharedWith: string;
  permissions: 'view' | 'edit';
  expiresAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ShareSchema = new Schema<IShare>({
  itemId: {
    type: String,
    required: true
  },
  itemType: {
    type: String,
    required: true,
    enum: ['lessonPlan', 'rubric', 'iep', 'exitTicket', 'reportComment', 'assignment', 'direction']
  },
  sharedBy: {
    type: String,
    required: true
  },
  sharedWith: {
    type: String,
    required: true
  },
  permissions: {
    type: String,
    enum: ['view', 'edit'],
    default: 'view'
  },
  expiresAt: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IShare>('Share', ShareSchema); 