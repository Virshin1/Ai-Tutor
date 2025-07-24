import mongoose, { Schema, Document } from 'mongoose';

export interface IRubric extends Document {
  title: string;
  subject: string;
  gradeLevel: string;
  criteria: string;
  levels: string;
  createdAt: Date;
  updatedAt: Date;
}

const RubricSchema: Schema = new Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  gradeLevel: { type: String, required: true },
  criteria: { type: String, required: true },
  levels: { type: String, required: true }
}, {
  timestamps: true
});

export default mongoose.model<IRubric>('Rubric', RubricSchema); 