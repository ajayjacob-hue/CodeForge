import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITopic extends Document {
  name: string;
  order: number;
  theory: {
    syntax: string;
    explanation: string;
    commonMistakes: string;
    importantNotes: string;
  };
}

const TopicSchema: Schema<ITopic> = new Schema(
  {
    name: { type: String, required: true, unique: true },
    order: { type: Number, required: true },
    theory: {
      syntax: { type: String, default: '' },
      explanation: { type: String, default: '' },
      commonMistakes: { type: String, default: '' },
      importantNotes: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

const Topic: Model<ITopic> = mongoose.models.Topic || mongoose.model<ITopic>('Topic', TopicSchema);

export default Topic;
