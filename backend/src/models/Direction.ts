import mongoose, { Schema, Document } from 'mongoose';

export interface IDirection extends Document {
  activity: string;
  gradeLevel: string;
  subject: string;
  directions: string;
  createdAt: Date;
  updatedAt: Date;
}

const DirectionSchema: Schema = new Schema({
  activity: { type: String, required: true },
  gradeLevel: { type: String, required: true },
  subject: { type: String, required: true },
  directions: { type: String, required: true }
}, {
  timestamps: true
});

export default mongoose.model<IDirection>('Direction', DirectionSchema); 