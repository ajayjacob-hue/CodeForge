import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubmission extends Document {
  userId: mongoose.Types.ObjectId;
  questionId: mongoose.Types.ObjectId;
  code: string;
  language: string;
  verdict: 'Passed' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Memory Limit Exceeded' | 'Runtime Error' | 'Compilation Error';
  passedCount: number;
  totalCount: number;
}

const SubmissionSchema: Schema<ISubmission> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    code: { type: String, required: true },
    language: { type: String, required: true },
    verdict: {
      type: String,
      enum: ['Passed', 'Wrong Answer', 'Time Limit Exceeded', 'Memory Limit Exceeded', 'Runtime Error', 'Compilation Error'],
      required: true,
    },
    passedCount: { type: Number, required: true },
    totalCount: { type: Number, required: true },
  },
  { timestamps: true }
);

const Submission: Model<ISubmission> = mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);

export default Submission;
