import { NextResponse,NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import User from "@/models/User";
import { verifyFirebaseToken } from "@/lib/verifyFirebaseToken";
import { getIO } from "@/lib/socket";

export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;

  try {
    const totalPosts = await Post.countDocuments(); // For total pages if needed
    const posts = await Post.find({})
      .populate("author", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json(
      { posts, totalPosts },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching posts", error },
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
      console.log("No authorization header");
      return NextResponse.json(
        { message: "No authorization header" },
        { status: 482 }
      );
    }
    console.log("POST request received");
    const token = authHeader.split(" ")[1];
    if (!token) {
      console.log("no token provided")
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
    const io = getIO();
  if (io) {
    io.emit("new-post", newPost);
  } else {
    console.warn("Socket.IO not initialized yet.");
  }
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 433 });
  }
}
