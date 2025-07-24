import mongoose, { Schema, Document } from 'mongoose';

export interface IExitTicket extends Document {
  subject: string;
  gradeLevel: string;
  topic: string;
  questions: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExitTicketSchema: Schema = new Schema({
  subject: { type: String, required: true },
  gradeLevel: { type: String, required: true },
  topic: { type: String, required: true },
  questions: { type: String, required: true }
}, {
  timestamps: true
});

export default mongoose.model<IExitTicket>('ExitTicket', ExitTicketSchema); 