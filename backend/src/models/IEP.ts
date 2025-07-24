import mongoose, { Schema, Document } from 'mongoose';

export interface IIEP extends Document {
  studentName: string;
  gradeLevel: string;
  subject: string;
  goals: string;
  accommodations: string;
  modifications: string;
  createdAt: Date;
  updatedAt: Date;
}

const IEPSchema: Schema = new Schema({
  studentName: { type: String, required: true },
  gradeLevel: { type: String, required: true },
  subject: { type: String, required: true },
  goals: { type: String, required: true },
  accommodations: { type: String, required: true },
  modifications: { type: String, required: true }
}, {
  timestamps: true
});

export default mongoose.model<IIEP>('IEP', IEPSchema); 