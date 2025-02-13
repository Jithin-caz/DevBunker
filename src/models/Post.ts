import mongoose, { Document, Model } from "mongoose";

export interface IPost extends Document {
  title: string;
  content?: string;
  author: mongoose.Types.ObjectId;
  votes: number;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new mongoose.Schema<IPost>({
  title: { type: String, required: true },
  content: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  votes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const PostModel: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);
export default PostModel;
