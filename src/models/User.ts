import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  solvedQuestions: mongoose.Types.ObjectId[];
  bookmarks: mongoose.Types.ObjectId[];
  streak: number;
  lastActiveDate: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    solvedQuestions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    bookmarks: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    streak: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
