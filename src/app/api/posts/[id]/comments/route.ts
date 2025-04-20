import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Comment from "@/models/Comment";
import { verifyFirebaseToken } from "@/lib/verifyFirebaseToken";
import mongoose from "mongoose";
import User from "@/models/User";
// GET comments for a post
export async function GET(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  // Resolve dynamic route parameters
  const resolvedParams = await Promise.resolve(context.params);
  const { id } = resolvedParams;
  await dbConnect();
  try {
    const comments = await Comment.find({ post: new mongoose.Types.ObjectId(id) }).populate(
      "author",
      "username"
    );
    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching comments", error: error },
      { status: 500 }
    );
  }
}

// POST a new comment on a post
export async function POST(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const resolvedParams = await Promise.resolve(context.params);
  const { id } = resolvedParams;
  await dbConnect();
  try {
    // Authenticate using Firebase
    const authHeader = request.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json(
        { message: "No authorization header" },
        { status: 401 }
      );
    const token = authHeader.split(" ")[1];
    if (!token)
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );

    let user;
    try {
      // Verify the Firebase token (this function should return the decoded token with uid)
      user = await verifyFirebaseToken(token);
      console.log("user is "+user);
    } catch (err) {
      console.log(err);
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    const userDoc = await User.findOne({ firebaseId:user.uid });
    if (!userDoc) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const { content,userMongoId, parentComment } = await request.json();
    console.log("userMongoId is "+userMongoId);
    console.log(`id is ${id}\ncontent is ${content}\nparentComment is ${parentComment}`);
    if (!content)
      return NextResponse.json(
        { message: "Content is required" },
        { status: 400 }
      );

    const newComment = new Comment({
      post:  new mongoose.Types.ObjectId(id),
      content,
      parentComment: parentComment || null,
      // Store the Firebase UID as the author
      author:  userDoc._id,
    });
    await newComment.save();
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.log("error is "+error);
    return NextResponse.json({ message: error }, { status: 404 });
  }
}
