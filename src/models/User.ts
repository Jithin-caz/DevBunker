import mongoose, { Document, Model } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default UserModel;
