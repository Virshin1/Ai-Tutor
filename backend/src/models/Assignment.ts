import mongoose, { Schema, Document } from 'mongoose';

export interface IAssignment extends Document {
  subject: string;
  gradeLevel: string;
  topic: string;
  studentLevel: string;
  assignments: string;
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema: Schema = new Schema({
  subject: { type: String, required: true },
  gradeLevel: { type: String, required: true },
  topic: { type: String, required: true },
  studentLevel: { type: String, required: true },
  assignments: { type: String, required: true }
}, {
  timestamps: true
});

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema); 