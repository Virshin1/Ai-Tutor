import mongoose, { Schema, Document } from 'mongoose';

export interface ILessonPlan extends Document {
  title: string;
  subject: string;
  gradeLevel: string;
  duration: string;
  objectives: string;
  materials: string;
  activities: string;
  assessment: string;
  createdAt: Date;
  updatedAt: Date;
}

const LessonPlanSchema: Schema = new Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  gradeLevel: { type: String, required: true },
  duration: { type: String, required: true },
  objectives: { type: String, required: true },
  materials: { type: String, required: true },
  activities: { type: String, required: true },
  assessment: { type: String, required: true }
}, {
  timestamps: true
});

export default mongoose.model<ILessonPlan>('LessonPlan', LessonPlanSchema); 