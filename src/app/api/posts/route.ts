import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import User from "@/models/User";
import { verifyFirebaseToken } from "@/lib/verifyFirebaseToken";

export async function GET() {
  await dbConnect();
  try {
    const posts = await Post.find({}).populate("author", "username");
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching posts", error: error },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    // Get and validate auth token from Firebase
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { message: "No authorization header" },
        { status: 482 }
      );
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 455 }
      );
    }
    let firebaseUser;
    try {
      firebaseUser = await verifyFirebaseToken(token);
    } catch (err) {
      console.log(err);
      return NextResponse.json({ message: "Invalid token" }, { status: 491 });
    }

    const { title, content, category } = await request.json();
    if (!title || !category)
      return NextResponse.json(
        { message: "Title and category are required" },
        { status: 400 }
      );

    // Retrieve the user from your MongoDB
    const userDoc = await User.findOne({ firebaseId: firebaseUser.uid });
    if (!userDoc) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const newPost = new Post({
      title,
      content,
      category,
      author: userDoc._id, // Use the MongoDB ObjectId
    });
    await newPost.save();
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 433 });
  }
}
