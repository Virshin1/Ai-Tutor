import mongoose, { Schema, Document } from 'mongoose';

export interface ISample extends Document {
  name: string;
}

const SampleSchema: Schema = new Schema({
  name: { type: String, required: true },
});

export default mongoose.model<ISample>('Sample', SampleSchema);
