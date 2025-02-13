import mongoose, { Document, Model } from "mongoose";

export interface IUser extends Document {
  firebaseId: string;
  username: string;
  email: string;
  createdAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
  firebaseId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default UserModel;
