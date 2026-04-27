import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITestCase {
  input: string;
  expectedOutput: string;
}

export interface IQuestion extends Document {
  topicId: mongoose.Types.ObjectId;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  statement: string;
  constraints: string;
  inputFormat: string;
  outputFormat: string;
  sampleInput: string;
  sampleOutput: string;
  explanation: string;
  hints: string[];
  testcases: ITestCase[];
}

const TestCaseSchema = new Schema<ITestCase>({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
});

const QuestionSchema: Schema<IQuestion> = new Schema(
  {
    topicId: { type: Schema.Types.ObjectId, ref: 'Topic', required: true },
    title: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    statement: { type: String, required: true },
    constraints: { type: String, required: true },
    inputFormat: { type: String, required: true },
    outputFormat: { type: String, required: true },
    sampleInput: { type: String, required: true },
    sampleOutput: { type: String, required: true },
    explanation: { type: String, default: '' },
    hints: [{ type: String }],
    testcases: [TestCaseSchema],
  },
  { timestamps: true }
);

const Question: Model<IQuestion> = mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);

export default Question;
