import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export interface IDocument extends MongooseDocument {
  title: string;
  content: string;
  formData?: any;
  type?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  formData: { type: Schema.Types.Mixed },
  type: { type: String },
}, { timestamps: true });

export default mongoose.model<IDocument>('Document', DocumentSchema); 