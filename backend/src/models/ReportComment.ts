import mongoose, { Schema, Document } from 'mongoose';

export interface IReportComment extends Document {
  studentName: string;
  gradeLevel: string;
  subject: string;
  performance: string;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReportCommentSchema: Schema = new Schema({
  studentName: { type: String, required: true },
  gradeLevel: { type: String, required: true },
  subject: { type: String, required: true },
  performance: { type: String, required: true },
  comment: { type: String, required: true }
}, {
  timestamps: true
});

export default mongoose.model<IReportComment>('ReportComment', ReportCommentSchema); 