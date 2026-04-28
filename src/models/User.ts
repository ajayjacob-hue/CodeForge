import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash?: string;
  solvedQuestions: mongoose.Types.ObjectId[];
  bookmarks: mongoose.Types.ObjectId[];
  submissions: {
    questionId: mongoose.Types.ObjectId;
    code: string;
    language: string;
    verdict: string;
    passedCount: number;
    totalCount: number;
    submittedAt: Date;
  }[];
  streak: number;
  lastActiveDate: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String },
    solvedQuestions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    bookmarks: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    submissions: [
      {
        questionId: { type: Schema.Types.ObjectId, ref: 'Question' },
        code: String,
        language: String,
        verdict: String,
        passedCount: Number,
        totalCount: Number,
        submittedAt: { type: Date, default: Date.now },
      },
    ],
    streak: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
